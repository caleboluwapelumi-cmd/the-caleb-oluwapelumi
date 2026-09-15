import type { ServiceSlug } from './services';

/** A real figure, or 'TODO' until one is supplied. Never invent a price. */
export type Amount = number | 'TODO';

export interface PricingTier {
  /** Stable id, unique within its service. */
  id: string;
  name: string;
  whoItsFor: string;
  includes: readonly string[];
  turnaround: string;
  /**
   * Single reference figure in USD. Deliberately one currency: the work is
   * remote and scoped per project, so a per-market price table implied a
   * precision the quote doesn't have. Every figure is a placeholder until the
   * real quote is scoped — see `PRICING_NOTE`.
   */
  usd: Amount;
  /** True when scope varies and the figure is a starting price. */
  from: boolean;
}

export type PricedServiceSlug = Extract<
  ServiceSlug,
  'web-development' | 'video-editing' | 'paid-advertising'
>;

export interface PricedService {
  service: PricedServiceSlug;
  tiers: readonly PricingTier[];
}

/** Stands under the pricing intro, on every tier table. */
export const PRICING_NOTE =
  'Figures are placeholders — final quote is scoped to your project and currency.';

// TODO(copy): every tier below — names, audience, inclusions, turnaround,
// the USD figure, and whether each is a "from" price.
const todoTier = (id: string): PricingTier => ({
  id,
  name: 'TODO(copy): tier name',
  whoItsFor: 'TODO(copy): who this tier is for',
  includes: ['TODO(copy): inclusion', 'TODO(copy): inclusion', 'TODO(copy): inclusion'],
  turnaround: 'TODO(copy): turnaround',
  usd: 'TODO',
  from: false,
});

export const pricing: readonly PricedService[] = [
  { service: 'web-development', tiers: [todoTier('tier-1'), todoTier('tier-2'), todoTier('tier-3')] },
  { service: 'video-editing', tiers: [todoTier('tier-1'), todoTier('tier-2'), todoTier('tier-3')] },
  { service: 'paid-advertising', tiers: [todoTier('tier-1'), todoTier('tier-2'), todoTier('tier-3')] },
];

export const isPriced = (slug: ServiceSlug): boolean => pricing.some((p) => p.service === slug);

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

/** Formatted at build time; unfilled amounts render as a visible TODO. */
export function formatAmount(amount: Amount): string {
  return amount === 'TODO' ? '$ TODO(copy)' : usd.format(amount);
}
