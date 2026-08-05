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

const SUBPAGE_HEADERS = [
  ['/events/', 'schedule', '0 rekaman publik'],
  ['/volunteer/', 'volunteer-cycle', 'Siklus 3 bulan'],
  ['/stories/', 'story-index', 'Catatan dari kegiatan.'],
  ['/about/history/', 'history-review', 'Tinjauan bukti'],
  ['/community/impact/', 'impact-ledger', 'rekaman metrik terbit'],
  ['/support/', 'support-readiness', 'Belum menerima pembayaran'],
  ['/community/credits/', 'contribution-ledger', 'Anonim secara bawaan'],
  ['/events/not-published/', 'event-record', 'Agenda'],
] as const;

const INFORMATION_FIRST_ROUTES = [
  ['/events/', 'schedule'],
  ['/volunteer/', 'volunteer-cycle'],
  ['/stories/', 'story-index'],
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

  test('Community leads with current metrics, programs, agenda, and people', async ({ page }) => {
    await page.goto('/community/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('[data-community-section="current"] dl')).toBeVisible();
    await expect(page.locator('[data-community-section="current"] dl > div')).toHaveCount(3);
    await expect(page.locator('[data-community-section="current"] .kad-community-information__metric-value')).toHaveText(['—', '—', '—']);
    await expect(page.locator('[data-community-section="current"] .kad-community-information__metric-detail')).toHaveCount(3);
    await expect(page.locator('[data-community-section="programs"] [data-program-record]')).toHaveCount(3);
    await expect(page.locator('[data-community-section="agenda"]')).toBeVisible();
    await expect(page.locator('[data-community-section="people"]')).toBeVisible();
    await expect(page.locator('.kad-journey-card, .kad-band, [data-community-section="social"]')).toHaveCount(0);
    const headingOrder = await page.locator('[data-community-section]').evaluateAll((sections) =>
      sections.map((section) => section.querySelector('h2')?.textContent?.trim() ?? ''),
    );
    expect(headingOrder.slice(0, 4)).toEqual([
      'Berikutnya di KAD',
      'Program yang bisa diikuti',
      'Jadwal publik',
      'Catatan kontribusi',
    ]);
  });

  test('Community stays compact and ordered on desktop and mobile', async ({ page }) => {
    for (const viewport of [{ width: 1280, height: 720 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      await page.goto('/community/', { waitUntil: 'domcontentloaded' });
      const header = page.locator('[data-page-header="orientation"]');
      const box = await header.boundingBox();
      expect(box?.height ?? Number.POSITIVE_INFINITY).toBeLessThanOrEqual(viewport.width === 1280 ? 400 : 600);
      await expectNoHorizontalOverflow(page);
      const sections = await page.locator('[data-community-section]').evaluateAll((items) => items.map((item) => item.getAttribute('data-community-section')));
      expect(sections).toEqual(['current', 'programs', 'agenda', 'people', 'sources']);
    }
  });

  for (const [route, headerKind, marker] of SUBPAGE_HEADERS) {
    test(`${route} exposes a page-specific ${headerKind} header`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto(route, { waitUntil: 'domcontentloaded' });

      const header = page.locator(`[data-page-header="${headerKind}"]`);
      await expect(header).toHaveCount(1);
      await expect(page.locator('[data-page-header="orientation"]')).toHaveCount(0);
      await expect(page.locator('[data-page-header="task"]')).toHaveCount(0);
      await expect(header).toContainText(marker);
      const headerBox = await header.boundingBox();
      expect(headerBox, 'page-specific header must be laid out in the first viewport').not.toBeNull();
      expect((headerBox?.y ?? 721) + (headerBox?.height ?? 0)).toBeLessThanOrEqual(720);
      await expectNoHorizontalOverflow(page);
    });
  }

  test('Programs exposes real category controls at the start of the catalogue', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/programs/', { waitUntil: 'domcontentloaded' });
    const filters = page.locator('.kad-program-filters');
    await expect(filters.getByRole('link')).toHaveCount(3);
    const box = await filters.boundingBox();
    expect((box?.y ?? 721) + (box?.height ?? 0)).toBeLessThanOrEqual(720);
  });

  test('Programs catalogue and detail keep task-scale headings', async ({ page }) => {
    for (const route of ['/programs/', '/programs/english-mandarin-weekly-clubs/']) {
      for (const viewport of [
        { width: 1280, height: 720, maxTitleSize: 48 },
        { width: 390, height: 844, maxTitleSize: 43 },
      ]) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(route, { waitUntil: 'domcontentloaded' });
        const title = page.locator('main h1');
        const titleSize = await title.evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize));
        expect(titleSize, `${route} should use task-scale type at ${viewport.width}px`).toBeLessThanOrEqual(viewport.maxTitleSize);
        await expectNoHorizontalOverflow(page);
      }
    }
  });

  test.describe('information-first task headers', () => {
    for (const [route, headerKind] of INFORMATION_FIRST_ROUTES) {
      test(`${route} is compact, useful, and contained on desktop and mobile`, async ({ page }) => {
        for (const viewport of [
          { width: 1280, height: 720, maxHeaderHeight: 300, maxTitleSize: 48 },
          { width: 390, height: 844, maxHeaderHeight: 310, maxTitleSize: 36 },
        ]) {
          await page.setViewportSize({ width: viewport.width, height: viewport.height });
          await page.goto(route, { waitUntil: 'domcontentloaded' });

          const header = page.locator(`[data-page-header="${headerKind}"]`);
          await expect(header).toHaveCount(1);
          await expect(header.locator('h1')).toBeVisible();

          const metrics = await header.evaluate((element) => {
            const title = element.querySelector('h1');
            const summary = element.querySelector('.kad-subpage-intro__aside, .kad-index-intro__record, .kad-community-information__header-note');
            const rect = element.getBoundingClientRect();
            const titleStyle = title ? getComputedStyle(title) : null;
            return {
              headerHeight: rect.height,
              titleSize: titleStyle ? Number.parseFloat(titleStyle.fontSize) : 0,
              summaryBottom: summary?.getBoundingClientRect().bottom ?? 0,
              summaryCount: summary ? 1 : 0,
            };
          });

          expect(metrics.headerHeight, `${route} header should stay compact at ${viewport.width}px`).toBeLessThanOrEqual(viewport.maxHeaderHeight);
          expect(metrics.titleSize, `${route} title should not use hero scale at ${viewport.width}px`).toBeLessThanOrEqual(viewport.maxTitleSize);
          expect(metrics.summaryCount, `${route} header should expose its information summary`).toBe(1);
          expect(metrics.summaryBottom, `${route} summary should be visible near the first viewport`).toBeLessThanOrEqual(viewport.height + 16);
          const firstAction = page.locator('main a.kad-button, .kad-story-information__empty a').first();
          await expect(firstAction).toBeVisible();
          const actionBox = await firstAction.boundingBox();
          expect(actionBox ? actionBox.y + actionBox.height : Number.POSITIVE_INFINITY, `${route} should expose a useful next action near the first viewport`).toBeLessThanOrEqual(viewport.height + 16);
          await expectNoHorizontalOverflow(page);
        }
      });
    }
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

  test('Field Notes is the normal-home candidate and renders the selected program posters', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page.locator('[data-design-direction="field-notes"]')).toBeVisible();
    await expect(page.locator('[data-interface-slice="community-home"] img[src^="/images/programs/"]')).toHaveCount(4);
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

test('program catalogue uses an information-first index backed by public records', async ({ page }) => {
  await page.goto('/programs/', { waitUntil: 'domcontentloaded' });

  await expect(page.locator('[data-page-family="programs"]')).toBeVisible();
  await expect(page.locator('[data-page-header="task"]')).toHaveCount(0);
  await expect(page.locator('[data-program-count="5"]')).toBeVisible();
  const records = page.locator('[data-program-record]');
  await expect(records).toHaveCount(5);
  await expect(records.locator('[data-program-availability="needs_confirmation"]')).toHaveCount(5);
  expect(await records.locator('[data-program-availability="needs_confirmation"]').allTextContents()).toEqual(
    new Array(5).fill('Sesi berikutnya belum dipastikan'),
  );

  const links = records.locator(`a[href^="https://x.com/KADSocialHub/status/"]`);
  await expect(links).toHaveCount(5);
  expect(await links.evaluateAll((anchors) => anchors.map((anchor) => (anchor as HTMLAnchorElement).href))).toEqual(
    expect.arrayContaining(PROGRAM_SOURCES),
  );
  expect(await links.evaluateAll((anchors) => anchors.every((anchor) => anchor.getAttribute('target') === '_blank'))).toBe(true);
  expect(await links.evaluateAll((anchors) => anchors.every((anchor) => anchor.getAttribute('rel') === 'noopener noreferrer'))).toBe(true);
});

test('program posters use meaningful local media with loading metadata and dimensions', async ({ page }) => {
  await page.goto('/programs/', { waitUntil: 'networkidle' });

  const records = page.locator('[data-program-record]');
  const posterImages = records.locator('img');
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

test('category filters are URL-addressable and update the visible result count', async ({ page }) => {
  await page.goto('/programs/category/language/#catalogue', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-program-filter="language"]')).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('[data-program-record]')).toHaveCount(3);
  await expect(page.locator('[data-program-result-count]')).toContainText('3 program');

  await page.locator('[data-program-filter="career"]').click();
  await expect(page).toHaveURL(/\/programs\/category\/career\/?#catalogue$/);
  await expect(page.locator('[data-program-record]')).toHaveCount(2);
  await expect(page.locator('[data-program-result-count]')).toContainText('2 program');
});

test('category filtering remains functional without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/programs/category/language/#catalogue', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-program-record]')).toHaveCount(3);
  await expect(page.locator('[data-program-filter="language"]')).toHaveAttribute('aria-current', 'page');
  const careerFilter = page.locator('[data-program-filter="career"]');
  await careerFilter.focus();
  await careerFilter.press('Enter');
  await expect(page).toHaveURL(/\/programs\/category\/career\/?#catalogue$/);
  await expect(page.locator('[data-program-record]')).toHaveCount(2);
  await context.close();
});

test('Programs lifecycle previews expose loading, empty, stale, and recoverable error states', async ({ page }) => {
  const states = ['loading', 'empty', 'stale', 'error'] as const;
  for (const state of states) {
    await page.goto(`/design-preview/programs/${state}/`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
    await expect(page.locator('main')).toHaveAttribute('data-repository-state', state);
  }

  await page.goto('/design-preview/programs/stale/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-freshness="stale"]').first()).toBeVisible();
  await expect(page.locator('[data-program-record]')).toHaveCount(5);

  await page.goto('/design-preview/programs/error/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-state-panel="error"]')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Coba lagi' })).toHaveAttribute('href', '/design-preview/programs/error');
});

test('GKS remains a text-only fallback and English + Mandarin detail has two posters', async ({ page }) => {
  await page.goto('/programs/', { waitUntil: 'domcontentloaded' });
  const gksCard = page.locator('[data-program-record]').filter({ hasText: 'GKS preparation' });
  await expect(gksCard).toHaveCount(1);
  await expect(gksCard.locator('img')).toHaveCount(0);
  await expect(gksCard.locator('.kad-source-link')).toHaveCount(1);
  await expect(gksCard.locator('[data-program-availability]')).toContainText('Sesi berikutnya belum dipastikan');

  await page.goto('/programs/english-mandarin-weekly-clubs/', { waitUntil: 'networkidle' });
  await expect(page.locator('[data-page-family="program-detail"]')).toBeVisible();
  await expect(page.locator('[data-page-header="task"]')).toHaveCount(0);
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

test('production Program detail keeps unproven structure and metrics as Evidence Placeholders', async ({ page }) => {
  await page.goto('/programs/french-club-trial/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('main')).toHaveAttribute('data-fixtures', 'disabled');
  await expect(page.locator('[data-program-series]')).toHaveCount(0);
  await expect(page.locator('[data-program-metric]')).toHaveCount(4);
  await expect(page.locator('[data-program-metric] [data-metric-value]')).toHaveText(new Array(4).fill('Belum terdokumentasi'));
  await expect(page.locator('[data-evidence-placeholder]').first()).toBeVisible();
});

test('program documentation keeps a descriptive fallback when local posters fail', async ({ page }) => {
  await page.route('**/images/programs/*.webp', (route) => route.abort());
  await page.goto('/programs/', { waitUntil: 'networkidle' });

  const records = page.locator('[data-program-record]');
  await expect(records).toHaveCount(5);
  await expect(records.locator('.kad-media-fallback:visible')).toHaveCount(4);
  await expect(records.locator('.kad-source-link')).toHaveCount(5);
  await expect(records.locator('[data-program-availability]')).toHaveCount(5);
});

test('program detail puts the Discord handoff before documentation on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/programs/english-mandarin-weekly-clubs/', { waitUntil: 'domcontentloaded' });

  const handoff = page.locator('.kad-program-detail-intro__action[href*="discord"]').filter({ hasText: /Gabung KAD di Discord|Join KAD on Discord/i });
  await expect(handoff).toHaveCount(1);
  await expect(handoff).toBeVisible();
  const handoffBox = await handoff.boundingBox();
  expect(handoffBox?.y ?? Number.POSITIVE_INFINITY, 'Discord handoff should appear in the first mobile viewport').toBeLessThan(900);

  await expect(page.locator('.kad-program-documentation')).toHaveCount(1);
  const precedesDocumentation = await page.evaluate(() => {
    const action = document.querySelector('.kad-program-detail-intro__action[href*="discord"]');
    const documentation = document.querySelector('.kad-program-documentation');
    return action !== null && documentation !== null && Boolean(action.compareDocumentPosition(documentation) & Node.DOCUMENT_POSITION_FOLLOWING);
  });
  expect(precedesDocumentation, 'Discord handoff must precede documentation in DOM order').toBe(true);
});

test('events begin with an honest zero-count empty state', async ({ page }) => {
  await page.goto('/events/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('[data-event-count="0"]')).toBeVisible();
  await expect(page.locator('[data-evidence-placeholder="agenda-empty"]')).toBeVisible();
  await expect(page.locator('[data-event-state="empty"]')).toBeVisible();
  await expect(page.locator('[data-event-count="0"] .kad-status')).toContainText('0');
  await expect(page.locator('.kad-event-card, [data-event-state="published"]')).toHaveCount(0);
});

test('readiness states stay explicit for history, support, credits, and unpublished events', async ({ page }) => {
  const states = [
    ['/about/history/', 'Tinjauan bukti'],
    ['/support/', 'Belum menerima pembayaran'],
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
  await expect(page.locator('.kad-nav-links a')).toHaveCount(5);

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
  await expect(page.locator('[data-page-header="orientation"]')).toBeVisible();
  await expect(page.locator('[data-community-section="current"] dl')).toBeVisible();
  await expect(page.locator('.kad-community-information__sources a').first()).toBeVisible();
});

test('production excludes staging fixtures and keeps language fallback explicit', async ({ page }) => {
  for (const route of ['/community/', '/events/', '/programs/', '/volunteer/', '/stories/', '/about/history/', '/community/impact/', '/community/credits/', '/support/']) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main')).toHaveAttribute('data-fixtures', 'disabled');
    await expect(page.locator('[data-fixture-id], [data-fixture-revision]')).toHaveCount(0);
    await expect(page.locator('main')).not.toContainText(/Data simulasi|Demo data|pratinjau|preview records|preview schedule/i);
  }

  await page.goto('/en/programs/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('main')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { name: 'Community programs' })).toBeVisible();
  await expect(page.getByText('Sumber publik di X', { exact: true })).toHaveCount(0);
  await expect(page.locator('[data-program-record]').first()).toContainText('Public source on X');

  await page.goto('/ja/community/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  await expect(page.locator('main')).toHaveAttribute('lang', 'en');
  await expect(page.getByText('This community surface is available in English while a full translation is prepared.')).toBeVisible();
  await expect(page.locator('#community-title')).toHaveText('See what the community is doing now.');

  await page.goto('/ja/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  await expect(page.getByText('Some community sections remain in English while their full translation is prepared.')).toBeVisible();
  await expect(page.getByRole('heading', { name: '本当の疑問から始めよう。' })).toBeVisible();
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

  test('representative page families stay within the viewport on desktop and mobile', async ({ page }) => {
    const routes = [
      '/',
      '/community/',
      '/programs/',
      '/programs/english-mandarin-weekly-clubs/',
      '/events/',
      '/events/not-published/',
      '/volunteer/',
      '/stories/',
      '/about/history/',
      '/community/impact/',
      '/support/',
      '/community/credits/',
    ];
    for (const viewport of [{ width: 1280, height: 720 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      for (const route of routes) {
        await page.goto(route, { waitUntil: 'domcontentloaded' });
        await expectNoHorizontalOverflow(page);
      }
    }
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
      const sample = document.querySelector('.kad-volunteer-position');
      if (!sample) return null;
      const style = getComputedStyle(sample);
      return { transitionDuration: style.transitionDuration, animationDuration: style.animationDuration };
    });
    expect(motion).not.toBeNull();
    const durationInMilliseconds = (value: string) => value === '0s' ? 0 : Number.parseFloat(value) * 1000;
    expect(durationInMilliseconds(motion?.transitionDuration ?? '1s')).toBeLessThanOrEqual(1);
    expect(durationInMilliseconds(motion?.animationDuration ?? '1s')).toBeLessThanOrEqual(1);

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const cityTransitionDuration = await page.locator('.kad-city-atlas__featured').evaluate(
      (element) => getComputedStyle(element).transitionDuration,
    );
    expect(durationInMilliseconds(cityTransitionDuration)).toBeLessThanOrEqual(1);
  });
});

test.describe('screenshot artifacts', () => {
  for (const [route, name] of [
    ['/', 'home'],
    ['/community/', 'community'],
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
