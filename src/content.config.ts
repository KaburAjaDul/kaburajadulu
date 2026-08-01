import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    pubDate: z.date(),
    category: z.enum(['Lowongan', 'Beasiswa', 'Event', 'Kelas Bahasa', 'Berita']),
    image: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };