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
  /** Set per market, not converted — a converted £ figure drifts with the naira. */
  ngn: Amount;
  gbp: Amount;
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

// TODO(copy): every tier below — names, audience, inclusions, turnaround,
// both prices, and whether each is a "from" price.
const todoTier = (id: string): PricingTier => ({
  id,
  name: 'TODO(copy): tier name',
  whoItsFor: 'TODO(copy): who this tier is for',
  includes: ['TODO(copy): inclusion', 'TODO(copy): inclusion', 'TODO(copy): inclusion'],
  turnaround: 'TODO(copy): turnaround',
  ngn: 'TODO',
  gbp: 'TODO',
  from: false,
});

export const pricing: readonly PricedService[] = [
  { service: 'web-development', tiers: [todoTier('tier-1'), todoTier('tier-2'), todoTier('tier-3')] },
  { service: 'video-editing', tiers: [todoTier('tier-1'), todoTier('tier-2'), todoTier('tier-3')] },
  { service: 'paid-advertising', tiers: [todoTier('tier-1'), todoTier('tier-2'), todoTier('tier-3')] },
];

export const isPriced = (slug: ServiceSlug): boolean => pricing.some((p) => p.service === slug);

const formatters = {
  ngn: new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }),
  gbp: new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }),
};

const symbols = { ngn: '₦', gbp: '£' };

/** Formatted at build time; unfilled amounts render as a visible TODO. */
export function formatAmount(amount: Amount, currency: 'ngn' | 'gbp'): string {
  return amount === 'TODO' ? `${symbols[currency]} TODO(copy)` : formatters[currency].format(amount);
}
