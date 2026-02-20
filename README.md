# Cognitive Overload Survey

Measure cognitive workload in the workplace using a survey based on [NASA-TLX](https://en.wikipedia.org/wiki/NASA-TLX). Workers fill out an anonymous annual survey. Managers get a dashboard showing results by department.

**Live app:** https://cognitive-overload.vercel.app

## Survey Questions

| Dimension | What it measures |
|---|---|
| Mental Demand | How much thinking and deciding was required |
| Temporal Demand | How rushed or time-pressured people felt |
| Performance | How well people think they did their job |
| Effort | How hard people had to work |
| Frustration | How stressed or annoyed people felt |
| Interruption Frequency | How often people were interrupted during focused work |

Each is rated on a 0–100 slider. Responses are anonymous — only the department is recorded.

## Tech Stack

- **Next.js 15** + TypeScript
- **Prisma** ORM with SQLite (local) / **Turso** (production)
- **Tailwind CSS** for styling
- **Recharts** for dashboard charts
- **Vercel** for hosting

## Getting Started

```bash
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev
```

Open http://localhost:3000.

## Pages

| Route | Description |
|---|---|
| `/` | Survey form for workers |
| `/dashboard` | Manager dashboard with charts and department breakdown |
| `/admin` | Add departments and view response counts |

## Environment Variables

For production (Turso), create a `.env` file:

```
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token
```

Without these, the app uses a local SQLite file (`prisma/dev.db`).

## Deploy

Push to GitHub. Vercel auto-deploys on every push to `main`.

Set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in Vercel's environment variables.
