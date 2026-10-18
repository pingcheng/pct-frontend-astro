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
  screenshotCaptions?: string[];
  year: string | null;
};
