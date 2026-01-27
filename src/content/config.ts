
import { defineCollection, z } from "astro:content";

const caseStudiesCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    emoji: z.string(),
    year: z.string(),
    summary: z.string(),
    problem: z.string(),
    solution: z.string(),
    tech: z.array(z.string()),
    link: z.string().url().optional(),
  }),
});

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  "case-studies": caseStudiesCollection,
  "blog": blogCollection,
};
