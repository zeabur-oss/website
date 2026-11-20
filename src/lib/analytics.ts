// The events the site sends to PostHog besides its own page views. Page views carry the path
// (and so the locale), the referrer and any utm_* parameters.
export type SiteEvent =
  | { name: "github_clicked"; props: { repo?: string } }
  | { name: "releases_clicked"; props: { repo: string } }
  | { name: "download_clicked"; props: { repo: string; tag: string; file: string } }
  | { name: "code_copied"; props: CodeBlock }
  | { name: "start_seen"; props: Record<string, never> }

export interface CodeBlock {
  by: "button" | "selection"
  heading?: string
  language?: string
  tab?: string
  index: number
  first_line: string
}

const repoLink =
  /^https:\/\/github\.com\/zeabur-oss(?:\/([^/?#]+)(\/releases(?:\/(?:download\/([^/?#]+)|latest\/download)\/([^/?#]+))?)?)?(?:[/?#]|$)/

// The event for a link to the zeabur-oss organisation, a repository, its releases or a file of
// a release; none for other links.
export function linkEvent(href: string): SiteEvent | undefined {
  const match = repoLink.exec(href)
  if (!match) return undefined
  const [, repo, releases, tag, file] = match
  if (repo && file) {
    const props = { repo, tag: tag ?? "latest", file }
    return { name: "download_clicked", props }
  }
  if (repo && releases) {
    return { name: "releases_clicked", props: { repo } }
  }
  return { name: "github_clicked", props: { repo } }
}

// The first line of copied code that is not a comment, short enough to group by.
export function firstLine(code: string): string {
  const lines = code
    .split(/[\n\u007f]/)
    .map((line) => line.trim())
    .filter(Boolean)
  return (lines.find((line) => !line.startsWith("#")) ?? lines[0] ?? "").slice(0, 120)
}
