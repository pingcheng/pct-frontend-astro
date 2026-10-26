import { expect, test } from "@playwright/test";

const slug = "/blog/a-small-space-for-useful-ideas";

test("Blog navigation leads to a readable sample and back", async ({
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
        .getByRole("link", { name: "A small space for useful ideas" })
        .click();
    await expect(page).toHaveURL(new RegExp(`${slug}/?$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "A small space for useful ideas",
    );
    await expect(
        page.getByRole("complementary", { name: "About this sample" }),
    ).toBeVisible();
    await expect(page.locator("pre code")).toContainText("nextReadingList");
    await expect(page.locator("blockquote")).toContainText("clearer question");
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

test("unknown blog slug returns 404", async ({ page }) => {
    const response = await page.goto("/blog/not-a-post");
    expect(response?.status()).toBe(404);
    await expect(
        page.getByRole("heading", { name: "Page not found" }),
    ).toBeVisible();
});
