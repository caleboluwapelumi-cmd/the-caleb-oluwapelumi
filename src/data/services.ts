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
    whatItIs:
      'Editing for short-form and long-form video — raw footage or existing content turned into something polished enough to publish.',
    whoItsFor:
      'Brands, creators, and social teams that need a steady stream of content without doing the editing themselves.',
    deliverables: [
      'Short-form social videos',
      'Long-form and promotional edits',
      'Captions, pacing, and transitions',
      'Platform-ready exports',
    ],
  },
  {
    slug: 'web-development',
    name: 'Web Development',
    tier: 'lead',
    category: 'web',
    summary:
      'Modern, responsive websites built around what the site needs to do — structure, UX, performance, conversion. For businesses that need visitors to become enquiries.',
    whatItIs:
      'A website built around what it actually needs to do — company site, landing page, service page, or a custom platform.',
    whoItsFor:
      'Businesses and service providers that need visitors to understand the offer and take the next step.',
    deliverables: [
      'Responsive, mobile-first build',
      'Clear information architecture',
      'Conversion-focused calls to action',
      'Performance and basic SEO foundation',
    ],
  },
  {
    slug: 'paid-advertising',
    name: 'Paid Advertising',
    tier: 'lead',
    category: 'marketing',
    summary:
      'Targeted campaigns end to end: strategy, audience, creative, setup, tracking, optimisation. For businesses that want a consistent source of leads, not just clicks.',
    whatItIs:
      'End-to-end paid campaign management — strategy, targeting, creative, setup, tracking, and ongoing optimisation.',
    whoItsFor:
      'Businesses that want a consistent, measurable source of leads rather than one-off boosted posts.',
    deliverables: [
      'Campaign strategy and audience targeting',
      'Ad creative and messaging direction',
      'Campaign setup and tracking',
      'Ongoing monitoring and optimisation',
    ],
  },
  {
    slug: 'brand-positioning',
    name: 'Brand Positioning',
    tier: 'build-up',
    category: 'marketing',
    summary:
      'Clarify what you stand for, who you serve, and why people should choose you over the alternative.',
    whatItIs:
      'Clarifying what a business stands for, who it serves, and why someone should choose it over the alternative.',
    whoItsFor: 'Businesses whose messaging feels unclear, generic, or inconsistent across channels.',
    deliverables: [
      'Positioning statement',
      'Messaging framework',
      'Audience and differentiation clarity',
    ],
  },
  {
    slug: 'marketing-strategy',
    name: 'Marketing Strategy',
    tier: 'supporting',
    category: 'marketing',
    summary: 'Turning business goals into a plan: audience, channels, content, acquisition.',
    whatItIs:
      'Turning a business goal into a practical marketing plan — audience, channels, content, and acquisition.',
    whoItsFor: 'Businesses that know what they want to achieve but not how to get there.',
    deliverables: [
      'Audience and channel plan',
      'Content and acquisition direction',
      'Practical next steps, not just theory',
    ],
  },
  {
    slug: 'content-strategy',
    name: 'Content Strategy',
    tier: 'supporting',
    category: 'marketing',
    summary:
      'What to say, who to say it to, and how to make content a business asset instead of a chore.',
    whatItIs:
      'Deciding what to say, who to say it to, and how to make content a consistent business asset.',
    whoItsFor: 'Businesses producing content without a clear plan behind it.',
    deliverables: [
      'Content pillars and direction',
      'Audience-to-message mapping',
      'A practical content plan',
    ],
  },
  {
    slug: 'business-consultation',
    name: 'Business Consultation',
    tier: 'supporting',
    category: 'solutions',
    summary:
      'A sounding board for a business, marketing, sales, or digital problem you’re trying to think through.',
    whatItIs:
      'A working session to break down a business, marketing, sales, or digital problem and find the practical next move.',
    whoItsFor:
      'Anyone with a specific problem they want to think through with someone who’s built the solutions before.',
    deliverables: ['Problem breakdown', 'Options and trade-offs', 'A recommended next step'],
  },
  {
    slug: 'digital-solutions',
    name: 'Digital Solutions',
    tier: 'supporting',
    category: 'solutions',
    summary:
      'Practical systems for specific problems — workflow, operations, the repetitive stuff that shouldn’t be manual anymore.',
    whatItIs:
      'Practical digital systems built around a specific operational problem, not off-the-shelf software.',
    whoItsFor: 'Businesses stuck with repetitive manual work or disconnected tools.',
    deliverables: [
      'Workflow mapping',
      'A working solution built around the actual process',
      'Documentation for handover',
    ],
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
