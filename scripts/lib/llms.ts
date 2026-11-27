// /llms.txt (https://llmstxt.org/): the docs of each repository's latest release, from the English
// sidebar, with links to the Markdown copy of each page.
import { markdownPath, siteOrigin } from "../../src/lib/urls.ts"
import type { SiteData, SiteNav } from "../sync-docs.ts"

const summary =
  "Zeabur OSS is an open-source web interface that deploys and runs services on your own Kubernetes cluster. Zeatend sets up Kubernetes on a Linux server, one `helm install` installs Zeabur OSS with Zeabur Identity for sign-in, and Zeabur OSS installs components and templates from the Zeabur Catalog, such as Zeabur Builder, which builds services from Git."

const about = [
  "The overview names each project and its role; read it first. Each link below is the Markdown copy of a docs page. The same page as HTML is at the URL without `.md`. Each page is also in Traditional Chinese under `/zh-TW` and in Simplified Chinese under `/zh-CN`, as HTML and as Markdown.",
]

export function llmsTxt(nav: SiteNav[string], site: SiteData): string {
  const lines = ["# Zeabur OSS", "", `> ${summary}`, "", ...about, ""]
  const repos = site.repos.filter((r) => r.channel === "release")
  for (const repo of repos) {
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
  for (const repo of repos.filter((r) => r.github !== "zeabur-oss/website")) {
    lines.push(
      `- [${repo.label} on GitHub](https://github.com/${repo.github}): Source code and releases.`,
    )
  }
  return lines.join("\n") + "\n"
}
