# Caleb Oluwapelumi — Portfolio Site Build Plan

**Stack:** Astro 5 + Tailwind 4 + TypeScript (strict) · Markdown content in-repo · Vercel
**Scope:** Full site — Home, Services, Pricing, Work, About, Insights, Contact
**Direction:** Light editorial, one bold accent, purposeful motion
**Status:** Plan. No code written yet.

Drop this file in the repo root as `BUILD-PLAN.md` so the coding agent can read it directly. Work one step at a time — each step below is self-contained enough to paste as a prompt.

---

## Read this first: risks, in order of how much they can hurt you

**1. You have no real Work content. This is the biggest risk on the list, and it isn't a code problem.**

A portfolio site whose Work section is four category descriptions is a site that quietly tells every prospect you have no clients. Three real, specific, well-written case studies will out-convert twelve pretty placeholder cards by a wide margin. The build below creates the *system* for case studies; you have to supply the *substance*.

Minimum viable case study, per project: what the business was struggling with, what you actually did, what happened afterward, and one image that isn't a stock photo. If you can't name the client, write it as "a Lagos-based fintech" — anonymised is fine, absent is not. If a project genuinely has no measurable outcome yet, say what changed qualitatively and be honest about the timeline.

**Decide before Step 8:** which three to five projects go in, and can you name the clients.

**2. What you sent is a brief, not copy — and building layouts around sentences that will change is wasted work.**

Four problems worth fixing before a single component gets built:

*Nine co-equal service lines dilute your positioning.* Marketing strategy, sales strategy, brand positioning, paid advertising, web development, video editing, business consultation, digital solutions — a prospect reading that list cannot tell what you are *great* at, only that you are available. For a consultant this directly lowers what you can charge. The fix isn't to drop services, it's to build a hierarchy: one or two headline offers that lead, the rest as supporting capabilities underneath. You already know this — it's brand positioning, which you sell.

*There is no proof anywhere.* No client names, no numbers, no testimonials, no before/after. Every claim on the site is currently an assertion. "I help businesses get seen, get chosen, and grow" is a sentence roughly four thousand other marketing consultants have on their homepage right now.

*"Businesses" is not an audience.* Your SEO section commits to Nigeria; your copy never does. Nigerian SMEs? B2B services? E-commerce? Founder-led companies doing ₦50m–₦500m? The more specific you get, the more the right people feel personally addressed — and the fewer tyre-kickers you talk to.

*The voice goes flat outside the About section.* "Practical solutions for businesses that want to grow" is the most generic sentence in the document. But this —

> Sometimes that means developing a marketing strategy. Sometimes it means positioning a brand. Sometimes it means building a website. Sometimes it means editing the video, running the campaign, or figuring out a better digital solution.
> The common thread is simple: Find the problem. Understand the opportunity. Build the solution.

— is genuinely good. That rhythm and directness should run through the entire site, starting with the hero.

**Step 0 handles this.** Don't skip it.

**3. Light editorial design with no photography looks empty.** This direction leans on whitespace and type, which means the few images present carry real weight. You need, at minimum: one strong portrait of yourself, and a real visual for each case study. Budget for this now, not in week three.

**4. Secrets.** `RESEND_API_KEY` and `TURNSTILE_SECRET_KEY` go in Vercel environment variables and are never prefixed `PUBLIC_`. In Astro, any env var starting with `PUBLIC_` is inlined into the browser bundle — leaking a Resend key that way lets anyone send email as you. `.env` in `.gitignore` from the first commit, and commit a `.env.example` with empty values so the shape is documented.

---

## Decisions, locked

