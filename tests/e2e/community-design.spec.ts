import { expect, test, type Page, type TestInfo } from '@playwright/test';

const PROGRAM_SOURCES = [
  'https://x.com/KADSocialHub/status/2083791105590784033',
  'https://x.com/KADSocialHub/status/2083159775362302137',
  'https://x.com/KADSocialHub/status/2082436751105388905',
  'https://x.com/KADSocialHub/status/2080532059408490846',
  'https://x.com/KADSocialHub/status/2080283341807604175',
];

const PROGRAM_POSTER_PATHS = [
  '/images/programs/french-club-trial-2026-08-02.webp',
  '/images/programs/mandarin-transport-2026-08-01.webp',
  '/images/programs/apple-developer-academy-2027-info-session.webp',
  '/images/programs/english-study-club-weekly-2026-07.webp',
  '/images/programs/mandarin-study-club-weekly-2026-07.webp',
] as const;

const PROGRAM_CATALOGUE_COVER_PATHS = [
  PROGRAM_POSTER_PATHS[0],
  PROGRAM_POSTER_PATHS[1],
  PROGRAM_POSTER_PATHS[2],
  PROGRAM_POSTER_PATHS[3],
] as const;

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

const DESIGN_PREVIEWS = [
  ['field-notes', 'Field Notes'],
  ['community-bulletin', 'Community Bulletin'],
  ['community-atlas', 'Community Atlas'],
] as const;

const TASK_HEADERS = [
  ['/programs/', 'catalogue', 'Program publik', '5'],
  ['/events/', 'operational', 'Agenda tampil', '0'],
  ['/volunteer/', 'operational', 'Satu siklus', '3 bulan'],
  ['/stories/', 'evidence', 'Cerita tampil', '0'],
  ['/about/history/', 'evidence', 'Status', 'Tinjauan bukti'],
  ['/community/impact/', 'evidence', 'Metrik tampil', '0'],
  ['/support/', 'proposal', 'Pembayaran aktif', '0'],
  ['/community/credits/', 'evidence', 'Kontribusi tampil', '0'],
  ['/programs/french-club-trial/', 'record', 'Poster publik', '1'],
  ['/events/not-published/', 'record', 'Status', 'Belum dipublikasikan'],
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
  await page.locator('main img').evaluateAll(async (images) => {
    for (const image of images) {
      const element = image as HTMLImageElement;
      element.scrollIntoView({ block: 'center' });
      if (!element.complete) {
        await new Promise<void>((resolve) => {
          element.addEventListener('load', () => resolve(), { once: true });
          element.addEventListener('error', () => resolve(), { once: true });
        });
      }
      await element.decode().catch(() => undefined);
    }

    window.scrollTo({ top: 0 });
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  });
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

test.describe('route-specific first viewport', () => {
  test('Community keeps the sole orientation hero', async ({ page }) => {
    await page.goto('/community/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-page-header="orientation"]')).toHaveCount(1);
    await expect(page.locator('[data-page-header="task"]')).toHaveCount(0);
  });

  for (const [route, variant, label, value] of TASK_HEADERS) {
    test(`${route} exposes ${label} in a compact ${variant} header`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto(route, { waitUntil: 'domcontentloaded' });

      const header = page.locator(`[data-page-header="task"][data-header-variant="${variant}"]`);
      await expect(header).toHaveCount(1);
      await expect(page.locator('[data-page-header="orientation"]')).toHaveCount(0);
      await expect(header.locator('.kad-task-header__stats > div')).toHaveCount(3);

      const stat = header.locator('.kad-task-header__stats > div').filter({ hasText: label });
      await expect(stat).toContainText(value);
      const statBox = await header.locator('.kad-task-header__stats').boundingBox();
      expect(statBox, 'status summary must be laid out in the first viewport').not.toBeNull();
      expect((statBox?.y ?? 721) + (statBox?.height ?? 0)).toBeLessThanOrEqual(720);
      await expectNoHorizontalOverflow(page);
    });
  }

  test('Programs exposes real category controls in the compact header', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/programs/', { waitUntil: 'domcontentloaded' });
    const filters = page.locator('.kad-task-header .kad-filter-row');
    await expect(filters.getByRole('link')).toHaveCount(3);
    const box = await filters.boundingBox();
    expect((box?.y ?? 721) + (box?.height ?? 0)).toBeLessThanOrEqual(720);
  });
});

