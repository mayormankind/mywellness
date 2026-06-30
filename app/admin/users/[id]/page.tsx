'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, EyeIcon, AlertTriangleIcon } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { SUBSCALE_COLORS } from '@/components/admin/charts/chart-constants';

interface AssessmentRow {
  id: string;
  anonymousId: string;
  depressionScore: number;
  anxietyScore: number;
  stressScore: number;
  depressionSeverity: string;
  anxietySeverity: string;
  stressSeverity: string;
  flagged: boolean;
  createdAt: string;
}

interface UserDetail {
  anonymousId: string;
  joinedAt: string;
  assessmentCount: number;
  assessments: AssessmentRow[];
}

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function severityBadge(s: string) {
  const map: Record<string, string> = {
    normal: 'bg-green-100 text-green-700',
    mild: 'bg-lime-100 text-lime-700',
    moderate: 'bg-amber-100 text-amber-700',
    severe: 'bg-orange-100 text-orange-700',
    extremely_severe: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${map[s] ?? 'bg-muted text-muted-foreground'}`}>
      {s.replace('_', ' ')}
    </span>
  );
}

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/admin/users/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error);
        else setUser(d);
      })
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  const trendData = user
    ? [...user.assessments]
        .reverse()
        .map((a, i) => ({
          n: i + 1,
          depression: a.depressionScore,
          anxiety: a.anxietyScore,
          stress: a.stressScore,
        }))
    : [];

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
          Users
        </Button>
        <div className="w-px h-5 bg-border" />
        <div>
          <h1 className="text-base font-bold text-foreground flex items-center gap-2">
            {loading ? <Skeleton className="h-5 w-32" /> : user?.anonymousId}
          </h1>
          <p className="text-xs text-muted-foreground font-light">
            {loading ? '' : `Joined ${fmt(user?.joinedAt ?? '')}`}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Score trend chart */}
        {!loading && trendData.length > 1 && (
          <Card className="bg-white">
            <CardHeader className="pb-1 pt-4 px-5">
              <CardTitle className="text-sm font-medium">Score Trend</CardTitle>
              <p className="text-xs text-muted-foreground font-light">
                Raw scores per assessment (chronological)
              </p>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={trendData} margin={{ top: 4, right: 12, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="n"
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                    label={{ value: 'Assessment #', position: 'insideBottom', offset: -2, fontSize: 10, fill: '#9ca3af' }}
                  />
                  <YAxis
                    domain={[0, 42]}
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }} />
                  <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ fontSize: 11 }}>{v.charAt(0).toUpperCase() + v.slice(1)}</span>} />
                  <Line type="monotone" dataKey="depression" stroke={SUBSCALE_COLORS.depression} strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="anxiety" stroke={SUBSCALE_COLORS.anxiety} strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="stress" stroke={SUBSCALE_COLORS.stress} strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Assessments table */}
        <Card className="bg-white">
          <CardHeader className="pb-1 pt-4 px-5">
            <CardTitle className="text-sm font-medium">
              Assessment History
              <span className="ml-2 text-xs text-muted-foreground font-normal">
                ({user?.assessmentCount ?? 0} total)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {['Assessment ID', 'Depression', 'Anxiety', 'Stress', 'Date', ''].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="px-5 py-3" colSpan={6}>
                            <Skeleton className="h-4 w-full rounded" />
                          </td>
                        </tr>
                      ))
                    : (user?.assessments ?? []).map(a => (
                        <tr key={a.id} className="border-b border-border/50 hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-1.5">
                              {a.flagged && <AlertTriangleIcon className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                              <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                                {a.anonymousId}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-3">{severityBadge(a.depressionSeverity)}</td>
                          <td className="px-5 py-3">{severityBadge(a.anxietySeverity)}</td>
                          <td className="px-5 py-3">{severityBadge(a.stressSeverity)}</td>
                          <td className="px-5 py-3 text-xs text-muted-foreground">{fmt(a.createdAt)}</td>
                          <td className="px-5 py-3 text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs gap-1"
                              onClick={() => router.push(`/admin/assessments/${a.id}`)}
                            >
                              <EyeIcon className="w-3 h-3" />
                              Detail
                            </Button>
                          </td>
                        </tr>
                      ))}
                  {!loading && (user?.assessments ?? []).length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-sm text-muted-foreground">
                        No assessments yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
