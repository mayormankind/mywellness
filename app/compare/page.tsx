'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, TrendingUpIcon, TrendingDownIcon, MinusIcon } from 'lucide-react';
import AppNav from '@/components/app-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ComparePage() {
  const router = useRouter();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedA, setSelectedA] = useState<string>('');
  const [selectedB, setSelectedB] = useState<string>('');

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await fetch('/api/assessments');
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          setLoading(false);
          return;
        }
        const data = await response.json();
        setAssessments(data);
        if (data.length >= 2) {
          setSelectedA(data[0].id);
          setSelectedB(data[1].id);
        }
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, [router]);

  const assessmentA = assessments.find((a) => a.id === selectedA);
  const assessmentB = assessments.find((a) => a.id === selectedB);

  const getDelta = (key: 'depression' | 'anxiety' | 'stress') => {
    if (!assessmentA || !assessmentB) return null;
    const valA = assessmentA.scores[key];
    const valB = assessmentB.scores[key];
    const delta = valA - valB;
    if (delta === 0) return { value: 0, icon: MinusIcon, color: 'text-muted-foreground' };
    if (delta > 0) return { value: delta, icon: TrendingUpIcon, color: 'text-red-600' };
    return { value: Math.abs(delta), icon: TrendingDownIcon, color: 'text-green-600' };
  };

  const subscales = ['depression', 'anxiety', 'stress'] as const;

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <AppNav />

      <main className="flex-1 max-w-5xl w-full mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/history" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to History
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">Compare Assessments</h1>
          <p className="text-sm text-muted-foreground font-light">View side-by-side comparison of two assessments</p>
        </div>

        {loading && (
          <div className="space-y-6">
            <Skeleton className="h-12 w-full" />
            <div className="grid grid-cols-2 gap-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
          </div>
        )}

        {!loading && assessments.length < 2 && (
          <Card>
            <CardContent className="pt-12 pb-12 text-center space-y-4">
              <p className="text-sm text-muted-foreground font-light">
                You need at least 2 assessments to compare.
              </p>
              <Link href="/questionnaire">
                <Button>Take an Assessment</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {!loading && assessments.length >= 2 && (
          <>
            {/* Selector */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Select Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground font-light mb-1.5 block">Assessment A</label>
                    <select
                      value={selectedA}
                      onChange={(e) => setSelectedA(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {assessments.map((a) => (
                        <option key={a.id} value={a.id}>
                          {new Date(a.createdAt).toLocaleString('en-GB', {
                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                          })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-light mb-1.5 block">Assessment B</label>
                    <select
                      value={selectedB}
                      onChange={(e) => setSelectedB(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {assessments.map((a) => (
                        <option key={a.id} value={a.id}>
                          {new Date(a.createdAt).toLocaleString('en-GB', {
                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                          })}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comparison */}
            {assessmentA && assessmentB && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">Score Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {subscales.map((key) => {
                        const delta = getDelta(key);
                        const DeltaIcon = delta?.icon;
                        return (
                          <div key={key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                            <div className="flex-1">
                              <p className="text-sm font-medium capitalize">{key}</p>
                              <p className="text-xs text-muted-foreground font-light">
                                {assessmentA.feedback[key].title} → {assessmentB.feedback[key].title}
                              </p>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-center">
                                <p className="text-lg font-bold">{assessmentA.scores[key]}</p>
                                <p className="text-xs text-muted-foreground">A</p>
                              </div>
                              {delta && DeltaIcon && (
                                <div className={`flex items-center gap-1 text-xs font-medium ${delta.color}`}>
                                  <DeltaIcon className="w-4 h-4" />
                                  {delta.value > 0 ? `+${delta.value}` : delta.value}
                                </div>
                              )}
                              <div className="text-center">
                                <p className="text-lg font-bold">{assessmentB.scores[key]}</p>
                                <p className="text-xs text-muted-foreground">B</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-semibold">Assessment A</CardTitle>
                      <p className="text-xs text-muted-foreground font-light">
                        {new Date(assessmentA.createdAt).toLocaleString('en-GB')}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground font-light leading-relaxed mb-3">
                        {assessmentA.feedback.overall.message}
                      </p>
                      <Link href={`/results/${assessmentA.id}`}>
                        <Button variant="outline" size="sm" className="w-full">View Details</Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-semibold">Assessment B</CardTitle>
                      <p className="text-xs text-muted-foreground font-light">
                        {new Date(assessmentB.createdAt).toLocaleString('en-GB')}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground font-light leading-relaxed mb-3">
                        {assessmentB.feedback.overall.message}
                      </p>
                      <Link href={`/results/${assessmentB.id}`}>
                        <Button variant="outline" size="sm" className="w-full">View Details</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
