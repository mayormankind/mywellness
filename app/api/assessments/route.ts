import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJwt, getAuthToken } from '@/lib/auth';
import { assessmentAnswersSchema, type AssessmentAnswers } from '@/lib/validation';
import { calculateScoringResult, type Severity } from '@/lib/scoring';
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

export async function GET(request: NextRequest) {
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

    const assessments = await prisma.assessment.findMany({
      where: {
        userId: payload.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(assessments.map(enrichAssessment));

  } catch (error) {
    console.error('Assessments fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    
    const validation = assessmentAnswersSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { answers } = validation.data;

    const scoringResult = calculateScoringResult(answers as unknown as Record<string, number>);
    const feedbackResult = generateFeedback(scoringResult.classifications);

    const assessment = await prisma.assessment.create({
      data: {
        userId: payload.userId,
        answers,
        depressionScore: scoringResult.scores.depression,
        anxietyScore: scoringResult.scores.anxiety,
        stressScore: scoringResult.scores.stress,
        depressionSeverity: scoringResult.classifications.depression,
        anxietySeverity: scoringResult.classifications.anxiety,
        stressSeverity: scoringResult.classifications.stress,
      }
    });

    return NextResponse.json(
      { 
        id: assessment.id,
        message: 'Assessment completed successfully'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Assessment creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
