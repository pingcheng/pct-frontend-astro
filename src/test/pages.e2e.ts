import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve(__dirname, '../../dist');

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

describe('Static Pages Content', () => {
    it('should render the Home page content correctly', () => {
        loadHtml('index.html');
        expectTextContent('Ping Cheng');
        expectTextContent('Principal Engineer');

        // Check layout presence
        expect(document.querySelector('nav')).toBeDefined();
        expect(document.querySelector('footer')).toBeDefined();
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
    });
});
