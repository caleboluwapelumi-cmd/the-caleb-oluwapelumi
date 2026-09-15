import { site } from '../data/site';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

export interface OgPage {
  /** Eyebrow above the title. */
  kicker: string;
  title: string;
}

/**
 * Pages that get a generated OG image. Collection entries are added by the
 * route's getStaticPaths; this covers the fixed pages.
 */
// TODO(copy): OG kickers and titles, once page copy is final.
export const staticOgPages: Record<string, OgPage> = {
  '/': { kicker: site.role, title: site.name },
  '/services': { kicker: 'Services', title: 'What I do' },
  '/pricing': { kicker: 'Pricing', title: 'Packages and prices' },
  '/about': { kicker: 'About', title: site.name },
  '/work': { kicker: 'Work', title: 'Selected case studies' },
  '/insights': { kicker: 'Insights', title: 'Notes on marketing and growth' },
  '/contact': { kicker: 'Contact', title: 'Let’s talk' },
};

const trimSlash = (path: string) => (path.length > 1 ? path.replace(/\/+$/, '') : path);

/** '/' -> 'index', '/work/x' -> 'work/x'. */
export const routeFor = (pathname: string) => {
  const path = trimSlash(pathname);
  return path === '/' ? 'index' : path.slice(1);
};

export const ogImagePath = (pathname: string) => `/og/${routeFor(pathname)}.png`;

export const hasStaticOgImage = (pathname: string) => trimSlash(pathname) in staticOgPages;
