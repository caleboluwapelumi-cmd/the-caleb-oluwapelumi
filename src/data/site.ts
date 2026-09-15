export interface NavItem {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  role: string;
  tagline: string;
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
  // TODO(copy): hero positioning line — pending Step 0 copy rework.
  tagline: 'TODO(copy): tagline',
  email: 'caleboluwapelumi9@gmail.com',
  // TODO: LinkedIn profile URL not yet supplied.
  linkedin: 'TODO-LINKEDIN-URL',
  // TODO: WhatsApp number in international format, e.g. 234XXXXXXXXXX.
  whatsapp: 'TODO-WHATSAPP',
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
