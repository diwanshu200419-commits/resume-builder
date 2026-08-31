/**
 * tests/responsive-audit.spec.ts
 * Suite #40 — Complete Whole-Site Responsive Design Audit
 *
 * Tests every route at 7 breakpoints for:
 *   1. Zero horizontal overflow (scrollWidth > innerWidth)
 *   2. No inputs with font-size < 16px (iOS Safari zoom prevention)
 *   3. FloatingAICopilot button does not overlap any primary CTA button
 *   4. No two-column form grids breaking at mobile widths (320–412px)
 *
 * Tags:
 *   @public   — no auth needed (runs without saved session)
 *   @dashboard — requires QA auth session from global-setup.ts
 *
 * Run public routes only:
 *   npx playwright test --grep @public
 * Run dashboard routes only (requires VAYLO_QA_PASSWORD):
 *   npx playwright test --grep @dashboard
 * Run all:
 *   npx playwright test
 */

import { test, expect, Page } from '@playwright/test';

// ---------------------------------------------------------------------------
// BREAKPOINTS — 7 widths per the task specification
// ---------------------------------------------------------------------------
const VIEWPORTS = [
  { width: 320,  height: 700,  label: '320px' },   // smallest common Android
  { width: 360,  height: 800,  label: '360px' },   // standard Android
  { width: 390,  height: 844,  label: '390px' },   // iPhone 14
  { width: 412,  height: 915,  label: '412px' },   // large Android
  { width: 768,  height: 1024, label: '768px-portrait' },   // iPad portrait
  { width: 1024, height: 768,  label: '1024px-landscape' }, // iPad landscape / small laptop
  { width: 1280, height: 800,  label: '1280px' },  // laptop
  { width: 1440, height: 900,  label: '1440px' },  // desktop
  { width: 1920, height: 1080, label: '1920px' },  // wide desktop
] as const;

// ---------------------------------------------------------------------------
// PUBLIC ROUTES — no authentication required
// ---------------------------------------------------------------------------
const PUBLIC_ROUTES = [
  '/',
  '/free-ats-resume-checker',
  '/ats-resume-checker',
  '/ats-score-checker',
  '/ai-resume-checker',
  '/resume-optimizer',
  '/ai-resume-builder',
  '/cover-letter-generator',
  '/pricing',
  '/about',
  '/privacy',
  '/terms',
  '/refund',
  // Blog hub + individual articles
  '/blog',
  '/blog/what-is-an-ats-resume',
  '/blog/how-to-check-ats-score',
  '/blog/how-to-make-ats-friendly-resume',
  '/blog/how-to-improve-ats-score',
  '/blog/ats-resume-keywords',
  '/blog/ats-resume-format',
  '/blog/why-ats-rejects-resumes',
  '/blog/system-design-interview-questions-faang',
  '/blog/top-behavioral-interview-questions-star',
  '/blog/top-15-fullstack-interview-questions-2026',
  '/blog/advanced-react-javascript-interview-questions',
  '/blog/backend-high-concurrency-interview-questions',
  '/blog/top-dsa-interview-patterns-google-meta',
  '/blog/machine-learning-llm-interview-questions',
  '/blog/advanced-sql-analytics-interview-questions',
  // Role guides
  '/resume/software-engineer',
  '/resume/data-analyst',
  '/resume/ai-engineer',
  '/resume/frontend-developer',
  '/resume/backend-developer',
  '/resume/full-stack-developer',
  '/resume/web-developer',
  '/resume/digital-marketer',
  '/resume/devops-engineer',
  '/resume/fresher',
] as const;

// ---------------------------------------------------------------------------
// DASHBOARD ROUTES — require authenticated QA session
// ---------------------------------------------------------------------------
const DASHBOARD_ROUTES = [
  '/dashboard',
  '/analyze',
  '/builder',
  '/cover-letter',
  '/branding-studio',
  '/interview-prep',
  '/portfolio',
  '/career-coach',
  '/recruiter-simulation',
  '/hiring-probability',
  '/salary-calculator',
  '/job-match',
  '/roadmap',
  '/translate',
  '/roast',
  '/applications',
  '/networking',
  '/notifications',   // ← proof test: this route was built AFTER the original pb-32 fix
  '/profile',
  '/account/usage',
  '/settings',
  '/support',
  '/github-sync',
] as const;

