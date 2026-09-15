// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// TODO: replace with the real domain. Sitemap, RSS, canonical URLs, the contact
// form's sender address and its origin check all read from this.
const SITE = 'https://TODO-DOMAIN.com';

export default defineConfig({
  site: SITE,
  output: 'static',
  adapter: vercel(),
  integrations: [
    mdx(),
    sitemap({
      // The styleguide is a dev tool and the form result pages are noindex.
      filter: (page) => {
        const path = new URL(page).pathname;
        return !path.startsWith('/styleguide') && !path.startsWith('/contact/');
      },
    }),
  ],
  security: {
    // Without this, Astro ignores the Host / X-Forwarded-Host headers and treats
    // every on-demand request as coming from localhost, so its built-in CSRF
    // origin check rejects every real browser POST to /api/contact with a 403.
    // *.vercel.app keeps the form working on preview deployments.
    allowedDomains: [
      { protocol: 'https', hostname: new URL(SITE).hostname },
      { protocol: 'https', hostname: '**.vercel.app' },
    ],
  },
  env: {
    // Secrets are 'secret' + 'server': Astro refuses to import them into client
    // code, and reads them from the runtime environment on Vercel. All optional
    // so the static build succeeds without them; /api/contact fails closed.
    schema: {
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      TURNSTILE_SECRET_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      CONTACT_TO_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
      PUBLIC_TURNSTILE_SITE_KEY: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      // astro/zod re-exports a bare `zod` import. Left external, Vercel's file
      // tracer resolves it from the project root, where @astrojs/sitemap and
      // @astrojs/rss hoist Zod 4 — while Astro, its types and the client bundle
      // use Zod 3. Bundling it keeps /api/contact on the same Zod as the browser.
      noExternal: ['zod'],
    },
  },
});
