import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, toAnonId, isFlagged } from '@/lib/admin';
import { questions } from '@/lib/questions';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { id } = await params;

    const assessment = await prisma.assessment.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        answers: true,
        depressionScore: true,
        anxietyScore: true,
        stressScore: true,
        depressionSeverity: true,
        anxietySeverity: true,
        stressSeverity: true,
        createdAt: true,
      },
    });

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    const answers = assessment.answers as Record<string, number>;
    const questionBreakdown = questions.map(q => ({
      id: q.id,
      text: q.text,
      subscale: q.subscale,
      score: answers[q.id] ?? 0,
    }));

    return NextResponse.json({
      anonymousId: toAnonId(assessment.id, 'ASM'),
      userAnonymousId: toAnonId(assessment.userId, 'USR'),
      userId: assessment.userId,
      scores: {
        depression: assessment.depressionScore,
        anxiety: assessment.anxietyScore,
        stress: assessment.stressScore,
      },
      severities: {
        depression: assessment.depressionSeverity,
        anxiety: assessment.anxietySeverity,
        stress: assessment.stressSeverity,
      },
      flagged: isFlagged(
        assessment.depressionSeverity,
        assessment.anxietySeverity,
        assessment.stressSeverity
      ),
      questionBreakdown,
      createdAt: assessment.createdAt,
    });
  } catch (error) {
    console.error('Admin assessment detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
