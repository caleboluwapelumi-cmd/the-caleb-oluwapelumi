import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { workCategories } from './data/taxonomy';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      client: z.string().optional(), // omit when under NDA
      clientDescriptor: z.string().optional(), // "a Lagos-based fintech"
      summary: z.string().max(180), // card + meta description
      category: z.enum(workCategories),
      services: z.array(z.string()), // chips on the case study page
      cover: image(), // required — no coverless cards
      coverAlt: z.string(),
      gallery: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
            caption: z.string().optional(),
          }),
        )
        .default([]),
      year: z.number().int().min(2015),
      liveUrl: z.string().url().optional(),
      outcomes: z
        .array(
          z.object({
            label: z.string(), // "Qualified leads / month"
            value: z.string(), // "3 → 27"
          }),
        )
        .default([]),
      featured: z.boolean().default(false),
      order: z.number().default(999),
      draft: z.boolean().default(false),
    }),
});

export const collections = { work };
