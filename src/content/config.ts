
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

export const collections = {
  "case-studies": caseStudiesCollection,
};
