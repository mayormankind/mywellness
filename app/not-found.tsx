import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="inline-block px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Go to Dashboard
          </Link>
          <br />
          <Link
            href="/"
            className="inline-block text-indigo-600 hover:text-indigo-500"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
