# PROJECT BRIEF FOR CODING AGENT

## Project: Mental Well-Being Monitoring System for FUTA Students

You are building a final-year software engineering project: a web-based, **rule-based** (explicitly NOT AI/ML-based) mental well-being self-assessment system for university students. Read this entire brief before writing any code, and follow the phase order — do not skip ahead or combine phases.

---

## 1. Core Constraints (Non-Negotiable)

- **No AI/ML anywhere in the system.** No LLM calls, no sentiment analysis models, no "smart" recommendation engines. All scoring, classification, and feedback must be deterministic rule-based logic that a human can read top to bottom and verify. This is a stated academic requirement, not a placeholder for "do it properly later."
- **No third-party auth providers** (no Supabase Auth, NextAuth/Auth.js with OAuth, Clerk, etc.). Auth is custom-built: bcrypt password hashing + JWT issued by our own API routes, stored in an HttpOnly cookie.
- **No third-party email service SDKs.** Email (verification, password reset) is sent via **Nodemailer** over SMTP.
- Supabase is used **only** as a hosted PostgreSQL database. We connect to it via its Postgres connection string through Prisma — never via the Supabase JS client/SDK.

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router), TypeScript |
| Database | PostgreSQL, hosted on Supabase (DB only, not their SDK) |
| ORM | Prisma |
| Auth | Custom: bcrypt + JWT (HttpOnly, Secure, SameSite=Lax cookie) |
| Email | Nodemailer over SMTP |
| Validation | Zod |
| Styling | Tailwind CSS |
| Charts | Chart.js (via react-chartjs-2) |
| Testing | Vitest |
| Deployment | Vercel |

## 3. Architecture (must remain visibly 3-tier despite being one repo)

This must be clear in the folder structure and should be explicitly documented in a top-level `ARCHITECTURE.md`:

- **Presentation layer** — Next.js pages/components, Tailwind CSS, minimal client-side JS
- **Application/Logic layer** — Next.js API routes under `/app/api/*`, plus all business logic in `/lib/*`
- **Data layer** — PostgreSQL on Supabase, accessed exclusively through Prisma

Required folder structure:

```
/app
  /api
    /auth
      register/route.ts
      login/route.ts
      logout/route.ts
      verify-email/route.ts
      forgot-password/route.ts
      reset-password/route.ts
    /assessments
      route.ts          (POST: submit new assessment, GET: list user's history)
      [id]/route.ts      (GET: single assessment detail)
  /(routes)
    /login/page.tsx
    /register/page.tsx
    /verify-email/page.tsx
    /forgot-password/page.tsx
    /reset-password/page.tsx
    /dashboard/page.tsx
    /questionnaire/page.tsx
    /results/[id]/page.tsx
    /history/page.tsx
/lib
  prisma.ts            (Prisma client singleton)
  auth.ts               (bcrypt hashing, JWT sign/verify, cookie helpers)
  mailer.ts             (Nodemailer transport + email templates)
  questions.ts          (DASS-21 question bank, static config)
  scoring.ts            (pure functions: raw answers -> subscale scores -> classification)
  feedback.ts           (classification -> feedback matrix: messages, tips, counseling flag)
  validation.ts         (Zod schemas for all forms/API inputs)
/prisma
  schema.prisma
/middleware.ts          (route protection: redirect unauthenticated users away from protected pages)
/__tests__
  scoring.test.ts
  feedback.test.ts
ARCHITECTURE.md
```

## 4. Data Model (Prisma schema — implement exactly this in Phase 0)

```prisma
model User {
  id            String       @id @default(uuid())
  userName      String
  email         String       @unique
  passwordHash  String
  isVerified    Boolean      @default(false)
  verifyToken   String?
  resetToken    String?
  resetTokenExp DateTime?
  createdAt     DateTime     @default(now())
  assessments   Assessment[]
}

model Assessment {
  id                 String   @id @default(uuid())
  userId             String
  user               User     @relation(fields: [userId], references: [id])
  answers            Json     // raw answers: { [questionId]: number (0-3) }
  depressionScore    Int
  anxietyScore       Int
  stressScore        Int
  depressionSeverity String   // "normal" | "mild" | "moderate" | "severe" | "extremely_severe"
  anxietySeverity    String
  stressSeverity     String
  createdAt          DateTime @default(now())
}
```

## 5. Assessment Instrument

Use **DASS-21** (Depression Anxiety Stress Scale, 21 items, 7 per subscale, each answered 0–3). Official DASS-21 scoring rule: sum each subscale's 7 raw item scores, then **multiply by 2** to get the subscale score, then map to severity using the standard published DASS-21 cutoffs (Normal / Mild / Moderate / Severe / Extremely Severe — look up and use the official cutoff table for each subscale, they differ slightly between Depression, Anxiety, and Stress). Store the actual 21 question texts in `lib/questions.ts`, each tagged with its subscale.

## 6. Feedback & Safety Rules

- Feedback matrix in `lib/feedback.ts`: keyed by `[subscale][severity]`, returning `{ message: string, copingTips: string[], recommendCounseling: boolean }`.
- Messages describe **assessment results**, never diagnose the person (e.g. "your responses suggest elevated stress," never "you have anxiety").
- **Safety branch**: if ANY subscale classification is `severe` or `extremely_severe`, the results page must render a visually distinct, prominent block (not mixed into the tips list) containing: FUTA counseling center contact info + a national mental health crisis line. This block renders regardless of the other two subscales' scores.
- Do not send any data about a student's results to anyone other than that student. No admin-facing dashboard of individual results.

