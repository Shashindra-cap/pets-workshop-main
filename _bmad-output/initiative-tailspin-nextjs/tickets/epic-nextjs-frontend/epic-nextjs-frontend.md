---
tracker_id: ""
type: epic
title: "Tailspin Shelter Next.js frontend"
parent: "initiative-tailspin-nextjs"
covers: ["R1", "R2", "R3", "R4"]
sources: []
companions: ["_bmad-output/initiative-tailspin-nextjs/tickets/epic-nextjs-frontend/ux-nextjs-frontend/DESIGN.md", "_bmad-output/initiative-tailspin-nextjs/tickets/epic-nextjs-frontend/ux-nextjs-frontend/EXPERIENCE.md"]
after: []
risk: high
refined: true
---

# Tailspin Shelter Next.js frontend

## Description

Replace the Astro client with a Next.js app that preserves the current Tailspin Shelter pages and behavior, uses the existing Flask API, passes the unchanged Playwright suite, and is started by the existing app scripts.

## Outcome

People running Tailspin Shelter use the current site through Next.js, with all 15 existing Playwright tests passing unchanged.

## Requirements

- R1 (parent R1): A Next.js app using App Router, TypeScript, and Tailwind serves `/`, `/dog/[id]`, and `/about`; `/` supports `?page=` pagination with six dogs per page.
- R2 (parent R2): The app reads all data from the existing Flask API through `API_SERVER_URL`, defaulting to `http://localhost:5100`.
- R3 (parent R3): Visible text, error states, and `data-testid` attributes match today's site, and all 15 existing Playwright tests pass against Next.js with their assertions unchanged.
- R4 (parent R4): `start-app.sh` and `start-app.ps1` start Flask and the Next.js app.

## Constraints

- Do not change the Flask API, its routes or responses, or the database.
- New features, visual redesign, and deployment are out of scope.

## Done when

- The Next.js App Router, TypeScript, and Tailwind app serves `/`, `/?page=`, `/dog/[id]`, and `/about`, with six dogs per page.
- Site data comes from the existing Flask API through `API_SERVER_URL` (default `http://localhost:5100`); the API routes/responses and database are unchanged.
- Current visible text, error states, and `data-testid` attributes are preserved, and all 15 existing Playwright tests pass without assertion changes.
- `start-app.sh` and `start-app.ps1` start Flask and Next.js together.

## Boundaries

- Owns the existing client, its test/runtime configuration, and local startup scripts.
- Consumes the existing Flask API through `API_SERVER_URL`; the API is a touch point, not owned work.
- New features, visual redesign, and deployment are outside this epic; see Constraints for scope exclusions.

## References

- parent — [initiative-tailspin-nextjs.md](../../initiative-tailspin-nextjs.md), Requirements R1–R4
- parent — [initiative-tailspin-nextjs.md](../../initiative-tailspin-nextjs.md), Constraints
- design — [DESIGN.md](ux-nextjs-frontend/DESIGN.md)
- experience — [EXPERIENCE.md](ux-nextjs-frontend/EXPERIENCE.md)

## Notes

- Decision: 2026-11-04 — High business risk because replacing the whole user-facing client can disrupt dog browsing and details even while the API remains stable.
- High-risk check: Run each startup script and confirm both services start. Then manually compare the home page, pagination, dog details, About, and error states with the current site on desktop and mobile.
- Decision: 2026-11-04 — Refine from the initiative requirements and current app/test code; defer rendering, data-fetching, and package-layout choices to stories because they do not change the agreed behavior.
- Decision: 2026-11-04 — Preserve the current Astro site's layout and visual system as the migration reference; the paired UX spines document the design and experience contract.
- Decision: 2026-11-04 — Tracer bullet is story 1: scaffold Next.js and prove the API-backed six-dog paginated homepage with its unchanged Playwright tests.
- Decision: 2026-11-04 — Story 1 owns the shared site shell and navigation; stories 2 and 3 consume it so their page work can proceed independently.
