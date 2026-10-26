import { expect, test } from "@playwright/test";

const slug = "/blog/reviewing-tailscale-at-home";

test("Blog navigation leads to a readable article and back", async ({
    page,
}) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Open main menu" });
    if (await toggle.isVisible()) await toggle.click();
    await page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: "Blog", exact: true })
        .click();
    await expect(
        page.getByRole("heading", { name: "Blog", exact: true }),
    ).toBeVisible();
    await page
        .getByRole("link", { name: "Reviewing Tailscale at home" })
        .click();
    await expect(page).toHaveURL(new RegExp(`${slug}/?$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "Reviewing Tailscale at home",
    );
    await expect(page.locator(".article-body p")).toHaveCount(18);
    await expect(page.locator(".article-body h2")).toHaveText([
        "Why I still want a private network",
        "What I want to tighten next",
        "Keeping up with the patches",
    ]);
    await expect(page.locator(".article-meta")).toContainText("4 min read");
    await expect(page.locator(".article-body a")).toHaveCount(7);
    await expect(page.locator(".sample-label, .sample-notice")).toHaveCount(0);
    await expect(page.locator(".article-body")).toContainText(
        "made sure the built-in Tailscale SSH feature was off on every device.",
    );
    const sourceLink = page.getByRole("link", {
        name: "Reddit response on 25 October",
        exact: true,
    });
    await sourceLink.focus();
    await expect(sourceLink).toBeFocused();
    await expect(sourceLink).toHaveAttribute(
        "href",
        "https://www.reddit.com/r/Tailscale/comments/1xeoj1l/recent_tailscale_vulnerability_reports/",
    );
    for (const name of [
        "Tailnet Lock",
        "default policy",
        "rule allowing that address and port",
        "Listening on localhost",
        "PHP",
        "Node.js/Brotli",
    ]) {
        await page.keyboard.press("Tab");
        await expect(
            page.getByRole("link", { name, exact: true }),
        ).toBeFocused();
    }
    const activeBlog = page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: "Blog", exact: true });
    if (await toggle.isVisible()) await toggle.click();
    await expect(activeBlog).toHaveAttribute("aria-current", "page");
    if (await page.getByRole("button", { name: "Close main menu" }).isVisible())
        await page.keyboard.press("Escape");
    await page.getByRole("link", { name: "Back to blog" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Blog");
    expect(errors).toEqual([]);
});

for (const colorScheme of ["light", "dark"] as const) {
    test(`blog content fits the viewport in ${colorScheme} mode`, async ({
        page,
    }) => {
        await page.emulateMedia({ colorScheme, reducedMotion: "reduce" });
        for (const route of ["/blog", slug]) {
            await page.goto(route);
            await expect(page.locator("main")).toBeVisible();
            const sizes = await page.evaluate(() => ({
                width: document.documentElement.clientWidth,
                content: document.documentElement.scrollWidth,
            }));
            expect(sizes.content).toBeLessThanOrEqual(sizes.width + 1);
        }
    });
}

for (const missing of [
    "not-a-post",
    "a-small-space-for-useful-ideas",
    "a-small-space-for-useful-ideas/",
]) {
    test(`missing blog slug ${missing} returns 404`, async ({ page }) => {
        const response = await page.goto(`/blog/${missing}`);
        expect(response?.status()).toBe(404);
        await expect(
            page.getByRole("heading", { name: "Page not found" }),
        ).toBeVisible();
    });
}
