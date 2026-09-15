import { site } from '../data/site';

/**
 * schema.org builders. Every URL is resolved against the `site` URL passed in
 * (Astro.site), so structured data can never disagree with the canonical tags.
 */

export type JsonLdNode = Record<string, unknown> & { '@type': string };

const abs = (path: string, siteUrl: URL | string) => new URL(path, siteUrl).href;

// Unfilled TODO placeholders in site.ts aren't URLs; emitting them would make
// the structured data invalid, so they're dropped until supplied.
const isUrl = (value: string) => /^https?:\/\//.test(value) && !value.includes('TODO');

export const personId = (siteUrl: URL | string) => abs('/#person', siteUrl);
export const serviceId = (siteUrl: URL | string) => abs('/#service', siteUrl);

export function personSchema(siteUrl: URL | string): JsonLdNode {
  const sameAs = [site.linkedin].filter(isUrl);
  return {
    '@type': 'Person',
    '@id': personId(siteUrl),
    name: site.name,
    jobTitle: site.role,
    email: `mailto:${site.email}`,
    url: abs('/', siteUrl),
    ...(sameAs.length > 0 && { sameAs }),
    address: { '@type': 'PostalAddress', addressCountry: 'NG' },
  };
}

export interface ProfessionalServiceOptions {
  /** Service names, from src/data/services.ts. */
  services?: readonly string[];
}

export function professionalServiceSchema(
  siteUrl: URL | string,
  { services = [] }: ProfessionalServiceOptions = {},
): JsonLdNode {
  return {
    '@type': 'ProfessionalService',
    '@id': serviceId(siteUrl),
    name: site.name,
    url: abs('/', siteUrl),
    email: `mailto:${site.email}`,
    founder: { '@id': personId(siteUrl) },
    address: { '@type': 'PostalAddress', addressCountry: 'NG' },
    areaServed: [
      { '@type': 'Country', name: 'Nigeria' },
      { '@type': 'Country', name: 'United Kingdom' },
    ],
    ...(services.length > 0 && {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Services',
        itemListElement: services.map((name) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name },
        })),
      },
    }),
  };
}

export interface BlogPostingInput {
  /** Page path, e.g. `/insights/some-post`. */
  path: string;
  title: string;
  description: string;
  publishDate: Date;
  updatedDate?: Date;
  image?: string;
  tags?: readonly string[];
}

export function blogPostingSchema(siteUrl: URL | string, post: BlogPostingInput): JsonLdNode {
  const url = abs(post.path, siteUrl);
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: url,
    headline: post.title,
    description: post.description,
    datePublished: post.publishDate.toISOString(),
    dateModified: (post.updatedDate ?? post.publishDate).toISOString(),
    author: { '@id': personId(siteUrl) },
    publisher: { '@id': personId(siteUrl) },
    ...(post.image && { image: abs(post.image, siteUrl) }),
    ...(post.tags?.length && { keywords: post.tags.join(', ') }),
  };
}

export interface CreativeWorkInput {
  /** Page path, e.g. `/work/some-case-study`. */
  path: string;
  title: string;
  summary: string;
  year: number;
  image?: string;
  /** Named client, or the anonymised descriptor. Omit under NDA. */
  client?: string;
  services?: readonly string[];
}

export function creativeWorkSchema(siteUrl: URL | string, work: CreativeWorkInput): JsonLdNode {
  const url = abs(work.path, siteUrl);
  return {
    '@type': 'CreativeWork',
    '@id': `${url}#work`,
    url,
    name: work.title,
    abstract: work.summary,
    dateCreated: String(work.year),
    creator: { '@id': personId(siteUrl) },
    ...(work.image && { image: abs(work.image, siteUrl) }),
    ...(work.client && { sourceOrganization: { '@type': 'Organization', name: work.client } }),
    ...(work.services?.length && { keywords: work.services.join(', ') }),
  };
}

export function graph(nodes: readonly JsonLdNode[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}
