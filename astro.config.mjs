// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.pingchengtech.com',
  output: 'static',
  integrations: [react(), sitemap()],
  // The CSS is small, so inlining it avoids render-blocking requests on first paint.
  build: {
    inlineStylesheets: 'always',
  },
  redirects: {
    '/sitemap.xml': '/sitemap-index.xml',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
