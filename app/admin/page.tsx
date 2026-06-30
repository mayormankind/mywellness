'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import KPICard from '@/components/admin/kpi-card';
import SeverityDonut from '@/components/admin/charts/severity-donut';
import SubscaleRadar from '@/components/admin/charts/subscale-radar';
import TrendLine from '@/components/admin/charts/trend-line';
import {
  UsersIcon,
  ClipboardListIcon,
  AlertTriangleIcon,
  ActivityIcon,
} from 'lucide-react';

interface OverviewStats {
  totalUsers: number;
  totalAssessments: number;
  flaggedCount: number;
  avgScores: { depression: number; anxiety: number; stress: number };
  distributions: {
    depression: Record<string, number>;
    anxiety: Record<string, number>;
    stress: Record<string, number>;
  };
  assessmentsByMonth: Array<{ month: string; count: number }>;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const flagRate =
    stats && stats.totalAssessments > 0
      ? ((stats.flaggedCount / stats.totalAssessments) * 100).toFixed(1)
      : '0.0';

  const avgPerUser =
    stats && stats.totalUsers > 0
      ? (stats.totalAssessments / stats.totalUsers).toFixed(1)
      : '—';

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-white shrink-0">
        <div>
          <h1 className="text-lg font-bold text-foreground">Overview</h1>
          <p className="text-xs text-muted-foreground font-light">
            Cohort analytics — anonymized aggregate data only
          </p>
        </div>
        <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
          Research Mode
        </span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))
          ) : (
            <>
              <KPICard
                title="Total Participants"
                value={stats?.totalUsers ?? 0}
                icon={UsersIcon}
                subtitle="Registered students"
              />
              <KPICard
                title="Total Assessments"
                value={stats?.totalAssessments ?? 0}
                icon={ClipboardListIcon}
                subtitle={`~${avgPerUser} per participant`}
              />
              <KPICard
                title="Flagged Cases"
                value={stats?.flaggedCount ?? 0}
                icon={AlertTriangleIcon}
                subtitle="Severe or extremely severe"
                variant="warning"
              />
              <KPICard
                title="Flag Rate"
                value={`${flagRate}%`}
                icon={ActivityIcon}
                subtitle="Of all assessments"
                variant={parseFloat(flagRate) > 20 ? 'danger' : 'default'}
              />
            </>
          )}
        </div>

        {/* Severity distributions */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">
            Severity Distributions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['depression', 'anxiety', 'stress'] as const).map(sub => (
              <Card key={sub} className="bg-white">
                <CardHeader className="pb-1 pt-4 px-5">
                  <CardTitle className="text-sm font-medium capitalize">{sub}</CardTitle>
                </CardHeader>
                <CardContent className="px-3 pb-3">
                  {loading ? (
                    <Skeleton className="h-52 w-full rounded-lg" />
                  ) : (
                    <SeverityDonut
                      data={
                        stats?.distributions[sub] ?? {}
                      }
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Radar + Trend line */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="bg-white">
            <CardHeader className="pb-1 pt-4 px-5">
              <CardTitle className="text-sm font-medium">
                Population Average Scores
              </CardTitle>
              <p className="text-xs text-muted-foreground font-light">
                Radar — max 42 per subscale
              </p>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {loading ? (
                <Skeleton className="h-56 w-full rounded-lg" />
              ) : (
                <SubscaleRadar
                  scores={
                    stats?.avgScores ?? { depression: 0, anxiety: 0, stress: 0 }
                  }
                />
              )}
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader className="pb-1 pt-4 px-5">
              <CardTitle className="text-sm font-medium">
                Assessment Volume
              </CardTitle>
              <p className="text-xs text-muted-foreground font-light">
                Submissions per month (last 12 months)
              </p>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {loading ? (
                <Skeleton className="h-56 w-full rounded-lg" />
              ) : (
                <TrendLine data={stats?.assessmentsByMonth ?? []} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