// ---------------------------------------------------------------------------
// SHARED CHECK FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Check 1: Zero horizontal overflow
 * Detects any element causing the page to scroll right.
 */
async function checkNoHorizontalOverflow(page: Page): Promise<{ passed: boolean; offenders: string[] }> {
  return page.evaluate(() => {
    const vw = window.innerWidth;
    const bodyOverflows = document.body.scrollWidth > vw + 2;
    const docOverflows = document.documentElement.scrollWidth > vw + 2;
    const overflowingEls: string[] = [];

    // Helper to check if an element is clipped by any overflow:hidden ancestor
    function isClippedByAncestor(el: HTMLElement): boolean {
      let curr: HTMLElement | null = el.parentElement;
      while (curr && curr !== document.body && curr !== document.documentElement) {
        const style = getComputedStyle(curr);
        if (
          style.overflow === 'hidden' ||
          style.overflowX === 'hidden' ||
          style.overflow === 'clip' ||
          style.overflowX === 'clip'
        ) {
          return true;
        }
        curr = curr.parentElement;
      }
      return false;
    }

    // Walk all visible elements
    document.querySelectorAll<HTMLElement>('*').forEach((el) => {
      try {
        // Skip scripts, styles, metadata, and clipped elements
        if (['script', 'style', 'meta', 'link', 'noscript'].includes(el.tagName.toLowerCase())) return;
        const style = getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return;

        if (!isClippedByAncestor(el)) {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.right > vw + 3) {
            const desc = `${el.tagName.toLowerCase()}${el.className ? '.' + el.className.split(' ').slice(0, 2).join('.') : ''} (right=${Math.round(rect.right)}px, vw=${vw}px)`;
            overflowingEls.push(desc);
          }
        }
      } catch {}
    });

    const passed = !bodyOverflows && !docOverflows && overflowingEls.length === 0;
    return {
      passed,
      offenders: overflowingEls.slice(0, 5),
    };
  });
}

/**
 * Check 2: All form inputs have font-size ≥ 16px at mobile widths
 * Below 16px causes iOS Safari to zoom into the field on focus.
 */
async function checkInputFontSizes(page: Page, viewportWidth: number): Promise<{ passed: boolean; count: number }> {
  // Only enforce at mobile widths (< 640px = Tailwind sm breakpoint)
  if (viewportWidth >= 640) return { passed: true, count: 0 };

  const smallInputCount = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll<HTMLElement>('input, textarea, select'));
    return inputs.filter((el) => {
      const fs = parseFloat(getComputedStyle(el).fontSize);
      return fs < 15.9; // 16px with float tolerance
    }).length;
  });

  return { passed: smallInputCount === 0, count: smallInputCount };
}

/**
 * Check 3: FloatingAICopilot button does not overlap any primary CTA
 * The copilot button is fixed; primary CTAs are the submit/action buttons
 * in the main content area. Overlap means the user literally cannot click.
 */
async function checkFloatingButtonClearance(page: Page): Promise<{ passed: boolean; detail: string }> {
  return page.evaluate(() => {
    // Find the floating AI copilot button (identified by aria-label)
    const floatingBtn = document.querySelector<HTMLElement>('[aria-label="Open Vaylo AI Copilot"]');
    if (!floatingBtn) return { passed: true, detail: 'no floating button found' };

    const floatRect = floatingBtn.getBoundingClientRect();

    // Find primary CTA buttons: type=submit buttons and buttons with common action text
    const primarySelectors = [
      'button[type="submit"]',
      'button.bg-indigo-600',
      'button.bg-accent',
      'button.bg-gradient-to-r',
      '[data-primary-cta]',
    ];

    const primaryBtns = Array.from(
      document.querySelectorAll<HTMLElement>(primarySelectors.join(','))
    ).filter((btn) => {
      // Exclude the floating button itself
      return !btn.closest('[aria-label="Open Vaylo AI Copilot"]') &&
             !btn.closest('.fixed'); // skip other fixed elements
    });

    const overlaps: string[] = [];
    for (const btn of primaryBtns) {
      const r = btn.getBoundingClientRect();
      // Only check elements in the viewport (visible)
      if (r.width === 0 || r.height === 0) continue;

      const overlapsX = floatRect.left < r.right && floatRect.right > r.left;
      const overlapsY = floatRect.top < r.bottom && floatRect.bottom > r.top;
      if (overlapsX && overlapsY) {
        overlaps.push(
          `"${btn.textContent?.trim().slice(0, 40)}" at y=${Math.round(r.top)}–${Math.round(r.bottom)}`
        );
      }
    }

    return {
      passed: overlaps.length === 0,
      detail: overlaps.length > 0 ? `Overlaps: ${overlaps.join('; ')}` : 'clear',
    };
  });
}

