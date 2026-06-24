'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyEmailPage() {
  const router = useRouter();
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
      } catch (err) {
        setStatus('error');
        setMessage('An error occurred. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
        </div>

        {status === 'loading' && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Verifying your email...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            <h3 className="text-lg font-medium">Success!</h3>
            <p className="mt-2">{message}</p>
            <div className="mt-4">
              <a
                href="/login"
                className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Proceed to Login
              </a>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <h3 className="text-lg font-medium">Verification Failed</h3>
            <p className="mt-2">{message}</p>
            <div className="mt-4">
              <a
                href="/login"
                className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Return to Login
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