| Decision | Choice | Why |
|---|---|---|
| Framework | Astro 5.18.x, not 6 | Evaluated 2026-09-15: Astro 6 (released March 2026) requires Vite 7 and a first-release (10.0.0) Vercel adapter, and neither is inside the coding agent's trained familiarity — both were shipped after its knowledge cutoff. Content site with a blog. Ships ~0 KB JS by default, best-in-class Core Web Vitals, type-safe content collections. Your own site's speed is a sales asset when you sell web development. Revisit at the next major content refresh, not mid-build. |
| Styling | Tailwind 4 via `@tailwindcss/vite` | No `tailwind.config.js` in v4 — tokens live in CSS via `@theme`. Faster builds, one less config file. |
| Language | TypeScript, `strict` | Catches content-schema drift at build time instead of in production. |
| Rendering | Prerendered, with per-route on-demand for `/api/*` | `output: 'static'` + `export const prerender = false` on the contact endpoint. Pages are files on a CDN; the form hits a real function. |
| Content | Markdown/MDX in `src/content/` | Version controlled, zero cost, no extra service, fits your agentic editing workflow. |
| Host | Vercel + `@astrojs/vercel` | You chose it. Excellent Astro support, preview deploys per branch. |
| Email | Resend | Clean API, generous free tier, good deliverability. Requires domain verification — see Step 10. |
| Bot protection | Cloudflare Turnstile + honeypot | Free, privacy-respecting, no "select all the traffic lights." |
| Motion | CSS transitions + IntersectionObserver + Astro `<ClientRouter />` | Under ~2 KB of JS total. IntersectionObserver is universally supported; CSS scroll-driven animations are still uneven across browsers, so they're a progressive enhancement only. |
| Fonts | Self-hosted via `@fontsource-variable` | Avoids the render-blocking round trip to Google's CDN, and keeps you clear of the GDPR complaints Google Fonts attracts in the EU. |

**Not doing in v1, deliberately:** a CMS admin UI, per-service landing pages, dark mode, i18n, analytics beyond one lightweight script. All revisited in the Phase 2 backlog.

---

## Design tokens

Put these in `src/styles/global.css` under `@theme`. Changing the brand is then a two-line edit.

```css
@import "tailwindcss";

@theme {
  /* Base — warm off-white, not pure white. Pure white on a bright phone
     screen in daylight is fatiguing and reads cheap. */
  --color-paper:      #FBFAF7;
  --color-paper-alt:  #F3F1EC;  /* alternating section bands */

  /* Ink */
  --color-ink:        #12100E;  /* headings, dark sections */
  --color-ink-body:   #3A3733;  /* body copy — 9.2:1 on paper */
  --color-ink-muted:  #6B6660;  /* captions, meta — 4.9:1 on paper */
  --color-rule:       #E2DED6;  /* hairlines, borders */

  /* Accent — two stops, and the distinction matters.
     Verified on-build via the styleguide; figures below are measured,
     not asserted. See "Accent rule" note for the full table. */
  --color-accent:     #FF4A1C;  /* 3.22:1 on paper. GRAPHICS AND LARGE
                                   DISPLAY TEXT ONLY. Never small text. */
  --color-accent-ink: #CC370F;  /* 4.88:1 on paper, 4.51:1 on paper-alt,
                                   4.62:1 on accent-wash. Small text, UI
                                   labels, button fills with white labels
                                   (white-on-fill: 5.10:1). NOT for inline
                                   links in body copy — see link rule. */
  --color-accent-wash:#FFF1EC;  /* tinted panels */

  /* Type */
  --font-display: "Fraunces Variable", Georgia, serif;
  --font-body:    "Inter Variable", system-ui, -apple-system, sans-serif;

  /* Motion */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-fast: 180ms;
  --dur-base: 420ms;
  --dur-slow: 800ms;
}
```

**The accent rule, because it's the thing most likely to get broken:** `--color-accent` at `#FF4A1C` measures 3.22:1 against paper. That passes WCAG AA for large text (18.66px bold / 24px regular) and for UI component boundaries, and fails for body text. So the bright orange is for display headlines, rules, icon fills, and hover states — never small text. Anything small and orange — labels, button text on a light background — uses `--color-accent-ink` at `#CC370F`, which measures 4.88:1 on paper, 4.51:1 on the paper-alt section band, and 4.62:1 on the accent-wash tinted panel. Primary buttons are an `--color-accent-ink` fill with white text (5.10:1, passes comfortably). On dark ink sections the bright accent is fine at any size.

**Inline links are the one exception, and it's deliberate, not an oversight:** even at 4.51:1, accent-ink sits close enough to the 4.5:1 AA floor on the paper-alt band that body-copy links shouldn't live there. Links in prose use `--color-ink-body` text with a 2px `--color-accent` underline (`text-decoration-color` + `text-underline-offset`), deepening to `--color-accent-ink` on hover. That keeps every prose link at the ink-body contrast ratio (11.34:1+) regardless of which section band it sits on, while still reading as a link via the accent underline.

*(Earlier drafts of this plan stated `#D93A10` / 4.6:1 for accent-ink and 3.36:1 for accent. Those were computed against pure white rather than the warm paper background actually specified above, and were wrong. The figures here are measured against the real tokens.)*

