import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { parse as parseYaml } from "yaml"
import type { Snapshot } from "./repos.ts"

export const siteLocales = ["en", "zh-TW", "zh-CN"] as const
export type Locale = (typeof siteLocales)[number]
/** The order in which a locale falls back when a page has no translation for it. */
export const fallbackOrder: Locale[] = ["en", "zh-TW", "zh-CN"]

export type NavGroup = { group: string; label: string; pages: string[] }
export type NavLabels = { groups: Record<string, string>; pages: Record<string, string> }

export type Page = {
  /** `index`, or the path under docs/ without extension: `get-started/quickstart`. */
  slug: string
  group?: string
  /** Repository paths of the page, by the locale it is written in. */
  files: Partial<Record<string, string>>
}

export type RepoDocs = {
  hasNav: boolean
  groups: NavGroup[]
  labels: Record<string, NavLabels>
  /** Folders under docs/ that hold translations. */
  translations: string[]
  pages: Page[]
  /** Pages that nav.yaml lists but no file has. */
  missing: { slug: string; group: string }[]
  redirects: Record<string, string>
}

const pageExtensions = [".mdx", ".md"]
/** Names a page or folder may not take: translation folders, and docs/ folders that are not pages. */
export const reservedNames = ["internal", "images"]

export function isLocaleName(name: string) {
  return (
    (siteLocales as readonly string[]).includes(name) || /^[a-z]{2}(-[A-Za-z]{2,4})?$/.test(name)
  )
}

export function readText(snap: Snapshot, path: string) {
  return readFileSync(join(snap.dir, path), "utf8")
}

export function readYaml<T>(snap: Snapshot, path: string): T | undefined {
  if (!snap.files.has(path)) return undefined
  return parseYaml(readText(snap, path)) as T
}

export function splitFrontmatter(text: string): { data: Record<string, unknown>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text)
  if (!match) return { data: {}, body: text }
  return {
    data: (parseYaml(match[1]!) as Record<string, unknown>) ?? {},
    body: text.slice(match[0].length),
  }
}

/** The `source` a translation records: the first 12 hex digits of the original's SHA-256. */
export function sourceHash(text: string) {
  return createHash("sha256").update(text).digest("hex").slice(0, 12)
}

export function pageFile(snap: Snapshot, base: string): string | undefined {
  return pageExtensions.map((ext) => base + ext).find((path) => snap.files.has(path))
}

export function readRepoDocs(snap: Snapshot): RepoDocs {
  const nav = readYaml<NavGroup[]>(snap, "docs/nav.yaml")
  const translations = [
    ...new Set(
      [...snap.files]
        .map((f) => /^docs\/([^/]+)\//.exec(f)?.[1])
        .filter((d): d is string => !!d && isLocaleName(d)),
    ),
  ]
  const labels: Record<string, NavLabels> = {}
  for (const locale of translations) {
    const translated = readYaml<
      { group: string; label?: string; pages?: Record<string, string> }[]
    >(snap, `docs/${locale}/nav.yaml`)
    labels[locale] = { groups: {}, pages: {} }
    for (const entry of translated ?? []) {
      if (entry.label) labels[locale].groups[entry.group] = entry.label
      for (const [page, title] of Object.entries(entry.pages ?? {})) {
        labels[locale].pages[`${entry.group}/${page}`] = title
      }
    }
  }
  const groups = nav ?? []
  const filesOf = (slug: string) => {
    const files: Page["files"] = {}
    const original = pageFile(snap, `docs/${slug}`)
    if (original) files.en = original
    for (const locale of translations) {
      const translated = pageFile(snap, `docs/${locale}/${slug}`)
      if (translated) files[locale] = translated
    }
    return files
  }
  const pages: Page[] = []
  const missing: RepoDocs["missing"] = []
  const readme = snap.files.has("README.md") ? "README.md" : undefined
  const index = filesOf("index")
  if (!index.en && readme && !Object.keys(index).length) index.en = readme
  if (Object.keys(index).length) pages.push({ slug: "index", files: index })
  if (nav) {
    for (const group of groups) {
      for (const name of group.pages) {
        const slug = `${group.group}/${name}`
        const files = filesOf(slug)
        if (Object.keys(files).length) pages.push({ slug, group: group.group, files })
        else missing.push({ slug, group: group.group })
      }
    }
  } else {
    // Without nav.yaml: the README is the home page, then every page directly in docs/, in the
    // order the README links them.
    const linked = readme
      ? [...readText(snap, readme).matchAll(/\]\(docs\/([^)#]+)\.mdx?[)#]/g)]
      : []
    const order = linked.map((m) => m[1]!)
    const top = [...snap.files]
      .filter((f) => /^docs\/[^/]+\.mdx?$/.test(f) && !/^docs\/index\.mdx?$/.test(f))
      .map((f) => f.slice(5).replace(/\.mdx?$/, ""))
    const rank = (slug: string) => (order.includes(slug) ? order.indexOf(slug) : order.length)
    top.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
    for (const slug of [...new Set(top)]) pages.push({ slug, files: filesOf(slug) })
  }
  const redirects = readYaml<Record<string, string>>(snap, "docs/redirects.yaml") ?? {}
  return { hasNav: !!nav, groups, labels, translations, pages, missing, redirects }
}
