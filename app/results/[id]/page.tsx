'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await fetch(`/api/assessments/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Assessment not found');
          } else if (response.status === 403) {
            setError('You do not have permission to view this assessment');
          } else {
            setError('Failed to load assessment');
          }
          setLoading(false);
          return;
        }
        const data = await response.json();
        setAssessment(data);
      } catch (err) {
        setError('An error occurred while loading the assessment');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [params.id]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'danger':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
          <div className="mt-4 text-center">
            <a
              href="/dashboard"
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Return to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return null;
  }

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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Assessment Results</h2>
          <p className="text-gray-600">
            Completed on {new Date(assessment.createdAt).toLocaleDateString()}
          </p>
        </div>

        {assessment.feedback.requiresProfessionalHelp && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <h3 className="text-lg font-medium">⚠️ Professional Support Recommended</h3>
            <p className="mt-2">Your assessment indicates significant symptoms. Please consider reaching out to a mental health professional.</p>
          </div>
        )}

        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Overall Assessment</h3>
            <div className={`border rounded-lg p-4 ${getSeverityColor(assessment.feedback.overall.severity)}`}>
              <h4 className="text-xl font-semibold mb-2">{assessment.feedback.overall.title}</h4>
              <p className="mb-4">{assessment.feedback.overall.message}</p>
              <div>
                <h5 className="font-medium mb-2">Recommendations:</h5>
                <ul className="list-disc list-inside space-y-1">
                  {assessment.feedback.overall.recommendations.map((rec: string, idx: number) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Depression</h3>
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {assessment.scores.depression}
              </div>
              <div className={`text-sm font-medium mb-3 px-2 py-1 rounded ${getSeverityColor(assessment.feedback.depression.severity)}`}>
                {assessment.feedback.depression.title}
              </div>
              <p className="text-sm text-gray-600 mb-3">{assessment.feedback.depression.message}</p>
              <div>
                <h5 className="text-sm font-medium mb-1">Recommendations:</h5>
                <ul className="text-xs list-disc list-inside space-y-1">
                  {assessment.feedback.depression.recommendations.map((rec: string, idx: number) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Anxiety</h3>
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {assessment.scores.anxiety}
              </div>
              <div className={`text-sm font-medium mb-3 px-2 py-1 rounded ${getSeverityColor(assessment.feedback.anxiety.severity)}`}>
                {assessment.feedback.anxiety.title}
              </div>
              <p className="text-sm text-gray-600 mb-3">{assessment.feedback.anxiety.message}</p>
              <div>
                <h5 className="text-sm font-medium mb-1">Recommendations:</h5>
                <ul className="text-xs list-disc list-inside space-y-1">
                  {assessment.feedback.anxiety.recommendations.map((rec: string, idx: number) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Stress</h3>
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {assessment.scores.stress}
              </div>
              <div className={`text-sm font-medium mb-3 px-2 py-1 rounded ${getSeverityColor(assessment.feedback.stress.severity)}`}>
                {assessment.feedback.stress.title}
              </div>
              <p className="text-sm text-gray-600 mb-3">{assessment.feedback.stress.message}</p>
              <div>
                <h5 className="text-sm font-medium mb-1">Recommendations:</h5>
                <ul className="text-xs list-disc list-inside space-y-1">
                  {assessment.feedback.stress.recommendations.map((rec: string, idx: number) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <a
            href="/history"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            View your assessment history
          </a>
          <a
            href="/questionnaire"
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Take New Assessment
          </a>
        </div>
      </main>
    </div>
  );
}