## 7. Build Order — Execute Phases Strictly In Order

### Phase 0 — Scaffolding
1. `create-next-app` with TypeScript, App Router, Tailwind, ESLint.
2. Set up the folder structure above (empty files/stubs where logic isn't written yet).
3. Install: `prisma`, `@prisma/client`, `bcryptjs`, `jsonwebtoken`, `nodemailer`, `zod`, `chart.js`, `react-chartjs-2` or rechart depending on which fits this project better, `vitest`.
4. Write `prisma/schema.prisma` exactly as specified in section 4. Run initial migration against a Supabase Postgres connection string (read from `.env` as `DATABASE_URL`).
5. `.env.example` listing all required vars: `DATABASE_URL`, `JWT_SECRET`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`, `APP_URL`.
6. Deploy this empty shell to Vercel and confirm build + DB connection succeed before moving to Phase 1.
7. Write `ARCHITECTURE.md` describing the 3-tier layering per section 3.

### Phase 1 — Custom Auth & Email
1. `lib/auth.ts`: `hashPassword`, `verifyPassword` (bcryptjs), `signJwt`, `verifyJwt` (jsonwebtoken, 2-hour expiry), `setAuthCookie`/`clearAuthCookie` helpers (HttpOnly, Secure in production, SameSite=Lax).
2. `lib/mailer.ts`: Nodemailer transport from env vars; two templates — verification email (link with token) and password reset email (link with token).
3. `POST /api/auth/register`: validate via Zod, check uniqueness (email), hash password, create unverified user, generate verify token, send verification email.
4. `GET /api/auth/verify-email?token=...`: look up user by token, mark `isVerified=true`, clear token.
5. `POST /api/auth/login`: verify credentials, reject if not verified, issue JWT cookie.
6. `POST /api/auth/logout`: clear cookie.
7. `POST /api/auth/forgot-password` + `POST /api/auth/reset-password`: token-based flow, token expiry enforced via `resetTokenExp`.
8. `middleware.ts`: protect `/dashboard`, `/questionnaire`, `/results/*`, `/history` — redirect to `/login` if JWT missing/invalid.
9. Build the corresponding pages with Tailwind forms and clear validation error states.

### Phase 2 — Questionnaire
1. `lib/questions.ts`: all 21 DASS-21 items, each `{ id, text, subscale }`.
2. `/questionnaire/page.tsx`: render items grouped by subscale, 0–3 radio/scale input per item, client-side check that all 21 are answered before submit.
3. `POST /api/assessments`: accept `{ answers: Record<string, number> }`, validate shape via Zod, pass to scoring engine (Phase 3), persist result, return new assessment id.

### Phase 3 — Scoring Engine
1. `lib/scoring.ts`: pure, framework-free functions:
   - `calculateSubscaleScores(answers): { depression: number, anxiety: number, stress: number }`
   - `classifySeverity(subscale: Subscale, score: number): Severity` using official DASS-21 cutoff tables.
2. `__tests__/scoring.test.ts`: Vitest unit tests covering at least one case per severity level per subscale, plus edge cases (all zeros, all max).

### Phase 4 — Feedback Engine
1. `lib/feedback.ts`: full feedback matrix per section 6, all 3 subscales × 5 severities.
2. `__tests__/feedback.test.ts`: verify every classification returns a non-empty message + tips, and that `recommendCounseling` is `true` for exactly `severe` and `extremely_severe`.
3. `/results/[id]/page.tsx`: fetch assessment by id (must belong to logged-in user), display scores, classifications, feedback messages, tips, and the safety block when triggered.

### Phase 5 — History & Trends
1. `GET /api/assessments`: return logged-in user's past assessments, sorted by date.
2. `/history/page.tsx`: table/list of past assessments with date + classification badges, linking to each result page.
3. Chart.js line chart (one line per subscale) plotting score over time across past assessments.

### Phase 6 — Hardening
1. Rate limiting on `/api/auth/login` and `/api/auth/register` (simple in-memory token bucket is acceptable given serverless constraints; document the limitation).
2. Confirm cookie flags (`HttpOnly`, `Secure` in production, `SameSite=Lax`) are correct.
3. Custom 404 and error pages.
4. Mobile responsiveness pass across all pages.
5. Ensure no API route leaks another user's data (every query scoped to the authenticated user's id from the JWT).

### Phase 7 — Deploy & Document
1. Final deploy to Vercel with all env vars set in the Vercel dashboard.
2. Seed script creating one pre-verified demo user with 3–4 historical assessments spanning different severity levels, for live defense use (don't rely on live email sending during the actual demo).
3. `README.md`: setup instructions, env vars needed, how to run migrations, how to run tests.
4. Confirm `ARCHITECTURE.md` and an ER diagram (can be generated from the Prisma schema) are present for the project report.

---

## 8. General Working Rules for the Agent

- After each phase, stop and summarize what was built, what was tested, and what's left, before proceeding to the next phase.
- Keep `lib/scoring.ts` and `lib/feedback.ts` completely free of Next.js/Prisma imports — they must be pure, independently testable TypeScript.
- Never invent additional dependencies (e.g. don't pull in NextAuth, Supabase client, or an AI SDK) without flagging it first — the stack above is fixed.
- Favor explicit, readable code over clever abstractions — this code will be read and defended by a non-expert in a viva.
