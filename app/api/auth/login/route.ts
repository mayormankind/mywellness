import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, signJwt, setAuthCookie } from '@/lib/auth';
import { loginSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { error: 'Please verify your email before logging in' },
        { status: 403 }
      );
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = await signJwt({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await setAuthCookie(token);

    return NextResponse.json(
      { 
        message: 'Login successful',
        user: {
          id: user.id,
          userName: user.userName,
          email: user.email,
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
