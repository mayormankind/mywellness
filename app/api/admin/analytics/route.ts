import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, SEVERITY_LEVELS, SeverityLevel } from '@/lib/admin';
import { questions } from '@/lib/questions';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const assessments = await prisma.assessment.findMany({
      select: {
        answers: true,
        depressionSeverity: true,
        anxietySeverity: true,
        stressSeverity: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const questionTotals: Record<string, { total: number; count: number }> = {};
    questions.forEach(q => { questionTotals[q.id] = { total: 0, count: 0 }; });

    for (const a of assessments) {
      const answers = a.answers as Record<string, number>;
      for (const [qId, score] of Object.entries(answers)) {
        if (qId in questionTotals) {
          questionTotals[qId].total += score;
          questionTotals[qId].count += 1;
        }
      }
    }

    const questionAverages = questions.map(q => ({
      id: q.id,
      text: q.text,
      subscale: q.subscale,
      avgScore:
        questionTotals[q.id].count > 0
          ? Math.round((questionTotals[q.id].total / questionTotals[q.id].count) * 100) / 100
          : 0,
    }));

    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - 11);
    cutoff.setDate(1);

    type MonthEntry = Record<SeverityLevel, number>;
    const monthMap: Record<
      string,
      { depression: MonthEntry; anxiety: MonthEntry; stress: MonthEntry }
    > = {};

    for (const a of assessments) {
      if (a.createdAt < cutoff) continue;
      const month = a.createdAt.toISOString().slice(0, 7);
      if (!monthMap[month]) {
        monthMap[month] = {
          depression: Object.fromEntries(SEVERITY_LEVELS.map(s => [s, 0])) as MonthEntry,
          anxiety: Object.fromEntries(SEVERITY_LEVELS.map(s => [s, 0])) as MonthEntry,
          stress: Object.fromEntries(SEVERITY_LEVELS.map(s => [s, 0])) as MonthEntry,
        };
      }
      monthMap[month].depression[a.depressionSeverity as SeverityLevel]++;
      monthMap[month].anxiety[a.anxietySeverity as SeverityLevel]++;
      monthMap[month].stress[a.stressSeverity as SeverityLevel]++;
    }

    const severityTrends = Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, ...data }));

    return NextResponse.json({ questionAverages, severityTrends });
  } catch (error) {
    console.error('Admin analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
