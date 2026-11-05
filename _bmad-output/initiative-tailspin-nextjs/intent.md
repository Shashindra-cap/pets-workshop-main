# User intent: Tailspin Shelter Next.js migration

## Epic

Migrate the Tailspin Shelter front end from Astro to Next.js.

## True at completion

- A Next.js app using App Router, TypeScript, and Tailwind serves `/` with `?page=` pagination at six dogs per page, `/dog/[id]`, and `/about`.
- The app reads all data from the existing Flask API through `API_SERVER_URL`, defaulting to `http://localhost:5100`.
- Visible text, error states, and `data-testid` attributes match today's site.
- All 15 existing Playwright tests pass against the Next.js app with their assertions unchanged.
- `start-app.sh` and `start-app.ps1` start Flask and the Next.js app.

## Must not change

- The Flask API, its routes and responses, or the database.

## Out of scope

- New features, visual redesign, and deployment.
