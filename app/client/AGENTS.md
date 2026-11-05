<!-- bmad:context -->
<!-- Verified 2026-11-04 against 9a7b7080ad9172b2f850ad45c02365600239bb29. Managed by bmad-project-context; edits inside this block are replaced on refresh. Keep anything you want preserved outside the markers. -->

## Tailspin Shelter client

The active client is Next.js 16 with App Router, TypeScript, and Tailwind. Add or change served routes in `src/app/`; the still-present Astro tree under `src/pages/` is not used by the current Next scripts. Use this folder's `README.md` for client setup; the root `README.md` still describes Astro.

## Policy

- For vulnerability disclosure, follow `../../SECURITY.md`; do not post reports in public issues, discussions, or PRs.

## Where things are

- Migration requirements and acceptance criteria: `../../_bmad-output/initiative-tailspin-nextjs/tickets/epic-nextjs-frontend/epic-nextjs-frontend.md`.
- Client browser tests: `e2e-tests/`.

<!-- /bmad:context -->

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
