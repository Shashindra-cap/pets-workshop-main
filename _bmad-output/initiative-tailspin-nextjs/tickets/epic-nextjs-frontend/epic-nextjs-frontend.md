---
tracker_id: ""
type: epic
title: "Tailspin Shelter Next.js frontend"
parent: "initiative-tailspin-nextjs"
covers: ["R1", "R2", "R3", "R4"]
sources: []
companions: []
after: []
risk: high
refined: false
---

# Tailspin Shelter Next.js frontend

## Description

Replace the Astro client with a Next.js app that preserves the current Tailspin Shelter pages and behavior, uses the existing Flask API, passes the unchanged Playwright suite, and is started by the existing app scripts.

## Outcome

People running Tailspin Shelter use the current site through Next.js, with all 15 existing Playwright tests passing unchanged.

## Done when

- The Next.js App Router, TypeScript, and Tailwind app serves `/`, `/?page=`, `/dog/[id]`, and `/about`, with six dogs per page.
- Site data comes from the existing Flask API through `API_SERVER_URL` (default `http://localhost:5100`); the API routes/responses and database are unchanged.
- Current visible text, error states, and `data-testid` attributes are preserved, and all 15 existing Playwright tests pass without assertion changes.
- `start-app.sh` and `start-app.ps1` start Flask and Next.js together.

## Boundaries

- Owns the existing client, its test/runtime configuration, and local startup scripts.
- Must not change the Flask API, its routes or responses, or the database.
- New features, visual redesign, and deployment are out of scope.

## References

- parent — [initiative-tailspin-nextjs.md](../../initiative-tailspin-nextjs.md), Requirements R1–R4
