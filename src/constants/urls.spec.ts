import { describe, it, expect } from "vitest";
import { URLS } from "./urls";

describe("URLS constants", () => {
  describe("ASSETS", () => {
    it("should point portfolio images to the local assets directory", () => {
      expect(URLS.ASSETS.PORTFOLIO_BASE).toBe("/images/portfolio");
    });
  });
});
