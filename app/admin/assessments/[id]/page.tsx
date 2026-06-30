'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, AlertTriangleIcon, UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { SUBSCALE_COLORS } from '@/components/admin/charts/chart-constants';

interface QuestionItem {
  id: string;
  text: string;
  subscale: 'depression' | 'anxiety' | 'stress';
  score: number;
}

interface AssessmentDetail {
  anonymousId: string;
  userAnonymousId: string;
  userId: string;
  scores: { depression: number; anxiety: number; stress: number };
  severities: { depression: string; anxiety: string; stress: string };
  flagged: boolean;
  questionBreakdown: QuestionItem[];
  createdAt: string;
}

const SEVERITY_COLORS: Record<string, string> = {
  normal: 'bg-green-100 text-green-700 border-green-200',
  mild: 'bg-lime-100 text-lime-700 border-lime-200',
  moderate: 'bg-amber-100 text-amber-700 border-amber-200',
  severe: 'bg-orange-100 text-orange-700 border-orange-200',
  extremely_severe: 'bg-red-100 text-red-700 border-red-200',
};

function ScoreCard({
  label,
  score,
  severity,
  subscale,
}: {
  label: string;
  score: number;
  severity: string;
  subscale: keyof typeof SUBSCALE_COLORS;
}) {
  return (
    <div className="flex-1 p-4 rounded-xl border bg-white">
      <p className="text-xs text-muted-foreground mb-2 font-medium">{label}</p>
      <p
        className="text-3xl font-bold"
        style={{ color: SUBSCALE_COLORS[subscale] }}
      >
        {score}
        <span className="text-sm font-normal text-muted-foreground ml-1">/ 42</span>
      </p>
      <span
        className={cn(
          'mt-2 inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border',
          SEVERITY_COLORS[severity] ?? 'bg-muted text-muted-foreground border-border'
        )}
      >
        {severity.replace('_', ' ')}
      </span>
    </div>
  );
}

export default function AdminAssessmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [detail, setDetail] = useState<AssessmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/admin/assessments/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error);
        else setDetail(d);
      })
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  const chartData = (detail?.questionBreakdown ?? []).map(q => ({
    id: q.id.toUpperCase(),
    score: q.score,
    subscale: q.subscale,
    text: q.text,
  }));

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-white shrink-0">
        <Button
          size="sm"
          variant="ghost"
          className="h-8 px-2 gap-1 text-muted-foreground"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </Button>
        <div className="w-px h-5 bg-border" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {detail?.flagged && (
              <AlertTriangleIcon className="w-4 h-4 text-amber-500 shrink-0" />
            )}
            <h1 className="text-base font-bold text-foreground truncate">
              {loading ? <Skeleton className="h-5 w-36 inline-block" /> : detail?.anonymousId}
            </h1>
          </div>
          <p className="text-xs text-muted-foreground font-light">
            {loading
              ? ''
              : `Submitted ${new Date(detail?.createdAt ?? '').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`}
          </p>
        </div>
        {detail && (
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs h-8"
            onClick={() => router.push(`/admin/users/${detail.userId}`)}
          >
            <UserIcon className="w-3.5 h-3.5" />
            {detail.userAnonymousId}
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Score summary */}
        <div className="flex gap-4 flex-col sm:flex-row">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 flex-1 rounded-xl" />
            ))
          ) : (
            <>
              <ScoreCard
                label="Depression"
                score={detail?.scores.depression ?? 0}
                severity={detail?.severities.depression ?? 'normal'}
                subscale="depression"
              />
              <ScoreCard
                label="Anxiety"
                score={detail?.scores.anxiety ?? 0}
                severity={detail?.severities.anxiety ?? 'normal'}
                subscale="anxiety"
              />
              <ScoreCard
                label="Stress"
                score={detail?.scores.stress ?? 0}
                severity={detail?.severities.stress ?? 'normal'}
                subscale="stress"
              />
            </>
          )}
        </div>

        {/* Per-question breakdown */}
        <Card className="bg-white">
          <CardHeader className="pb-1 pt-4 px-5">
            <CardTitle className="text-sm font-medium">Per-Question Responses</CardTitle>
            <p className="text-xs text-muted-foreground font-light">
              Score per item (0 = Never, 3 = Almost Always)
            </p>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {loading ? (
              <Skeleton className="h-80 w-full rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 16, left: 24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis
                    type="number"
                    domain={[0, 3]}
                    ticks={[0, 1, 2, 3]}
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="id"
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                    width={28}
                  />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                    formatter={(v: number, _n, props) => [
                      `${v} / 3`,
                      props.payload?.text ?? 'Score',
                    ]}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={SUBSCALE_COLORS[entry.subscale as keyof typeof SUBSCALE_COLORS]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Question text table */}
        <Card className="bg-white">
          <CardHeader className="pb-1 pt-4 px-5">
            <CardTitle className="text-sm font-medium">Response Detail</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-16">ID</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Question</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-24">Subscale</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-16">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="px-5 py-3" colSpan={4}>
                            <Skeleton className="h-4 w-full rounded" />
                          </td>
                        </tr>
                      ))
                    : (detail?.questionBreakdown ?? []).map(q => (
                        <tr key={q.id} className="border-b border-border/50">
                          <td className="px-5 py-2.5">
                            <span className="font-mono text-xs text-muted-foreground uppercase">{q.id}</span>
                          </td>
                          <td className="px-5 py-2.5 text-xs text-foreground">{q.text}</td>
                          <td className="px-5 py-2.5">
                            <span
                              className="text-[10px] font-medium px-1.5 py-0.5 rounded capitalize"
                              style={{
                                background: `${SUBSCALE_COLORS[q.subscale as keyof typeof SUBSCALE_COLORS]}20`,
                                color: SUBSCALE_COLORS[q.subscale as keyof typeof SUBSCALE_COLORS],
                              }}
                            >
                              {q.subscale}
                            </span>
                          </td>
                          <td className="px-5 py-2.5">
                            <span className="font-semibold text-sm">{q.score}</span>
                            <span className="text-muted-foreground text-xs"> / 3</span>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
