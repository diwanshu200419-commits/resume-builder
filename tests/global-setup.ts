/**
 * tests/global-setup.ts
 *
 * Runs ONCE before all Playwright tests. Ensures the QA test account
 * exists and is confirmed, logs in via the UI to establish full browser
 * session cookies & localStorage, and saves storage state to
 * playwright/.auth/session.json.
 */

import { chromium, FullConfig } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const AUTH_STATE_PATH = path.join(process.cwd(), 'playwright/.auth/session.json');
const QA_EMAIL = 'qa-test@vayloai.online';
const DEFAULT_TEST_PASSWORD = 'QaTestVaylo2026!';
const QA_PASSWORD = process.env.VAYLO_QA_PASSWORD || DEFAULT_TEST_PASSWORD;

function getEnvVar(name: string): string {
  if (process.env[name]) return process.env[name]!;
  try {
    const envLocal = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf-8');
    const match = envLocal.match(new RegExp(`^${name}=(.*)$`, 'm'));
    if (match) return match[1].trim().replace(/^["']|["']$/g, '');
  } catch {}
  return '';
}

export default async function globalSetup(_config: FullConfig): Promise<void> {
  fs.mkdirSync(path.dirname(AUTH_STATE_PATH), { recursive: true });

  const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
  const serviceKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY');

  // Step 1: Provision QA test user via Supabase Admin API if service key is available
  if (supabaseUrl && serviceKey) {
    try {
      console.log('\n🔧 Provisioning / verifying QA test user in Supabase...');
      const adminClient = createClient(supabaseUrl, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      // Check if user exists
      const { data: usersData, error: listError } = await adminClient.auth.admin.listUsers();
      if (!listError) {
        const existingUser = usersData.users.find(
          (u) => u.email?.toLowerCase() === QA_EMAIL.toLowerCase()
        );

        let userId = existingUser?.id;

        if (!existingUser) {
          console.log(`Creating test user ${QA_EMAIL}...`);
          const { data: created, error: createError } = await adminClient.auth.admin.createUser({
            email: QA_EMAIL,
            password: QA_PASSWORD,
            email_confirm: true,
            user_metadata: { full_name: 'QA Test User' },
          });
          if (createError) {
            console.warn('Could not create QA user via admin API:', createError.message);
          } else if (created.user) {
            userId = created.user.id;
          }
        } else {
          // Ensure password is up to date and email is confirmed
          await adminClient.auth.admin.updateUserById(existingUser.id, {
            password: QA_PASSWORD,
            email_confirm: true,
          });
        }

        // Ensure a profile row exists with premium plan so all dashboard tools are unlocked
        if (userId) {
          await adminClient.from('profiles').upsert({
            id: userId,
            email: QA_EMAIL,
            full_name: 'QA Test User',
            plan: 'premium',
            role: 'user',
            total_ats_checks: 10,
            updated_at: new Date().toISOString(),
          });
        }
      }
    } catch (err: any) {
      console.warn('Supabase QA user provisioning note:', err?.message || err);
    }
  }

  // Step 2: Log in via browser to capture full cookies & storage state
  const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 390, height: 844 },
    extraHTTPHeaders: {
      'x-vaylo-test-runner': 'playwright',
    },
  });
  const page = await context.newPage();

  console.log(`🔐 Playwright global-setup: logging in as ${QA_EMAIL} against ${baseURL}...`);

  try {
    await page.goto(`${baseURL}/login`, { waitUntil: 'domcontentloaded', timeout: 30_000 });

    await page.fill('input[type="email"], input[name="email"]', QA_EMAIL);
    await page.fill('input[type="password"], input[name="password"]', QA_PASSWORD);

    const signInBtn = page.locator('button[type="submit"]').first();
    await signInBtn.click();

    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard**', { timeout: 20_000 });

    // Save authenticated session state
    await context.storageState({ path: AUTH_STATE_PATH });
    console.log(`✅ Auth session saved to ${AUTH_STATE_PATH}\n`);
  } catch (err: any) {
    console.error('❌ Login in global-setup encountered:', err?.message || err);
    // Write state file so tests do not crash on missing file
    if (!fs.existsSync(AUTH_STATE_PATH)) {
      fs.writeFileSync(AUTH_STATE_PATH, JSON.stringify({ cookies: [], origins: [] }));
    }
  } finally {
    await browser.close();
  }
}
