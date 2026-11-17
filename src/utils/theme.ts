export type Theme = "light" | "dark" | "system";

/** localStorage key for the visitor's choice. BaseLayout's pre-paint script reads the same key. */
export const THEME_STORAGE_KEY = "theme";

export function isTheme(value: unknown): value is Theme {
    return value === "light" || value === "dark" || value === "system";
}

/** The stored choice, or "system" when nothing (or nothing valid) is stored or storage is blocked. */
export function readTheme(): Theme {
    try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        return stored === "light" || stored === "dark" ? stored : "system";
    } catch {
        return "system";
    }
}

export function writeTheme(theme: Theme): void {
    try {
        if (theme === "system") localStorage.removeItem(THEME_STORAGE_KEY);
        else localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
        // Storage can be blocked; the choice still applies to this page.
    }
}

/**
 * The theme the page is showing. The data-theme attribute is the source of
 * truth while the page is open; storage only carries the choice to later visits.
 */
export function currentTheme(root: HTMLElement): Theme {
    const theme = root.dataset.theme;
    return theme === "light" || theme === "dark" ? theme : "system";
}

/** "system" removes the override so CSS falls back to prefers-color-scheme. */
export function applyTheme(root: HTMLElement, theme: Theme): void {
    if (theme === "system") delete root.dataset.theme;
    else root.dataset.theme = theme;
}
