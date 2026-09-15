// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // TODO: replace with the real domain. Sitemap, RSS and canonical URLs all read from this.
  site: 'https://TODO-DOMAIN.com',
  output: 'static',
  adapter: vercel(),
  integrations: [
    mdx(),
    sitemap({
      // The styleguide is a dev tool, not a public page.
      filter: (page) => !new URL(page).pathname.startsWith('/styleguide'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
