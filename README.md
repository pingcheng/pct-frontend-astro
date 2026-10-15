# pct-frontend-astro

Personal website for Ping Cheng, built with Astro, React, and Tailwind CSS.

## Stack

- Astro
- React
- Tailwind CSS
- Vitest
- ESLint
- Prettier

## Development

Use Node.js `24.19.0`, as pinned in `.nvmrc` and used by CI. If using nvm,
run `nvm install` and `nvm use` before installing dependencies.

```sh
npm install
npm run dev
```

Open `http://localhost:4321`.

## Scripts

- `npm run dev` Start the local dev server
- `npm run build` Build the production site
- `npm run preview` Preview the production build
- `npm run test` Run unit tests
- `npm run test:e2e` Run end-to-end tests
- `npm run test:browser` Build and run desktop/mobile Chromium smoke tests
- `npm run lint` Run ESLint
- `npm run format` Format the codebase

## Cloudflare Pages

The site builds to static HTML in `dist`; no SSR adapter, Functions, Worker,
storage binding or paid plan is needed. The production canonical origin remains
`https://www.pingchengtech.com`, including when viewing a preview deployment.

### Connect Git and configure builds

1. In Cloudflare, open **Workers & Pages → Create application → Pages → Import
   an existing Git repository**. Authorize the Cloudflare Workers and Pages
   GitHub app for `pingcheng/pct-frontend-astro` if necessary.
2. Create a Git-integrated Pages project named `pct-frontend-astro` (or another
   available name). Do not create a Direct Upload project: use Git integration
   for automatic builds and PR previews.
3. Configure the following settings. Enable production deployments and previews
   for non-production branches, including `codex/cloudflare-pages-migration`.

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Root directory | Repository root |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js | `24.19.0`, matching `.nvmrc` |

4. In both production and preview build environments, set `NODE_VERSION` to
   `24.19.0` (update any existing `22.13.1` override) and copy the existing values
   for the variables below from Vercel. Keep their values out of commits,
   screenshots and shared logs.
   These `PUBLIC_` values are intentionally included in the generated browser
   content; they are not credentials. Rebuild after changing a build variable.

| Variable | Purpose |
| --- | --- |
| `PUBLIC_APP_DESCRIPTION` | Default description when a page has no override |
| `PUBLIC_GA_MEASUREMENT_ID` | Optional Google Analytics measurement ID; leave unset to disable GA |

5. Save and deploy. Validate the migration branch preview before merging to
   `main` or changing production DNS. Pushes to `main` then deploy automatically;
   other branches and PRs get preview URLs.

### Validate before cutover

```sh
npm ci
npm run lint
npm run test
npm run test:e2e
npx playwright install chromium
npm run test:browser
```

CI builds with a test GA ID so both its async loader and failure behavior are
covered. To run browser checks against a Pages preview instead of the local
Astro preview server:

```sh
PLAYWRIGHT_BASE_URL=https://YOUR-PREVIEW.pages.dev npx playwright test
```

The checks cover desktop/mobile navigation, React hydration, all portfolio image
decodes, the local Inter font, SEO, unknown routes and analytics failure. When
`PLAYWRIGHT_BASE_URL` is supplied, they also require a native 301 from
`/sitemap.xml` to `/sitemap-index.xml`. Astro preview does not process Pages'
`_redirects`; the retained Astro redirect provides an HTML fallback for other
hosts. A top-level `404.html` prevents Pages from treating unknown routes as SPA
routes that render the homepage.

Check HTTPS and certificate status, `/`, `/about`, `/friends`, `/portfolio`,
every portfolio detail, `/robots.txt`, both sitemap URLs and a missing route on
the real preview. In DevTools, confirm images/fonts come from the preview's own
origin and there are no Google Fonts, S3, GitHub avatar or Vercel telemetry
requests. GA is optional and external; its async loader must not delay rendering
or navigation when unreachable.

Compare repeatable cold-cache and warm-cache page-load measurements with the
existing Vercel deployment, using the same device, location and network. Test
representative mainland China networks when access is available. Self-hosted
assets reduce dependencies but do not establish mainland China performance;
Cloudflare's China Network is a separate Enterprise service. Do not add a font
preload until measurements show it helps.