If orange ends up feeling too loud once you see it at full-page scale, the conservative swap is a deep cobalt (`#1B4DFF` bright / `#1438C2` ink). One-line change. But orange is the more distinctive choice in a category where every consultant site is blue, and "get seen" is literally your pitch.

**Type scale** — fluid, using `clamp()` so it responds without breakpoint jumps:

```css
--text-display: clamp(2.75rem, 1.6rem + 5.2vw, 6rem);   /* hero */
--text-h1:      clamp(2.25rem, 1.5rem + 3.2vw, 4rem);
--text-h2:      clamp(1.75rem, 1.3rem + 1.9vw, 2.75rem);
--text-h3:      clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem);
--text-body:    clamp(1rem, 0.97rem + 0.16vw, 1.125rem);
--text-small:   0.9375rem;
```

Body copy caps at `max-width: 68ch`. Longer measures than that measurably slow reading.

---

## Architecture

```
caleb-site/
├── astro.config.mjs
├── tsconfig.json                 # extends astro/tsconfigs/strict
├── .env.example
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── images/                   # raw source images
├── src/
│   ├── content.config.ts         # collection schemas (Astro 5 Content Layer)
│   ├── content/
│   │   ├── work/                 # case studies (.md)
│   │   └── insights/             # blog posts (.md)
│   ├── data/
│   │   ├── services.ts           # typed service data, single source of truth
│   │   ├── pricing.ts            # typed packages, single USD placeholder amounts
│   │   └── site.ts               # name, socials, WhatsApp number, base URL
│   ├── components/
│   │   ├── layout/  Header.astro Footer.astro MobileNav.astro
│   │   ├── ui/      Button.astro Tag.astro Rule.astro Reveal.astro
│   │   ├── sections/ Hero.astro ServicesGrid.astro ProcessSteps.astro
│   │   │              WorkPreview.astro InsightsPreview.astro CtaBand.astro
│   │   └── seo/     Seo.astro
│   ├── layouts/
│   │   ├── Base.astro            # <html>, head, Header, Footer, ClientRouter
│   │   ├── Page.astro            # standard content page
│   │   ├── WorkEntry.astro
│   │   └── InsightEntry.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── services.astro
│   │   ├── pricing.astro         # packages, single USD reference figure
│   │   ├── contact.astro         # Cal.com booking embed + form
│   │   ├── work/        index.astro  [...slug].astro
│   │   ├── insights/    index.astro  [...slug].astro
│   │   ├── api/         contact.ts   # prerender = false
│   │   ├── og/          [...route].png.ts
│   │   ├── rss.xml.ts
│   │   └── 404.astro
│   ├── lib/
│   │   ├── schema.ts             # zod schema for the contact form
│   │   ├── reveal.ts             # IntersectionObserver, ~40 lines
│   │   └── jsonld.ts             # Person + ProfessionalService structured data
│   └── styles/global.css
```

**Why `src/data/services.ts` is a TypeScript file and not content collections:** services are a fixed, small, hand-curated set that appears in three places (homepage grid, services page, footer). A typed array gives you autocomplete and a compile error the moment the shape drifts. Content collections are for things that grow over time — posts and case studies.

---

## Content model

`src/content.config.ts`:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    client: z.string().optional(),          // omit when under NDA
    clientDescriptor: z.string().optional(), // "a Lagos-based fintech"
    summary: z.string().max(180),            // card + meta description
    category: z.enum(['web', 'marketing', 'creative', 'solutions']),
    services: z.array(z.string()),           // chips on the case study page
    cover: image(),                          // required — no coverless cards
    coverAlt: z.string(),
    gallery: z.array(z.object({
      src: image(), alt: z.string(), caption: z.string().optional(),
    })).default([]),
    year: z.number().int().min(2015),
    liveUrl: z.string().url().optional(),
    outcomes: z.array(z.object({
      label: z.string(),                     // "Qualified leads / month"
      value: z.string(),                     // "3 → 27"
    })).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(999),
    draft: z.boolean().default(false),
  }),
});

const insights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insights' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().max(160),         // becomes the meta description
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.enum([
      'marketing','sales','positioning','growth',
      'digital','content','technology','execution',
    ])).min(1),
    cover: image().optional(),
    coverAlt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { work, insights };
