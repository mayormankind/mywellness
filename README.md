# Mental Well-Being Monitoring System

A rule-based mental health self-assessment system for FUTA students using the DASS-21 questionnaire. This system provides students with a confidential way to track their mental well-being over time and receive personalized feedback based on their assessment results.

## Features

- **DASS-21 Assessment**: Validated 21-item questionnaire measuring depression, anxiety, and stress
- **Personalized Feedback**: Rule-based feedback matrix with recommendations based on severity levels
- **Assessment History**: Track mental well-being trends over time with visual charts
- **Secure Authentication**: Custom JWT-based authentication with email verification
- **Password Recovery**: Forgot password and reset password functionality
- **Data Privacy**: User data is protected with proper authentication and authorization
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Custom JWT with httpOnly cookies
- **Email**: Nodemailer for verification and password reset
- **Validation**: Zod for input validation
- **Charts**: Chart.js with react-chartjs-2
- **Testing**: Vitest for unit tests

## Architecture

The application follows a 3-tier architecture:

1. **Presentation Layer**: React components and pages (`app/` directory)
2. **Application/Logic Layer**: Business logic and utilities (`lib/` directory)
3. **Data Layer**: Database access via Prisma (`prisma/` directory)

See `ARCHITECTURE.md` for detailed documentation.

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- SMTP server for email (or use a service like SendGrid)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mywellness
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
DATABASE_URL="postgresql://user:password@localhost:5432/mywellness"
JWT_SECRET="your-secret-key-here"
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_USER="your-email@example.com"
SMTP_PASSWORD="your-smtp-password"
SMTP_FROM="noreply@mywellness.com"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Registration

1. Navigate to `/register`
2. Fill in your full name, matric number, email, and password
3. Check your email for verification link
4. Click the verification link to activate your account

### Taking an Assessment

1. Log in to your account
2. Navigate to `/questionnaire`
3. Answer all 21 questions based on how you felt over the past week
4. Submit the assessment to view your results

### Viewing Results

After completing an assessment, you will see:
- Overall assessment summary
- Individual scores for depression, anxiety, and stress
- Severity classification for each subscale
- Personalized recommendations based on your scores

### Assessment History

Navigate to `/history` to:
- View all your past assessments
- See score trends over time with a line chart
- Click on any assessment to view detailed results

## DASS-21 Scoring

The DASS-21 questionnaire uses a 4-point scale:
- 0: Did not apply to me at all
- 1: Applied to me to some degree, or some of the time
- 2: Applied to me to a considerable degree, or a good part of the time
- 3: Applied to me very much, or most of the time

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

## API Routes

### Authentication
- `POST /api/auth/register` - User registration
- `GET /api/auth/verify-email?token=xxx` - Email verification
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Assessments
- `POST /api/assessments` - Submit new assessment
- `GET /api/assessments` - Get user's assessment history
- `GET /api/assessments/[id]` - Get specific assessment details

## Testing

Run the test suite:
```bash
npm test
```

Tests are written using Vitest and cover:
- Scoring functions (`lib/scoring.ts`)
- Feedback generation (`lib/feedback.ts`)

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to set these in your production environment:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Strong random secret for JWT signing
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` - Email configuration
- `SMTP_FROM` - From address for emails

## Security

- Passwords are hashed using bcryptjs
- JWT tokens are stored in httpOnly cookies
- CSRF protection via SameSite cookie attribute
- All protected routes require authentication
- User data is filtered to prevent information leakage
- Input validation using Zod schemas

## Important Notes

- This system is for self-monitoring purposes only and does not provide medical diagnosis
- For severe symptoms, users are advised to seek professional help
- The system includes safety resources and crisis support information
- All user data is confidential and protected

## License

This project is for educational purposes.

## Support

For issues or questions, please contact the development team.
