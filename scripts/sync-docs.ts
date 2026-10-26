// Reads each repository's docs/ at the ref in docs.lock.json and writes what Starlight reads:
// src/content/docs/[<locale>/]docs/<repo>/…, content/site.json and content/nav.json (the sidebar),
// and the images, screenshots and social images under public/.
//   bun scripts/sync-docs.ts
import { $ } from "bun"
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { stringify as toYaml } from "yaml"
import sharp from "sharp"
import { avifSize } from "../src/lib/avif.ts"
import { docsUrl, localePrefix } from "../src/lib/urls.ts"
import {
  fallbackOrder,
  readRepoDocs,
  readText,
  siteLocales,
  splitFrontmatter,
  type RepoDocs,
} from "./lib/docs.ts"
import { readLock, root, snapshot, walk, type LockRepo, type Snapshot } from "./lib/repos.ts"

export type SitePage = {
  repo: string
  slug: string
  locale: string
  title: string
  /** The repository path the content comes from. */
  source: string
  /** The language the content is written in; differs from `locale` for a fallback. */
  contentLocale: string
}

export type SiteData = {
  repos: Pick<LockRepo, "name" | "label" | "github" | "ref">[]
  pages: Record<string, SitePage>
  redirects: { from: string; to: string }[]
}

/** What the remark plugin needs to rewrite links in one repository's pages. */
export type RepoLinks = {
  name: string
  github: string
  ref: string
  translations: string[]
  published: string[]
  files: string[]
}

export type NavItem = { label: string; href: string; slug: string }
export type NavGroup = { label?: string; items: NavItem[] }
/** The sidebar of each repository in each locale: `nav[locale][repo]`. */
export type SiteNav = Record<string, Record<string, NavGroup[]>>

const content = join(root, "content")
const pagesDir = join(root, "src/content/docs")
const publicDir = join(root, "public")
/** Manifests under docs/ that are not files a page links to. */
const manifests = /^docs\/([^/]+\/)?(nav|redirects|([a-z]+-)?shots)\.ya?ml$/

function pagePath(locale: string, repo: string, slug: string, ext: string) {
  return join(pagesDir, locale === "en" ? "" : locale, "docs", repo, slug + ext)
}

function pageKey(locale: string, repo: string, slug: string) {
  return `${locale}/${repo}/${slug}`
}

/** Title from the frontmatter, or the first `# ` heading, which is then removed from the body. */
function normalise(text: string, fallbackTitle: string) {
  const { data, body } = splitFrontmatter(text)
  let rest = body
  let title = typeof data.title === "string" ? data.title : undefined
  if (!title) {
    // The README's cover picture repeats the title as an image.
    rest = rest.replace(/^\s*<picture>[\s\S]*?<\/picture>\s*/, "")
    const heading = /^#\s+(.+)\n/m.exec(rest)
    if (heading && rest.slice(0, heading.index).trim() === "") {
      title = heading[1]!.trim()
      rest = rest.slice(heading.index + heading[0].length)
    }
  }
  const frontmatter: Record<string, string> = { title: title ?? fallbackTitle }
  if (typeof data.description === "string") frontmatter.description = data.description
  return { frontmatter, body: rest.replace(/^\n+/, "") }
}

function writeFile(path: string, text: string) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, text)
}

function navOf(locale: string, repo: LockRepo, docs: RepoDocs, titles: Record<string, string>) {
  const labels = docs.labels[locale]
  const item = (slug: string): NavItem => ({
    slug,
    label: titles[slug] ?? slug,
    href: docsUrl(locale, repo.name, slug),
  })
  const groups: NavGroup[] = [{ items: [item("index")] }]
  if (docs.hasNav) {
    for (const group of docs.groups) {
      const slugs = docs.pages.filter((p) => p.group === group.group).map((p) => p.slug)
      if (!slugs.length) continue
      groups.push({ label: labels?.groups[group.group] ?? group.label, items: slugs.map(item) })
    }
  } else {
    groups[0]!.items.push(...docs.pages.filter((p) => p.slug !== "index").map((p) => item(p.slug)))
  }
  return groups
}

/**
 * Copies the files pages refer to: everything under docs/ but pages, manifests and internal/, so
 * a link to an example file stays on the site.
 */
function copyAssets(snap: Snapshot) {
  const out = join(publicDir, "docs-assets", snap.repo.name)
  rmSync(out, { recursive: true, force: true })
  for (const path of snap.files) {
    const inDocs =
      path.startsWith("docs/") &&
      !path.startsWith("docs/internal/") &&
      !/\.mdx?$/.test(path) &&
      !manifests.test(path)
    if (!inDocs) continue
    const from = join(snap.dir, path)
    if (!existsSync(from)) continue
    mkdirSync(dirname(join(out, path)), { recursive: true })
    copyFileSync(from, join(out, path))
  }
}

/**
 * Screenshots: the release's docs-shots-<tag>.tar when the lock names one, else what
 * scripts/shots.sh left in .shots/<repo>.
 */
