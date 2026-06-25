'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangleIcon, BrainIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen bg-secondary flex flex-col items-center justify-center px-4 py-12">
      <div className="flex items-center gap-2 mb-10">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <BrainIcon className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-lg text-foreground">
          My<span className="text-primary">Wellness</span>
        </span>
      </div>

      <div className="max-w-md w-full text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
          <AlertTriangleIcon className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
        <p className="text-sm text-muted-foreground font-light leading-relaxed">
          An unexpected error occurred. Please try again or return to the dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset}>Try Again</Button>
          <Link href="/dashboard">
            <Button variant="outline" className="w-full sm:w-auto">Go to Dashboard</Button>
          </Link>
        </div>
        <Link href="/" className="block text-xs text-muted-foreground hover:text-primary transition-colors font-light">
          Return to home page
        </Link>
      </div>
    </div>
  );
}
