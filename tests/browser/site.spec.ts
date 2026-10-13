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
  test('home page renders identity, navigation links, and hydrated typewriter text', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /Ping Cheng/ })).toBeVisible();
    await expect(page.getByText('Principal Engineer at REA Group')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Github' })).toHaveAttribute(
      'href',
      'https://github.com/pingcheng',
    );
    await expect(page.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/ping-cheng-5a47b484',
    );
    await expect(page.getByRole('link', { name: 'Portfolio' })).toHaveAttribute(
      'href',
      '/portfolio',
    );
    await expect(page.getByRole('link', { name: 'About' })).toHaveAttribute(
      'href',
      '/about',
    );
    // The homepage cycles taglines via a typewriter (each line types out,
    // pauses, then deletes before the next). 'Writing code' is the second
    // line, so the assertion needs to wait for the first line's full
    // type/pause/delete cycle (~6.7s) before it can appear. Allow a full
    // cycle plus margin.
    await expect(page.getByText('Writing code')).toBeVisible({
      timeout: 15_000,
    });

    await expectNoHorizontalOverflow(page);
  });

  test('about page renders profile, skills, and experience content', async ({ page }) => {
    await page.goto('/about');

    await expect(page.getByRole('heading', { name: 'Ping Cheng' })).toBeVisible();
    await expect(page.getByText('Principal Engineer at REA Group')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Technical Expertise' })).toBeVisible();
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
    await expect(page.getByRole('link', { name: '< Back' })).toHaveAttribute('href', '/portfolio');
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
  await page.getByRole('link', { name: 'Portfolio', exact: true }).first().click();
  await expect(page.getByRole('heading', { name: 'Portfolio' })).toBeVisible();
  await page.getByRole('link', { name: /Empire CBS/ }).click();
  await expect(page.getByRole('heading', { name: 'Empire CBS' })).toBeVisible();
});
