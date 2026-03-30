import type { Portfolio } from "./Portfolio";

describe("test Portfolio model", () => {
  const mockPortfolio: Portfolio = {
    slug: "test-portfolio",
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

  it("should have correct slug", () => {
    expect(mockPortfolio.slug).toBe("test-portfolio");
  });

  it("should have all required fields", () => {
    expect(mockPortfolio.name).toBe("Test Portfolio");
    expect(mockPortfolio.coverImage).toBe("/images/test-cover.jpg");
    expect(mockPortfolio.url).toBe("https://example.com");
    expect(mockPortfolio.shortDescription).toBe("This is a short description");
    expect(mockPortfolio.workplace).toBe("Test Company");
    expect(mockPortfolio.projectRole).toBe("Developer");
    expect(mockPortfolio.roleDescription).toHaveLength(3);
    expect(mockPortfolio.members).toHaveLength(2);
    expect(mockPortfolio.screenshots).toHaveLength(2);
  });

  it("should detect screenshots via length", () => {
    expect(mockPortfolio.screenshots.length > 0).toBe(true);
    const noScreens = { ...mockPortfolio, screenshots: [] };
    expect(noScreens.screenshots.length > 0).toBe(false);
  });
});
