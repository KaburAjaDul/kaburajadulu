import { expect, test, type Page, type TestInfo } from '@playwright/test';

const PROGRAM_SOURCES = [
  'https://x.com/KADSocialHub/status/2083791105590784033',
  'https://x.com/KADSocialHub/status/2083159775362302137',
  'https://x.com/KADSocialHub/status/2082436751105388905',
  'https://x.com/KADSocialHub/status/2080532059408490846',
  'https://x.com/KADSocialHub/status/2080283341807604175',
];

const ROOT_SURFACES = [
  '/',
  '/community/',
  '/programs/',
  '/events/',
  '/volunteer/',
  '/stories/',
  '/about/history/',
  '/community/impact/',
  '/support/',
  '/community/credits/',
] as const;

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    body: document.body.scrollWidth,
    document: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  expect(dimensions.body, 'body must not overflow horizontally').toBeLessThanOrEqual(dimensions.viewport);
  expect(dimensions.document, 'document must not overflow horizontally').toBeLessThanOrEqual(dimensions.viewport);
}

async function capture(page: Page, testInfo: TestInfo, name: string) {
  await page.screenshot({ path: testInfo.outputPath('screenshots', name), fullPage: true });
}

test.describe('KAD clean redesign route contract', () => {
  for (const route of ROOT_SURFACES) {
    test(`${route} is a represented root surface`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('main h1, main h2').first()).toBeVisible();
      expect(new URL(page.url()).pathname).toBe(route);
      await expect(page.locator('html')).toHaveAttribute('lang', 'id');
      await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    });
  }
});

test('program catalogue renders five source-backed cards with explicit status', async ({ page }) => {
  await page.goto('/programs/', { waitUntil: 'domcontentloaded' });

  const cards = page.locator('.kad-program-card');
  await expect(cards).toHaveCount(5);
  const categoryAnchorIds = await cards.evaluateAll((elements) =>
    elements.map((element) => element.id).filter(Boolean),
  );
  expect(new Set(categoryAnchorIds).size).toBe(categoryAnchorIds.length);
  expect(categoryAnchorIds.sort()).toEqual(['career', 'language']);
  await expect(cards.locator('.kad-status')).toHaveCount(5);
  expect(await cards.locator('.kad-status').allTextContents()).toEqual(
    new Array(5).fill('Konfirmasi di Discord'),
  );

  const links = cards.locator(`a[href^="https://x.com/KADSocialHub/status/"]`);
  await expect(links).toHaveCount(5);
  expect(await links.evaluateAll((anchors) => anchors.map((anchor) => (anchor as HTMLAnchorElement).href))).toEqual(
    expect.arrayContaining(PROGRAM_SOURCES),
  );
  expect(await links.evaluateAll((anchors) => anchors.every((anchor) => anchor.getAttribute('target') === '_blank'))).toBe(true);
  expect(await links.evaluateAll((anchors) => anchors.every((anchor) => anchor.getAttribute('rel') === 'noopener noreferrer'))).toBe(true);
});

test('events begin with an honest zero-count empty state', async ({ page }) => {
  await page.goto('/events/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-event-count="0"]')).toBeVisible();
  await expect(page.locator('[data-event-state="empty"]')).toBeVisible();
  await expect(page.locator('[data-event-count="0"] .kad-status')).toContainText('0');
  await expect(page.locator('.kad-event-card, [data-event-state="published"]')).toHaveCount(0);
});

test('readiness states stay explicit for history, support, credits, and unpublished events', async ({ page }) => {
  const states = [
    ['/about/history/', 'Evidence review'],
    ['/support/', 'Proposed'],
    ['/community/credits/', 'Anonymous by default'],
    ['/events/not-published/', 'Not published'],
  ] as const;

  for (const [route, marker] of states) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page.getByText(marker, { exact: true }).first()).toBeVisible();
  }
});

