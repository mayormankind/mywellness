'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  AlertTriangleIcon,
  ClipboardListIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssessmentRow {
  id: string;
  userId: string;
  anonymousId: string;
  userAnonymousId: string;
  depressionSeverity: string;
  anxietySeverity: string;
  stressSeverity: string;
  flagged: boolean;
  createdAt: string;
}

interface AssessmentsResponse {
  assessments: AssessmentRow[];
  total: number;
  page: number;
  totalPages: number;
}

const SEVERITIES = ['', 'normal', 'mild', 'moderate', 'severe', 'extremely_severe'];
const SEVERITY_LABELS: Record<string, string> = {
  '': 'All Severities',
  normal: 'Normal',
  mild: 'Mild',
  moderate: 'Moderate',
  severe: 'Severe',
  extremely_severe: 'Extremely Severe',
};

const SEVERITY_COLORS: Record<string, string> = {
  normal: 'bg-green-100 text-green-700',
  mild: 'bg-lime-100 text-lime-700',
  moderate: 'bg-amber-100 text-amber-700',
  severe: 'bg-orange-100 text-orange-700',
  extremely_severe: 'bg-red-100 text-red-700',
};

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminAssessmentsPage() {
  const router = useRouter();
  const [data, setData] = useState<AssessmentsResponse | null>(null);
  const [page, setPage] = useState(1);
  const [severity, setSeverity] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(
    (p: number, sev: string) => {
      setLoading(true);
      const params = new URLSearchParams({ page: String(p), limit: '20' });
      if (sev) params.set('severity', sev);
      fetch(`/api/admin/assessments?${params}`)
        .then(r => r.json())
        .then(d => setData(d))
        .catch(console.error)
        .finally(() => setLoading(false));
    },
    []
  );

  useEffect(() => { load(page, severity); }, [page, severity, load]);

  const handleSeverityChange = (s: string) => {
    setSeverity(s);
    setPage(1);
  };

  const rows = data?.assessments ?? [];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-white shrink-0">
        <div>
          <h1 className="text-lg font-bold text-foreground">Assessments</h1>
          <p className="text-xs text-muted-foreground font-light">
            {data ? `${data.total} total records` : 'Loading…'}
          </p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <ClipboardListIcon className="w-4 h-4 text-primary" />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-4">
        {/* Severity filter */}
        <div className="flex flex-wrap gap-2">
          {SEVERITIES.map(s => (
            <button
              key={s}
              onClick={() => handleSeverityChange(s)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-colors border',
                severity === s
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
              )}
            >
              {SEVERITY_LABELS[s]}
            </button>
          ))}
        </div>

        <Card className="bg-white">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {['Assessment', 'Participant', 'Depression', 'Anxiety', 'Stress', 'Date', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="px-4 py-3" colSpan={7}>
                            <Skeleton className="h-4 w-full rounded" />
                          </td>
                        </tr>
                      ))
                    : rows.map(a => (
                        <tr key={a.id} className="border-b border-border/50 hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              {a.flagged && <AlertTriangleIcon className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                              <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                                {a.anonymousId}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-mono text-[11px] text-muted-foreground">
                              {a.userAnonymousId}
                            </span>
                          </td>
                          {[a.depressionSeverity, a.anxietySeverity, a.stressSeverity].map((s, i) => (
                            <td key={i} className="px-4 py-3">
                              <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded', SEVERITY_COLORS[s] ?? 'bg-muted text-muted-foreground')}>
                                {s.replace('_', ' ')}
                              </span>
                            </td>
                          ))}
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            {fmt(a.createdAt)}
                          </td>
                          <td className="px-4 py-3 text-right">
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
                  {!loading && rows.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">
                        No assessments match the selected filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  Page {data.page} of {data.totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="h-7 px-2"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page >= data.totalPages}
                    onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                    className="h-7 px-2"
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
