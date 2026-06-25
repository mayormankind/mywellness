import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJwt, getAuthToken } from '@/lib/auth';
import { type Severity } from '@/lib/scoring';
import { generateFeedback } from '@/lib/feedback';

function enrichAssessment(a: any) {
  const classifications = {
    depression: a.depressionSeverity as Severity,
    anxiety: a.anxietySeverity as Severity,
    stress: a.stressSeverity as Severity,
  };
  return {
    ...a,
    scores: { depression: a.depressionScore, anxiety: a.anxietyScore, stress: a.stressScore },
    classifications,
    feedback: generateFeedback(classifications),
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getAuthToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = verifyJwt(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const assessment = await prisma.assessment.findUnique({
      where: {
        id,
      },
    });

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      );
    }

    if (assessment.userId !== payload.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json(enrichAssessment(assessment));

  } catch (error) {
    console.error('Assessment fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