test('Arabic routes preserve locale links and RTL composition', async ({ page }) => {
  await page.goto('/ar/programs/', { waitUntil: 'networkidle' });
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('.kad-nav-links a')).toHaveCount(4);

  const internalLinks = await page.locator('a[href]').evaluateAll((anchors) =>
    anchors
      .map((anchor) => (anchor as HTMLAnchorElement).getAttribute('href'))
      .filter(
        (href): href is string =>
          typeof href === 'string' &&
          href.startsWith('/') &&
          !href.startsWith('//') &&
          !href.startsWith('/_'),
      ),
  );
  expect(internalLinks.filter((href) => !href.startsWith('#'))).toEqual(
    expect.arrayContaining(['/ar/programs', '/ar/events']),
  );
  expect(internalLinks.filter((href) => !href.startsWith('#')).every((href) => href === '/ar/' || href.startsWith('/ar/'))).toBe(true);

  await page.goto('/ar/community/', { waitUntil: 'domcontentloaded' });
  const firstChecklistItem = page.locator('.kad-check-list li').first();
  await expect(firstChecklistItem).toBeVisible();
  expect(await firstChecklistItem.evaluate((element) => ({
    paddingInlineStart: getComputedStyle(element).paddingInlineStart,
    marker: getComputedStyle(element, '::before').content,
  }))).toEqual({ paddingInlineStart: '24px', marker: '"←"' });
});

test('canonical and hreflang metadata match trailing-slash static routes', async ({ page }) => {
  await page.goto('/en/community/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://kaburajadulu.com/en/community/',
  );
  await expect(page.locator('link[rel="alternate"][hreflang="ar"]')).toHaveAttribute(
    'href',
    'https://kaburajadulu.com/ar/community/',
  );
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
    'href',
    'https://kaburajadulu.com/en/community/',
  );
});

test('mobile menu opens, Escape closes it, and focus returns to its trigger', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/programs/', { waitUntil: 'networkidle' });
  const trigger = page.locator('.kad-menu-button');
  const panel = page.locator('#primary-navigation');

  await expect(trigger).toBeVisible();
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(panel).toHaveAttribute('data-open', 'true');
  await page.keyboard.press('Escape');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(panel).toHaveAttribute('data-open', 'false');
  await expect(trigger).toBeFocused();
});

test.describe('responsive and motion safeguards', () => {
  test('desktop and mobile home surfaces have no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expectNoHorizontalOverflow(page);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expectNoHorizontalOverflow(page);
  });

  test('the 200% zoom-equivalent viewport remains readable without two-dimensional scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 720 });
    await page.goto('/support/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main h1')).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test('reduced motion collapses transitions and decorative transforms', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/volunteer/', { waitUntil: 'domcontentloaded' });
    const motion = await page.locator('body').evaluate(() => {
      const sample = document.querySelector('.kad-card');
      if (!sample) return null;
      const style = getComputedStyle(sample);
      return { transitionDuration: style.transitionDuration, animationDuration: style.animationDuration };
    });
    expect(motion).not.toBeNull();
    const durationInMilliseconds = (value: string) => value === '0s' ? 0 : Number.parseFloat(value) * 1000;
    expect(durationInMilliseconds(motion?.transitionDuration ?? '1s')).toBeLessThanOrEqual(1);
    expect(durationInMilliseconds(motion?.animationDuration ?? '1s')).toBeLessThanOrEqual(1);
  });
});

test.describe('screenshot artifacts', () => {
  for (const [route, name] of [
    ['/', 'home'],
    ['/programs/', 'programs'],
    ['/support/', 'support'],
  ] as const) {
    test(`${name} desktop and mobile screenshots are emitted`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await capture(page, testInfo, `${name}-desktop.png`);

      await page.setViewportSize({ width: 390, height: 844 });
      await page.reload({ waitUntil: 'domcontentloaded' });
      await capture(page, testInfo, `${name}-mobile.png`);
    });
  }
});