test.describe('staging landing direction review', () => {
  for (const [direction, label] of DESIGN_PREVIEWS) {
    test(`${label} keeps the full site context and stays out of search`, async ({ page }) => {
      await page.goto(`/design-preview/${direction}/`, { waitUntil: 'networkidle' });
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
      await expect(page.locator(`[data-design-direction="${direction}"]`)).toBeVisible();
      await expect(page.locator('.kad-direction-tabs a[aria-current="page"]')).toContainText(label);
      await expect(page.locator('.kad-nav-links a[href="/programs"]')).toBeVisible();
      await expect(page.getByRole('link', { name: 'Cek placeholder halaman lain' })).toHaveAttribute('href', '/programs');
      await expectNoHorizontalOverflow(page);
    });
  }

  test('Field Notes is the normal-home candidate and renders all five approved posters', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page.locator('[data-design-direction="field-notes"]')).toBeVisible();
    await expect(page.locator('[data-interface-slice="community-home"] img[src^="/images/programs/"]')).toHaveCount(5);
    await expect(page.locator('.kad-direction-tabs')).toHaveCount(0);
  });

  test('mobile staging directions reflow without horizontal page overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const [direction] of DESIGN_PREVIEWS) {
      await page.goto(`/design-preview/${direction}/`, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('.kad-menu-button')).toBeVisible();
      await expectNoHorizontalOverflow(page);
    }
  });
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

test('program posters use meaningful local media with loading metadata and dimensions', async ({ page }) => {
  await page.goto('/programs/', { waitUntil: 'networkidle' });

  const cards = page.locator('.kad-program-card');
  const posterImages = cards.locator('img');
  await expect(posterImages).toHaveCount(4);

  const posterMetadata = await posterImages.evaluateAll((images) => images.map((image) => {
    const element = image as HTMLImageElement;
    const url = new URL(element.currentSrc || element.src, window.location.href);
    return {
      path: url.pathname,
      origin: url.origin,
      alt: element.alt.trim(),
      loading: element.getAttribute('loading'),
      width: Number(element.getAttribute('width')),
      height: Number(element.getAttribute('height')),
      complete: element.complete,
      naturalWidth: element.naturalWidth,
      naturalHeight: element.naturalHeight,
    };
  }));

  expect(posterMetadata.map(({ path }) => path).sort()).toEqual(PROGRAM_CATALOGUE_COVER_PATHS.slice().sort());
  expect(posterMetadata.every(({ origin }) => origin === new URL(page.url()).origin)).toBe(true);
  expect(posterMetadata.every(({ path }) => path.startsWith('/images/programs/'))).toBe(true);
  expect(posterMetadata.every(({ alt }) => alt.length >= 20 && !/^image|^poster$/i.test(alt))).toBe(true);
  expect(posterMetadata.every(({ loading }) => loading === 'lazy' || loading === 'eager')).toBe(true);
  expect(posterMetadata.every(({ width, height }) => width > 0 && height > 0)).toBe(true);
  expect(posterMetadata.every(({ complete, naturalWidth, naturalHeight }) => complete && naturalWidth > 0 && naturalHeight > 0)).toBe(true);

  const weeklyEnglish = posterMetadata.find(({ path }) => path === PROGRAM_POSTER_PATHS[3]);
  expect(weeklyEnglish?.alt).toContain('English Study Club');
});