```

Three things this buys you. `image()` runs covers through Astro's optimizer and gives you width and height at build time, which kills layout shift. `coverAlt` being required means you cannot ship an inaccessible image by forgetting. And `tags` as an enum means a typo is a build failure, not a silently orphaned tag page.

`draft: true` entries are filtered out in production and shown in dev — so you can write in the open repo without publishing.

---

# Build steps

## Phase 0 — Content

### Step 0 · Rework the copy

**Do this before any code.** Deliverable: a `copy.md` in the repo with final, section-by-section text for all six pages.

The rewrite has four jobs: pick a positioning hierarchy (which one or two offers lead, which support), commit to a specific audience in the copy and not just the meta tags, carry the About section's voice into the hero and every section head, and mark every place a piece of proof should sit — even if the proof is `[TODO: metric]` for now. Placeholders you can see are better than gaps you can't.

Also nail down the one sentence under your name in the hero. Everything else is downstream of it.

*I can run this rewrite with you as the next thing we do.*

---

## Phase 1 — Foundation

### Step 1 · Scaffold

```bash
npm create astro@latest caleb-site -- --template minimal --typescript strict --git
cd caleb-site
npx astro add vercel mdx sitemap
npm i tailwindcss @tailwindcss/vite
npm i @fontsource-variable/fraunces @fontsource-variable/inter
```

Wire Tailwind through the Vite plugin in `astro.config.mjs` (v4 has no Astro integration — it's a Vite plugin now). Set `site: 'https://calebeoluwapelumi.com'` — the sitemap, RSS feed, and canonical URLs all read from it, and they silently generate wrong output if it's missing. Confirm `tsconfig.json` extends `astro/tsconfigs/strict`.

Add `.env` to `.gitignore` and commit `.env.example` containing `RESEND_API_KEY=`, `PUBLIC_TURNSTILE_SITE_KEY=`, `TURNSTILE_SECRET_KEY=`, `CONTACT_TO_EMAIL=`.

**Verify:** `npm run dev` serves a blank page; `npm run build` succeeds.

### Step 2 · Design system

Write `src/styles/global.css` with the `@theme` block above, plus: a CSS reset layer, `font-face` imports from Fontsource, base element styles (body uses `--font-body` / `--color-ink-body` / `--color-paper`, headings use `--font-display`), a `.prose` style block for markdown content, a visible `:focus-visible` ring using `--color-accent-ink` at 2px offset, and a global `@media (prefers-reduced-motion: reduce)` block that collapses all transitions and animations to `0.01ms`.

Then build `src/components/ui/`:

- **`Button.astro`** — variants `primary` (accent-ink fill, white label), `secondary` (ink outline), `ghost` (underline only). Renders `<a>` when given `href`, `<button>` otherwise. Min 44×44px hit area. Never lose the focus ring.
- **`Tag.astro`** — small pill for categories and post tags.
- **`Rule.astro`** — the editorial hairline, with an optional accent segment.
- **`Reveal.astro`** — wrapper that applies the scroll-reveal class.

**Verify:** a throwaway `/styleguide` page rendering every token and component variant. Keep it; it's how you catch drift later. Exclude it from the sitemap.

### Step 3 · Layout shell

`Base.astro`: full document, `lang="en"`, viewport meta, `<Seo />` in head, skip-to-content link as the first focusable element, `<Header />`, `<main id="main">`, `<Footer />`, `<ClientRouter />` for view transitions.

`Header.astro`: logo/wordmark left, nav right (Work, Services, Pricing, About, Insights), a `primary` "Let's Talk" button. Shrinks and gains a hairline border on scroll — use IntersectionObserver on a sentinel element rather than a scroll listener, it's cheaper and doesn't need throttling. Current page gets `aria-current="page"`.

`MobileNav.astro`: full-screen overlay under 768px. Must trap focus while open, close on Escape, restore focus to the trigger on close, and set `aria-expanded` on the button. Lock body scroll while open. **This is the single most commonly botched component on portfolio sites** — if the hamburger isn't keyboard-operable the site fails accessibility outright, and it's invisible in manual testing unless you go looking.

`Footer.astro`: three columns (services links, site nav, contact), email, LinkedIn, WhatsApp, copyright.

**Verify:** tab through the whole shell using only the keyboard, on both desktop and mobile widths. Every interactive element reachable, focus always visible, mobile nav fully operable, Escape closes it.

### Step 4 · SEO and metadata

`Seo.astro` takes `title`, `description`, `image`, `type`, `noindex`, and emits: title, meta description, canonical (built from `Astro.site` + `Astro.url.pathname`), Open Graph tags, Twitter card, and JSON-LD.

`src/lib/jsonld.ts` exports a `Person` schema (name, jobTitle "Marketing & Sales Strategist", email, sameAs LinkedIn, address with `addressCountry: 'NG'`) and a `ProfessionalService` schema with `areaServed` and the service list. For posts, add `BlogPosting`; for case studies, `CreativeWork`.

Page titles come from the SEO section of your brief — those are already well-formed, use them verbatim.

`public/robots.txt` allows everything and points at `/sitemap-index.xml`.

**Verify:** build, then check `dist/` for correct canonicals. Run the generated JSON-LD through Google's Rich Results Test.

### Step 5 · Motion layer

`src/lib/reveal.ts` — roughly forty lines. One IntersectionObserver with `rootMargin: '0px 0px -12% 0px'`, `threshold: 0.1`. On intersect, add `.is-revealed` and `unobserve` the element. Bail out entirely if `prefers-reduced-motion: reduce` matches, or if `IntersectionObserver` is undefined.

Three critical details:

1. The initial hidden state (`opacity: 0`) must be applied **by the script**, not in the stylesheet. If it's in CSS and JS fails to run, your entire site is invisible. Script adds `.reveal-ready` to `<html>`, and the hidden styles are scoped under `.reveal-ready`.
2. Re-run the observer setup on `astro:page-load`, or reveals break after the first view transition.
3. Never apply reveal to content above the fold — animating the hero in delays Largest Contentful Paint and costs you a real Core Web Vitals number.

Motion vocabulary: sections fade up 24px over `--dur-base` with `--ease-out-expo`; grid children stagger 60ms; hover states transition over `--dur-fast`; view transitions cross-fade at 200ms.

**Verify:** disable JavaScript — all content still visible and readable. Set OS reduce-motion — nothing animates. Navigate between pages twice — reveals still fire on the second visit.

---

## Phase 2 — Pages

### Step 6 · Homepage

Sections in order: Hero (name, positioning line, sub-paragraph, primary + secondary CTA), a proof band (client logos or a one-line credibility statement — **do not skip; this is the highest-leverage 60px on the site**), What I Do (service grid from `services.ts`, hierarchy per Step 0), Why Caleb, Featured Work (three case studies, `featured: true`, sorted by `order`), How I Work (the four numbered steps), Insights preview (three latest), final CTA band.

Hero image and any above-fold image: `loading="eager"`, `fetchpriority="high"`, explicit dimensions. Everything below: `loading="lazy"`.

**Verify:** Lighthouse on a production build — LCP under 2.0s, CLS under 0.05, zero accessibility violations.

### Step 6.5 · About page

`/about` — the one page where the brief's voice already works, so it sets the register for everything else. It is in the header and footer nav from Step 5 onward; until this step ships, that link 404s.

Structure, following the About section of the original brief:

1. **Opening** — "I'm Caleb Oluwapelumi", the role line, and who he actually works with. This is the place to commit to the specific audience Step 0 picked, not "businesses".
2. **The range paragraph** — the "sometimes that means…" rhythm: strategy, positioning, a website, an edit, a campaign, a digital solution. It earns the breadth that a flat service list only asserts.
3. **The through-line** — *Find the problem. Understand the opportunity. Build the solution.* Three beats, set as display type, not a bullet list. This is the strongest sentence in the source document; give it the whole width of the page.
4. **How that plays out** — a short "how I work" restatement pointing at `/work` and `/services`, so the page routes rather than dead-ends.
5. **CTA band** — the shared `CtaBand`, same as every other page.

**Portrait:** this page carries the one real photograph the design direction depends on (see the design-risk note in Phase 0). Until it exists, leave the figure out entirely rather than shipping a grey placeholder box — a missing image reads as unfinished, an empty box reads as broken.

**Copy is `TODO(copy)` until the brief text is transferred verbatim.** Do not paraphrase the About section into new marketing copy; the point of this step is that the existing voice survives.

**Verify:** one `<h1>`, heading levels unbroken, the through-line readable with JS off, nav shows About as `aria-current="page"`.

### Step 7 · Services page

One page, deep sections, anchor links from the homepage grid and footer, with a sticky in-page table of contents on desktop. Each service: what it is, who it's for, what you actually deliver, and a CTA.

**Service hierarchy — fixed, do not re-derive.** Leads: Video Editing, Web Development, Paid Advertising. Brand Positioning: supporting/build-up. All others: supporting capabilities, no tier. This order lives in `src/data/services.ts` and propagates from there to the homepage grid, this page and its table of contents, the footer service column, and the `ProfessionalService` offer catalogue — change it in one place only.

**SEO note worth understanding:** the keyword list (`site.seoKeywords`, published as `knowsAbout` on the `ProfessionalService` node) is skill-and-intent based with no country qualifier — "freelance web developer", "video editor for brands", "paid ads specialist", "lead generation campaigns" and the rest. It still spans ten distinct search intents: a searcher looking for a video editor and one looking for an ads specialist have different problems. A single services page cannot rank well for all of them. Individual `/services/[slug]` pages, each targeting one keyword cluster with its own copy and its own case study, is the play that actually wins that traffic. It's in the Phase 3 backlog rather than v1 because it needs six to eight pages of real copy, not because it's technically hard.

### Step 7.5 · Pricing page

`/pricing` — packages for the three productisable services: **web development**, **video editing**, and **paid ads**. Package data lives in `src/data/pricing.ts` (typed, like `services.ts`): name, who it's for, what's included, turnaround, and a single `usd` amount. Every figure starts as a visible `TODO(copy)` — no invented prices.

Each service gets a small set of tiers as cards (name, price, inclusions list, a CTA into `/contact` with the service preselected via query string). Mark prices "from" where scope varies, and say so plainly.

**A "Not sure what you need?" card** closes the grid, routing to the booking embed on `/contact` (`/contact#book`). Consultation-led offers (strategy, positioning) don't get a price card — they route here.

