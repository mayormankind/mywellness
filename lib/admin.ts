import { prisma } from './prisma';
import { getAuthToken, verifyJwt } from './auth';

export const SEVERITY_LEVELS = ['normal', 'mild', 'moderate', 'severe', 'extremely_severe'] as const;
export type SeverityLevel = (typeof SEVERITY_LEVELS)[number];

export function toAnonId(id: string, prefix: 'USR' | 'ASM'): string {
  return `${prefix}-${id.slice(0, 8).toUpperCase()}`;
}

export function isFlagged(d: string, a: string, s: string): boolean {
  return (
    ['severe', 'extremely_severe'].includes(d) ||
    ['severe', 'extremely_severe'].includes(a) ||
    ['severe', 'extremely_severe'].includes(s)
  );
}

export async function requireAdmin() {
  const token = await getAuthToken();
  if (!token) return null;
  const payload = await verifyJwt(token);
  if (!payload || payload.role !== 'admin') return null;
  return payload;
}

function countBySeverity(items: string[]): Record<SeverityLevel, number> {
  const counts = Object.fromEntries(
    SEVERITY_LEVELS.map(s => [s, 0])
  ) as Record<SeverityLevel, number>;
  for (const s of items) {
    if (s in counts) counts[s as SeverityLevel]++;
  }
  return counts;
}

function avg(nums: number[]): number {
  if (!nums.length) return 0;
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

export async function getOverviewStats() {
  const [totalUsers, totalAssessments, assessments] = await Promise.all([
    prisma.user.count({ where: { role: 'student' } }),
    prisma.assessment.count(),
    prisma.assessment.findMany({
      select: {
        depressionSeverity: true,
        anxietySeverity: true,
        stressSeverity: true,
        depressionScore: true,
        anxietyScore: true,
        stressScore: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    }),
  ]);

  const flaggedCount = assessments.filter(a =>
    isFlagged(a.depressionSeverity, a.anxietySeverity, a.stressSeverity)
  ).length;

  const avgScores = {
    depression: avg(assessments.map(a => a.depressionScore)),
    anxiety: avg(assessments.map(a => a.anxietyScore)),
    stress: avg(assessments.map(a => a.stressScore)),
  };

  const distributions = {
    depression: countBySeverity(assessments.map(a => a.depressionSeverity)),
    anxiety: countBySeverity(assessments.map(a => a.anxietySeverity)),
    stress: countBySeverity(assessments.map(a => a.stressSeverity)),
  };

  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 11);
  cutoff.setDate(1);

  const monthMap: Record<string, number> = {};
  for (const a of assessments) {
    if (a.createdAt < cutoff) continue;
    const month = a.createdAt.toISOString().slice(0, 7);
    monthMap[month] = (monthMap[month] || 0) + 1;
  }
  const assessmentsByMonth = Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));

  return {
    totalUsers,
    totalAssessments,
    flaggedCount,
    avgScores,
    distributions,
    assessmentsByMonth,
  };
}
