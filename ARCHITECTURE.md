# Architecture Documentation

## Overview

This project follows a clear 3-tier architecture pattern, despite being implemented in a single Next.js repository. The separation of concerns is maintained through folder structure and disciplined code organization.

## 3-Tier Architecture

### 1. Presentation Layer

**Location:** `/app/*`

This layer handles:
- UI rendering using Next.js App Router and React components
- User interactions and form submissions
- Client-side state management (minimal)
- Styling with Tailwind CSS

**Key Components:**
- Page components in `/app/(routes)/*` - render the UI for each route
- Layout components - shared UI structure
- Client components - interactive elements that require client-side JavaScript

**Responsibilities:**
- Display data to users
- Collect user input
- Handle navigation
- Render feedback and error messages

### 2. Application/Logic Layer

**Location:** `/app/api/*` and `/lib/*`

This layer handles:
- Business logic and rules
- Request validation
- Authentication and authorization
- Data processing and transformation
- Email sending logic

**Key Components:**
- API routes in `/app/api/*` - HTTP endpoints for client communication
- Business logic in `/lib/*`:
  - `auth.ts` - password hashing, JWT signing/verification, cookie management
  - `mailer.ts` - email transport and templates
  - `questions.ts` - DASS-21 question bank configuration
  - `scoring.ts` - pure functions for calculating subscale scores and severity classification
  - `feedback.ts` - feedback matrix mapping classifications to messages and tips
  - `validation.ts` - Zod schemas for input validation

**Responsibilities:**
- Validate incoming requests
- Apply business rules
- Coordinate data access
- Transform data between layers
- Handle authentication and authorization

### 3. Data Layer

**Location:** PostgreSQL on Supabase, accessed via Prisma

This layer handles:
- Data persistence
- Data retrieval
- Data relationships
- Transaction management

**Key Components:**
- Prisma ORM (`/prisma/schema.prisma`) - defines data models and relationships
- Prisma client (`/lib/prisma.ts`) - singleton instance for database access
- PostgreSQL database hosted on Supabase

**Responsibilities:**
- Store and retrieve data
- Maintain data integrity
- Enforce constraints
- Manage relationships

**Important:** We connect to Supabase exclusively via the PostgreSQL connection string through Prisma. We do NOT use the Supabase JS client/SDK.

## Data Flow

### Example: User Registration

1. **Presentation Layer:** User fills out registration form on `/register/page.tsx`
2. **Application Layer:** Form data sent to `POST /api/auth/register`
   - Validates input using Zod schemas (`lib/validation.ts`)
   - Checks uniqueness (email, matric number)
   - Hashes password using bcrypt (`lib/auth.ts`)
   - Creates user record via Prisma
   - Generates verification token
   - Sends verification email via Nodemailer (`lib/mailer.ts`)
3. **Data Layer:** Prisma persists user to PostgreSQL

### Example: Assessment Submission

1. **Presentation Layer:** User completes questionnaire on `/questionnaire/page.tsx`
2. **Application Layer:** Answers sent to `POST /api/assessments`
   - Validates answer format
   - Passes answers to scoring engine (`lib/scoring.ts`)
   - Calculates subscale scores (depression, anxiety, stress)
   - Classifies severity levels
   - Persists assessment via Prisma
3. **Data Layer:** Assessment stored in PostgreSQL

### Example: Viewing Results

1. **Presentation Layer:** User navigates to `/results/[id]/page.tsx`
2. **Application Layer:** Page fetches assessment via `GET /api/assessments/[id]`
   - Verifies JWT from cookie (`lib/auth.ts`)
   - Ensures assessment belongs to authenticated user
   - Retrieves assessment via Prisma
   - Passes severity classifications to feedback engine (`lib/feedback.ts`)
   - Returns formatted results
3. **Data Layer:** Assessment retrieved from PostgreSQL

## Security Architecture

### Authentication
- Custom implementation using bcrypt for password hashing
- JWT tokens signed with secret key
- Tokens stored in HttpOnly, Secure, SameSite=Lax cookies
- 2-hour token expiry

### Authorization
- Middleware (`middleware.ts`) protects protected routes
- JWT verified on each protected request
- All database queries scoped to authenticated user's ID
- No admin dashboard for viewing individual user results

### Data Privacy
- No data shared with third parties
- Email sent via SMTP (Nodemailer), not third-party email service SDKs
- No AI/ML processing of user data
- All scoring and feedback is deterministic rule-based logic

## Technology Stack Rationale

| Technology | Purpose | Why This Choice |
|------------|---------|-----------------|
| Next.js 14+ (App Router) | Framework | Modern React framework with built-in routing and API routes |
| TypeScript | Language | Type safety and better developer experience |
| PostgreSQL | Database | Robust relational database with strong constraints |
| Supabase | Database Hosting | Managed PostgreSQL hosting (DB only, not SDK) |
| Prisma | ORM | Type-safe database access with excellent TypeScript support |
| bcryptjs | Password Hashing | Industry-standard password hashing |
| jsonwebtoken | JWT | Lightweight token-based authentication |
| Nodemailer | Email | Simple SMTP email sending without third-party SDKs |
| Zod | Validation | Runtime type validation with TypeScript inference |
| Tailwind CSS | Styling | Utility-first CSS for rapid UI development |
| Chart.js + react-chartjs-2 | Charts | Simple, flexible charting library |
| Vitest | Testing | Fast unit test framework with native ESM support |
| Vercel | Deployment | Seamless Next.js deployment with edge functions |

## Folder Structure Summary

```
/app
  /api              # Application Layer: API routes
    /auth           # Authentication endpoints
    /assessments    # Assessment endpoints
  /(routes)         # Presentation Layer: Page components
    /login
    /register
    /dashboard
    /questionnaire
    /results
    /history
/lib                # Application Layer: Business logic
  prisma.ts         # Prisma client singleton
  auth.ts           # Authentication utilities
  mailer.ts         # Email utilities
  questions.ts      # Question bank
  scoring.ts        # Scoring engine (pure functions)
  feedback.ts       # Feedback engine (pure functions)
  validation.ts     # Zod schemas
/prisma             # Data Layer: Database schema
  schema.prisma
/__tests__          # Testing
  scoring.test.ts   # Unit tests for scoring
  feedback.test.ts  # Unit tests for feedback
middleware.ts       # Route protection
```

## Key Design Principles

1. **Separation of Concerns:** Each layer has distinct responsibilities
2. **Pure Functions:** `lib/scoring.ts` and `lib/feedback.ts` contain no framework dependencies
3. **Type Safety:** TypeScript and Zod ensure type safety throughout
4. **No AI/ML:** All logic is deterministic and rule-based
5. **Custom Auth:** No third-party auth providers, full control over authentication
6. **Testability:** Business logic is isolated and independently testable
