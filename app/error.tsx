'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">Error</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-8">
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>
        <div className="space-y-4">
          <button
            onClick={reset}
            className="inline-block px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Try Again
          </button>
          <br />
          <Link
            href="/dashboard"
            className="inline-block text-indigo-600 hover:text-indigo-500"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