**Currency: one USD reference figure, not a per-market table.** Superseded 2026-09-16 — the earlier NGN + GBP pairing and its ₦/£ `localStorage` toggle are removed. The work is remote and quoted per project, so two market prices implied a precision the quote doesn't have, and the toggle was JS plus persisted state for a decision nobody needed to make. One `usd` figure per tier, formatted with `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })` at build time, rendered as "From $X" where scope varies and "$X" where it doesn't. **Every figure is an explicit placeholder, not a conversion** — a standing note under the pricing intro says so in plain words: "Figures are placeholders — final quote is scoped to your project and currency." The budget brackets on `/contact` use the same USD scale.

**Verify:** prices readable with JS off — the page now ships no JS at all; cards stack cleanly at 320px.

### Step 8 · Work

`/work` — filterable grid, filters driven by the `category` enum. **Filter with CSS, not by re-rendering:** put `data-category` on each card and toggle a class on the container. Zero framework, zero layout thrash, works instantly. Update `aria-live` on the results count so screen reader users know the filter applied. Reflect the active filter in the URL query string so a filtered view is shareable.

`/work/[...slug]` — hero with title, client, year, services; the outcomes row (skip the block entirely when `outcomes` is empty rather than rendering an empty shell); markdown body; gallery; prev/next; CTA.

