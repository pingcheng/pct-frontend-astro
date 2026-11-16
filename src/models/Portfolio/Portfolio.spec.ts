import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { imageDimensions } from "@/data/image-dimensions";
import { Portfolios } from "@/data/portfolios";

const publicDir = resolve(import.meta.dirname, "../../../public");

const allImages = Portfolios.flatMap((portfolio) => [
  portfolio.coverImage,
  ...portfolio.screenshots,
]);

describe("Portfolios data", () => {
  it("should have unique slugs", () => {
    const slugs = Portfolios.map((portfolio) => portfolio.slug);
    const duplicates = slugs.filter(
      (slug, index) => slugs.indexOf(slug) !== index,
    );

    expect(duplicates).toEqual([]);
  });

  it("should have a screenshot caption for every screenshot when captions are provided", () => {
    const mismatches = Portfolios.filter(
      (portfolio) =>
        portfolio.screenshotCaptions &&
        portfolio.screenshotCaptions.length !== portfolio.screenshots.length,
    ).map((portfolio) => portfolio.slug);

    expect(mismatches).toEqual([]);
  });

  it("should record intrinsic dimensions for every cover image and screenshot", () => {
    const missing = allImages.filter((src) => !imageDimensions[src]);

    expect(missing).toEqual([]);
  });

  it("should serve every cover image and screenshot from public/", () => {
    const missing = allImages.filter(
      (src) => !existsSync(resolve(publicDir, `.${src}`)),
    );

    expect(missing).toEqual([]);
  });
});
