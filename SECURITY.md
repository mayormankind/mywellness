# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability in MyWellness, please report it responsibly.

### How to Report

**Do NOT** open a public issue for security vulnerabilities.

Instead, send an email to: security@futa.edu.ng

Please include:
- A description of the vulnerability
- Steps to reproduce the issue
- Potential impact if exploited
- Any suggested fixes (if known)

### Response Timeline

- **Initial response**: Within 48 hours
- **Investigation**: Within 7 days
- **Resolution**: Based on severity and complexity

### Supported Versions

Only the latest version of MyWellness receives security updates. Users are encouraged to upgrade to the latest version as soon as possible.

## Security Features

### Authentication & Authorization

- **JWT-based authentication** with httpOnly cookies
- **Role-based access control** (student/admin)
- **Email verification** required before account activation
- **Secure password hashing** using bcrypt (10 salt rounds)
- **JWT expiry**: 2 hours
- **No fallback secrets** - fails fast if JWT_SECRET not set

### API Security

- **Rate limiting** on sensitive endpoints:
  - Login: 5 requests per 15 minutes per IP
  - Register: 3 requests per hour per IP
  - Assessments: 10 requests per hour per user
- **Zod validation** on all API inputs
- **JWT verification** on protected routes
- **Role checks** on admin routes

### Web Security

- **Content Security Policy** (CSP) headers
- **X-Frame-Options: DENY** (prevents clickjacking)
- **X-Content-Type-Options: nosniff** (prevents MIME sniffing)
- **X-XSS-Protection: 1; mode=block**
- **Referrer-Policy: strict-origin-when-cross-origin**
- **Permissions-Policy** (restricts camera, microphone, geolocation)
- **SameSite: lax** cookies (CSRF protection)
- **httpOnly cookies** (prevents XSS token theft)
- **Secure cookies** in production

### Input Sanitization

- **DOMPurify** for HTML sanitization (client-side)
- **Text escaping** utilities for plain text
- **Zod schemas** for input validation

### Database Security

- **Environment variables** for sensitive credentials
- **Prisma ORM** with parameterized queries (SQL injection prevention)
- **Supabase** with built-in security features

## Best Practices for Deployment

### Environment Variables

Required environment variables:

```env
DATABASE_URL=your_postgresql_database_url
DIRECT_URL=your_direct_database_url
JWT_SECRET=your_strong_random_secret (minimum 32 characters)
```

### Production Checklist

- [ ] Set strong `JWT_SECRET` (use a cryptographically secure random string)
- [ ] Enable HTTPS
- [ ] Configure proper CORS settings
- [ ] Set up database backups
- [ ] Enable monitoring and logging
- [ ] Configure rate limiting appropriately for your scale
- [ ] Review and update security headers as needed
- [ ] Keep dependencies updated

## Known Limitations

### Rate Limiting

The current implementation uses in-memory rate limiting, which works for single-server deployments. For production with multiple server instances, consider using Redis-based rate limiting (e.g., Upstash).

### Server-Side Sanitization

DOMPurify requires a browser environment. For full server-side HTML sanitization, consider using a library like `sanitize-html`.

## Security Audits

This project undergoes regular security reviews. Key areas audited:

- Authentication flow
- Authorization checks
- Input validation
- SQL injection prevention
- XSS prevention
- CSRF protection
- Rate limiting effectiveness
- Dependency vulnerabilities

## Dependency Management

We regularly update dependencies to address security vulnerabilities. Run:

```bash
npm audit
npm audit fix
```

## Data Privacy

- User data is stored securely in Supabase (PostgreSQL)
- Passwords are never stored in plain text
- Assessment results are private to the user
- Admin access is role-restricted
- Email addresses are used only for account verification and password reset

## Contact

For security-related questions or concerns, contact: security@futa.edu.ng