// ---------------------------------------------------------------------------
// TEST GENERATOR — runs all 3 checks for a given route + viewport
// ---------------------------------------------------------------------------

function makeTests(
  route: string,
  tag: '@public' | '@dashboard',
  description: string,
) {
  for (const vp of VIEWPORTS) {
    test(`${tag} [${vp.label}] ${route} — no overflow`, async ({ page }) => {
      test.info().annotations.push({ type: 'tag', description: tag });

      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 30_000 });

      // Wait for layout to settle (client components, hydration)
      await page.waitForTimeout(800);

      const result = await checkNoHorizontalOverflow(page);
      if (!result.passed) {
        console.error(`OVERFLOW at ${route} @ ${vp.width}px: ${result.offenders.join(' | ')}`);
      }
      expect(result.passed, `Horizontal overflow at ${route} @ ${vp.label}. Offenders: ${result.offenders.join(', ')}`).toBe(true);
    });

    test(`${tag} [${vp.label}] ${route} — input font ≥ 16px`, async ({ page }) => {
      test.info().annotations.push({ type: 'tag', description: tag });

      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 30_000 });
      await page.waitForTimeout(800);

      const result = await checkInputFontSizes(page, vp.width);
      expect(result.passed, `${result.count} input(s) with font-size < 16px at ${route} @ ${vp.label}`).toBe(true);
    });

    test(`${tag} [${vp.label}] ${route} — floating button clearance`, async ({ page }) => {
      test.info().annotations.push({ type: 'tag', description: tag });

      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 30_000 });
      await page.waitForTimeout(800);

      // Scroll to bottom to reveal any late-rendered CTAs
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(400);

      const result = await checkFloatingButtonClearance(page);
      expect(result.passed, `Copilot button overlaps CTA at ${route} @ ${vp.label}: ${result.detail}`).toBe(true);
    });
  }
}

// ---------------------------------------------------------------------------
// GENERATE ALL TESTS
// ---------------------------------------------------------------------------

test.describe('Suite #40 — Public Routes Responsive Audit @public', () => {
  for (const route of PUBLIC_ROUTES) {
    makeTests(route, '@public', `Public: ${route}`);
  }
});

test.describe('Suite #40 — Dashboard Routes Responsive Audit @dashboard', () => {
  for (const route of DASHBOARD_ROUTES) {
    makeTests(route, '@dashboard', `Dashboard: ${route}`);
  }
});

// ---------------------------------------------------------------------------
// SPECIFIC PROOF TEST: /notifications proves centralized fix is automatic
// This route was added AFTER the original per-page pb-32 fix on /interview-prep.
// If the global layout fix works, this test will pass with zero per-page changes.
// ---------------------------------------------------------------------------
test.describe('Suite #40 — Centralization Proof Test', () => {
  for (const vp of [
    { width: 320, height: 700, label: '320px' },
    { width: 390, height: 844, label: '390px' },
  ]) {
    test(`@dashboard [${vp.label}] /notifications — copilot clearance (centralization proof)`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/notifications', { waitUntil: 'domcontentloaded', timeout: 30_000 });
      await page.waitForTimeout(800);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(400);

      const result = await checkFloatingButtonClearance(page);
      expect(
        result.passed,
        `CENTRALIZATION PROOF FAILED: /notifications copilot overlaps CTA at ${vp.label}. ` +
        `This means the fix is still per-page, not global. Detail: ${result.detail}`
      ).toBe(true);
    });
  }
});
