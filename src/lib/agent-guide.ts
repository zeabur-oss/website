import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import type { RepoLinks } from "../../scripts/sync-docs.ts"
import { docsUrl, markdownPath, siteOrigin } from "./urls.ts"

const guide = "get-started/from-zeabur-com"
const install = "install/agent"

/** The Markdown copy of the guide (scripts/sync-docs.ts), which the prompt asks the agent to read. */
export const agentGuideMarkdown = (locale: string) =>
  siteOrigin + markdownPath(docsUrl(locale, "zeabur", guide))

const published = (): string[] => {
  const links: Record<string, RepoLinks> = JSON.parse(
    readFileSync(join(process.cwd(), "content/links.json"), "utf8"),
  )
  return links.zeabur?.published ?? []
}

/** The guide in Zeabur's latest release gives the same prompt. */
const guideReady = (locale: string) => {
  const file = join(
    process.cwd(),
    "src/content/docs",
    locale === "en" ? "" : locale,
    "docs/zeabur",
    `${guide}.mdx`,
  )
  return existsSync(file) && readFileSync(file, "utf8").includes(agentGuideMarkdown(locale))
}

/**
 * The docs pages behind the agent page, in `locale`. Until the latest release's guide has the
 * prompt, the page shows "Stay tuned" and no prompt.
 */
export function agentDocs(locale: string) {
  const pages = published()
  return {
    guide:
      pages.includes(guide) && guideReady(locale) ? docsUrl(locale, "zeabur", guide) : undefined,
    install: pages.includes(install) ? docsUrl(locale, "zeabur", install) : undefined,
  }
}
