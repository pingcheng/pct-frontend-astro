import { expect, test, type Page } from '@playwright/test';

const browserErrors = new WeakMap<
  Page,
  {
    consoleErrors: string[];
    pageErrors: string[];
    unexpectedRequests: string[];
  }
>();

function installBrowserErrorGuards(page: Page) {
  const errors = {
    consoleErrors: [] as string[],
    pageErrors: [] as string[],
    unexpectedRequests: [] as string[],
  };

  browserErrors.set(page, errors);
  page.on('console', (message) => {
    const source = message.location().url;
    const expected404 = source.endsWith('/this-page-does-not-exist') && message.text().includes('404');
    if (message.type() === 'error' && !expected404 && !source.startsWith('https://www.googletagmanager.com/')) {
      errors.consoleErrors.push(message.text());
    }
  });

  page.on('request', (request) => {
    if (/fonts\.googleapis|fonts\.gstatic|_vercel\/|vercel-insights|avatars0?\.githubusercontent|pct-frontend-assets\.s3/.test(request.url())) {
      errors.unexpectedRequests.push(request.url());
    }
  });

  page.on('pageerror', (error) => {
    errors.pageErrors.push(error.message);
  });
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(
    overflow.scrollWidth,
    `Page has horizontal overflow: ${overflow.scrollWidth}px > ${overflow.clientWidth}px`,
  ).toBeLessThanOrEqual(overflow.clientWidth + 1);
}

test.beforeEach(async ({ page }) => {
  // Analytics can fail on restricted networks; site rendering must still work.
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort());

  installBrowserErrorGuards(page);
});

test.afterEach(async ({ page }) => {
  const errors = browserErrors.get(page);

  expect(errors?.unexpectedRequests ?? [], 'Unexpected external asset or Vercel requests').toEqual([]);
  expect(errors?.pageErrors ?? [], 'Unexpected browser page errors').toEqual([]);
  expect(errors?.consoleErrors ?? [], 'Unexpected browser console errors').toEqual([]);
});

