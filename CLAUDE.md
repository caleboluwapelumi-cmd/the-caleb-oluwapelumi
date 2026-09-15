# CLAUDE.md

Personal brand site for **Caleb Oluwapelumi** — Marketing & Sales Strategist (Nigeria).
Read `BUILD-PLAN.md` for the full spec, design tokens, content schemas, and ordered build steps. Work one numbered step at a time; do not run ahead.

## Stack

Astro 5 (prerendered) · Tailwind 4 · TypeScript strict · Markdown content in-repo · Vercel

Before writing framework-specific code, check the real installed versions in `package.json`. If they differ from what's assumed here, follow the installed version and say so.

## Commands

```bash
npm run dev          # do NOT run this — it blocks. Use build to verify.
npm run build        # the verification command. Must pass with zero errors.
npm run preview      # production preview, for Lighthouse checks
npx astro check      # TypeScript + Astro diagnostics. Must be clean.
```

Verify work with `npm run build && npx astro check`, never by starting the dev server.

## Non-negotiables

**Secrets.** Any env var prefixed `PUBLIC_` is inlined into the browser bundle. `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, and `CONTACT_TO_EMAIL` must never carry that prefix. Only `PUBLIC_TURNSTILE_SITE_KEY` is public. Never write real secret values into any tracked file — update `.env.example` with empty keys instead.

**The accent colour rule.** `--color-accent` (`#FF4A1C`) is 3.22:1 on the paper background (measured; the plan's 3.36 was wrong): it passes WCAG AA only for large text (≥24px, or ≥18.66px bold) and UI boundaries. Use it for display headings, rules, icon fills, hover states. For anything smaller — inline links, labels, small button text, white-on-accent fills — use `--color-accent-ink` (`#CC370F`, 4.88:1 on paper, 4.51:1 on paper-alt, 5.10:1 white-on-fill). Do not put small text in the bright accent. Inline links in body copy are `--color-ink-body` text with a 2px `--color-accent` underline, not accent-coloured text.

**Tokens only, no raw values.** Every colour, font, duration, and easing comes from the `@theme` block in `src/styles/global.css`. No raw hex in .astro/.ts/.css under src/ outside the @theme block; asset files are exempt. No arbitrary Tailwind values like `text-[#FF4A1C]` or `duration-[437ms]`. If a token is missing, add it to `@theme` and use it.

**Accessibility is part of done, not a later pass.** Semantic HTML first. Every image needs meaningful `alt` (empty `alt=""` only for genuinely decorative images). Visible `:focus-visible` on everything interactive. Minimum 44×44px hit areas. Never remove focus outlines. Heading levels never skip. One `<h1>` per page.

**Reduced motion.** Every animation and transition respects `prefers-reduced-motion: reduce`. The global reduce block in `global.css` handles CSS; JS animation code must check `matchMedia` and bail.

**Progressive enhancement.** The site must be readable and navigable with JavaScript disabled. Scroll-reveal hidden states are applied by script under a `.reveal-ready` class on `<html>` — never put `opacity: 0` in the stylesheet unscoped, or a JS failure makes the whole site invisible. The contact form keeps a real `action` and `method="POST"` so it degrades to a native submit.

**Never animate above the fold.** Revealing hero content delays Largest Contentful Paint and costs a measurable Core Web Vitals score.

## Stack gotchas — these are the ones that get written wrong

**Tailwind 4 has no config file.** There is no `tailwind.config.js` and no `tailwind.config.ts`. Do not create one. Tailwind is a Vite plugin (`@tailwindcss/vite`) wired in `astro.config.mjs`, and design tokens live in an `@theme { }` block inside `src/styles/global.css`. Content paths are auto-detected.

**Astro 5 content collections.** The schema file is `src/content.config.ts` (project `src/` root), *not* `src/content/config.ts`. Collections use the Content Layer API — `loader: glob({ pattern, base })` — not the removed `type: 'content'`. Read entries with `getCollection()` / `getEntry()`. `Astro.glob()` is deprecated; don't use it.

