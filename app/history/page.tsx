'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
import { ClipboardListIcon, ExternalLinkIcon, GitCompareArrowsIcon } from 'lucide-react';
import AppNav from '@/components/app-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function HistoryPage() {
  const router = useRouter();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await fetch('/api/assessments', { credentials: 'include' });
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          setError('Failed to load assessments');
          setLoading(false);
          return;
        }
        const data = await response.json();
        setAssessments(data);
      } catch (err) {
        setError('An error occurred while loading assessments');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [router]);

  const getBadge = (severity: string) => {
    if (severity === 'info') return 'bg-primary/10 text-primary';
    if (severity === 'warning') return 'bg-yellow-100 text-yellow-800';
    if (severity === 'danger') return 'bg-red-100 text-red-700';
    return 'bg-muted text-muted-foreground';
  };

  const sorted = [...assessments].reverse();

  const chartData = sorted.map((a) => ({
    date: new Date(a.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    Depression: a.scores.depression,
    Anxiety: a.scores.anxiety,
    Stress: a.scores.stress,
  }));

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <AppNav />

      <main className="flex-1 max-w-7xl w-full mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">Assessment History</h1>
            <p className="text-sm text-muted-foreground font-light">Track your mental well-being over time</p>
          </div>
          <div className="flex gap-2 self-start sm:self-auto shrink-0">
            {assessments.length >= 2 && (
              <Link href="/compare">
                <Button size="sm" variant="outline" className="gap-1.5">
                  <GitCompareArrowsIcon className="w-4 h-4" />
                  Compare
                </Button>
              </Link>
            )}
            <Link href="/questionnaire">
              <Button size="sm" className="gap-1.5">
                <ClipboardListIcon className="w-4 h-4" />
                New Assessment
              </Button>
            </Link>
          </div>
        </div>

        {loading && (
          <div className="space-y-6">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-80 rounded-xl" />
          </div>
        )}

        {error && !loading && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 font-light">
            {error}
          </div>
        )}

        {!loading && assessments.length === 0 && (
          <Card>
            <CardContent className="pt-12 pb-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto">
                <ClipboardListIcon className="w-7 h-7 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">No assessments yet</h2>
              <p className="text-sm text-muted-foreground font-light max-w-xs mx-auto">
                Complete your first DASS-21 assessment to start tracking your well-being.
              </p>
              <Link href="/questionnaire">
                <Button className="mt-2">Take Your First Assessment</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {!loading && assessments.length > 0 && (
          <div className="space-y-6">
            {assessments.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Score Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 42]} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Depression" stroke="#20ADA0" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Anxiety" stroke="#8BD4CD" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Stress" stroke="#166262" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-base font-semibold">All Assessments</CardTitle>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {['Date', 'Depression', 'Anxiety', 'Stress', 'Overall', ''].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {assessments.map((a) => (
                      <tr key={a.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-4 text-sm text-foreground whitespace-nowrap font-light">
                          {new Date(a.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </td>
                        {(['depression', 'anxiety', 'stress'] as const).map((sub) => (
                          <td key={sub} className="px-5 py-4 whitespace-nowrap">
                            <span className="font-semibold text-foreground mr-2">{a.scores[sub]}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getBadge(a.feedback[sub].severity)}`}>
                              {a.feedback[sub].title}
                            </span>
                          </td>
                        ))}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getBadge(a.feedback.overall.severity)}`}>
                            {a.feedback.overall.title}
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <Link
                            href={`/results/${a.id}`}
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                          >
                            Details
                            <ExternalLinkIcon className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
