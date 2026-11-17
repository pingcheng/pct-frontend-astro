import { afterEach, describe, expect, it } from "vitest";
import { applyTheme, readTheme, THEME_STORAGE_KEY, writeTheme } from "./theme";

afterEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
});

describe("theme storage", () => {
    it("defaults to system when nothing is stored", () => {
        expect(readTheme()).toBe("system");
    });

    it("ignores unknown stored values", () => {
        localStorage.setItem(THEME_STORAGE_KEY, "sepia");
        expect(readTheme()).toBe("system");
    });

    it.each(["light", "dark"] as const)("round-trips %s", (theme) => {
        writeTheme(theme);
        expect(readTheme()).toBe(theme);
    });

    it("clears the stored choice for system", () => {
        writeTheme("dark");
        writeTheme("system");
        expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
    });
});

describe("applyTheme", () => {
    it("sets data-theme for an explicit choice and removes it for system", () => {
        const root = document.documentElement;
        applyTheme(root, "dark");
        expect(root.dataset.theme).toBe("dark");
        applyTheme(root, "system");
        expect(root.dataset.theme).toBeUndefined();
    });
});