async function copyShots(repo: LockRepo, sizes: Record<string, [number, number]>) {
  let from = join(root, ".shots", repo.name)
  if (repo.shots) {
    from = join(root, ".cache/shots", `${repo.name}-${repo.shots}`)
    if (!existsSync(join(from, "manifest.json"))) {
      mkdirSync(from, { recursive: true })
      const url = `https://github.com/${repo.github}/releases/download/${repo.shots}/docs-shots-${repo.shots}.tar`
      const response = await fetch(url)
      if (!response.ok) throw new Error(`${url}: ${response.status}`)
      const tar = join(from, "shots.tar")
      writeFileSync(tar, new Uint8Array(await response.arrayBuffer()))
      await $`tar -xf ${tar} -C ${from}`.quiet()
      rmSync(tar)
    }
  }
  const out = join(publicDir, "shots", repo.name)
  rmSync(out, { recursive: true, force: true })
  const files = walk(from).filter((p) => p.endsWith(".avif"))
  for (const path of files) {
    const name = path.slice(from.length + 1)
    mkdirSync(dirname(join(out, name)), { recursive: true })
    copyFileSync(path, join(out, name))
    const size = avifSize(readFileSync(path))
    if (size) sizes[`${repo.name}/${name.replace(/\.avif$/, "")}`] = size
  }
  return files.length
}

/** The social image of a repository: its README cover, dark, as the 1280 × 640 PNG crawlers read, the size of the covers. */
async function writeSocialImage(snap: Snapshot) {
  const cover = join(snap.dir, "docs/images/cover-dark.avif")
  if (!existsSync(cover)) return
  mkdirSync(join(publicDir, "og"), { recursive: true })
  await sharp(cover)
    .resize(1280, 640)
    .png({ compressionLevel: 9 })
    .toFile(join(publicDir, "og", `${snap.repo.name}.png`))
}

export async function sync() {
  const lock = readLock()
  rmSync(content, { recursive: true, force: true })
  rmSync(pagesDir, { recursive: true, force: true })
  const nav: SiteNav = {}
  const site: SiteData = { repos: [], pages: {}, redirects: [] }
  const sizes: Record<string, [number, number]> = {}
  const links: Record<string, RepoLinks> = {}
  for (const repo of lock) {
    const snap = await snapshot(repo)
    const docs = readRepoDocs(snap)
    site.repos.push({ name: repo.name, label: repo.label, github: repo.github, ref: repo.ref })
    const titles: Record<string, Record<string, string>> = {}
    for (const page of docs.pages) {
      for (const locale of siteLocales) {
        const contentLocale = [locale, ...fallbackOrder].find((l) => page.files[l])!
        const source = page.files[contentLocale]!
        const navTitle = docs.labels[locale]?.pages[page.slug]
        const { frontmatter, body } = normalise(readText(snap, source), navTitle ?? page.slug)
        const ext = source.endsWith(".mdx") ? ".mdx" : ".md"
        const data = { ...frontmatter, repo: repo.name, contentLocale, sourcePath: source }
        const path = pagePath(locale, repo.name, page.slug, ext)
        writeFile(path, `---\n${toYaml(data).trimEnd()}\n---\n\n${body}`)
        ;(titles[locale] ??= {})[page.slug] = navTitle ?? frontmatter.title!
        site.pages[pageKey(locale, repo.name, page.slug)] = {
          repo: repo.name,
          slug: page.slug,
          locale,
          title: frontmatter.title!,
          source,
          contentLocale,
        }
      }
    }
    for (const locale of siteLocales) {
      ;(nav[locale] ??= {})[repo.name] = navOf(locale, repo, docs, titles[locale] ?? {})
    }
    for (const [from, to] of Object.entries(docs.redirects)) {
      for (const locale of siteLocales) {
        site.redirects.push({
          from: `${localePrefix(locale)}/docs/${repo.name}/${from}`,
          to: docsUrl(locale, repo.name, to),
        })
      }
    }
    links[repo.name] = {
      name: repo.name,
      github: repo.github,
      ref: repo.ref,
      translations: docs.translations,
      published: docs.pages.map((p) => p.slug),
      files: [...snap.files],
    }
    copyAssets(snap)
    await writeSocialImage(snap)
    const shots = await copyShots(repo, sizes)
    console.log(
      `${repo.name}@${repo.ref.slice(0, 8)}: ${docs.pages.length} pages` +
        (docs.missing.length ? `, ${docs.missing.length} listed without a file` : "") +
        `, ${shots} screenshots`,
    )
  }
  writeFile(join(content, "site.json"), JSON.stringify(site, null, 2))
  writeFile(join(content, "links.json"), JSON.stringify(links))
  writeFile(join(content, "shots.json"), JSON.stringify(sizes, null, 2))
  writeFile(join(content, "nav.json"), JSON.stringify(nav, null, 2))
}

if (import.meta.main) await sync()
