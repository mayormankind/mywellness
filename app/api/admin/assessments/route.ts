import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, toAnonId, isFlagged } from '@/lib/admin';

export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'));
    const severity = searchParams.get('severity') || '';
    const subscale = searchParams.get('subscale') || '';
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (severity && subscale) {
      const field = `${subscale}Severity`;
      where[field] = severity;
    } else if (severity) {
      where.OR = [
        { depressionSeverity: severity },
        { anxietySeverity: severity },
        { stressSeverity: severity },
      ];
    }

    const [assessments, total] = await Promise.all([
      prisma.assessment.findMany({
        where,
        select: {
          id: true,
          userId: true,
          depressionScore: true,
          anxietyScore: true,
          stressScore: true,
          depressionSeverity: true,
          anxietySeverity: true,
          stressSeverity: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.assessment.count({ where }),
    ]);

    return NextResponse.json({
      assessments: assessments.map(a => ({
        id: a.id,
        userId: a.userId,
        anonymousId: toAnonId(a.id, 'ASM'),
        userAnonymousId: toAnonId(a.userId, 'USR'),
        depressionScore: a.depressionScore,
        anxietyScore: a.anxietyScore,
        stressScore: a.stressScore,
        depressionSeverity: a.depressionSeverity,
        anxietySeverity: a.anxietySeverity,
        stressSeverity: a.stressSeverity,
        flagged: isFlagged(a.depressionSeverity, a.anxietySeverity, a.stressSeverity),
        createdAt: a.createdAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Admin assessments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
