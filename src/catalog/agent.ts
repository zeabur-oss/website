// The prompt a template or component page offers to paste into a coding agent. It names the entry
// and the section of the Zeabur OSS docs that holds the rules, so the rules live in one place. A
// page shows it once the docs that docs.lock.json pins have that section.
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { docsUrl, markdownPath, siteOrigin, type SiteLocale } from "../lib/urls.ts"
import { catalogCopy } from "./copy.ts"

const slugs = { templates: "deploy/templates", components: "cluster/components" } as const

const synced = (locale: SiteLocale, slug: string) => {
  const file = join(
    process.cwd(),
    "src/content/docs",
    locale === "en" ? "" : locale,
    "docs/zeabur",
    `${slug}.mdx`,
  )
  return existsSync(file) ? readFileSync(file, "utf8") : ""
}

/** The prompt for the entry, or `undefined` while the pinned docs lack the section. */
export function agentPrompt(locale: SiteLocale, kind: keyof typeof slugs, id: string) {
  const t = catalogCopy[locale]
  const { section, prompt } = kind === "templates" ? t.template.agent : t.component.agent
  const url = siteOrigin + markdownPath(docsUrl(locale, "zeabur", slugs[kind]))
  return synced(locale, slugs[kind]).includes(`\n## ${section}\n`)
    ? prompt(id, url, section)
    : undefined
}
