# Changelog

All notable changes to MyWellness will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- React Hook Form integration with Zod validation for all auth forms
- Real-time form validation with onChange mode
- Rate limiting on sensitive API endpoints (login, register, assessments)
- Security headers via proxy (CSP, X-Frame-Options, X-Content-Type-Options, etc.)
- Input sanitization utilities with DOMPurify
- JWT secret fail-fast mechanism (no fallback)
- Mental wellness chart with time filters (week, month, all) on dashboard
- Detailed metrics display with progress bars on dashboard
- Latest assessment results summary on dashboard
- Empty state handling for no assessments
- Instrument Sans font integration
- Present tense phrasing for all assessment questions and UI text

### Changed
- Updated all DASS-21 questions from past tense to present tense
- Updated questionnaire scale labels to present tense
- Updated assessment instructions across the application
- Removed HTML required attributes in favor of React Hook Form validation
- Improved dashboard UX with intuitive charts and metrics

### Security
- Added rate limiting to prevent brute force attacks
- Added comprehensive security headers
- Removed fallback JWT secret
- Added input sanitization utilities
- Enhanced CSRF protection with SameSite cookies

### Fixed
- Prisma client sync issues
- Build conflicts between middleware.ts and proxy.ts
- Duplicate Skeleton import in dashboard

## [0.1.0] - 2026-07-01

### Added
- Initial release of MyWellness platform
- User registration with email verification
- JWT-based authentication
- DASS-21 assessment questionnaire
- Assessment results with scoring and feedback
- Student dashboard with assessment history
- Admin dashboard with user management
- Assessment analytics and reporting
- PDF export for assessment results
- Mental wellness trend tracking
- Password reset functionality
- Role-based access control (student/admin)
- Responsive design with Tailwind CSS
- Instrument Sans font

### Security
- bcrypt password hashing
- httpOnly cookies for JWT tokens
- Zod validation on all API inputs
- Role-based route protection
- Email verification requirement

[Unreleased]: https://github.com/your-username/mywellness/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/your-username/mywellness/releases/tag/v0.1.0
