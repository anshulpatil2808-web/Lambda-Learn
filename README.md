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
- **Community forum** (`/community`): share projects, work through calculations and maths (with LaTeX), and discuss
  telescope imaging. Photo uploads, likes, replies, search, reports and a moderation queue.
- **5 tracks, 42 lessons**, including **Maths & Calculations** (powers of ten, units, angles, logarithms and magnitudes,
  parallax, rearranging formulas) and **telescope imaging** (prime focus, plate scale and sampling, planetary lucky imaging).
- Every lesson has a *Simple* and a *Deep dive* version,
  a key formula, a cosmic fact and a 3-question check.
- **20 simulators and calculators** (`/labs`): plate scale & field of view, parallax, magnitudes, angular size, distance units, rocket thruster, rocket equation & staging, Newton's cannon orbit,
  Hohmann planner, wing lift, Kepler's 3rd law, telescope calculator, exoplanet transit,
  Moon phases, star colour (Wien), black-hole sizer, Hubble's law, night exposure triangle,
  Rule of 500 / NPF, and image stacking.
- **Pre-flight diagnostic quiz** (`/quiz`) that finds your level and recommends a track.
- **Sky Tonight** (`/sky`): live Moon phase, a 30-night calendar, meteor showers rated by moonlight,
  the Bortle scale and an observing checklist.
- **Glossary** of 75+ terms, and **Ask Lambda**, an offline helper on every page.
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

## Turning on the community

The forum needs accounts (above) plus one more SQL file.

1. In Supabase **SQL Editor**, run [`supabase/migrations/0002_community.sql`](supabase/migrations/0002_community.sql).
   It creates profiles, posts, comments, likes and reports, the photo bucket (5 MB images), spam limits
   (5 posts and 30 comments per hour), and row-level security so people can only change their own things.
2. Make yourself a moderator: sign in to the site once, then in **SQL Editor** run
   ```sql
   insert into public.admins (user_id) select id from auth.users where email = 'you@example.com';
   ```
   A "Moderation queue" button then appears on the community page.
3. Redeploy on Vercel so it picks up the environment variables.

Until Supabase is connected, the live site shows "The community is almost ready".
When you run `npm run dev` without keys, the forum runs in **demo mode**: posts stay in your browser and you are a pretend
moderator, so you can try every screen.

The database rules are tested against a real Postgres (PGlite) in `supabase/tests/community.test.ts`.

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
