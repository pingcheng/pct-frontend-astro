import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const dist = path.resolve(import.meta.dirname, "../../dist");
const slug = "reviewing-tailscale-at-home";
const description =
    "Reviewing a home tailnet, device permissions and the trust that comes with each private connection.";
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
        const link = document.querySelector(`main h2 a[href='/blog/${slug}/']`);
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
        ).toBe("4 min read");
    });
    it("renders a complete reading page with production canonical and rich content", () => {
        load(`blog/${slug}/index.html`);
        expect(document.querySelectorAll("h1")).toHaveLength(1);
        expect(document.title).toBe("Reviewing Tailscale at home | Ping Cheng");
        expect(
            document.querySelector("link[rel=canonical]")?.getAttribute("href"),
        ).toBe(`https://www.pingchengtech.com/blog/${slug}/`);
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
        expect(document.querySelectorAll(".article-body p")).toHaveLength(18);
        expect(
            Array.from(document.querySelectorAll(".article-body h2")).map(
                (heading) => heading.textContent,
            ),
        ).toEqual([
            "Why I still want a private network",
            "What I want to tighten next",
            "Keeping up with the patches",
        ]);
        expect(
            document.querySelector(".article-body strong")?.textContent,
        ).toBe(
            "if one of my devices were compromised, what else could it reach?",
        );
        expect(document.querySelectorAll(".article-body strong")).toHaveLength(
            1,
        );
        expect(document.querySelector(".article-body h1")).toBeNull();
        expect(
            document.querySelectorAll("article .article-meta time"),
        ).toHaveLength(1);
        expect(
            document.querySelector("article .article-meta")?.textContent,
        ).toContain("Ping Cheng");
        expect(
            document.querySelector(".article-body")?.textContent,
        ).not.toContain("Ping Cheng · 26 October 2026");
        expect(document.querySelector(".article-body")?.textContent).toContain(
            "made sure the built-in Tailscale SSH feature was off on every device.",
        );
        expect(
            Array.from(document.querySelectorAll(".article-body a")).map(
                (a) => [a.textContent, a.getAttribute("href")],
            ),
        ).toEqual([
            [
                "Reddit response on 25 October",
                "https://www.reddit.com/r/Tailscale/comments/1xeoj1l/recent_tailscale_vulnerability_reports/",
            ],
            [
                "Tailnet Lock",
                "https://tailscale.com/docs/features/tailnet-lock",
            ],
            [
                "default policy",
                "https://tailscale.com/docs/reference/examples/grants",
            ],
            [
                "rule allowing that address and port",
                "https://tailscale.com/docs/reference/syntax/grants",
            ],
            [
                "Listening on localhost",
                "https://tailscale.com/docs/features/tailscale-serve#identity-headers",
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
            document.querySelector('main a[href="/blog/"]')?.textContent,
        ).toContain("Back to blog");
        expect(document.querySelectorAll('main a[href="/blog/"]')).toHaveLength(
            2,
        );
    });
    it.each(["blog", `blog/${slug}`])(
        "%s canonical and Open Graph URL match one exact sitemap location",
        (route) => {
            load(`${route}/index.html`);
            const expected = `https://www.pingchengtech.com/${route}/`;
            const canonicals = document.querySelectorAll(
                'link[rel="canonical"]',
            );
            const ogUrls = document.querySelectorAll('meta[property="og:url"]');
            expect(canonicals).toHaveLength(1);
            expect(ogUrls).toHaveLength(1);
            expect(canonicals[0].getAttribute("href")).toBe(expected);
            expect(ogUrls[0].getAttribute("content")).toBe(expected);

            const sitemap = new DOMParser().parseFromString(
                fs.readFileSync(path.join(dist, "sitemap-0.xml"), "utf8"),
                "application/xml",
            );
            expect(sitemap.querySelector("parsererror")).toBeNull();
            const locations = Array.from(
                sitemap.querySelectorAll("url > loc"),
            ).map((loc) => loc.textContent);
            expect(locations.filter((url) => url === expected)).toHaveLength(1);
            expect(locations).not.toContain(expected.slice(0, -1));
            for (const link of document.querySelectorAll(
                'nav a[href="/blog/"]',
            )) {
                expect(link.getAttribute("aria-current")).toBe("page");
            }
            expect(
                document.querySelectorAll('nav a[href="/blog/"]'),
            ).toHaveLength(2);
        },
    );
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
