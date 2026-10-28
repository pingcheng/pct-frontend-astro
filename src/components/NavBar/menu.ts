export const menuItems = [
    { label: "Home", path: "/" },
    { label: "Portfolio", path: "/portfolio" },
    { label: "Blog", path: "/blog/" },
    { label: "About me", path: "/about" },
];

/** Section links stay active on their nested pages; Home only matches "/". */
export function isActive(itemPath: string, currentPath: string): boolean {
    const normalized = currentPath.replace(/\/+$/, "") || "/";
    const item = itemPath.replace(/\/+$/, "") || "/";
    return item !== "/"
        ? normalized === item || normalized.startsWith(`${item}/`)
        : normalized === item;
}
