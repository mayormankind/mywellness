'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2Icon } from 'lucide-react';
import { getQuestionsBySubscale, Subscale } from '@/lib/questions';
import AppNav from '@/components/app-nav';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const SCALE_LABELS = [
  'Did not apply to me at all',
  'Applied to me to some degree',
  'Applied to a considerable degree',
  'Applied very much, or most of the time',
];

export default function QuestionnairePage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / 21) * 100);

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (answeredCount !== 21) {
      toast.error('Please answer all 21 questions before submitting.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Submission failed');
        return;
      }

      router.push(`/results/${data.id}`);
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderGroup = (subscale: Subscale, title: string, color: string) => {
    const qs = getQuestionsBySubscale(subscale);
    return (
      <div key={subscale} className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-3 h-3 rounded-full ${color}`} />
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <span className="text-xs text-muted-foreground font-light">
            ({qs.filter((q) => answers[q.id] !== undefined).length}/{qs.length} answered)
          </span>
        </div>
        <div className="space-y-4">
          {qs.map((question, idx) => (
            <div key={question.id} className="bg-white rounded-xl border border-border p-5">
              <p className="text-sm font-medium text-foreground mb-4">
                <span className="text-primary font-semibold mr-2">{idx + 1}.</span>
                {question.text}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((value) => (
                  <label
                    key={value}
                    className={cn(
                      'cursor-pointer rounded-lg border p-3 text-center text-xs font-medium transition-colors',
                      answers[question.id] === value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-secondary text-muted-foreground hover:border-primary/40 hover:text-foreground'
                    )}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={value}
                      checked={answers[question.id] === value}
                      onChange={() => handleAnswerChange(question.id, value)}
                      className="sr-only"
                    />
                    <span className="block font-bold text-lg mb-1">{value}</span>
                    {SCALE_LABELS[value]}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <AppNav />

      <main className="flex-1 max-w-3xl w-full mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">DASS-21 Assessment</h1>
          <p className="text-muted-foreground font-light text-sm max-w-xl">
            Rate each statement based on how much it applied to you <strong className="text-foreground">over the past week</strong>. There are no right or wrong answers.
          </p>
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-xl border border-border p-4 mb-8 flex items-center gap-4">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-medium text-foreground shrink-0">
            {answeredCount} / 21
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          {renderGroup('depression', 'Depression', 'bg-primary')}
          {renderGroup('anxiety', 'Anxiety', 'bg-chart-2')}
          {renderGroup('stress', 'Stress', 'bg-chart-3')}

          <div className="sticky bottom-4 mt-6">
            <div className="bg-white border border-border rounded-xl p-4 flex items-center justify-between shadow-sm">
              <p className="text-sm text-muted-foreground font-light">
                {21 - answeredCount > 0
                  ? `${21 - answeredCount} question${21 - answeredCount === 1 ? '' : 's'} remaining`
                  : 'All questions answered — ready to submit!'}
              </p>
              <Button
                type="submit"
                disabled={loading || answeredCount !== 21}
                className="gap-2"
              >
                {loading ? (
                  <><Loader2Icon className="w-4 h-4 animate-spin" />Submitting…</>
                ) : (
                  'Submit Assessment'
                )}
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
