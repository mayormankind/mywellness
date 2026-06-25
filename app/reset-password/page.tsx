'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { BrainIcon, ArrowLeftIcon, Loader2Icon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setTokenValid(false);
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = searchParams.get('token');
    if (!token) {
      setError('Invalid reset link');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Reset failed');
        return;
      }

      setSuccess(true);
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logoBlock = (
    <div className="flex items-center justify-center gap-2 mb-8">
      <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
        <BrainIcon className="w-5 h-5 text-white" />
      </div>
      <span className="font-bold text-xl text-foreground">
        My<span className="text-primary">Wellness</span>
      </span>
    </div>
  );

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-secondary flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {logoBlock}
          <Card>
            <CardContent className="pt-8 pb-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                <AlertCircleIcon className="w-7 h-7 text-destructive" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Invalid Reset Link</h2>
              <p className="text-sm text-muted-foreground font-light">{error}</p>
              <Link href="/forgot-password">
                <Button className="mt-2 w-full">Request New Reset Link</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-secondary flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {logoBlock}
          <Card>
            <CardContent className="pt-8 pb-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <CheckCircleIcon className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Password Reset Successful</h2>
              <p className="text-sm text-muted-foreground font-light">
                You can now sign in with your new password.
              </p>
              <Link href="/login">
                <Button className="mt-2 w-full">Proceed to Login</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary flex flex-col items-center justify-center px-4 py-12">
      <Link
        href="/login"
        className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to login
      </Link>

      <div className="w-full max-w-md">
        {logoBlock}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold">Set new password</CardTitle>
            <CardDescription className="font-light">Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full h-10 mt-2">
                {loading ? (
                  <><Loader2Icon className="w-4 h-4 animate-spin mr-2" />Resetting…</>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
