import { describe, expect, it } from "vitest";
import { isActive, menuItems } from "./menu";

function activeLabels(currentPath: string) {
    return menuItems
        .filter((item) => isActive(item.path, currentPath))
        .map((item) => item.label);
}

describe("NavBar active link", () => {
    it.each([
        ["/", "Home"],
        ["/about", "About me"],
        ["/about/", "About me"],
        ["/portfolio", "Portfolio"],
        ["/portfolio/", "Portfolio"],
        ["/portfolio/empire-cbs/", "Portfolio"],
        ["/blog", "Blog"],
        ["/blog/", "Blog"],
        ["/blog/reviewing-tailscale-at-home", "Blog"],
        ["/blog/reviewing-tailscale-at-home/", "Blog"],
    ])("selects only the right link at %s", (currentPath, label) => {
        expect(activeLabels(currentPath)).toEqual([label]);
    });

    it("does not mark Blog active for a similarly named route", () => {
        expect(activeLabels("/blogger")).toEqual([]);
    });

    it("links Blog to its trailing-slash index", () => {
        expect(menuItems.find((item) => item.label === "Blog")?.path).toBe(
            "/blog/",
        );
    });
});
