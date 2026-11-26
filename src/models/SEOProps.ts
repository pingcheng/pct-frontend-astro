export type SEOProps = {
  title: string;
  description?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  ogType?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  /** Keep the page out of search results (adds a robots noindex meta tag). */
  noindex?: boolean;
};
