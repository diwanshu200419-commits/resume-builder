import { defineConfig, devices } from '@playwright/test';
import path from 'path';

// Auth state storage path — saved once by global-setup, reused by all dashboard tests
export const AUTH_STATE_PATH = path.join(process.cwd(), 'playwright/.auth/session.json');

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  timeout: 45_000,
  retries: 1,
  workers: 6,
  reporter: [
    ['list'],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['html', { outputFile: 'playwright-report/index.html', open: 'never' }],
  ],

  globalSetup: './tests/global-setup.ts',

  use: {
    baseURL: 'https://www.vayloai.online',
    // Act like a real mobile browser for accurate CSS rendering
    // Individual tests override viewport per-breakpoint
    viewport: { width: 390, height: 844 },
    ignoreHTTPSErrors: false,
    // Wait for network to be idle before evaluating layout
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    // Do NOT use JavaScript-disabled mode — we want full client-side rendering
    javaScriptEnabled: true,
  },

  projects: [
    // Public routes — no auth needed
    {
      name: 'public-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/responsive-audit.spec.ts',
      grep: /@public/,
    },
    // Dashboard routes — authenticated session
    {
      name: 'dashboard-chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: AUTH_STATE_PATH,
      },
      testMatch: '**/responsive-audit.spec.ts',
      grep: /@dashboard/,
    },
  ],
});
