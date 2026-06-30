import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { sendEmail, generateVerificationEmail } from '@/lib/mailer';
import { registerSchema } from '@/lib/validation';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { userName, email, password } = validation.data;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 409 }
        );
      }
    }

    const passwordHash = await hashPassword(password);
    const verifyToken = randomBytes(32).toString('hex');

    const user = await prisma.user.create({
      data: {
        userName,
        email,
        passwordHash,
        verifyToken,
      }
    });

    try {
      await sendEmail({
        to: email,
        subject: 'Verify Your Email - Mental Well-Being Monitoring System',
        html: generateVerificationEmail(verifyToken),
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }

    return NextResponse.json(
      { 
        message: 'Registration successful. Please check your email to verify your account.',
        userId: user.id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
