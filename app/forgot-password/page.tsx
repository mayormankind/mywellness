'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { BrainIcon, ArrowLeftIcon, Loader2Icon, MailCheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Request failed');
        return;
      }

      setSuccess(true);
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <MailCheckIcon className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Check your email</h2>
              <p className="text-sm text-muted-foreground font-light max-w-xs mx-auto">
                If an account with that email exists, a password reset link has been sent.
              </p>
              <Link href="/login">
                <Button className="mt-2 w-full">Return to Login</Button>
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
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <BrainIcon className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-foreground">
            My<span className="text-primary">Wellness</span>
          </span>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold">Reset your password</CardTitle>
            <CardDescription className="font-light">
              Enter your email and we&apos;ll send you a reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@futa.edu.ng"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full h-10 mt-2">
                {loading ? (
                  <><Loader2Icon className="w-4 h-4 animate-spin mr-2" />Sending…</>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground font-light mt-6">
              Remember your password?{' '}
              <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
