import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail, generatePasswordResetEmail } from '@/lib/mailer';
import { forgotPasswordSchema } from '@/lib/validation';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = forgotPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { message: 'If an account with this email exists, a password reset link has been sent' },
        { status: 200 }
      );
    }

    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExp = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExp,
      }
    });

    try {
      await sendEmail({
        to: email,
        subject: 'Reset Your Password - Mental Well-Being Monitoring System',
        html: generatePasswordResetEmail(resetToken),
      });
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
    }

    return NextResponse.json(
      { message: 'If an account with this email exists, a password reset link has been sent' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
