/**
 * tests/global-setup.ts
 *
 * Runs ONCE before all Playwright tests. Logs in with the QA test account,
 * saves the authenticated browser storage state (cookies + localStorage) to
 * playwright/.auth/session.json so that every dashboard-route test can reuse
 * the live session without re-logging in on every test.
 *
 * QA account: qa-test@vayloai.online
 * This is a dedicated testing account — NEVER use a real user's credentials here.
 *
 * SETUP REQUIRED (one-time):
 *   1. Create the account qa-test@vayloai.online in Supabase (or via signup UI)
 *   2. Set env var VAYLO_QA_PASSWORD=<password> before running Playwright
 *      e.g.: $env:VAYLO_QA_PASSWORD="yourpassword"; npx playwright test
 *   3. The session.json is gitignored — it contains auth tokens.
 */

import { chromium, FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const AUTH_STATE_PATH = path.join(process.cwd(), 'playwright/.auth/session.json');
const QA_EMAIL = 'qa-test@vayloai.online';
const QA_PASSWORD = process.env.VAYLO_QA_PASSWORD ?? '';

export default async function globalSetup(_config: FullConfig): Promise<void> {
  // Ensure the auth directory exists
  fs.mkdirSync(path.dirname(AUTH_STATE_PATH), { recursive: true });

  // If no password is provided, skip auth setup — dashboard tests will be skipped
  if (!QA_PASSWORD) {
    console.warn(
      '\n⚠️  VAYLO_QA_PASSWORD env var not set. Dashboard-route tests will be skipped.\n' +
      '   To enable: set VAYLO_QA_PASSWORD=<qa account password> and re-run.\n'
    );
    // Write an empty/invalid state so dashboard tests fail gracefully (not with a missing file crash)
    fs.writeFileSync(AUTH_STATE_PATH, JSON.stringify({ cookies: [], origins: [] }));
    return;
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    baseURL: 'https://www.vayloai.online',
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();

  console.log('\n🔐 Playwright global-setup: logging in as QA account...');

  try {
    // Navigate to login
    await page.goto('https://www.vayloai.online/login', { waitUntil: 'domcontentloaded' });

    // Fill credentials
    await page.fill('input[type="email"], input[name="email"]', QA_EMAIL);
    await page.fill('input[type="password"], input[name="password"]', QA_PASSWORD);

    // Click sign-in button
    const signInBtn = page.locator('button[type="submit"]').first();
    await signInBtn.click();

    // Wait for redirect to dashboard (successful login indicator)
    await page.waitForURL('**/dashboard**', { timeout: 20_000 });

    // Save the authenticated session
    await context.storageState({ path: AUTH_STATE_PATH });
    console.log(`✅ Auth session saved to ${AUTH_STATE_PATH}\n`);
  } catch (err) {
    console.error('❌ Login failed in global-setup. Dashboard tests will use unauthenticated state.');
    console.error(err);
    // Save empty state so tests fail gracefully
    fs.writeFileSync(AUTH_STATE_PATH, JSON.stringify({ cookies: [], origins: [] }));
  } finally {
    await browser.close();
  }
}
