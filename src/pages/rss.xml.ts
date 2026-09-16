import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '../data/site';
import { getPublishedInsights, insightHref } from '../lib/collections';

export async function GET(context: APIContext) {
  // Drafts are already excluded in production by getPublishedInsights().
  const posts = await getPublishedInsights();
  return rss({
    title: `${site.name} · Insights`,
    description:
      'Practical insights on marketing, digital strategy, and business growth from Caleb Oluwapelumi.',
    site: context.site ?? site.baseUrl,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: insightHref(post),
      categories: [...post.data.tags],
    })),
    customData: '<language>en-gb</language>',
  });
}
