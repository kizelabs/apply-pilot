# Apply Pilot

AI-powered job application tracker. Track applications through every stage, analyze resumes against job descriptions, and generate tailored cover letters.

## Features

- **Application Tracking** — Manage applications through Saved → Applied → Interviewing → Offer/Rejected stages
- **Resume Analysis** — AI-powered resume-to-job matching with scores, strengths, gaps, and keyword suggestions
- **Cover Letter Generator** — Generate personalized cover letters with tone selection (Professional, Confident, Friendly, Concise, Startup)
- **Dashboard** — Pipeline visualization, stats overview, and recent activity
- **Auth** — Email/password and Google OAuth via Supabase
- **Dark/Light Mode** — Toggle with system preference fallback

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict) |
| UI | React 19, Tailwind CSS 4, Lucide Icons |
| Database | PostgreSQL via Prisma ORM |
| Connection Pool | Prisma Accelerate (HTTP-based) |
| Auth | Supabase Auth |
| AI | OpenAI-compatible API (configurable) |
| Testing | Vitest + Playwright |
| CI | GitHub Actions |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 22+
- A Supabase project (for auth + database)
- A Prisma Accelerate account (for connection pooling)
- An OpenAI-compatible API key

### Setup

1. Clone the repo and install dependencies:

```bash
git clone https://github.com/your-username/apply-pilot.git
cd apply-pilot
npm install
```

2. Copy the environment file and fill in your values:

```bash
cp .env.example .env
```

```env
# Prisma Accelerate connection (runtime queries over HTTP)
DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=YOUR_KEY"

# Direct database connection (migrations only)
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# OpenAI-compatible AI Provider
OPENAI_BASE_URL="https://api.openai.com/v1"
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4o"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

3. Run database migrations:

```bash
npx prisma migrate deploy
```

4. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run end-to-end tests (Playwright) |

## Project Structure

```
app/
├── actions/           Server Actions (auth, CRUD)
├── api/               API routes (AI endpoints)
├── applications/      Application pages (list, detail, new, edit)
├── components/        Feature components
├── dashboard/         Dashboard page
├── login/ & signup/   Auth pages
components/ui/         shadcn/ui primitives
lib/
├── supabase/          Supabase client helpers
├── schemas/           Zod validation schemas
├── prisma.ts          Prisma client (Accelerate)
├── openai.ts          AI client config
├── format-date.ts     Date formatting utility
prisma/                Schema & migrations
design-system/         Persisted design system
tests/                 Unit & e2e tests
```

## Deployment

### Vercel

1. Connect your GitHub repo to Vercel
2. Set all environment variables from `.env.example`
3. Vercel runs `npm ci` which triggers `postinstall` → `prisma generate --no-engine`
4. Build runs automatically

### Supabase Setup

1. Set **Site URL** to your production URL in Authentication → URL Configuration
2. Add `https://your-app.vercel.app/auth/callback` to Redirect URLs
3. Configure Google OAuth provider if using Google sign-in

## License

Private
