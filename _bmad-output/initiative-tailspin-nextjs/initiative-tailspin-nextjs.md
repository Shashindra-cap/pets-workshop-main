---
tracker_id: ""
type: initiative
title: "Tailspin Shelter Next.js migration"
parent: ""
covers: []
sources:
  - "_bmad-output/initiative-tailspin-nextjs/intent.md"
companions: []
after: []
risk: high
---

# Tailspin Shelter Next.js migration

## Description

Replace the Tailspin Shelter Astro front end with a behavior-compatible Next.js app while continuing to use the existing Flask API. The migration includes the current pages, Playwright coverage, and local startup scripts.

## Outcome

People running the shelter site use the same pages and behavior through Next.js, with all 15 existing Playwright tests passing unchanged.

## Requirements

- R1 (intent — True at completion): A Next.js app using App Router, TypeScript, and Tailwind serves `/`, `/dog/[id]`, and `/about`; `/` supports `?page=` pagination with six dogs per page.
- R2 (intent — True at completion): The app reads all data from the existing Flask API through `API_SERVER_URL`, defaulting to `http://localhost:5100`.
- R3 (intent — True at completion): Visible text, error states, and `data-testid` attributes match today's site, and all 15 existing Playwright tests pass against Next.js with their assertions unchanged.
- R4 (intent — True at completion): `start-app.sh` and `start-app.ps1` start Flask and the Next.js app.

## Constraints

- Do not change the Flask API, its routes or responses, or the database. (intent — Must not change)
- New features, visual redesign, and deployment are out of scope. (intent — Out of scope)

## Done when

- The Next.js app serves `/`, `/dog/[id]`, and `/about`, and home pagination shows six dogs per page.
- All site data is read through `API_SERVER_URL`, defaulting to `http://localhost:5100`.
- The existing 15 Playwright tests pass against Next.js without assertion changes, including their visible-text, error-state, and test-ID checks.
- Both startup scripts launch the Flask API and Next.js client.
- The Flask API routes and responses and the database are unchanged.

## Boundaries

- This initiative covers the existing front-end migration, its test/runtime configuration, and local startup.
- New features, redesign, and deployment are out of scope.
- The database is out of scope; the front end only uses it indirectly through the unchanged Flask API.
- Touch point: existing Flask API — consumed through `API_SERVER_URL` without changing it; owner: epic-nextjs-frontend.

## References

- intent — [intent.md](./intent.md), True at completion, Must not change, and Out of scope

## Notes

- Decision: 2026-11-04 — Keep the migration in one epic because the front end, its compatibility tests, and local startup scripts are one integrated app boundary; the Flask API and database remain unchanged.
- Decision: 2026-11-04 — Deployment is excluded as requested; Done when verifies the locally runnable, integrated Next.js app rather than a deployment.
- Decision: 2026-11-04 — The opening epic includes the platform baseline; its first story will scaffold the Next.js App Router, TypeScript, and Tailwind app before migrating pages.
