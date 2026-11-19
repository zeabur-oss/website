// The components MDX pages may use, by name, with their props. Pages never import them: the site
// imports them into each page (src/mdx/remark-docs.ts). scripts/docs-check.ts checks pages against
// these schemas.
import { z } from "zod"

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
  Figure: z.strictObject({ label: z.string().min(1) }),
  FigFlow: z.strictObject({}),
  FigGroup: z.strictObject({ label: z.string().optional(), row: z.boolean().optional() }),
  FigCard: z.strictObject({
    title: z.string().min(1),
    note: z.string().optional(),
    tag: z.string().optional(),
    hot: z.boolean().optional(),
    accent: z.boolean().optional(),
  }),
  FigArrow: z.strictObject({ label: z.string().optional(), accent: z.boolean().optional() }),
  Steps: z.strictObject({}),
  Step: z.strictObject({}),
} as const

export type ComponentName = keyof typeof registry

/** HTML elements a page may write as JSX. */
export const htmlElements = ["br", "details", "summary", "kbd", "sub", "sup"]
