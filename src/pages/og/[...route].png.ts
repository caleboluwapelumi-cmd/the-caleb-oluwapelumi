import fs from 'node:fs';
import path from 'node:path';
import type { APIRoute } from 'astro';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { site } from '../../data/site';
import { token } from '../../lib/theme';
import { OG_HEIGHT, OG_KICKER, OG_WIDTH, routeFor, staticOgPages, type OgPage } from '../../lib/og';
import { getPublishedInsights, getPublishedWork, insightHref, workHref } from '../../lib/collections';

/**
 * Per-page Open Graph images, rendered once at build time. satori turns the
 * element tree into SVG, resvg rasterises it. Colours come from the @theme
 * block via token(), so the cards can't drift from the site's palette.
 */

// satori needs real font binaries, and can't read WOFF2 — see the note in
// src/assets/fonts/README.md.
const fontDir = path.join(process.cwd(), 'src/assets/fonts');
const font = (file: string) => fs.readFileSync(path.join(fontDir, file));

const fonts = [
  { name: 'Fraunces', data: font('fraunces-latin-600-normal.woff'), weight: 600 as const, style: 'normal' as const },
  { name: 'Inter', data: font('inter-latin-400-normal.woff'), weight: 400 as const, style: 'normal' as const },
  { name: 'Inter', data: font('inter-latin-600-normal.woff'), weight: 600 as const, style: 'normal' as const },
];

const ink = token('--color-ink');
const paper = token('--color-paper');
const accent = token('--color-accent');
const muted = token('--color-ink-muted');

// satori accepts React-shaped nodes; these are plain objects, no JSX runtime.
const node = (type: string, style: Record<string, unknown>, children: unknown) => ({
  type,
  props: { style, children },
});

function card({ title }: OgPage) {
  return node(
    'div',
    {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '100%',
      height: '100%',
      padding: 72,
      backgroundColor: ink,
      fontFamily: 'Inter',
    },
    [
      node('div', { display: 'flex', width: 120, height: 10, backgroundColor: accent }, []),
      node(
        'div',
        { display: 'flex', flexDirection: 'column' },
        [
          node(
            'div',
            { fontSize: 28, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: muted },
            OG_KICKER,
          ),
          node(
            'div',
            {
              marginTop: 20,
              fontFamily: 'Fraunces',
              fontWeight: 600,
              fontSize: title.length > 48 ? 64 : 84,
              lineHeight: 1.05,
              color: paper,
            },
            title,
          ),
        ],
      ),
      node(
        'div',
        { display: 'flex', justifyContent: 'flex-end', fontSize: 26, color: muted },
        // The homepage card already leads with the role, so it isn't repeated.
        [node('div', { display: 'flex' }, title === site.role ? '' : site.role)],
      ),
    ],
  );
}

export async function getStaticPaths() {
  const fixed = Object.entries(staticOgPages).map(([pathname, page]) => ({
    params: { route: routeFor(pathname) },
    props: page,
  }));

  const work = (await getPublishedWork()).map((entry) => ({
    params: { route: routeFor(workHref(entry)) },
    props: { title: entry.data.title } satisfies OgPage,
  }));

  const insights = (await getPublishedInsights()).map((entry) => ({
    params: { route: routeFor(insightHref(entry)) },
    props: { title: entry.data.title } satisfies OgPage,
  }));

  return [...fixed, ...work, ...insights];
}

export const GET: APIRoute = async ({ props }) => {
  const svg = await satori(card(props as OgPage), { width: OG_WIDTH, height: OG_HEIGHT, fonts });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: OG_WIDTH } }).render().asPng();
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
};
