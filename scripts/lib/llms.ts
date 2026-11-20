// /llms.txt (https://llmstxt.org/): the docs of each repository, from the English sidebar, with
// links to the Markdown copy of each page.
import { markdownPath, siteOrigin } from "../../src/lib/urls.ts"
import type { SiteData, SiteNav } from "../sync-docs.ts"

const summary =
  "Zeabur is an open-source management interface for Kubernetes clusters. Zeatend sets up Kubernetes on your own servers, Zeabur Identity signs people in with passkeys, Zeabur Builder builds services from Git, and the Zeabur Catalog holds the components and templates."

const about = [
  "Each link below is the Markdown copy of a docs page. The same page as HTML is at the URL without `.md`. Each page is also in Traditional Chinese under `/zh-TW` and in Simplified Chinese under `/zh-CN`, as HTML and as Markdown.",
]

export function llmsTxt(nav: SiteNav[string], site: SiteData): string {
  const lines = ["# Zeabur OSS", "", `> ${summary}`, "", ...about, ""]
  for (const repo of site.repos) {
    const groups = nav[repo.name]
    if (!groups) continue
    lines.push(`## ${repo.label}`, "")
    for (const { slug, label, href } of groups.flatMap((g) => g.items)) {
      const description = site.pages[`en/${repo.name}/${slug}`]?.description
      lines.push(
        `- [${label}](${siteOrigin}${markdownPath(href)})${description ? `: ${description}` : ""}`,
      )
    }
    lines.push("")
  }
  lines.push("## Optional", "")
  for (const repo of site.repos) {
    lines.push(
      `- [${repo.label} on GitHub](https://github.com/${repo.github}): Source code and releases.`,
    )
  }
  return lines.join("\n") + "\n"
}