test('GKS remains a text-only fallback and English + Mandarin detail has two posters', async ({ page }) => {
  await page.goto('/programs/', { waitUntil: 'domcontentloaded' });
  const gksCard = page.locator('.kad-program-card').filter({ hasText: 'GKS preparation' });
  await expect(gksCard).toHaveCount(1);
  await expect(gksCard.locator('img')).toHaveCount(0);
  await expect(gksCard.locator('.kad-source-link')).toHaveCount(1);
  await expect(gksCard.locator('.kad-status')).toContainText('Konfirmasi di Discord');

  await page.goto('/programs/english-mandarin-weekly-clubs/', { waitUntil: 'networkidle' });
  const gallery = page.locator('.kad-program-gallery');
  await expect(gallery).toHaveCount(1);
  const galleryImages = gallery.locator('img');
  await expect(galleryImages).toHaveCount(2);
  expect(await galleryImages.evaluateAll((images) => images.map((image) => new URL((image as HTMLImageElement).currentSrc || (image as HTMLImageElement).src, window.location.href).pathname).sort())).toEqual(
    [PROGRAM_POSTER_PATHS[3], PROGRAM_POSTER_PATHS[4]].sort(),
  );
  expect(await galleryImages.evaluateAll((images) => images.every((image) => {
    const element = image as HTMLImageElement;
    const url = new URL(element.currentSrc || element.src, window.location.href);
    return url.origin === window.location.origin && url.pathname.startsWith('/images/programs/') && element.alt.trim().length >= 20;
  }))).toBe(true);

  const galleryMetadata = await galleryImages.evaluateAll((images) => images.map((image) => ({
    path: new URL((image as HTMLImageElement).currentSrc || (image as HTMLImageElement).src, window.location.href).pathname,
    alt: (image as HTMLImageElement).alt,
  })));
  expect(galleryMetadata.find(({ path }) => path === PROGRAM_POSTER_PATHS[3])?.alt).toContain('English Study Club');
  expect(galleryMetadata.find(({ path }) => path === PROGRAM_POSTER_PATHS[4])?.alt).toContain('Mandarin Study Club');
});

test('program documentation keeps a descriptive fallback when local posters fail', async ({ page }) => {
  await page.route('**/images/programs/*.webp', (route) => route.abort());
  await page.goto('/programs/', { waitUntil: 'networkidle' });

  const cards = page.locator('.kad-program-card');
  await expect(cards).toHaveCount(5);
  await expect(cards.locator('.kad-media-fallback:visible')).toHaveCount(4);
  await expect(cards.locator('.kad-source-link')).toHaveCount(5);
  await expect(cards.locator('.kad-status')).toHaveCount(5);
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
    ['/about/history/', 'Tinjauan bukti'],
    ['/support/', 'Belum siap'],
    ['/community/credits/', 'Anonim secara bawaan'],
    ['/events/not-published/', 'Belum dipublikasikan'],
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
  await expect(page.locator('main')).toHaveAttribute('lang', 'en');
  await expect(page.locator('[data-testid="site-header"]')).toHaveAttribute('lang', 'en');
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

test('production excludes staging fixtures and keeps language fallback explicit', async ({ page }) => {
  await page.goto('/events/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('main')).toHaveAttribute('data-fixtures', 'disabled');
  await expect(page.locator('[data-fixture-id]')).toHaveCount(0);
  await expect(page.getByText('Data simulasi', { exact: true })).toHaveCount(0);

  await page.goto('/en/programs/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('main')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { name: 'Choose something you can actually follow through on.' })).toBeVisible();
  await expect(page.getByText('Sumber publik di X', { exact: true })).toHaveCount(0);
  await expect(page.locator('.kad-program-card').first()).toContainText('Public source on X');

  await page.goto('/ja/community/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  await expect(page.locator('main')).toHaveAttribute('lang', 'en');
  await expect(page.getByText('This community surface is available in English while a full translation is prepared.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Community is more than a server.' })).toBeVisible();

  await page.goto('/ja/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  await expect(page.getByText('This page is available in English while a full translation is prepared.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Kabur Aja Dulu' })).toBeVisible();
  await expect(page.getByText('コミュニティの公開スペース', { exact: true })).toHaveCount(0);
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

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const heroAnimationDuration = await page.locator('.kad-home-hero__dither').evaluate(
      (element) => getComputedStyle(element).animationDuration,
    );
    expect(durationInMilliseconds(heroAnimationDuration)).toBeLessThanOrEqual(1);
  });
});

test.describe('screenshot artifacts', () => {
  for (const [route, name] of [
    ['/', 'home'],
    ['/programs/', 'programs'],
    ['/programs/english-mandarin-weekly-clubs/', 'weekly-detail'],
    ['/support/', 'support'],
    ['/events/', 'events'],
    ['/volunteer/', 'volunteer'],
    ['/about/history/', 'history'],
    ['/design-preview/field-notes/', 'preview-field-notes'],
    ['/design-preview/community-bulletin/', 'preview-bulletin'],
    ['/design-preview/community-atlas/', 'preview-atlas'],
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
