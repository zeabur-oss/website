import { docsLoader, i18nLoader } from "@astrojs/starlight/loaders"
import { docsSchema, i18nSchema } from "@astrojs/starlight/schema"
import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "astro/zod"

// scripts/sync-docs.ts writes the pages. Ids keep the case of the path (/zh-TW/…), and an index
// page is its folder's URL.
// The blog: one folder per locale (en, zh-TW, zh-CN), the same file name for each translation.
const blog = defineCollection({
  loader: glob({
    base: "./src/content/blog",
    pattern: "**/*.{md,mdx}",
    generateId: ({ entry }) => entry.replace(/\.mdx?$/, ""),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** Left out of production builds; shown by `astro dev` and BLOG_DRAFTS=1. */
    draft: z.boolean().default(false),
  }),
})

export const collections = {
  blog,
  // Starlight labels a note 「注意」, which reads like a caution.
  i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
  docs: defineCollection({
    loader: docsLoader({
      generateId: ({ entry }) => entry.replace(/\.mdx?$/, "").replace(/\/index$/, ""),
    }),
    schema: docsSchema({
      extend: z.object({
        repo: z.string(),
        contentLocale: z.string(),
        sourcePath: z.string(),
      }),
    }),
  }),
}
