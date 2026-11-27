import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import type { RepoLinks } from "../../scripts/sync-docs.ts"
import { docsUrl, markdownPath, siteOrigin, type SiteLocale } from "./urls.ts"

const guide = "get-started/from-zeabur-com"
const install = "install/agent"

/** The sections of the Zeabur OSS docs the catalog prompts name, by their title in each locale. */
export const catalogSections = {
  templates: {
    slug: "deploy/templates",
    title: { en: "Deploy with an agent", "zh-TW": "交給 Agent 部署", "zh-CN": "交给 Agent 部署" },
  },
  components: {
    slug: "cluster/components",
    title: { en: "Install with an agent", "zh-TW": "交給 Agent 安裝", "zh-CN": "交给 Agent 安装" },
  },
} as const
export type CatalogKind = keyof typeof catalogSections

/** The Markdown copy of the guide (scripts/sync-docs.ts), which the prompt asks the agent to read. */
export const agentGuideMarkdown = (locale: string) =>
  siteOrigin + markdownPath(docsUrl(locale, "zeabur", guide))

const published = (): string[] => {
  const links: Record<string, RepoLinks> = JSON.parse(
    readFileSync(join(process.cwd(), "content/links.json"), "utf8"),
  )
  return links.zeabur?.published ?? []
}

/** Whether the page in Zeabur's latest release holds `text`. */
const releaseHas = (locale: string, slug: string, text: string) => {
  const file = join(
    process.cwd(),
    "src/content/docs",
    locale === "en" ? "" : locale,
    "docs/zeabur",
    `${slug}.mdx`,
  )
  return existsSync(file) && readFileSync(file, "utf8").includes(text)
}

/** The Markdown copy of the page of a catalog prompt, once the latest release has its section. */
export function catalogPromptDocs(locale: SiteLocale, kind: CatalogKind) {
  const { slug, title } = catalogSections[kind]
  return releaseHas(locale, slug, `\n## ${title[locale]}\n`)
    ? siteOrigin + markdownPath(docsUrl(locale, "zeabur", slug))
    : undefined
}

/**
 * The docs pages behind the agent page, in `locale`. Until the latest release's guide has the
 * prompt, the page shows "Stay tuned" and no prompt.
 */
export function agentDocs(locale: string) {
  const pages = published()
  return {
    guide:
      pages.includes(guide) && releaseHas(locale, guide, agentGuideMarkdown(locale))
        ? docsUrl(locale, "zeabur", guide)
        : undefined,
    install: pages.includes(install) ? docsUrl(locale, "zeabur", install) : undefined,
  }
}
