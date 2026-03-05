import { createPortfolio, PortfolioProps } from "./Portfolio";

describe("test Portfolio model", () => {
  const mockPortfolioProps: PortfolioProps = {
    name: "Test Portfolio",
    coverImage: "/images/test-cover.jpg",
    url: "https://example.com",
    shortDescription: "This is a short description",
    longDescription:
      "This is a longer description that explains the portfolio in detail",
    workplace: "Test Company",
    projectRole: "Developer",
    roleDescription: [
      "Developed features",
      "Fixed bugs",
      "Deployed to production",
    ],
    members: ["John Doe", "Jane Smith"],
    screenshots: ["/images/screenshot1.jpg", "/images/screenshot2.jpg"],
    year: "2023",
  };

  it("should create a portfolio with provided values", () => {
    const portfolio = createPortfolio("test-portfolio", mockPortfolioProps);

    expect(portfolio.slug).toBe("test-portfolio");
    expect(portfolio.name).toBe("Test Portfolio");
    expect(portfolio.coverImage).toBe("/images/test-cover.jpg");
    expect(portfolio.url).toBe("https://example.com");
    expect(portfolio.shortDescription).toBe("This is a short description");
    expect(portfolio.longDescription).toBe(
      "This is a longer description that explains the portfolio in detail"
    );
    expect(portfolio.workplace).toBe("Test Company");
    expect(portfolio.projectRole).toBe("Developer");
    expect(portfolio.roleDescription).toEqual([
      "Developed features",
      "Fixed bugs",
      "Deployed to production",
    ]);
    expect(portfolio.members).toEqual(["John Doe", "Jane Smith"]);
    expect(portfolio.screenshots).toEqual([
      "/images/screenshot1.jpg",
      "/images/screenshot2.jpg",
    ]);
  });

  it("should handle null values with defaults", () => {
    const nullProps: PortfolioProps = {
      name: null,
      coverImage: null,
      url: null,
      shortDescription: null,
      longDescription: null,
      workplace: null,
      projectRole: null,
      roleDescription: null,
      members: null,
      screenshots: null,
      year: null,
    };

    const portfolio = createPortfolio("empty-portfolio", nullProps);

    expect(portfolio.slug).toBe("empty-portfolio");
    expect(portfolio.name).toBe("");
    expect(portfolio.coverImage).toBe("");
    expect(portfolio.url).toBe(null);
    expect(portfolio.shortDescription).toBe("");
    expect(portfolio.longDescription).toBe("");
    expect(portfolio.workplace).toBe("");
    expect(portfolio.projectRole).toBe("");
    expect(portfolio.roleDescription).toEqual([]);
    expect(portfolio.members).toEqual([]);
    expect(portfolio.screenshots).toEqual([]);
  });

  it("hasScreenshots should return true when screenshots exist", () => {
    const portfolio = createPortfolio("with-screenshots", mockPortfolioProps);
    expect(portfolio.hasScreenshots).toBe(true);
  });

  it("hasScreenshots should return false when no screenshots exist", () => {
    const propsWithoutScreenshots = { ...mockPortfolioProps, screenshots: [] };
    const portfolio = createPortfolio("no-screenshots", propsWithoutScreenshots);
    expect(portfolio.hasScreenshots).toBe(false);
  });
});
