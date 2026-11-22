# Λ Lambda Learn

[![CI](https://github.com/anshulpatil2808-web/Lambda-Learn/actions/workflows/ci.yml/badge.svg)](https://github.com/anshulpatil2808-web/Lambda-Learn/actions/workflows/ci.yml)
![License: MIT](https://img.shields.io/badge/license-MIT-yellow)

**Space science anyone can actually understand.** A free, self-paced learning platform for
astrophysics, astronomy, aerospace and astrophotography, from 5th grade to PhD, guided by
**Lambda**, the space-cab mascot.

## Features

- **Starts at the basics.** A guided **Start Here** path (`/start`) begins with 12 **Launch Pad** lessons written for
  5th graders, with a picture, "Words to know", a try-at-home activity, read-aloud and an easy quiz in each.
  From there learners move up to Orbit (middle and high school) and Deep Space (university).
- **3 space games** (`/play`): Planet Parade, Moon Month, and Space True or False.
- **4 tracks, 33 lessons.** Every lesson has a *Simple* and a *Deep dive* version,
  a key formula, a cosmic fact and a 3-question check.
- **15 simulators** (`/labs`): rocket thruster, rocket equation & staging, Newton's cannon orbit,
  Hohmann planner, wing lift, Kepler's 3rd law, telescope calculator, exoplanet transit,
  Moon phases, star colour (Wien), black-hole sizer, Hubble's law, night exposure triangle,
  Rule of 500 / NPF, and image stacking.
- **Pre-flight diagnostic quiz** (`/quiz`) that finds your level and recommends a track.
- **Sky Tonight** (`/sky`): live Moon phase, a 30-night calendar, meteor showers rated by moonlight,
  the Bortle scale and an observing checklist.
- **Glossary** of 60+ terms, and **Ask Lambda**, an offline helper on every page.
- **XP, 6 ranks, 12 badges and streaks**, with progress export.
- **Accounts (optional):** email one-time-code and Google sign-in through Supabase, with progress synced across devices.
  Without Supabase keys the app runs in local-only mode.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script              | What it does                     |
| ------------------- | -------------------------------- |
| `npm run dev`       | Start the dev server             |
| `npm test`          | Run unit tests (Vitest)          |
| `npm run typecheck` | Type-check with TypeScript       |
| `npm run build`     | Production build into `dist/`    |
| `npm run preview`   | Serve the production build       |

## Turning on accounts (Supabase)

1. Create a free project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run [`supabase/migrations/0001_progress.sql`](supabase/migrations/0001_progress.sql).
   It creates the `progress` table with row-level security, so each learner can only read their own row.
3. Copy `.env.example` to `.env.local`, then fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   from **Project Settings → API**.
4. **Authentication → Email templates → Magic Link:** include `{{ .Token }}` in the template so emails
   contain a 6-digit code (the default template sends only a link).
5. **Authentication → URL Configuration:** add your site URL (and `http://localhost:5173`) to the redirect URLs.
6. *(Optional)* **Authentication → Providers → Google:** enable it with a Google OAuth client ID and secret.

Visitors who don't sign in still get full access. Their progress stays in their own browser, and it is merged into
their account the first time they sign in.

## Deploying

The app builds to a static site, so you can deploy `dist/` to any static host. SPA rewrites are included for
Netlify (`public/_redirects`) and Vercel (`vercel.json`). Set the two `VITE_SUPABASE_*` variables in
your host's environment settings.

## Project structure

```
src/
  components/   Layout, Mascot (Lambda), Starfield, Sims (all simulators)
  data/         tracks.ts (lessons), glossary.ts
  lib/          store.ts (XP, badges, progress), cloud.ts (Supabase), astro.ts
  pages/        Home, Learn, Quiz, Explore (Labs, Sky, Glossary), Account
supabase/       Database migration
```

## Contributing

Found a science error or have an idea for a lesson? [Open an issue](https://github.com/anshulpatil2808-web/Lambda-Learn/issues/new/choose)
or read [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE) © ProInnoTech
