import type { WorkCategory } from './taxonomy';

export type ServiceSlug =
  | 'marketing-strategy'
  | 'sales-strategy'
  | 'brand-positioning'
  | 'web-development'
  | 'paid-advertising'
  | 'video-editing'
  | 'business-consultation'
  | 'digital-solutions';

export interface Service {
  /** Anchor id on /services and the value used by the contact form's select. */
  slug: ServiceSlug;
  name: string;
  /** Lead offers headline the homepage grid; supporting ones sit underneath. */
  tier: 'lead' | 'supporting';
  /** Which /work filter shows case studies for this service. */
  category: WorkCategory;
  /** One or two sentences for the homepage grid card. */
  summary: string;
  whatItIs: string;
  whoItsFor: string;
  deliverables: readonly string[];
}

/*
 * Service names are the brief's service lines, verbatim. Which four lead is a
 * provisional call pending Step 0: the brief's role title ("Marketing & Sales
 * Strategist") puts the strategy work first, and web development is the offer
 * the plan singles out as a sales asset. Swapping a `tier` is a one-word edit.
 */
// TODO(copy): confirm the lead/supporting split once Step 0 positioning is decided.
export const services = [
  {
    slug: 'marketing-strategy',
    name: 'Marketing Strategy',
    tier: 'lead',
    category: 'marketing',
    summary: 'TODO(copy): marketing strategy summary',
    whatItIs: 'TODO(copy): what marketing strategy is',
    whoItsFor: 'TODO(copy): who marketing strategy is for',
    deliverables: ['TODO(copy): deliverable', 'TODO(copy): deliverable', 'TODO(copy): deliverable'],
  },
  {
    slug: 'sales-strategy',
    name: 'Sales Strategy',
    tier: 'lead',
    category: 'marketing',
    summary: 'TODO(copy): sales strategy summary',
    whatItIs: 'TODO(copy): what sales strategy is',
    whoItsFor: 'TODO(copy): who sales strategy is for',
    deliverables: ['TODO(copy): deliverable', 'TODO(copy): deliverable', 'TODO(copy): deliverable'],
  },
  {
    slug: 'brand-positioning',
    name: 'Brand Positioning',
    tier: 'lead',
    category: 'marketing',
    summary: 'TODO(copy): brand positioning summary',
    whatItIs: 'TODO(copy): what brand positioning is',
    whoItsFor: 'TODO(copy): who brand positioning is for',
    deliverables: ['TODO(copy): deliverable', 'TODO(copy): deliverable', 'TODO(copy): deliverable'],
  },
  {
    slug: 'web-development',
    name: 'Web Development',
    tier: 'lead',
    category: 'web',
    summary: 'TODO(copy): web development summary',
    whatItIs: 'TODO(copy): what web development is',
    whoItsFor: 'TODO(copy): who web development is for',
    deliverables: ['TODO(copy): deliverable', 'TODO(copy): deliverable', 'TODO(copy): deliverable'],
  },
  {
    slug: 'paid-advertising',
    name: 'Paid Advertising',
    tier: 'supporting',
    category: 'marketing',
    summary: 'TODO(copy): paid advertising summary',
    whatItIs: 'TODO(copy): what paid advertising is',
    whoItsFor: 'TODO(copy): who paid advertising is for',
    deliverables: ['TODO(copy): deliverable', 'TODO(copy): deliverable', 'TODO(copy): deliverable'],
  },
  {
    slug: 'video-editing',
    name: 'Video Editing',
    tier: 'supporting',
    category: 'creative',
    summary: 'TODO(copy): video editing summary',
    whatItIs: 'TODO(copy): what video editing is',
    whoItsFor: 'TODO(copy): who video editing is for',
    deliverables: ['TODO(copy): deliverable', 'TODO(copy): deliverable', 'TODO(copy): deliverable'],
  },
  {
    slug: 'business-consultation',
    name: 'Business Consultation',
    tier: 'supporting',
    category: 'solutions',
    summary: 'TODO(copy): business consultation summary',
    whatItIs: 'TODO(copy): what business consultation is',
    whoItsFor: 'TODO(copy): who business consultation is for',
    deliverables: ['TODO(copy): deliverable', 'TODO(copy): deliverable', 'TODO(copy): deliverable'],
  },
  {
    slug: 'digital-solutions',
    name: 'Digital Solutions',
    tier: 'supporting',
    category: 'solutions',
    summary: 'TODO(copy): digital solutions summary',
    whatItIs: 'TODO(copy): what digital solutions are',
    whoItsFor: 'TODO(copy): who digital solutions are for',
    deliverables: ['TODO(copy): deliverable', 'TODO(copy): deliverable', 'TODO(copy): deliverable'],
  },
] as const satisfies readonly Service[];

export const leadServices = services.filter((s) => s.tier === 'lead');
export const supportingServices = services.filter((s) => s.tier === 'supporting');

export const serviceHref = (slug: ServiceSlug) => `/services#${slug}`;

export function getService(slug: ServiceSlug): Service {
  const service = services.find((s) => s.slug === slug);
  if (!service) throw new Error(`Unknown service: ${slug}`);
  return service;
}
