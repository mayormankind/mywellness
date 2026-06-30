'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ClipboardListIcon,
  HistoryIcon,
  InfoIcon,
  ArrowRightIcon,
  HeartPulseIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  MinusIcon,
} from 'lucide-react';
import AppNav from '@/components/app-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ userName: string; email: string } | null>(null);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [authRes, assessmentsRes] = await Promise.all([
          fetch('/api/auth/verify'),
          fetch('/api/assessments'),
        ]);
        if (!authRes.ok) {
          router.push('/login');
          return;
        }
        const authData = await authRes.json();
        setUser(authData.user);
        if (assessmentsRes.ok) {
          const assessmentsData = await assessmentsRes.json();
          setAssessments(assessmentsData);
        }
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [router]);

  const latest = assessments[0];
  const previous = assessments[1];

  const getDelta = (key: 'depression' | 'anxiety' | 'stress') => {
    if (!latest || !previous) return null;
    const current = latest.scores[key];
    const prev = previous.scores[key];
    const delta = prev - current;
    if (delta === 0) return { value: 0, icon: MinusIcon, color: 'text-muted-foreground' };
    if (delta > 0) return { value: delta, icon: TrendingDownIcon, color: 'text-green-600' };
    return { value: Math.abs(delta), icon: TrendingUpIcon, color: 'text-red-600' };
  };

  const getTrendSummary = () => {
    const recent = assessments.slice(0, 3);
    if (recent.length < 2) return null;

    const first = recent[recent.length - 1];
    const last = recent[0];

    const improved: string[] = [];
    const worsened: string[] = [];
    const stable: string[] = [];

    ['depression', 'anxiety', 'stress'].forEach((key) => {
      const delta = first.scores[key] - last.scores[key];
      if (delta > 2) improved.push(key);
      else if (delta < -2) worsened.push(key);
      else stable.push(key);
    });

    if (improved.length === 3) {
      return 'Your mental well-being has been improving across all areas. Keep up the great work!';
    }
    if (worsened.length === 3) {
      return 'Your scores have increased across all areas. Consider reaching out for support.';
    }
    if (improved.length > worsened.length) {
      return `Your ${improved.join(', ')} scores have been improving over your last ${recent.length} assessments.`;
    }
    if (worsened.length > improved.length) {
      return `Your ${worsened.join(', ')} scores have increased. Pay attention to these areas.`;
    }
    return 'Your scores have remained relatively stable over recent assessments.';
  };

  const cards = [
    {
      icon: ClipboardListIcon,
      title: 'Take Assessment',
      description:
        'Complete the 21-question DASS-21 assessment to evaluate your current depression, anxiety, and stress levels.',
      action: { label: 'Start Assessment', href: '/questionnaire' },
      accent: 'bg-primary/10 text-primary',
    },
    {
      icon: HistoryIcon,
      title: 'View History',
      description:
        'Browse your past assessment results and track trends in your mental well-being over time.',
      action: { label: 'View History', href: '/history' },
      accent: 'bg-accent/60 text-primary',
    },
    {
      icon: InfoIcon,
      title: 'About DASS-21',
      description:
        'Learn about the Depression Anxiety Stress Scales — the scientifically validated instrument used here.',
      action: { label: 'Learn More', href: '/#about' },
      accent: 'bg-muted text-muted-foreground',
    },
  ];

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <AppNav userName={user?.userName} />

      <main className="flex-1 max-w-7xl w-full mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Greeting */}
        <div className="mb-10">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="h-5 w-80" />
            </div>
          ) : (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                Welcome back, {user?.userName?.split(' ')[0] ?? 'Student'} 👋
              </h1>
              <p className="text-muted-foreground font-light">
                How are you feeling today? Take a moment to check in with yourself.
              </p>
            </>
          )}
        </div>

        {/* Hero CTA strip */}
        <div
          className="rounded-2xl p-6 sm:p-8 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ backgroundColor: '#20ADA0' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <HeartPulseIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">Ready for your next check-in?</p>
              <p className="text-white/80 text-sm font-light">
                The DASS-21 takes less than 5 minutes to complete.
              </p>
            </div>
          </div>
          <Link href="/questionnaire">
            <Button className="bg-white text-primary hover:bg-white/90 shrink-0 gap-2">
              Start Assessment
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Score deltas */}
        {latest && previous && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {(['depression', 'anxiety', 'stress'] as const).map((key) => {
              const delta = getDelta(key);
              const DeltaIcon = delta?.icon;
              return (
                <Card key={key} className="bg-white">
                  <CardContent className="pt-6 pb-5 text-center">
                    <p className="text-xs text-muted-foreground font-light mb-2 capitalize">{key}</p>
                    <p className="text-3xl font-bold text-foreground mb-2">{latest.scores[key]}</p>
                    {delta && DeltaIcon && (
                      <div className={`flex items-center justify-center gap-1 text-xs font-medium ${delta.color}`}>
                        <DeltaIcon className="w-3.5 h-3.5" />
                        {delta.value > 0 ? `${delta.value} pts` : 'No change'}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Trend summary */}
        {assessments.length >= 2 && (
          <Card className="bg-white mb-6">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <HeartPulseIcon className="w-4 h-4 text-primary" />
                Trend Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                {getTrendSummary()}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map(({ icon: Icon, title, description, action, accent }) => (
            <Card key={title} className="bg-white">
              <CardHeader>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1 ${accent}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
                <CardDescription className="font-light text-sm leading-relaxed">
                  {description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={action.href}>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    {action.label}
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