Write three to five real case studies. This is the step that decides whether the site works.

**Verify:** filters correct with JS on; with JS off, all cards visible and the filter UI hidden.

### Step 9 · Insights

`/insights` — reverse-chronological list, tag filter, reading time computed from word count at build. `/insights/[...slug]` — prose layout at 68ch, proper heading hierarchy, `<time datetime>`, tags, prev/next, CTA.

`rss.xml.ts` via `@astrojs/rss`. Draft posts excluded in production, visible in dev. Seed with two or three real posts — an empty blog is worse than no blog.

### Step 10 · Contact and form

**The security-sensitive step. Read it carefully.**

`/contact` renders, in order: a **"Book a Strategy Session"** Cal.com embed, then the form, WhatsApp button (`https://wa.me/234XXXXXXXXXX?text=` with a prefilled opener), and direct email link.

**Booking embed (above the form, `id="book"`):** Cal.com free tier — no backend, no API key, nothing to add to `.env`. Lazy-load it: render a static panel with a real link to the Cal.com booking page, and only inject Cal's embed script when the panel nears the viewport (IntersectionObserver) or the visitor clicks "Show calendar". That keeps a third-party script off the initial load and out of LCP. With JS off, the link still books. Give the iframe a `title`, re-run the loader on `astro:page-load`, and add the Cal.com username to `src/data/site.ts` as a TODO until supplied. If a CSP is added later, allow `app.cal.com`.

