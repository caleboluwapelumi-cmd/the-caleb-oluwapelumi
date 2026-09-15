import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { insightTags, workCategories } from './data/taxonomy';

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

const insights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insights' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string().max(160), // becomes the meta description
        publishDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        tags: z.array(z.enum(insightTags)).min(1),
        cover: image().optional(),
        coverAlt: z.string().optional(),
        draft: z.boolean().default(false),
      })
      // Both are optional, but a cover without alt text is a build failure.
      .refine((post) => !post.cover || Boolean(post.coverAlt), {
        message: 'coverAlt is required when cover is set',
        path: ['coverAlt'],
      }),
});

export const collections = { work, insights };
