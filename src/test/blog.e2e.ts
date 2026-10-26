import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const dist = path.resolve(import.meta.dirname, "../../dist");
const slug = "reviewing-tailscale-at-home";
const description =
    "A Tailscale vulnerability disclosure had me going through the nodes in my tailnet today.";
function load(page: string) {
    document.documentElement.innerHTML = fs.readFileSync(
        path.join(dist, page),
        "utf8",
    );
}

describe("Blog static output", () => {
    it("lists the approved article with publication and reading metadata", () => {
        load("blog/index.html");
        expect(document.querySelector("h1")?.textContent).toBe("Blog");
        const link = document.querySelector(`main h2 a[href='/blog/${slug}']`);
        expect(link?.textContent).toContain("Reviewing Tailscale at home");
        expect(document.querySelector("time")?.getAttribute("datetime")).toBe(
            "2026-10-26",
        );
        expect(document.querySelector("main")?.textContent).not.toContain(
            "Sample post",
        );
        expect(document.querySelectorAll("main .post-entry")).toHaveLength(1);
        expect(document.querySelector("main")?.textContent).toContain(
            description,
        );
        expect(
            document.querySelector(".reading-time")?.textContent?.trim(),
        ).toBe("2 min read");
    });
    it("renders a complete reading page with production canonical and rich content", () => {
        load(`blog/${slug}/index.html`);
        expect(document.querySelectorAll("h1")).toHaveLength(1);
        expect(document.title).toBe("Reviewing Tailscale at home | Ping Cheng");
        expect(
            document.querySelector("link[rel=canonical]")?.getAttribute("href"),
        ).toBe(`https://www.pingchengtech.com/blog/${slug}`);
        expect(
            document
                .querySelector('meta[property="og:type"]')
                ?.getAttribute("content"),
        ).toBe("article");
        expect(
            document
                .querySelector('meta[name="description"]')
                ?.getAttribute("content"),
        ).toBe(description);
        expect(
            document
                .querySelector('nav a[aria-current="page"]')
                ?.textContent?.trim(),
        ).toBe("Blog");
        expect(document.querySelectorAll(".article-body p")).toHaveLength(7);
        expect(document.querySelector(".article-body")?.textContent).toContain(
            "made sure Tailscale SSH was off on every device.",
        );
        expect(
            Array.from(document.querySelectorAll(".article-body a")).map(
                (a) => [a.textContent, a.getAttribute("href")],
            ),
        ).toEqual([
            [
                "Tailnet Lock",
                "https://tailscale.com/docs/features/tailnet-lock",
            ],
            [
                "PHP",
                "https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp",
            ],
            [
                "Node.js/Brotli",
                "https://nodejs.org/en/blog/vulnerability/october-2026-security-releases",
            ],
        ]);
        expect(
            document.querySelector(".sample-label, .sample-notice"),
        ).toBeNull();
        expect(document.querySelector("main")?.textContent).not.toMatch(
            /sample|draft|v0\.10|author review|editorial status/i,
        );
        expect(
            document.querySelector('main a[href="/blog"]')?.textContent,
        ).toContain("Back to blog");
    });
    it("includes both blog routes in the sitemap and builds no unknown post", () => {
        const sitemap = fs.readFileSync(
            path.join(dist, "sitemap-0.xml"),
            "utf8",
        );
        expect(sitemap).toContain("https://www.pingchengtech.com/blog/");
        expect(sitemap).toContain(
            `https://www.pingchengtech.com/blog/${slug}/`,
        );
        expect(
            fs.existsSync(path.join(dist, "blog/not-a-post/index.html")),
        ).toBe(false);
        expect(sitemap).not.toContain("a-small-space-for-useful-ideas");
        expect(
            fs.existsSync(
                path.join(dist, "blog/a-small-space-for-useful-ideas"),
            ),
        ).toBe(false);
    });
});
