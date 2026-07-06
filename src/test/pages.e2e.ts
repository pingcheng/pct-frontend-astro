import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve(__dirname, '../../dist');
const configuredGaMeasurementId = process.env.PUBLIC_GA_MEASUREMENT_ID;
const gaTest = configuredGaMeasurementId ? it : it.skip;

function loadHtml(filePath: string) {
    const fullPath = path.join(DIST_DIR, filePath);
    if (!fs.existsSync(fullPath)) {
        throw new Error(`File not found: ${fullPath}. Did you run 'npm run build'?`);
    }
    const html = fs.readFileSync(fullPath, 'utf-8');
    document.documentElement.innerHTML = html;
}

function expectTextContent(text: string) {
    expect(document.documentElement.textContent?.includes(text)).toBe(true);
}

function getMetaContent(selector: string) {
    return document.querySelector(selector)?.getAttribute('content');
}

function getStructuredData() {
    return Array.from(
        document.querySelectorAll('script[type="application/ld+json"]'),
    ).map((script) => JSON.parse(script.textContent ?? 'null'));
}

describe('Static Pages Content', () => {
    it('should render the Home page content correctly', () => {
        loadHtml('index.html');
        expectTextContent('Ping Cheng');
        expectTextContent('Principal Engineer');

        // Check layout presence
        expect(document.querySelector('nav')).toBeDefined();
        expect(document.querySelector('footer')).toBeDefined();
    });

    it('should include homepage SEO metadata and structured data', () => {
        loadHtml('index.html');

        expect(document.title).toBe('Ping Cheng');
        expect(getMetaContent('meta[name="description"]')).toContain(
            'Principal Engineer at REA Group',
        );
        expect(getMetaContent('meta[property="og:type"]')).toBe('profile');
        expect(getMetaContent('meta[property="og:url"]')).toBe(
            'https://www.pingchengtech.com',
        );
        expect(getMetaContent('meta[name="twitter:title"]')).toBe('Ping Cheng');

        // Canonical URL
        const canonical = document.querySelector('link[rel="canonical"]');
        expect(canonical).not.toBeNull();
        expect(canonical?.getAttribute('href')).toBe('https://www.pingchengtech.com');

        // OG image should be an absolute URL
        const ogImage = getMetaContent('meta[property="og:image"]');
        expect(ogImage).toMatch(/^https?:\/\//);

        const structuredData = getStructuredData();
        const personData = structuredData.find((item) => item?.['@type'] === 'Person');
        const websiteData = structuredData.find((item) => item?.['@type'] === 'WebSite');

        expect(personData).toMatchObject({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Ping Cheng',
            jobTitle: 'Principal Engineer',
            url: 'https://www.pingchengtech.com',
        });
        expect(personData.sameAs).toEqual(
            expect.arrayContaining([
                'https://github.com/pingcheng',
                'https://www.linkedin.com/in/ping-cheng-5a47b484',
            ]),
        );

        expect(websiteData).toMatchObject({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Ping Cheng Tech',
            url: 'https://www.pingchengtech.com',
        });
    });

    gaTest('should expose the configured Google Analytics tag globally', () => {
        loadHtml('index.html');

        const measurementId = configuredGaMeasurementId as string;
        const gaLoader = document.querySelector(
            `script[src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"]`,
        );
        const gaConfig = Array.from(document.querySelectorAll('script:not([src])')).find(
            (script) => script.textContent?.includes(measurementId),
        );

        expect(gaLoader).not.toBeNull();
        expect(gaConfig?.textContent).toContain('window.gtag');
        expect(gaConfig?.textContent).toContain(
            `gtag('config', ${JSON.stringify(measurementId)})`,
        );
    });

    it('should render the About page content correctly', () => {
        loadHtml('about/index.html');
        expectTextContent('Ping Cheng');
        expectTextContent('Technical Expertise');
        expectTextContent('Professional Experience');

        expect(document.querySelector('nav')).toBeDefined();

        const activeNav = document.querySelector('nav a[class*="active"]');
        expect(activeNav?.textContent?.trim()).toBe('About me');
    });

    it('should include about page SEO metadata and structured data', () => {
        loadHtml('about/index.html');

        expect(document.title).toBe('About Ping Cheng');
        expect(getMetaContent('meta[property="og:url"]')).toBe(
            'https://www.pingchengtech.com/about',
        );
        expect(getMetaContent('meta[property="og:type"]')).toBe('profile');

        // Canonical URL
        const canonical = document.querySelector('link[rel="canonical"]');
        expect(canonical).not.toBeNull();
        expect(canonical?.getAttribute('href')).toBe('https://www.pingchengtech.com/about');

        const structuredData = getStructuredData();
        const personData = structuredData.find((item) => item?.['@type'] === 'Person');
        const breadcrumbData = structuredData.find(
            (item) => item?.['@type'] === 'BreadcrumbList',
        );
        const serviceData = structuredData.find(
            (item) => item?.['@type'] === 'ProfessionalService',
        );

        expect(personData).toMatchObject({
            '@type': 'Person',
            name: 'Ping Cheng',
            email: 'ping.che@hotmail.com',
        });

        expect(breadcrumbData.itemListElement).toEqual([
            expect.objectContaining({
                position: 1,
                name: 'Home',
                item: 'https://www.pingchengtech.com',
            }),
            expect.objectContaining({
                position: 2,
                name: 'About',
                item: 'https://www.pingchengtech.com/about',
            }),
        ]);

        expect(serviceData).toMatchObject({
            '@type': 'ProfessionalService',
            name: 'Software Development Services',
            areaServed: 'Melbourne, Australia',
            serviceType: 'Software Development',
        });
    });

    it('should render the Portfolio list page correctly', () => {
        loadHtml('portfolio/index.html');

        expectTextContent('Portfolio');

        // Ensure portfolio items are rendered by checking links pointing to portfolio details
        expect(document.querySelectorAll('a[href^="/portfolio/"]').length).toBeGreaterThan(0);

        const activeNav = document.querySelector('nav a[class*="active"]');
        expect(activeNav?.textContent?.trim()).toBe('Portfolio');
    });

    it('should render a typical Portfolio detail page correctly (e.g. empire-cbs)', () => {
        loadHtml('portfolio/empire-cbs/index.html');
        expectTextContent('Empire CBS');
        expect(document.querySelector('h1')?.textContent).toContain('Empire CBS');

        // Ensure specific details from the portfolio item are rendered
        expectTextContent('Backend & DevOps Developer');
        expectTextContent('Private project');

        // Nav should still outline "Portfolio" as active
        const activeNav = document.querySelector('nav a[class*="active"]');
        expect(activeNav?.textContent?.trim()).toBe('Portfolio');

        // External links should have rel="noopener noreferrer"
        const externalLinks = document.querySelectorAll('a[target="_blank"]');
        for (const link of externalLinks) {
            const rel = link.getAttribute('rel');
            expect(rel).toContain('noopener');
            expect(rel).toContain('noreferrer');
        }

        // OG image should be the portfolio cover image, not the default icon
        const ogImage = getMetaContent('meta[property="og:image"]');
        expect(ogImage).toBeDefined();
        expect(ogImage).not.toBe('https://www.pingchengtech.com/apple-icon.png');
    });
});
