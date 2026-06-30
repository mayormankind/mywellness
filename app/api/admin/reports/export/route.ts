import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, toAnonId } from '@/lib/admin';

export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const where: { createdAt?: { gte?: Date; lte?: Date } } = {};
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const assessments = await prisma.assessment.findMany({
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
      orderBy: { createdAt: 'asc' },
    });

    const header =
      'assessment_id,user_id,depression_score,anxiety_score,stress_score,' +
      'depression_severity,anxiety_severity,stress_severity,submitted_at\n';

    const rows = assessments
      .map(a =>
        [
          toAnonId(a.id, 'ASM'),
          toAnonId(a.userId, 'USR'),
          a.depressionScore,
          a.anxietyScore,
          a.stressScore,
          a.depressionSeverity,
          a.anxietySeverity,
          a.stressSeverity,
          a.createdAt.toISOString(),
        ].join(',')
      )
      .join('\n');

    const csv = header + rows;
    const dateTag = new Date().toISOString().slice(0, 10);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="mywellness-cohort-${dateTag}.csv"`,
      },
    });
  } catch (error) {
    console.error('Admin export error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
