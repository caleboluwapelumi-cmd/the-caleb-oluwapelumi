import { site } from '../data/site';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export interface OgPage {
  title: string;
  /**
   * Content-type label rendered under the title — "Case Study", "Insight".
   * The site-wide kicker replaced the old per-card type label; this puts the
   * label back as a subtitle rather than a second kicker, so the two never
   * compete for the same slot.
   */
  subtitle?: string;
}

/**
 * The eyebrow above the title on every generated card. Caleb asked for one
 * site-wide kicker rather than a per-page section label, so it isn't a prop.
 */
export const OG_KICKER = site.name;

/**
 * Pages that get a generated OG image. Collection entries are added by the
 * route's getStaticPaths; this covers the fixed pages.
 */
export const staticOgPages: Record<string, OgPage> = {
  // The kicker now carries the name, so the homepage card leads with the role.
  '/': { title: site.role },
  '/services': { title: 'What I do' },
  '/pricing': { title: 'Packages and prices' },
  '/about': { title: 'Strategy. Execution. Results.' },
  '/work': { title: 'Selected case studies' },
  '/insights': { title: 'Notes on marketing and growth' },
  '/contact': { title: 'Let’s talk' },
};

const trimSlash = (path: string) => (path.length > 1 ? path.replace(/\/+$/, '') : path);

/** '/' -> 'index', '/work/x' -> 'work/x'. */
export const routeFor = (pathname: string) => {
  const path = trimSlash(pathname);
  return path === '/' ? 'index' : path.slice(1);
};

export const ogImagePath = (pathname: string) => `/og/${routeFor(pathname)}.png`;

export const hasStaticOgImage = (pathname: string) => trimSlash(pathname) in staticOgPages;
