import type { WorkCategory } from './taxonomy';

export type ServiceSlug =
  | 'video-editing'
  | 'web-development'
  | 'paid-advertising'
  | 'brand-positioning'
  | 'marketing-strategy'
  | 'content-strategy'
  | 'business-consultation'
  | 'digital-solutions';

/**
 * Three tiers, not two. `lead` headlines the homepage grid; `build-up` is the
 * one capability that feeds the leads rather than standing beside them;
 * `supporting` is everything else, listed without special billing.
 */
export type ServiceTier = 'lead' | 'build-up' | 'supporting';

export interface Service {
  /** Anchor id on /services and the value used by the contact form's select. */
  slug: ServiceSlug;
  name: string;
  tier: ServiceTier;
  /** Which /work filter shows case studies for this service. */
  category: WorkCategory;
  /** One or two sentences for the homepage grid card. */
  summary: string;
  whatItIs: string;
  whoItsFor: string;
  deliverables: readonly string[];
}

/*
 * Order is meaning here: this array drives the homepage grid, the /services
 * page and its table of contents, the footer's service column and the
 * ProfessionalService offer catalogue. Changing the order changes all four.
 * The split is fixed — see BUILD-PLAN.md Step 7. Don't re-derive it.
 */
export const services = [
  {
    slug: 'video-editing',
    name: 'Video Editing',
    tier: 'lead',
    category: 'creative',
    summary:
      'I turn raw footage and ideas into polished, platform-ready videos — pacing, captions, transitions, presentation. For brands, creators, and social teams that need content people actually watch.',
    whatItIs: 'TODO(copy): what video editing is',
    whoItsFor: 'TODO(copy): who video editing is for',
    deliverables: ['TODO(copy): deliverable', 'TODO(copy): deliverable', 'TODO(copy): deliverable'],
  },
  {
    slug: 'web-development',
    name: 'Web Development',
    tier: 'lead',
    category: 'web',
    summary:
      'Modern, responsive websites built around what the site needs to do — structure, UX, performance, conversion. For businesses that need visitors to become enquiries.',
    whatItIs: 'TODO(copy): what web development is',
    whoItsFor: 'TODO(copy): who web development is for',
    deliverables: ['TODO(copy): deliverable', 'TODO(copy): deliverable', 'TODO(copy): deliverable'],
  },
  {
    slug: 'paid-advertising',
    name: 'Paid Advertising',
    tier: 'lead',
    category: 'marketing',
    summary:
      'Targeted campaigns end to end: strategy, audience, creative, setup, tracking, optimisation. For businesses that want a consistent source of leads, not just clicks.',
    whatItIs: 'TODO(copy): what paid advertising is',
    whoItsFor: 'TODO(copy): who paid advertising is for',
    deliverables: ['TODO(copy): deliverable', 'TODO(copy): deliverable', 'TODO(copy): deliverable'],
  },
  {
    slug: 'brand-positioning',
    name: 'Brand Positioning',
    tier: 'build-up',
    category: 'marketing',
    summary:
      'Clarify what you stand for, who you serve, and why people should choose you over the alternative.',
    whatItIs: 'TODO(copy): what brand positioning is',
    whoItsFor: 'TODO(copy): who brand positioning is for',
    deliverables: ['TODO(copy): deliverable', 'TODO(copy): deliverable', 'TODO(copy): deliverable'],
  },
  {
    slug: 'marketing-strategy',
    name: 'Marketing Strategy',
    tier: 'supporting',
    category: 'marketing',
    summary: 'Turning business goals into a plan: audience, channels, content, acquisition.',
    whatItIs: 'TODO(copy): what marketing strategy is',
    whoItsFor: 'TODO(copy): who marketing strategy is for',
    deliverables: ['TODO(copy): deliverable', 'TODO(copy): deliverable', 'TODO(copy): deliverable'],
  },
  {
    slug: 'content-strategy',
    name: 'Content Strategy',
    tier: 'supporting',
    category: 'marketing',
    summary:
      'What to say, who to say it to, and how to make content a business asset instead of a chore.',
    whatItIs: 'TODO(copy): what content strategy is',
    whoItsFor: 'TODO(copy): who content strategy is for',
    deliverables: ['TODO(copy): deliverable', 'TODO(copy): deliverable', 'TODO(copy): deliverable'],
  },
  {
    slug: 'business-consultation',
    name: 'Business Consultation',
    tier: 'supporting',
    category: 'solutions',
    summary:
      'A sounding board for a business, marketing, sales, or digital problem you’re trying to think through.',
    whatItIs: 'TODO(copy): what business consultation is',
    whoItsFor: 'TODO(copy): who business consultation is for',
    deliverables: ['TODO(copy): deliverable', 'TODO(copy): deliverable', 'TODO(copy): deliverable'],
  },
  {
    slug: 'digital-solutions',
    name: 'Digital Solutions',
    tier: 'supporting',
    category: 'solutions',
    summary:
      'Practical systems for specific problems — workflow, operations, the repetitive stuff that shouldn’t be manual anymore.',
    whatItIs: 'TODO(copy): what digital solutions are',
    whoItsFor: 'TODO(copy): who digital solutions are for',
    deliverables: ['TODO(copy): deliverable', 'TODO(copy): deliverable', 'TODO(copy): deliverable'],
  },
] as const satisfies readonly Service[];

export const leadServices = services.filter((s) => s.tier === 'lead');
export const buildUpServices = services.filter((s) => s.tier === 'build-up');
export const supportingServices = services.filter((s) => s.tier === 'supporting');

export const serviceHref = (slug: ServiceSlug) => `/services#${slug}`;

export function getService(slug: ServiceSlug): Service {
  const service = services.find((s) => s.slug === slug);
  if (!service) throw new Error(`Unknown service: ${slug}`);
  return service;
}

/** Closing line under the services grid, for people whose need isn't listed. */
export const servicesClosing = {
  line: 'Need something specific? Tell me what you’re building or solving.',
  cta: 'Tell Me What You Need',
} as const;
