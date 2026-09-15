import { getCollection, type CollectionEntry } from 'astro:content';
import { insightTagLabels, workCategoryLabels } from '../data/taxonomy';
import type { Props as WorkCardProps } from '../components/ui/WorkCard.astro';
import type { Props as InsightCardProps } from '../components/ui/InsightCard.astro';

/** Drafts are visible in dev and filtered out of production builds. */
const isPublished = ({ data }: { data: { draft: boolean } }) =>
  import.meta.env.PROD ? !data.draft : true;

export type WorkEntry = CollectionEntry<'work'>;

export async function getPublishedWork(): Promise<WorkEntry[]> {
  const entries = await getCollection('work', isPublished);
  return entries.sort((a, b) => a.data.order - b.data.order || b.data.year - a.data.year);
}

export const workHref = (entry: WorkEntry) => `/work/${entry.id}`;

export function toWorkCard(entry: WorkEntry, headingLevel: 'h2' | 'h3' = 'h3'): WorkCardProps {
  const { data } = entry;
  return {
    href: workHref(entry),
    title: data.title,
    summary: data.summary,
    categoryLabel: workCategoryLabels[data.category],
    cover: data.cover,
    coverAlt: data.coverAlt,
    client: data.client ?? data.clientDescriptor,
    year: data.year,
    headingLevel,
  };
}

export type InsightEntry = CollectionEntry<'insights'>;

/** Newest first. */
export async function getPublishedInsights(): Promise<InsightEntry[]> {
  const entries = await getCollection('insights', isPublished);
  return entries.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
}

export const insightHref = (entry: InsightEntry) => `/insights/${entry.id}`;

const WORDS_PER_MINUTE = 230;

/** Computed from the raw markdown at build time; never less than a minute. */
export function readingMinutes(body: string | undefined): number {
  const words = (body ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function toInsightCard(
  entry: InsightEntry,
  headingLevel: 'h2' | 'h3' = 'h3',
): InsightCardProps {
  const { data } = entry;
  return {
    href: insightHref(entry),
    title: data.title,
    description: data.description,
    publishDate: data.publishDate,
    readingMinutes: readingMinutes(entry.body),
    tagLabels: data.tags.map((tag) => insightTagLabels[tag]),
    headingLevel,
  };
}
