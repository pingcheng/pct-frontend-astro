export type Portfolio = {
  slug: string;
  name: string;
  coverImage: string;
  url: string | null;
  shortDescription: string;
  longDescription: string;
  workplace: string;
  projectRole: string;
  roleDescription: string[];
  members: string[];
  screenshots: string[];
  hasScreenshots: boolean;
  year: string | null;
};

export function createPortfolio(slug: string, props: PortfolioProps): Portfolio {
  const screenshots = props.screenshots ?? [];
  return {
    slug,
    name: props.name ?? "",
    coverImage: props.coverImage ?? "",
    url: props.url ?? null,
    shortDescription: props.shortDescription ?? "",
    longDescription: props.longDescription ?? "",
    workplace: props.workplace ?? "",
    projectRole: props.projectRole ?? "",
    roleDescription: props.roleDescription ?? [],
    members: props.members ?? [],
    screenshots,
    hasScreenshots: screenshots.length > 0,
    year: props.year ?? null,
  };
}

export type PortfolioProps = {
  name: string | null;
  coverImage: string | null;
  url: string | null;

  shortDescription: string | null;
  longDescription: string | null;

  workplace: string | null;
  projectRole: string | null;
  roleDescription: string[] | null;

  members: string[] | null;
  screenshots: string[] | null;
  year: string | null;
};
