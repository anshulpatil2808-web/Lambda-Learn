# Contributing to Lambda Learn

Thanks for helping make space science easier to learn! 🚀

## Quick start

```bash
npm install
npm run dev
```

Before opening a pull request, run:

```bash
npm run typecheck && npm test && npm run build
```

## Where things live

| You want to…              | Edit                              |
| ------------------------- | --------------------------------- |
| Fix or add a lesson       | `src/data/tracks.ts` (Launch Pad basics: `src/data/basics.ts`) |
| Add a glossary term       | `src/data/glossary.ts`            |
| Add a simulator           | `src/components/Sims.tsx` (add to the `SIMS` registry) |
| Change colours / fonts    | top of `src/styles.css`           |

## Content rules

- Every lesson needs a **Simple** version (a 10-year-old can follow it) and a **Deep dive** version.
- Check facts against NASA, ESA, the IAU or peer-reviewed sources, and put the source in your PR.
- Keep the tone friendly and encouraging — that's Lambda's personality.
