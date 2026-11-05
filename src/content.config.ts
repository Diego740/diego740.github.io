import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

const bi = z.object({ es: z.string(), en: z.string() });
const biList = z.object({ es: z.array(z.string()), en: z.array(z.string()) });

export const collections = {
  experience: defineCollection({
    loader: file('src/content/experience.json'),
    schema: z.object({ order: z.number(), anchor: z.string(), org: z.string(), role: z.string(), from: z.string(), to: z.string().nullable(), current: z.boolean(), location: bi, period: bi, summary: bi, highlights: biList }),
  }),
  certifications: defineCollection({
    loader: file('src/content/certifications.json'),
    schema: z.object({ order: z.number(), anchor: z.string(), name: z.string(), fullName: z.string(), issuer: z.string(), date: bi, verifyUrl: z.string().url().nullable(), featured: z.boolean(), description: bi }),
  }),
  education: defineCollection({
    loader: file('src/content/education.json'),
    schema: z.object({ order: z.number(), anchor: z.string(), institution: bi, degree: bi, period: bi, location: bi, badge: bi, description: bi, highlights: biList }),
  }),
  writeups: defineCollection({
    loader: file('src/content/writeups.json'),
    schema: z.object({ title: z.string(), os: z.string(), difficulty: z.enum(['easy', 'medium', 'hard', 'insane']), status: z.enum(['active', 'retired']), date: z.string(), file: z.string().nullable(), platform: z.string().nullable(), heading: bi.optional(), cover: bi.optional(), blurb: bi.optional(), motif: z.string().optional() }),
  }),
  projects: defineCollection({
    loader: file('src/content/projects.json'),
    schema: z.object({
      shelf: z.string(), order: z.number(), status: z.enum(['en-curso', 'publicada', 'terminado']), featured: z.boolean(), detail: z.boolean(), motif: z.string(),
      title: z.string(), heading: bi, cover: bi, blurb: bi, tags: z.array(z.string()), whatIs: bi,
      problem: bi.optional(), how: biList.optional(), results: biList.optional(), limits: biList.optional(), techDetails: biList.optional(), notes: biList.optional(),
      stack: z.array(z.string()),
      links: z.object({ repo: z.string().optional(), store: z.string().optional(), legal: z.string().optional(), report: z.string().nullable().optional(), writeups: z.string().optional() }),
      gallery: z.array(z.object({ src: z.object({ es: z.string(), en: z.string() }), alt: bi })).optional(),
      gallerySize: z.object({ w: z.number(), h: z.number() }).optional(),
      video: z.object({ src: z.string(), poster: z.string(), caption: bi }).optional(),
    }),
  }),
};