### Custom domains and DNS cutover

The domain and Cloudflare nameservers are already active. Hosting changes still
require a validated Pages deployment. Keep the Vercel project and domain bindings
available through production verification.

1. Export current DNS records and record any redirect rules. The website records
   observed before this migration are listed in the rollback section below.
2. After validating the migration preview and the `main` deployment, add
   `www.pingchengtech.com` and `pingchengtech.com` under the Pages project's
   **Custom domains**. Associate domains with Pages before pointing their DNS
   at `<project>.pages.dev`; a CNAME alone does not register a Pages domain.
3. Resolve the existing website record conflicts by replacing only the apex
   `A` and `www` `CNAME` with the Pages CNAME targets shown in the dashboard.
   Cloudflare supports CNAME flattening at the apex. Keep mail/MX, TXT,
   verification and unrelated records intact. Wait for both domain statuses and
   HTTPS certificates to become active.
4. Add a Cloudflare Single Redirect matching
   `http.host eq "pingchengtech.com"`, with status **301**, dynamic destination
   `concat("https://www.pingchengtech.com", http.request.uri.path)` and
   **Preserve query string** enabled. The source DNS record must be proxied.
   Enable **Always Use HTTPS** and check for loops with existing rules. Preserve
   the `www` canonical host; do not redirect preview hostnames to production.
5. Verify apex/www, HTTP/HTTPS, paths and query strings, all routes/assets, 404s,
   sitemap redirect and SEO metadata through the production domain. Keep Vercel
   available until these checks and the performance comparison are complete.
6. After production verification, disable redundant Vercel Git deployments.
   The repository now sets `git.deploymentEnabled: false` in `vercel.json`,
   disabling automatic Vercel deployments for all branches while retaining
   the project and existing deployments for rollback. Cloudflare Pages Git
   deployments remain enabled. Check other consumers and access logs before
   retiring external image storage.

### Rollback

For a Pages release problem after a successful cutover, use the Pages dashboard
to roll back to the last verified production deployment. Also revert the source
change on `main` so a future automatic build does not reintroduce it.

To return hosting to Vercel during the migration, confirm the retained Vercel
deployment and both domain bindings are usable, remove the Pages custom-domain
associations, then restore the two website DNS records. Removing an association
may remove its managed DNS record, so restore DNS afterwards.

| Name | Type | Pre-migration target | Proxy / TTL |
| --- | --- | --- | --- |
| `pingchengtech.com` | A | `76.76.21.21` | Proxied / Auto |
| `www.pingchengtech.com` | CNAME | `cname.vercel-dns.com` | Proxied / Auto |

These targets were read on 13 October 2026; confirm the current Vercel dashboard
still specifies them before restoring. Revert redirect/HTTPS rule changes to
the saved configuration, remove any conflicting Pages CNAME first, re-enable
Vercel Git deployments if needed by removing `git.deploymentEnabled: false`
from `vercel.json` (or setting it to `true`), and verify HTTPS and public routes again.
Cloudflare can remain the registrar and DNS provider throughout rollback.

## Self-hosted assets

All portfolio images and the profile avatar are WebP files under `public/images/`.
The migration reduced the 49-image set from approximately 9.34 MB to 6.15 MB,
with a maximum width of 1600 pixels and no enlargement. Screenshot dimensions,
aspect ratios, alt text and lazy loading are preserved. Existing friend avatars
and site icons remain local. Social previews use absolute production URLs.

Inter v4.1 is served from `public/fonts/InterVariable.woff2`, using weights
300–900, `font-display: swap`, and a system fallback. Its SIL Open Font License
and attribution are included in `public/fonts/LICENSE.txt`. Vercel Analytics,
Speed Insights and Google Fonts requests have been removed; optional GA remains.

See [the asset inventory](docs/assets.md) for source URLs, output dimensions,
sizes, font provenance and external-storage retirement guidance. Each image is
under 1 MB, and the complete static output fits comfortably within the documented
[Pages limits](https://developers.cloudflare.com/pages/platform/limits/).

References: [build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/),
[Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/),
[custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/),
[redirects](https://developers.cloudflare.com/pages/configuration/redirects/), and
[serving pages](https://developers.cloudflare.com/pages/configuration/serving-pages/).
