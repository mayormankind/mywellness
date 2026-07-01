import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || (() => {
    throw new Error('JWT_SECRET environment variable is not set');
  })()
);

const STUDENT_ROUTES = ['/dashboard', '/questionnaire', '/results', '/history', '/settings'];
const ADMIN_ROUTES = ['/admin'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isStudentRoute = STUDENT_ROUTES.some(p => pathname.startsWith(p));
  const isAdminRoute = ADMIN_ROUTES.some(p => pathname.startsWith(p));

  // Add security headers to all responses
  const response = isStudentRoute || isAdminRoute ? NextResponse.next() : NextResponse.next();
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'none';"
  );
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  if (!isStudentRoute && !isAdminRoute) return response;

  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (isAdminRoute && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return response;
  } catch {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/questionnaire/:path*',
    '/results/:path*',
    '/history/:path*',
    '/settings/:path*',
    '/admin/:path*',
  ],
};
