import { expect, test, type Page } from '@playwright/test';

const browserErrors = new WeakMap<
  Page,
  {
    consoleErrors: string[];
    pageErrors: string[];
  }
>();

function installBrowserErrorGuards(page: Page) {
  const errors = {
    consoleErrors: [] as string[],
    pageErrors: [] as string[],
  };

  browserErrors.set(page, errors);
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.consoleErrors.push(message.text());
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
  await page.route('**/_vercel/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: '',
    });
  });

  installBrowserErrorGuards(page);
});

test.afterEach(async ({ page }) => {
  const errors = browserErrors.get(page);

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
    await expect(page.getByText('Working on PropTrack')).toBeVisible({
      timeout: 5_000,
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
