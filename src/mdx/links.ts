import { posix } from "node:path"
import { siteOrigin } from "../lib/urls.ts"

export type LinkTarget =
  | { kind: "external" }
  | { kind: "anchor" }
  /** A path on this site, from `https://oss.zeabur.com/…`, without the locale prefix. */
  | { kind: "site"; path: string; hash: string }
  | { kind: "page"; slug: string; hash: string; path: string; exists: boolean }
  /** A page file that nav.yaml does not publish. */
  | { kind: "unpublished"; path: string; hash: string }
  | { kind: "file" | "dir" | "missing"; path: string; hash: string }

export type RepoFiles = {
  files: Set<string>
  translations: string[]
  published: Set<string>
}

/** A file or folder of a zeabur-oss repository on GitHub, at any ref. */
const githubFile =
  /^https:\/\/github\.com\/(zeabur-oss\/[^/#?]+)\/(?:blob|tree)\/[^/#?]+\/([^#?]+)([?#].*)?$/

/**
 * A link written as a GitHub URL to a docs page or README of a zeabur-oss repository. The site
 * shows that page itself, so the link should not leave the site.
 */
export function githubDocsLink(href: string) {
  const match = githubFile.exec(href)
  if (!match) return undefined
  const [, github, path, hash = ""] = match
  if (path !== "README.md" && !/^docs\/.+\.mdx?$/.test(path!)) return undefined
  return { github: github!, path: path!, hash }
}

/** Files a page may link to on the site: what sync-docs.ts copies to /docs-assets/<repo>/. */
export function isDocsAsset(path: string) {
  return path.startsWith("docs/") && !path.startsWith("docs/internal/")
}

export function slugOfPath(path: string, translations: string[]): string | undefined {
  if (path === "README.md") return "index"
  const match = /^docs\/(.+)\.mdx?$/.exec(path)
  if (!match) return undefined
  const parts = match[1]!.split("/")
  if (translations.includes(parts[0]!)) parts.shift()
  return parts.join("/")
}

/** What a link or image reference in the repository file `from` points to. */
export function classifyLink(href: string, from: string, repo: RepoFiles): LinkTarget {
  if (href.startsWith("#")) return { kind: "anchor" }
  if (href.startsWith(siteOrigin + "/") || href === siteOrigin) {
    const url = new URL(href)
    const path = url.pathname.replace(/^\/(zh-TW|zh-CN)(?=\/|$)/, "") || "/"
    return { kind: "site", path, hash: url.hash }
  }
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("//")) return { kind: "external" }
  const hashAt = href.search(/[?#]/)
  const raw = hashAt === -1 ? href : href.slice(0, hashAt)
  const hash = hashAt === -1 ? "" : href.slice(hashAt)
  let decoded = raw
  try {
    decoded = decodeURI(raw)
  } catch {}
  const path = (
    decoded.startsWith("/")
      ? posix.normalize(decoded.slice(1))
      : posix.normalize(posix.join(posix.dirname(from), decoded))
  ).replace(/\/$/, "")
  if (path.startsWith("..")) return { kind: "missing", path, hash }
  const slug = slugOfPath(path, repo.translations)
  if (slug !== undefined && /\.mdx?$/.test(path)) {
    if (repo.published.has(slug))
      return { kind: "page", slug, hash, path, exists: repo.files.has(path) }
    return { kind: repo.files.has(path) ? "unpublished" : "missing", path, hash }
  }
  if (repo.files.has(path)) return { kind: "file", path, hash }
  if (path === "." || [...repo.files].some((f) => f.startsWith(path + "/"))) {
    return { kind: "dir", path, hash }
  }
  return { kind: "missing", path, hash }
}

/** An image path in a translation falls back to the original's file of the same name. */
export function resolveImage(path: string, repo: RepoFiles) {
  if (repo.files.has(path)) return path
  const match = /^docs\/([^/]+)\/(images\/.+)$/.exec(path)
  if (match && repo.translations.includes(match[1]!) && repo.files.has(`docs/${match[2]}`)) {
    return `docs/${match[2]}`
  }
  return undefined
}
