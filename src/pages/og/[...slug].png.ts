import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { generateOGImage } from '../../lib/og';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  const blogPaths = posts.map((post) => ({
    params: { slug: `blog/${post.id}` },
    props: { title: post.data.title, description: post.data.description },
  }));

  const staticPages = [
    { slug: 'home', title: 'Michael Linder', description: 'Solutions Architect · AI Governance · Enterprise IT' },
    { slug: 'ueber-mich', title: 'Über mich', description: 'Solutions Architect mit 20+ Jahren Erfahrung' },
{ slug: 'blog', title: 'Blog', description: 'Gedanken zu Platform Engineering, AI Governance und Enterprise IT' },
    { slug: 'en/home', title: 'Michael Linder', description: 'Solutions Architect · AI Governance · Enterprise IT' },
    { slug: 'en/about', title: 'About', description: 'Solutions Architect with 20+ years of experience' },
{ slug: 'en/blog', title: 'Blog', description: 'Thoughts on Platform Engineering, AI Governance, and Enterprise IT' },
  ];

  const staticPaths = staticPages.map(({ slug, title, description }) => ({
    params: { slug },
    props: { title, description },
  }));

  return [...blogPaths, ...staticPaths];
}

export async function GET({ props }: APIContext) {
  const png = await generateOGImage(props.title as string, props.description as string);
  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
