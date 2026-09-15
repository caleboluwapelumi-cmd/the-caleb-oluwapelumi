export interface NavItem {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  role: string;
  tagline: string;
  /** Site-wide default meta description; also the homepage description. */
  description: string;
  /**
   * Primary search intents, skill-and-intent based with no country qualifier —
   * the work is remote. Emitted as `knowsAbout` on the ProfessionalService node
   * so the list is actually published rather than kept as dead documentation.
   */
  seoKeywords: readonly string[];
  email: string;
  linkedin: string;
  /** International format, digits only, no "+" — used to build wa.me links. */
  whatsapp: string;
  baseUrl: string;
  /** Cal.com booking path, e.g. "username/strategy-session". */
  calLink: string;
  nav: readonly NavItem[];
}

export const site = {
  name: 'Caleb Oluwapelumi',
  role: 'Marketing & Sales Strategist',
  tagline:
    'I build websites, edit video, and run ad campaigns — the practical work that turns attention into customers.',
  description:
    'Caleb Oluwapelumi builds websites, edits video, and runs paid ad campaigns that turn attention into customers — for businesses anywhere.',
  seoKeywords: [
    'freelance web developer',
    'website designer for small business',
    'video editor for brands',
    'freelance video editor',
    'paid ads specialist',
    'Facebook and Instagram ads management',
    'lead generation campaigns',
    'digital marketing consultant',
    'landing page designer',
    'remote web developer for hire',
  ],
  email: 'caleboluwapelumi9@gmail.com',
  linkedin: 'https://www.linkedin.com/in/calebemmanuel/',
  whatsapp: '2349014482413',
  // TODO: must match `site` in astro.config.mjs once the domain is known.
  baseUrl: 'https://TODO-DOMAIN.com',
  // TODO: Cal.com username/event path not yet supplied.
  calLink: 'TODO-CAL-LINK',
  nav: [
    { label: 'Work', href: '/work' },
    { label: 'Services', href: '/services' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'About', href: '/about' },
    { label: 'Insights', href: '/insights' },
  ],
} as const satisfies SiteConfig;
