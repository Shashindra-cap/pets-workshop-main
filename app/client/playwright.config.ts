import { defineConfig, devices } from '@playwright/test';

const flaskPort = Number(process.env.FLASK_PORT || 5100);
const nextDevPort = Number(process.env.NEXT_DEV_PORT || 4321);
const apiProxyPort = Number(process.env.API_PROXY_PORT || 5101);
const nextDistDir = `.next-e2e-${nextDevPort}`;

export default defineConfig({
  testDir: './e2e-tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: `http://localhost:${nextDevPort}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: `node start-test-server.js`,
      url: `http://localhost:${flaskPort}/api/dogs`,
      reuseExistingServer: false,
      timeout: 30_000,
    },
    {
      command: `node start-mock-api.js`,
      url: `http://localhost:${apiProxyPort}/health`,
      reuseExistingServer: false,
      timeout: 30_000,
    },
    {
      command: `npx cross-env API_SERVER_URL=http://localhost:${apiProxyPort} NEXT_DIST_DIR=${nextDistDir} next dev --hostname 0.0.0.0 --port ${nextDevPort}`,
      url: `http://localhost:${nextDevPort}`,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
  ],
});
