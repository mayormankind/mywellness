'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { questions, getQuestionsBySubscale, Subscale } from '@/lib/questions';

export default function QuestionnairePage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (Object.keys(answers).length !== 21) {
      setError('Please answer all 21 questions before submitting.');
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
        setError(data.error || 'Submission failed');
        return;
      }

      router.push(`/results/${data.id}`);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderQuestionGroup = (subscale: Subscale, title: string) => {
    const subscaleQuestions = getQuestionsBySubscale(subscale);
    
    return (
      <div key={subscale} className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="space-y-6">
          {subscaleQuestions.map((question) => (
            <div key={question.id} className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-gray-700 mb-3">{question.text}</p>
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2, 3].map((value) => (
                  <label
                    key={value}
                    className={`flex-1 min-w-[100px] cursor-pointer ${
                      answers[question.id] === value
                        ? 'bg-indigo-100 border-indigo-500'
                        : 'bg-gray-50 border-gray-300'
                    } border rounded-md p-3 text-center transition-colors hover:bg-indigo-50`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={value}
                      checked={answers[question.id] === value}
                      onChange={() => handleAnswerChange(question.id, value)}
                      className="sr-only"
                    />
                    <span className="block text-sm font-medium text-gray-900">
                      {value === 0 && 'Did not apply to me at all'}
                      {value === 1 && 'Applied to me to some degree, or some of the time'}
                      {value === 2 && 'Applied to me to a considerable degree, or a good part of the time'}
                      {value === 3 && 'Applied to me very much, or most of the time'}
                    </span>
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Mental Well-Being Monitoring</h1>
              </div>
            </div>
            <div className="flex items-center">
              <a
                href="/dashboard"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Back to Dashboard
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">DASS-21 Assessment</h2>
          <p className="text-gray-600">
            Please read each statement and circle a number 0, 1, 2, or 3 which indicates how much the statement applied to you over the past week.
            There are no right or wrong answers. Do not spend too much time on any statement.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {renderQuestionGroup('depression', 'Depression')}
          {renderQuestionGroup('anxiety', 'Anxiety')}
          {renderQuestionGroup('stress', 'Stress')}

          <div className="mt-8 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Answered: {Object.keys(answers).length} / 21 questions
            </div>
            <button
              type="submit"
              disabled={loading || Object.keys(answers).length !== 21}
              className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Assessment'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
