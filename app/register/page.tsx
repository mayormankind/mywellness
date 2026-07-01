'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { BrainIcon, ArrowLeftIcon, Loader2Icon, MailCheckIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { registerSchema, type RegisterInput } from '@/lib/validation';

export default function RegisterPage() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    setSubmittedEmail(data.email);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        toast.error(responseData.error || 'Registration failed');
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
                We sent a verification link to <strong className="text-foreground">{submittedEmail}</strong>. Verify your email to activate your account.
              </p>
              <Link href="/login">
                <Button className="mt-2 w-full">Go to Login</Button>
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
        href="/"
        className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to home
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
            <CardTitle className="text-xl font-bold">Create your account</CardTitle>
            <CardDescription className="font-light">
              Mental Well-Being Monitoring System
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="userName">Username</Label>
                <Input
                  id="userName"
                  type="text"
                  placeholder="John Doe"
                  {...register('userName')}
                  className="h-10"
                />
                {errors.userName && (
                  <p className="text-xs text-destructive mt-1">{errors.userName.message}</p>
                )}
              </div>

              {/* <div className="space-y-1.5">
                <Label htmlFor="matricNumber">Matric Number</Label>
                <Input
                  id="matricNumber"
                  type="text"
                  placeholder="FUTA/2023/1234"
                  required
                  value={formData.matricNumber}
                  onChange={(e) => setFormData({ ...formData, matricNumber: e.target.value })}
                  className="h-10"
                />
              </div> */}

              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@futa.edu.ng"
                  {...register('email')}
                  className="h-10"
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password')}
                    className="h-10 pr-10"
                  />
                  {errors.password && (
                    <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-10 mt-2">
                {loading ? (
                  <>
                    <Loader2Icon className="w-4 h-4 animate-spin mr-2" />
                    Creating account…
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground font-light mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
