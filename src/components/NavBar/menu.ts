export const menuItems = [
    { label: "Home", path: "/" },
    { label: "Portfolio", path: "/portfolio/" },
    { label: "Blog", path: "/blog/" },
    { label: "About me", path: "/about/" },
];

/** Section links stay active on their nested pages; Home only matches "/". */
export function isActive(itemPath: string, currentPath: string): boolean {
    const normalized = currentPath.replace(/\/+$/, "") || "/";
    const item = itemPath.replace(/\/+$/, "") || "/";
    return item !== "/"
        ? normalized === item || normalized.startsWith(`${item}/`)
        : normalized === item;
}

/** Pages that show the large profile photo themselves; elsewhere the nav carries a small one. */
const portraitPages = ["/", "/about"];

export function hasOwnPortrait(currentPath: string): boolean {
    const normalized = currentPath.replace(/\/+$/, "") || "/";
    return portraitPages.includes(normalized);
}
