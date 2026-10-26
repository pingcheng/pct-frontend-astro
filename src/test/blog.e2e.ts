import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const dist = path.resolve(import.meta.dirname, "../../dist");
const slug = "a-small-space-for-useful-ideas";
function load(page: string) {
    document.documentElement.innerHTML = fs.readFileSync(
        path.join(dist, page),
        "utf8",
    );
}

describe("Blog static output", () => {
    it("links from the index to the sample article with metadata", () => {
        load("blog/index.html");
        expect(document.querySelector("h1")?.textContent).toBe("Blog");
        const link = document.querySelector(`main h2 a[href='/blog/${slug}']`);
        expect(link?.textContent).toContain("A small space for useful ideas");
        expect(document.querySelector("time")?.getAttribute("datetime")).toBe(
            "2026-10-26",
        );
        expect(document.querySelector("main")?.textContent).toContain(
            "Sample post",
        );
    });
    it("renders a complete reading page with production canonical and rich content", () => {
        load(`blog/${slug}/index.html`);
        expect(document.querySelectorAll("h1")).toHaveLength(1);
        expect(document.title).toBe(
            "A small space for useful ideas | Ping Cheng",
        );
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
        ).toContain("sample entry");
        expect(
            document
                .querySelector('nav a[aria-current="page"]')
                ?.textContent?.trim(),
        ).toBe("Blog");
        for (const selector of [
            "h2",
            "h3",
            "p",
            "ul",
            "ol",
            "blockquote",
            "pre code",
            "table",
        ]) {
            expect(
                document.querySelector(`.article-body ${selector}`),
                selector,
            ).not.toBeNull();
        }
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
    });
});
