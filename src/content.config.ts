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
    author: z.enum(["pan93412"]),
    /** A cover under the title, from src/blog/covers. */
    cover: z.enum(["open-source", "release-0-2-0"]).optional(),
  }),
})

const text = z.string()
// The site's own pages: src/content/pages/<locale>/<slug>.mdx, one file per locale with the same
// slug (the row of src/lib/site-pages.ts says where the page shows up).
const pages = defineCollection({
  loader: glob({
    base: "./src/content/pages",
    pattern: "**/*.mdx",
    generateId: ({ entry }) => entry.replace(/\.mdx$/, ""),
  }),
  schema: z.object({
    /** A page that is not released shows "Stay tuned" in place of its release tag. */
    status: z.enum(["released", "soon"]),
    /** The line under the page's name in the header menu and on the home page. */
    lines: z.object({ nav: text, landing: text }),
    meta: z.object({ title: text, description: text }),
    titleDim: text,
    title: text,
    sub: text,
    docs: text,
    source: text,
    highlights: z.object({
      titleDim: text,
      title: text,
      items: z.array(z.object({ tag: text, title: text, body: text })),
    }),
    how: z.object({
      titleDim: text,
      title: text,
      steps: z.array(z.object({ title: text, body: text })),
    }),
    shots: z.object({ title: text, captions: z.record(z.string(), text) }).optional(),
    details: z.object({ title: text, cols: z.array(text), rows: z.array(z.array(text)) }),
    start: z.object({ title: text, sub: text, cta: text }),
  }),
})

export const collections = {
  blog,
  pages,
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
