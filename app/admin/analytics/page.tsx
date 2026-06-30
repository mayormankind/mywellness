'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import SeverityBar from '@/components/admin/charts/severity-bar';
import QuestionBar from '@/components/admin/charts/question-bar';
import { BarChart3Icon } from 'lucide-react';

interface QuestionEntry {
  id: string;
  text: string;
  subscale: 'depression' | 'anxiety' | 'stress';
  avgScore: number;
}

interface SeverityTrendEntry {
  month: string;
  depression: Record<string, number>;
  anxiety: Record<string, number>;
  stress: Record<string, number>;
}

interface AnalyticsData {
  questionAverages: QuestionEntry[];
  severityTrends: SeverityTrendEntry[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-white shrink-0">
        <div>
          <h1 className="text-lg font-bold text-foreground">Analytics</h1>
          <p className="text-xs text-muted-foreground font-light">
            Severity trends &amp; per-question item analysis
          </p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <BarChart3Icon className="w-4 h-4 text-primary" />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Severity trends over time */}
        <Card className="bg-white">
          <CardHeader className="pb-1 pt-4 px-5">
            <CardTitle className="text-sm font-medium">Severity Distribution Over Time</CardTitle>
            <p className="text-xs text-muted-foreground font-light">
              Stacked count per severity level by month (last 12 months)
            </p>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {loading ? (
              <Skeleton className="h-72 w-full rounded-lg" />
            ) : (
              <SeverityBar data={data?.severityTrends ?? []} />
            )}
          </CardContent>
        </Card>

        {/* Per-question averages */}
        <Card className="bg-white">
          <CardHeader className="pb-1 pt-4 px-5">
            <CardTitle className="text-sm font-medium">Per-Question Average Scores</CardTitle>
            <p className="text-xs text-muted-foreground font-light">
              Mean item response across all participants (0–3 scale)
            </p>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {loading ? (
              <Skeleton className="h-80 w-full rounded-lg" />
            ) : (
              <QuestionBar data={data?.questionAverages ?? []} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
