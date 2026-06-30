import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, toAnonId, isFlagged } from '@/lib/admin';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { id } = await params;

    const user = await prisma.user.findFirst({
      where: { id, role: 'student' },
      select: {
        id: true,
        createdAt: true,
        assessments: {
          select: {
            id: true,
            depressionScore: true,
            anxietyScore: true,
            stressScore: true,
            depressionSeverity: true,
            anxietySeverity: true,
            stressSeverity: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      anonymousId: toAnonId(user.id, 'USR'),
      joinedAt: user.createdAt,
      assessmentCount: user.assessments.length,
      assessments: user.assessments.map(a => ({
        id: a.id,
        anonymousId: toAnonId(a.id, 'ASM'),
        depressionScore: a.depressionScore,
        anxietyScore: a.anxietyScore,
        stressScore: a.stressScore,
        depressionSeverity: a.depressionSeverity,
        anxietySeverity: a.anxietySeverity,
        stressSeverity: a.stressSeverity,
        flagged: isFlagged(a.depressionSeverity, a.anxietySeverity, a.stressSeverity),
        createdAt: a.createdAt,
      })),
    });
  } catch (error) {
    console.error('Admin user detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
