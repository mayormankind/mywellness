'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BrainIcon, Loader2Icon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. Please request a new verification email.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed');
        }
      } catch {
        setStatus('error');
        setMessage('An error occurred. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-secondary flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <BrainIcon className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-foreground">
            My<span className="text-primary">Wellness</span>
          </span>
        </div>

        <Card>
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            {status === 'loading' && (
              <>
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <Loader2Icon className="w-7 h-7 text-primary animate-spin" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Verifying your email</h2>
                <p className="text-sm text-muted-foreground font-light">
                  Please wait while we verify your email address…
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <CheckCircleIcon className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Email Verified!</h2>
                <p className="text-sm text-muted-foreground font-light max-w-xs mx-auto">{message}</p>
                <Link href="/login">
                  <Button className="mt-2 w-full">Proceed to Login</Button>
                </Link>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                  <AlertCircleIcon className="w-7 h-7 text-destructive" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Verification Failed</h2>
                <p className="text-sm text-muted-foreground font-light max-w-xs mx-auto">{message}</p>
                <Link href="/login">
                  <Button className="mt-2 w-full">Return to Login</Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-secondary flex items-center justify-center">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
