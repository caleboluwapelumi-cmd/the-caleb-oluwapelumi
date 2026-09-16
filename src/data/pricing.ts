import type { ServiceSlug } from './services';

/** A figure in USD, or 'custom' where the tier is quoted rather than listed. */
export type Amount = number | 'custom';

export interface PricingTier {
  /** Stable id, unique within its service. */
  id: string;
  name: string;
  /**
   * The one line Caleb supplied for this tier — a volume ("Up to 12 short-form
   * videos") or the scope a custom tier covers. Omitted where he gave none;
   * `whoItsFor`, `includes` and `turnaround` were dropped from this schema
   * rather than filled with invented values.
   */
  detail?: string;
  /** Single reference figure in USD; the work is remote and quoted per project. */
  usd: Amount;
  /** True when scope varies and the figure is a starting price. */
  from: boolean;
}

export type PricedServiceSlug = Extract<
  ServiceSlug,
  | 'video-editing'
  | 'web-development'
  | 'paid-advertising'
  | 'business-consultation'
  | 'digital-solutions'
>;

export interface PricedService {
  service: PricedServiceSlug;
  tiers: readonly PricingTier[];
  /** Standing caveat shown under this service's tiers. */
  note?: string;
}

/**
 * Sits above the closing line: the figures are indicative, not a quote. Caleb
 * asked for both, in this order — the caveat first, then his closing line.
 */
export const PRICING_PLACEHOLDER_NOTE =
  'Figures shown are placeholders — final pricing is confirmed after scoping the project.';

/** Closes the pricing tables. */
export const PRICING_CLOSING =
  'Final project pricing is confirmed after understanding the scope of work.';

export const pricing: readonly PricedService[] = [
  {
    service: 'video-editing',
    tiers: [
      { id: 'starter', name: 'Starter', detail: 'Up to 4 short-form videos', usd: 25, from: false },
      { id: 'growth', name: 'Growth', detail: 'Up to 12 short-form videos', usd: 75, from: false },
      { id: 'pro', name: 'Pro', detail: 'Up to 25 short-form videos', usd: 150, from: false },
      {
        id: 'custom',
        name: 'Custom',
        detail: 'For long form, promotional, campaign, or high volume editing.',
        usd: 'custom',
        from: false,
      },
    ],
  },
  {
    service: 'web-development',
    tiers: [
      { id: 'landing-page', name: 'Landing Page', usd: 100, from: true },
      { id: 'business-website', name: 'Business Website', usd: 175, from: true },
      { id: 'advanced-website', name: 'Advanced Website', usd: 300, from: true },
      {
        id: 'custom-web-application',
        name: 'Custom Web Application',
        detail: 'Priced according to scope and functionality.',
        usd: 'custom',
        from: false,
      },
    ],
  },
  {
    service: 'paid-advertising',
    note: 'Advertising budget is separate from management fees.',
    tiers: [
      { id: 'campaign-setup', name: 'Campaign Setup', usd: 50, from: true },
      { id: 'monthly-management', name: 'Monthly Management', usd: 75, from: true },
      { id: 'lead-generation-system', name: 'Full Lead Generation System', usd: 125, from: true },
    ],
  },
  {
    service: 'business-consultation',
    tiers: [
      { id: 'single-session', name: 'Single Session', usd: 25, from: false },
      { id: 'strategy-session', name: 'Strategy Session', usd: 50, from: false },
      {
        id: 'ongoing-consultation',
        name: 'Ongoing Consultation',
        detail: 'Custom pricing based on requirements.',
        usd: 'custom',
        from: false,
      },
    ],
  },
  {
    service: 'digital-solutions',
    tiers: [
      { id: 'simple-digital-setup', name: 'Simple Digital Setup', usd: 75, from: true },
      {
        id: 'custom-solution',
        name: 'Custom Solution',
        detail: 'Priced according to requirements.',
        usd: 'custom',
        from: false,
      },
    ],
  },
];

export const isPriced = (slug: ServiceSlug): boolean => pricing.some((p) => p.service === slug);

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

/** Formatted at build time. Quoted tiers read "Custom" instead of a figure. */
export function formatAmount(amount: Amount): string {
  return amount === 'custom' ? 'Custom' : usd.format(amount);
}
