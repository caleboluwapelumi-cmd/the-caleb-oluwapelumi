import { getCollection, type CollectionEntry } from 'astro:content';
import { workCategoryLabels } from '../data/taxonomy';
import type { Props as WorkCardProps } from '../components/ui/WorkCard.astro';

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
