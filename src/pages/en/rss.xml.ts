import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = (await getCollection('blog', ({ data }) => data.lang === 'en' && !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'Michael Linder — Blog',
    description: 'Thoughts on Platform Engineering, AI Governance, and Enterprise IT.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/en/blog/${post.id.replace(/^en\//, '')}`,
    })),
  });
}
