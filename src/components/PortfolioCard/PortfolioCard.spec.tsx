import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PortfolioCard from "./PortfolioCard";
import type { Portfolio } from "@/models/Portfolio/Portfolio";

// Mock window.matchMedia
beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })),
    });
});

// Mock throttle to pass through immediately
vi.mock("@/utils/throttle", () => ({
    throttle: <T extends (...args: unknown[]) => void>(fn: T) => fn,
}));

// Mock calculateRotation
vi.mock("@/utils/calculateRotation", () => ({
    calculateRotation: () => "rotateX(0deg) rotateY(0deg)",
}));

// Mock CSS modules
vi.mock("./style.module.css", () => ({
    default: {
        perspectiveContainer: "perspectiveContainer",
        portfolioCard: "portfolioCard",
        imageFallback: "imageFallback",
    },
}));

const mockPortfolio: Portfolio = {
    slug: "test-project",
    name: "Test Project",
    coverImage: "https://example.com/cover.png",
    url: "https://example.com",
    shortDescription: "A test project",
    longDescription: "A longer description",
    workplace: "Test Co",
    projectRole: "Developer",
    roleDescription: ["Built things"],
    members: ["Alice"],
    screenshots: [],
    year: "2024",
};

describe("PortfolioCard", () => {
    it("renders the portfolio card with project name", () => {
        render(<PortfolioCard portfolio={mockPortfolio} />);
        expect(screen.getByText("Test Project")).toBeInTheDocument();
    });

    it("renders a hidden img element for image error detection", () => {
        render(<PortfolioCard portfolio={mockPortfolio} />);
        const hiddenImg = document.querySelector(
            'img[src="https://example.com/cover.png"]'
        );
        expect(hiddenImg).toBeInTheDocument();
    });

    it("renders fallback UI when the image fails to load", () => {
        render(<PortfolioCard portfolio={mockPortfolio} />);
        const hiddenImg = document.querySelector(
            'img[src="https://example.com/cover.png"]'
        ) as HTMLImageElement;

        fireEvent.error(hiddenImg);

        expect(
            screen.getByLabelText(
                "Cover image for Test Project project (image unavailable)"
            )
        ).toBeInTheDocument();
    });

    it("shows the year when provided", () => {
        render(<PortfolioCard portfolio={mockPortfolio} />);
        expect(screen.getByText("(2024)")).toBeInTheDocument();
    });

    it("does not show year when null", () => {
        const noYearPortfolio = { ...mockPortfolio, year: null };
        render(<PortfolioCard portfolio={noYearPortfolio} />);
        expect(screen.queryByText(/\(\d{4}\)/)).not.toBeInTheDocument();
    });
});
