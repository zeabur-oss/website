import { Callout } from "fumadocs-ui/components/callout"
import { Step, Steps } from "fumadocs-ui/components/steps"
import { Tab, Tabs } from "fumadocs-ui/components/tabs"
import defaultMdxComponents from "fumadocs-ui/mdx"
import type { MDXComponents } from "mdx/types"
import type { ComponentName } from "./registry.ts"
import { Screenshot } from "./screenshot.tsx"

const registered = {
  Callout,
  Tabs,
  Tab,
  Steps,
  Step,
  Screenshot,
} satisfies Record<ComponentName, unknown>

export const mdxComponents: MDXComponents = { ...defaultMdxComponents, ...registered }
