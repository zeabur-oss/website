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
    cover: z.enum(["open-source", "release-0-2-0", "release-0-3-0"]).optional(),
  }),
})

const text = z.string()
// The text of the site's product pages: src/content/pages/<locale>/<slug>.yaml, one file per locale
// for each row of src/lib/site-pages.ts.
const pages = defineCollection({
  loader: glob({
    base: "./src/content/pages",
    pattern: "**/*.yaml",
    generateId: ({ entry }) => entry.replace(/\.yaml$/, ""),
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
    /** An app's downloads: the main button, then every file by system and way to install. */
    download: z
      .object({
        /** The main button when the page cannot tell the visitor's computer. */
        button: text,
        /** The main button for each system, such as "Download for macOS". */
        for: z.object({ macos: text, windows: text, linux: text }),
        /** The heading over the list of every file. */
        all: text,
        /** What the page calls a Mac's Arm chip. */
        apple: text,
        kinds: z.object({
          dmg: text,
          setup: text,
          portable: text,
          deb: text,
          rpm: text,
          appimage: text,
        }),
        /** The link to the release page, below the list. */
        releasePage: text,
      })
      .optional(),
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
    start: z.object({
      title: text,
      sub: text,
      cta: text,
      /** The heading in the docs page that the button links to. */
      anchor: text.optional(),
      /** The line above the hero's command block. */
      hero: text.optional(),
      /** First steps, each with the key of its commands in examples.ts. */
      steps: z.array(z.object({ title: text, body: text, code: z.string() })).optional(),
      copy: z.object({ label: text, done: text, failed: text }).optional(),
    }),
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
