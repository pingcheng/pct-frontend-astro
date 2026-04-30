import { describe, it, expect } from "vitest";
import { URLS } from "./urls";

describe("URLS constants", () => {
  describe("ASSETS", () => {
    it("should have S3_BASE defined", () => {
      expect(URLS.ASSETS.S3_BASE).toBeDefined();
    });

    it("should have S3_BASE matching expected S3 URL pattern", () => {
      expect(URLS.ASSETS.S3_BASE).toMatch(
        /^https:\/\/.*\.s3\..*\.amazonaws\.com\//,
      );
    });

    it("should have S3_BASE pointing to the portfolio assets bucket", () => {
      expect(URLS.ASSETS.S3_BASE).toBe(
        "https://pct-frontend-assets.s3.ap-southeast-2.amazonaws.com/portfolio",
      );
    });
  });
});
