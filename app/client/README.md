# Tailspin Shelter client

The client uses Next.js App Router, TypeScript, and Tailwind CSS. Its homepage fetches listing data from the Flask API at `http://localhost:5100` by default; set `API_SERVER_URL` to use another API base URL.

Run these commands from `app/client`:

```sh
npm ci
npm run dev       # http://localhost:4321
npm run build
npm run start     # serve the production build on port 4321
```

End-to-end tests start a seeded Flask API and a test-only API proxy:

```sh
npm run test:e2e -- e2e-tests/homepage.spec.ts e2e-tests/homepage-states.spec.ts --project=chromium
```