test.describe('personal site browser smoke', () => {
  test('home page renders identity, navigation links, and a stable personal introduction', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /Ping Cheng/ })).toBeVisible();
    const menuButton = page.getByRole('button', { name: 'Open main menu' });
    if (await menuButton.isVisible()) await menuButton.click();
    await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Portfolio', exact: true })).toHaveAttribute(
      'href',
      '/portfolio',
    );
    await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'About me', exact: true })).toHaveAttribute(
      'href',
      '/about',
    );
    const closeMenuButton = page.getByRole('button', { name: 'Close main menu' });
    if (await closeMenuButton.isVisible()) await closeMenuButton.click();
    await expect(page.getByText('I like making things that are useful.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'A little more about me' })).toHaveAttribute(
      'href', '/about',
    );
    await expect(page.getByText('I’m a software engineer in Melbourne, exploring coding agents, building personal tools, and tinkering with everyday life.')).toBeVisible();
    await expect(page.getByRole('img', { name: 'Ping Cheng profile photo', exact: true })).toBeVisible();

    await expectNoHorizontalOverflow(page);
  });

  test('about page renders profile, skills, and experience content', async ({ page }) => {
    await page.goto('/about');

    await expect(page.getByRole('heading', { name: 'Ping Cheng' })).toBeVisible();
    await expect(page.getByText('Principal Engineer at REA Group')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Focus & Interests' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Professional Experience' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Visit my GitHub profile' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Visit my LinkedIn profile' })).toBeVisible();

    await expectNoHorizontalOverflow(page);
  });

  test('portfolio list renders cards with usable project links', async ({ page }) => {
    await page.goto('/portfolio');

    await expect(page.getByRole('heading', { name: 'Portfolio' })).toBeVisible();

    const projectLink = page.getByRole('link', { name: /Empire CBS/ });
    await expect(projectLink).toBeVisible();
    await expect(projectLink).toHaveAttribute('href', '/portfolio/empire-cbs');

    await expectNoHorizontalOverflow(page);
  });

  test('portfolio detail renders project data and safe external links', async ({ page }) => {
    await page.goto('/portfolio/empire-cbs');

    await expect(page.getByRole('heading', { name: 'Empire CBS' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Back to portfolio' })).toHaveAttribute('href', '/portfolio');
    await expect(page.getByText('Backend & DevOps Developer', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Private project', { exact: true }).first()).toBeVisible();

    const unsafeExternalLinks = await page
      .locator('a[target="_blank"]')
      .evaluateAll((links) =>
        links
          .filter((link) => {
            const rel = link.getAttribute('rel') ?? '';
            return !rel.includes('noopener') || !rel.includes('noreferrer');
          })
          .map((link) => link.getAttribute('href')),
      );
    expect(unsafeExternalLinks).toEqual([]);

    await expectNoHorizontalOverflow(page);
  });

  test('mobile navigation opens, exposes links, and closes', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile navigation is only rendered on mobile viewports.');

    await page.goto('/about');

    const menuButton = page.getByRole('button', { name: 'Open main menu' });
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    await menuButton.click();
    await expect(page.getByRole('button', { name: 'Close main menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await expect(page.locator('#mobile-menu').getByRole('link', { name: 'Portfolio' })).toBeVisible();
    await expect(page.locator('#mobile-menu').getByRole('link', { name: 'About me' })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Open main menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );

    await expect(page.locator('#mobile-menu')).toHaveAttribute('inert', '');
    await expect(menuButton).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Visit my GitHub profile' })).toBeFocused();

    const mobileViewport = page.viewportSize();
    await menuButton.click();
    await page.setViewportSize({ width: 900, height: 850 });
    await expect(page.locator('button[aria-controls="mobile-menu"]')).toHaveAttribute('aria-expanded', 'false');
    if (mobileViewport) await page.setViewportSize(mobileViewport);
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    await expectNoHorizontalOverflow(page);
  });
});


test('local Inter loads and every portfolio image decodes', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => Array.from(document.fonts).some(
    (font) => font.family === 'Inter' && font.status === 'loaded',
  ))).toBe(true);

  const { Portfolios } = await import('../../src/data/portfolios');
  const images = ['/images/avatar.webp', ...new Set(Portfolios.flatMap(
    (portfolio) => [portfolio.coverImage, ...portfolio.screenshots],
  ))];
  const failures = await page.evaluate(async (sources) => {
    return (await Promise.all(sources.map(async (src) => {
      const image = new Image();
      image.src = src;
      try {
        await image.decode();
        return image.naturalWidth > 0 ? null : src;
      } catch {
        return src;
      }
    }))).filter(Boolean);
  }, images);
  expect(failures).toEqual([]);
});

test('unknown routes return the static 404 page', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/');
});

test('Pages serves a native sitemap redirect', async ({ request }) => {
  test.skip(!process.env.PLAYWRIGHT_BASE_URL, 'Run against Pages or Wrangler to check hosting redirects.');
  const response = await request.get('/sitemap.xml', { maxRedirects: 0 });
  expect(response.status()).toBe(301);
  expect(new URL(response.headers().location, response.url()).pathname).toBe('/sitemap-index.xml');
  const sitemap = await request.get('/sitemap-index.xml');
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain('https://www.pingchengtech.com/sitemap-0.xml');
});

test('navigation works when the optional analytics loader fails', async ({ page }) => {
  const failedAnalytics: string[] = [];
  page.on('requestfailed', (request) => {
    if (request.url().startsWith('https://www.googletagmanager.com/')) {
      failedAnalytics.push(request.url());
    }
  });
  await page.goto('/');
  if (await page.locator('script[src^="https://www.googletagmanager.com/"]').count()) {
    await expect.poll(() => failedAnalytics.length).toBeGreaterThan(0);
  }
  const menuButton = page.getByRole('button', { name: 'Open main menu' });
  if (await menuButton.isVisible()) await menuButton.click();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Portfolio', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Portfolio' })).toBeVisible();
  await page.getByRole('link', { name: /Empire CBS/ }).click();
  await expect(page.getByRole('heading', { name: 'Empire CBS' })).toBeVisible();
});


test('home entrances run once and finish with readable content', async ({ page }) => {
  await page.addInitScript(() => {
    const motionWindow = window as Window & { studioMotionEvents: string[] };
    motionWindow.studioMotionEvents = [];
    for (const phase of ['animationstart', 'animationend']) {
      document.addEventListener(phase, (event) => {
        if (!(event.target instanceof Element)) return;
        for (const group of ['hero-copy', 'studio-vignette']) {
          if (event.target.classList.contains(group)) {
            motionWindow.studioMotionEvents.push(`${group}:${phase}`);
          }
        }
      });
    }
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.evaluate(() => (
    window as Window & { studioMotionEvents: string[] }
  ).studioMotionEvents)).toEqual(expect.arrayContaining([
    'hero-copy:animationstart', 'hero-copy:animationend',
    'studio-vignette:animationstart', 'studio-vignette:animationend',
  ]));
  expect(await page.evaluate(() => (
    window as Window & { studioMotionEvents: string[] }
  ).studioMotionEvents)).toHaveLength(4);
  expect(await page.locator('main').evaluate((main) =>
    main.checkVisibility({ checkOpacity: true }),
  )).toBe(true);
  await expectNoHorizontalOverflow(page);
});

test('reduced motion keeps home and inner-page content immediately readable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const route of ['/', '/about']) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(await page.locator('main [class*="animate-"]').evaluateAll((groups) =>
      groups.every((group) => group.checkVisibility({ checkOpacity: true })),
    )).toBe(true);
    expect(await page.evaluate(() => document.getAnimations().filter(
      (animation) => animation.playState === 'running',
    ).length)).toBe(0);
    await expectNoHorizontalOverflow(page);
  }
});