Form fields: name, email, business name, "what do you need" (select, mirroring your service lines), budget range (select — this is what turns an enquiry into a qualified lead), message, plus a Turnstile widget and a honeypot input hidden with CSS and `tabindex="-1"` `autocomplete="off"`.

`src/lib/schema.ts` — one zod schema, imported by both the client (for inline validation) and `/api/contact.ts` (for the real validation). Same schema, one source of truth, no drift.

`src/pages/api/contact.ts` with `export const prerender = false`:

1. Reject non-POST with 405.
2. Parse the body, validate with zod. On failure return 400 with field-level errors — never echo raw input back.
3. If the honeypot is non-empty, return 200 with a fake success. Silent rejection; bots don't learn.
4. Verify the Turnstile token server-side against `https://challenges.cloudflare.com/turnstile/v0/siteverify` using `TURNSTILE_SECRET_KEY`. Fail → 400.
5. Send via Resend. `from` must be an address on your verified domain (`hello@yourdomain.com`), **never** the submitter's address — sending as an unverified sender is how you get your domain flagged for spoofing. Put the submitter in `reply_to` so hitting reply in your inbox goes to them.
6. Escape all user input before it goes into the HTML email body. A form submission is untrusted input and your email client renders HTML.
7. Return 200 on success. Log failures server-side without logging the message content.

**Rate limiting:** in-memory counters do not work on Vercel — each invocation may be a fresh instance, so the counter resets constantly and provides no real protection. For your traffic, Turnstile plus honeypot is genuinely sufficient. If you start seeing abuse, add Upstash Redis (free tier, ~20 lines) for a proper IP-keyed limit. Noted as a deliberate call, not an oversight.

**Client side:** submit via `fetch`, but keep a real `action` and `method="POST"` on the `<form>` so it degrades to a native submit without JS. Disable the button and show a pending state during flight. On success replace the form with a confirmation that names what happens next and by when. On failure show a retryable error *and* the direct email address — never leave someone with a dead end.

**Verify:** submit valid and invalid payloads; confirm email arrives with working reply-to; confirm a request with a missing or forged Turnstile token is rejected; confirm the honeypot path returns 200 and sends nothing; grep the built client bundle for your Resend key and confirm it is absent.

### Step 11 · OG images and 404

`/og/[...route].png.ts` generating per-page Open Graph images at build time — name, page title, accent rule, on the ink background. Use `satori` + `@resvg/resvg-js`, or `astro-og-canvas` for the shorter path. Worth the hour: it's what your links look like every time anyone shares them.

`404.astro` in the site's voice, with links to Work, Services, and Contact.

### Step 12 · Ship

Deploy to Vercel, connect the repo, add all four environment variables in the dashboard (Production and Preview). Point the domain; Vercel handles SSL. Verify the sending domain in Resend — SPF and DKIM DNS records — **and wait for them to propagate before announcing the site**, or your first real enquiry lands in spam.

Add Vercel Analytics or Plausible. Submit the sitemap to Google Search Console. The keyword list is deliberately country-agnostic and `areaServed` is worldwide, so a Google Business Profile is optional rather than implied — set one up only if local Lagos search turns out to be a channel worth having.

**Final verification pass:**

- Lighthouse ≥ 95 across all four categories, on mobile throttling, production build
- Real device test — Android mid-range on 3G, not just Chrome DevTools
- Every page keyboard-navigable end to end
- Screen reader pass on the homepage and the mobile nav
- Form tested from a phone on mobile data
- All links resolve, no console errors
- Share a link on WhatsApp and LinkedIn, confirm the OG image renders
- Zoom to 200% — nothing clipped, nothing horizontally scrolling

---

## Phase 3 backlog

Per-service landing pages for the ten keyword clusters (highest ROI item here by a distance). Testimonials, once you have them. Case study metrics filled in as results come through. Lead magnet plus email capture. Dark mode. A git-based CMS at `/admin` if you want to publish from your phone. (Booking calendar moved into v1 — see Step 10.)

---

## What I need from you to keep moving

1. **Green light on the copy rework** — it's Step 0 and everything else waits on it.
2. **Your positioning call**: which one or two services lead, and who specifically you serve.
3. **The three to five projects** for Work, and whether clients can be named.
4. **Domain name**, if you have it.
5. **WhatsApp number** in international format.
6. **Photography** — do you have a usable portrait, or does that need shooting?