**Prefer zero JS.** Astro components are server-rendered by default. For interactivity, reach for a plain `<script>` tag in the `.astro` file before considering a framework component. There is no React, Vue, or Svelte in this project and none should be added. Do not add `client:*` directives — there are no framework components to hydrate.

**Images.** Use `<Image />` / `<Picture />` from `astro:assets` for local images so they get optimized and carry intrinsic dimensions (prevents layout shift). Content collection covers are typed with the `image()` helper in the schema. Above-fold images: `loading="eager"` + `fetchpriority="high"`. Everything else: `loading="lazy"`.

**API routes need `export const prerender = false`.** The site is `output: 'static'`, so any endpoint under `src/pages/api/` must opt into on-demand rendering explicitly or it will be built as a static file and return the wrong thing at runtime.

**View transitions reset JS.** Anything that attaches listeners or sets up an IntersectionObserver must re-run on the `astro:page-load` event, or it silently stops working after the first client-side navigation.

**Palette is locked.** `@theme` opens with `--color-*: initial;`, so Tailwind's default colours (`bg-blue-500` etc.) generate no CSS. `white` and `black` are re-declared; `transparent`, `current` and `inherit` are hardcoded utility values in Tailwind 4.3, not theme vars, and work without declaration.

**Windows PowerShell 5.1** — no &&, no POSIX coreutils (rm, cat, touch, mkdir -p). Use PowerShell cmdlets.

## Conventions

- **Components:** PascalCase `.astro` files, grouped under `components/layout|ui|sections|seo`. One component per file. Props typed via an exported `interface Props`.
- **Data:** fixed hand-curated data (services, site config) lives in typed modules under `src/data/`. Growing content (posts, case studies) lives in `src/content/` collections.
- **Content:** kebab-case filenames matching the intended slug. `draft: true` hides an entry in production and shows it in dev.
- **Body copy** caps at `max-width: 68ch`.
- **Comments** explain *why*, not *what*. Skip them when the code is self-evident.
- **Placeholders:** mark unfinished copy as `{/* TODO(copy): ... */}` so it's greppable. Never invent client names, testimonials, metrics, or case study results — leave a visible TODO instead.
- **Commits:** conventional style (`feat:`, `fix:`, `chore:`, `refactor:`). Do not commit unless asked.

## Dependencies

Do not install anything not already in `package.json` without asking first, and state what it costs in bundle size and what platform primitive it replaces. The approved set for the whole build: `@astrojs/vercel`, `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/rss`, `tailwindcss`, `@tailwindcss/vite`, `@fontsource-variable/*`, `zod` (ships with Astro), `resend`, one OG-image library (`satori` + `@resvg/resvg-js`, or `astro-og-canvas`), and as devDependencies `@astrojs/check` and `typescript`.

No UI kits, no animation libraries, no utility grab-bags.

## Known deviations

- **`vite` override pinned to `^6.4.3`** in `package.json` `overrides`, to dedupe against `@tailwindcss/vite`'s Vite 8. REMOVE when Astro's own Vite dependency reaches 8.x.
- **`@astrojs/check` and `typescript` added as devDependencies.** Required by `npx astro check`; dev-only, zero bundle impact.

## Definition of done, per step

1. `npm run build` passes, zero errors, zero warnings you introduced
2. `npx astro check` clean
3. Keyboard-navigable end to end, focus always visible
4. Content readable with JS disabled
5. Nothing animates with reduce-motion on
6. No raw hex values or arbitrary Tailwind values
7. Responsive from 320px to 2560px, no horizontal scroll, nothing clipped at 200% zoom

Report which of these you verified and how. Do not claim a step is done on steps you didn't check.

## Ask before doing

- Adding any dependency
- Changing the rendering mode of any route
- Adding a framework integration
- Writing marketing copy, client names, metrics, or testimonials
- Deviating from `BUILD-PLAN.md` — if the plan looks wrong, say so and why rather than quietly routing around it

## Placeholders to fill

`src/data/site.ts` carries `TODO` values for the domain and WhatsApp number. Leave them as TODOs until supplied; don't guess.
