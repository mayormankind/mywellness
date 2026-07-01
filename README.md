# MyWellness

<div align="center">

![MyWellness Logo](https://img.shields.io/badge/MyWellness-FUTA%20Student%20Mental%20Well-being-teal)
![Next.js](https://img.shields.io/badge/Next.js-16.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

**A confidential mental well-being monitoring platform for FUTA students**

[Features](#features) • [Getting Started](#getting-started) • [Documentation](#documentation) • [Security](#security) • [Contributing](#contributing)

</div>

---

## Overview

MyWellness is a comprehensive mental health self-assessment system designed specifically for FUTA students. Built using the scientifically validated DASS-21 questionnaire, the platform provides students with a confidential way to track their mental well-being over time, receive personalized feedback, and access support resources when needed.

### Key Highlights

- 🎯 **Evidence-Based**: Uses the validated DASS-21 assessment tool
- 🔒 **Privacy-First**: User data is protected with enterprise-grade security
- 📊 **Visual Insights**: Interactive charts to track mental wellness trends
- 💡 **Personalized Feedback**: Tailored recommendations based on assessment results
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🎨 **Modern UI**: Clean, intuitive interface built with shadcn/ui components

---

## Features

### For Students

- **DASS-21 Assessment**: Complete the 21-item questionnaire in under 5 minutes
- **Real-Time Results**: Instant feedback with severity classifications
- **Trend Tracking**: Visualize your mental wellness journey over time
- **Personalized Recommendations**: Receive actionable advice based on your scores
- **Assessment History**: Access all past assessments with detailed breakdowns
- **PDF Export**: Download your assessment reports for personal records
- **Crisis Resources**: Quick access to professional support when needed

### For Administrators

- **User Management**: View and manage student accounts
- **Assessment Analytics**: Aggregate statistics and trends
- **Individual Review**: Access anonymized assessment data
- **Export Reports**: Generate detailed reports for analysis
- **Role-Based Access**: Secure admin dashboard with proper authorization

### Security Features

- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Comprehensive Zod schema validation
- **Secure Authentication**: JWT tokens with httpOnly cookies
- **CSRF Protection**: SameSite cookie policies
- **Security Headers**: CSP, X-Frame-Options, and more
- **Input Sanitization**: DOMPurify for XSS prevention

---

## Tech Stack

### Frontend
- **Framework**: Next.js 16.2 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.0
- **Components**: shadcn/ui
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **PDF Generation**: jsPDF

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma 6.0
- **Authentication**: Custom JWT (jose)
- **Email**: Nodemailer
- **Validation**: Zod 4.4
- **Password Hashing**: bcryptjs

### Development
- **Testing**: Vitest
- **Linting**: ESLint
- **Package Manager**: npm

---

## Documentation

- [Architecture](./ARCHITECTURE.md) - System architecture and design decisions
- [Security](./SECURITY.md) - Security policies and best practices
- [Contributing](./CONTRIBUTING.md) - Contribution guidelines
- [Changelog](./CHANGELOG.md) - Version history and changes
- [License](./LICENSE) - MIT License

---

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (Supabase recommended)
- SMTP server for email (or use a service like SendGrid, Mailgun)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/mywellness.git
cd mywellness
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mywellness"
DIRECT_URL="postgresql://user:password@localhost:5432/mywellness"

# Authentication
JWT_SECRET="your-cryptographically-secure-random-secret-min-32-chars"

# Email Configuration
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="your-email@example.com"
SMTP_PASSWORD="your-smtp-password"
SMTP_FROM="noreply@mywellness.com"
```

4. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

---

## Usage

### Student Workflow

#### 1. Registration
1. Navigate to `/register`
2. Enter your username, FUTA student email, and password
3. Check your email for the verification link
4. Click the verification link to activate your account

#### 2. Taking an Assessment
1. Log in to your account
2. Navigate to `/questionnaire`
3. Answer all 21 questions based on how you are feeling currently
4. Submit the assessment to view your results

#### 3. Viewing Results
After completing an assessment, you will see:
- **Overall Summary**: General assessment overview
- **Score Breakdown**: Individual scores for depression, anxiety, and stress
- **Severity Classification**: Severity level for each subscale
- **Personalized Recommendations**: Actionable advice based on your scores
- **Trend Chart**: Visual representation of your scores over time

#### 4. Dashboard Features
- **Latest Results**: Quick view of your most recent assessment
- **Score Changes**: Comparison with previous assessment
- **Mental Wellness Chart**: Interactive chart with time filters (week, month, all)
- **Detailed Metrics**: Progress bars showing score breakdown
- **Trend Summary**: Analysis of your mental wellness patterns

### Admin Workflow

1. Log in with admin credentials
2. Access `/admin` dashboard
3. View user statistics and assessment analytics
4. Review individual assessment data (anonymized)
5. Generate and export reports

---

## DASS-21 Scoring

The DASS-21 questionnaire uses a 4-point scale:

| Score | Description |
|-------|-------------|
| 0 | Does not apply to me at all |
| 1 | Applies to me to some degree, or some of the time |
| 2 | Applies to me to a considerable degree, or a good part of the time |
| 3 | Applies to me very much, or most of the time |

Scores are multiplied by 2 to match the original DASS-42 scale.

### Severity Classifications

**Depression:**
- Normal: 0-9
- Mild: 10-13
- Moderate: 14-20
- Severe: 21-27
- Extremely Severe: 28+

**Anxiety:**
- Normal: 0-7
- Mild: 8-9
- Moderate: 10-14
- Severe: 15-19
- Extremely Severe: 20+

**Stress:**
- Normal: 0-14
- Mild: 15-18
- Moderate: 19-25
- Severe: 26-33
- Extremely Severe: 34+

---

## API Routes

### Authentication
- `POST /api/auth/register` - User registration with email verification
- `GET /api/auth/verify-email?token=xxx` - Email verification
- `POST /api/auth/login` - User login with rate limiting
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/verify` - Verify current authentication status

### Assessments
- `POST /api/assessments` - Submit new assessment (rate limited)
- `GET /api/assessments` - Get user's assessment history
- `GET /api/assessments/[id]` - Get specific assessment details

### User
- `GET /api/user` - Get current user profile

### Admin
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users` - List all users (paginated)
- `GET /api/admin/users/[id]` - Get specific user details
- `GET /api/admin/assessments` - List all assessments
- `GET /api/admin/assessments/[id]` - Get specific assessment
- `GET /api/admin/analytics` - Get analytics data
- `GET /api/admin/reports/export` - Export reports

---

## Testing

Run the test suite:
```bash
npm test
```

Tests are written using Vitest and cover:
- Scoring functions (`lib/scoring.ts`)
- Feedback generation (`lib/feedback.ts`)

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Environment Variables for Production

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct database connection string
- `JWT_SECRET` - Strong random secret (minimum 32 characters)

Optional (for email functionality):
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` - Email configuration
- `SMTP_FROM` - From address for emails

---

## Security

This project implements multiple security measures:

- **Authentication**: JWT tokens with httpOnly cookies
- **Password Security**: bcrypt hashing with 10 salt rounds
- **Rate Limiting**: Protection against brute force and spam
- **Input Validation**: Zod schemas on all API inputs
- **CSRF Protection**: SameSite cookie policies
- **Security Headers**: CSP, X-Frame-Options, X-Content-Type-Options
- **Input Sanitization**: DOMPurify for XSS prevention

For detailed security information, see [SECURITY.md](./SECURITY.md).

---

## Important Notes

⚠️ **Medical Disclaimer**: This system is for self-monitoring purposes only and does not provide medical diagnosis. For severe symptoms or crisis situations, users are strongly advised to seek professional help.

🆘 **Crisis Support**: The platform includes safety resources and crisis support information, including:
- FUTA Counselling Unit contact information
- Suicide Prevention Lifeline: 0800-800-2000

🔒 **Data Privacy**: All user data is confidential and protected. Assessment results are only visible to the user and authorized administrators (anonymized for analytics).

---

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Integration with FUTA student information system
- [ ] Peer support groups
- [ ] Wellness resources library
- [ ] Meditation and relaxation exercises
- [ ] Appointment scheduling with counselors
- [ ] Anonymous peer chat
- [ ] Mood journaling
- [ ] Goal setting and progress tracking

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) for details.

---

## Acknowledgments

- DASS-21 questionnaire developed by Lovibond & Lovibond (1995)
- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Charts from [Recharts](https://recharts.org/)

---

## Support

For issues, questions, or security concerns, please contact:
- Development Team: [GitHub Issues](https://github.com/your-username/mywellness/issues)
- Security: security@futa.edu.ng

---

<div align="center">

**Built with ❤️ for FUTA Students**

</div>
