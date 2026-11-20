import { readFileSync } from "node:fs"
import { join } from "node:path"
import type { RepoLinks } from "../../scripts/sync-docs.ts"
import { docsUrl, siteOrigin } from "./urls.ts"

const guide = "install/move-from-zeabur"
const install = "install/agent"

/** The Markdown copy of the guide that scripts/sync-docs.ts writes for agents. */
export const agentGuideMarkdown = `${siteOrigin}/docs/move-from-zeabur.md`

const published = (): string[] => {
  const links: Record<string, RepoLinks> = JSON.parse(
    readFileSync(join(process.cwd(), "content/links.json"), "utf8"),
  )
  return links.zeabur?.published ?? []
}

/**
 * The docs pages behind the agent page, in `locale`, once the Zeabur release that docs.lock.json
 * pins has them. Until then the page shows "Stay tuned" and no prompt.
 */
export function agentDocs(locale: string) {
  const pages = published()
  return {
    guide: pages.includes(guide) ? docsUrl(locale, "zeabur", guide) : undefined,
    install: pages.includes(install) ? docsUrl(locale, "zeabur", install) : undefined,
  }
}
