// The prompt a template or component page offers to paste into a coding agent. It names the entry
// and the Markdown copy of the docs that hold the rules, so the rules live in one place. A page
// shows it once the docs that docs.lock.json pins have that page and, for templates, that section.
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { docsUrl, markdownPath, siteOrigin, type SiteLocale } from "../lib/urls.ts"
import { catalogCopy } from "./copy.ts"

const docs = {
  templates: { repo: "zeabur", slug: "deploy/templates" },
  components: { repo: "catalog", slug: "get-started/agent" },
} as const

const synced = (locale: SiteLocale, repo: string, slug: string) => {
  const file = join(
    process.cwd(),
    "src/content/docs",
    locale === "en" ? "" : locale,
    "docs",
    repo,
    `${slug}.mdx`,
  )
  return existsSync(file) ? readFileSync(file, "utf8") : ""
}

/** The prompt for the entry, or `undefined` while the pinned docs lack what it points to. */
export function agentPrompt(locale: SiteLocale, kind: keyof typeof docs, id: string) {
  const { repo, slug } = docs[kind]
  const page = synced(locale, repo, slug)
  const url = siteOrigin + markdownPath(docsUrl(locale, repo, slug))
  const t = catalogCopy[locale]
  if (kind === "components") return page ? t.component.agent.prompt(id, url) : undefined
  const { section, prompt } = t.template.agent
  return page.includes(`\n## ${section}\n`) ? prompt(id, url, section) : undefined
}
