import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import NavBar from "./NavBar";

vi.mock("@/data/profile", () => ({
    profile: {
        fullName: "Test User",
    },
}));

afterEach(() => {
    document.body.innerHTML = "";
});

describe("NavBar", () => {
    it("marks the current page as active", () => {
        render(<NavBar currentPath="/about" />);

        const aboutLink = screen.getByRole("link", { name: "About me" });
        const homeLink = screen.getByRole("link", { name: "Home" });

        expect(aboutLink.className).toContain("active");
        expect(homeLink.className).not.toContain("active");
    });

    it("keeps portfolio active for nested portfolio routes", () => {
        render(<NavBar currentPath="/portfolio/empire-cbs/" />);

        const portfolioLinks = screen.getAllByRole("link", { name: "Portfolio" });

        for (const link of portfolioLinks) {
            expect(link.className).toContain("active");
        }
    });

    it("toggles the mobile menu from the menu button", () => {
        render(<NavBar currentPath="/" />);

        const toggleButton = screen.getByRole("button", {
            name: "Open main menu",
        });
        const mobileMenu = document.getElementById("mobile-menu");

        expect(toggleButton).toHaveAttribute("aria-expanded", "false");
        expect(mobileMenu).toHaveAttribute("aria-hidden", "true");

        fireEvent.click(toggleButton);

        expect(toggleButton).toHaveAttribute("aria-expanded", "true");
        expect(toggleButton).toHaveAttribute("aria-label", "Close main menu");
        expect(mobileMenu).toHaveAttribute("aria-hidden", "false");
    });

    it("closes the mobile menu when a menu item is clicked", () => {
        render(<NavBar currentPath="/" />);

        const toggleButton = screen.getByRole("button", {
            name: "Open main menu",
        });
        const mobileMenu = document.getElementById("mobile-menu");

        fireEvent.click(toggleButton);

        const portfolioLink = within(mobileMenu as HTMLElement).getByRole("link", {
            name: "Portfolio",
        });

        portfolioLink.addEventListener("click", (event) => {
            event.preventDefault();
        });

        fireEvent.click(portfolioLink);

        expect(toggleButton).toHaveAttribute("aria-expanded", "false");
        expect(toggleButton).toHaveAttribute("aria-label", "Open main menu");
        expect(mobileMenu).toHaveAttribute(
            "aria-hidden",
            "true",
        );
    });

    it("closes the mobile menu when Escape is pressed", () => {
        render(<NavBar currentPath="/" />);

        const toggleButton = screen.getByRole("button", {
            name: "Open main menu",
        });

        fireEvent.click(toggleButton);
        fireEvent.keyDown(document, { key: "Escape" });

        expect(toggleButton).toHaveAttribute("aria-expanded", "false");
        expect(document.getElementById("mobile-menu")).toHaveAttribute(
            "aria-hidden",
            "true",
        );
    });
});
