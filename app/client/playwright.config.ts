import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.resolve(__dirname, '..', 'server');
const testDbPath = path.join(serverDir, 'e2e_test_dogshelter.db');
const flaskPort = 5100;
const nextDevPort = 4321;
const apiProxyPort = 5101;

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
      command: `npx cross-env API_SERVER_URL=http://localhost:${apiProxyPort} npm run dev`,
      url: `http://localhost:${nextDevPort}`,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
  ],
});
