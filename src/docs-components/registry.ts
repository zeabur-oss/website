// The components MDX pages may use, by name, with their props. Pages never import them: the site
// imports them into each page (src/mdx/remark-docs.ts). scripts/docs-check.ts checks pages against
// these schemas.
import { z } from "zod"
import { locales } from "../lib/urls.ts"

const id = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "a kebab-case screenshot id")

export const registry = {
  Callout: z.strictObject({
    type: z.enum(["info", "warn", "error", "success"]).optional(),
    title: z.string().optional(),
  }),
  Tabs: z.strictObject({
    items: z.array(z.string()).min(1),
    defaultIndex: z.number().int().nonnegative().optional(),
  }),
  Tab: z.strictObject({ value: z.string().optional() }),
  Steps: z.strictObject({}),
  Step: z.strictObject({}),
  /** A release screenshot, `docs/shots.yaml` id, in the page's language unless `locale` is set. */
  Screenshot: z.strictObject({
    id,
    alt: z.string().min(1),
    repo: z.string().optional(),
    locale: z.enum(locales).optional(),
    theme: z.enum(["light", "dark"]).optional(),
    /** Also show the dark shot in the dark theme; the shot must list `themes: [light, dark]`. */
    dark: z.boolean().optional(),
  }),
} as const

export type ComponentName = keyof typeof registry

/** HTML elements a page may write as JSX. */
export const htmlElements = ["br", "details", "summary", "kbd", "sub", "sup"]
