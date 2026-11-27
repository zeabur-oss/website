// Reads the site's own docs/ and each repository's docs/ at its latest full release, or at main
// with DOCS_CHANNEL=main, and writes what Starlight reads:
// src/content/docs/[<locale>/]docs/<repo>/… (<repo>/main/… for main), content/site.json and
// content/nav.json (the sidebar),
// content/catalog.json (the catalog's components and templates), the images and social images
// under public/, and for agents a Markdown copy of each page at its URL plus `.md` and /llms.txt.
//   bun scripts/sync-docs.ts
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { stringify as toYaml } from "yaml"
import sharp from "sharp"
import {
  docsDir,
  docsUrl,
  localePrefix,
  locales,
  markdownPath,
  onMain,
  siteOrigin,
} from "../src/lib/urls.ts"
import { rewriteHref, rewriteSrc, type Context } from "../src/mdx/remark-docs.ts"
import { group } from "../src/lib/capture.ts"
import { readRepoDocs, readText, splitFrontmatter, type RepoDocs } from "./lib/docs.ts"
import { llmsTxt } from "./lib/llms.ts"
import { toMarkdown } from "./lib/markdown.ts"
import {
  at,
  fromDirectory,
  latest,
  releaseAsset,
  root,
  snapshot,
  type Latest,
  type Release,
  type Source,
  type Snapshot,
} from "./lib/repos.ts"
import { readCatalog, type CatalogComponent, type CatalogTemplate } from "./lib/catalog.ts"
import { exampleFiles, type ExampleFile } from "../src/catalog/examples.ts"

export type SitePage = {
  repo: string
  slug: string
  locale: string
  title: string
  description?: string
  /** The repository path the content comes from. */
  source: string
  /** The language the content is written in; differs from `locale` for a fallback. */
  contentLocale: string
}

export type SiteData = {
  repos: Source[]
  /** The latest full release of each product, which the product pages show. */
  releases: Record<string, Release>
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

/** The catalog's components and templates at its latest release. */
export type CatalogData = {
  github: string
  ref: string
  components: CatalogComponent[]
  templates: CatalogTemplate[]
  /** The text of each file the pages show. */
  files: Record<ExampleFile, string>
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
  return join(pagesDir, locale === "en" ? "" : locale, "docs", docsDir(repo), slug + ext)
}

/** The page's file in `locale`, or in the first locale that has one, with that locale. */
function contentOf(files: Partial<Record<string, string>>, locale: string): [string, string] {
  for (const l of [locale, ...locales]) {
    const file = files[l]
    if (file) return [l, file]
  }
  throw new Error("a docs page has no file in any locale")
}

function pageKey(locale: string, repo: string, slug: string) {
  return `${locale}/${docsDir(repo)}/${slug}`
}

/** Title from the frontmatter, or the first `# ` heading, which is then removed from the body. */
function normalise(text: string, fallbackTitle: string) {
  const { data, body } = splitFrontmatter(text)
  let rest = body
  let title = typeof data.title === "string" ? data.title : undefined
  if (!title) {
    // Above a README's title: the cover picture, which repeats the title, and the links to its
    // translations, which the site's language menu replaces.
    const heading = /^#\s+(.+)\n/m.exec(rest)
    const above = rest
      .slice(0, heading?.index)
      .replace(/<picture>[\s\S]*?<\/picture>|<!--[\s\S]*?-->|^.*\]\(README[^)]*\.md\).*$/gm, "")
    if (heading && above.trim() === "") {
      title = group(heading).trim()
      rest = rest.slice(heading.index + heading[0].length)
    }
  }
  const frontmatter: { title: string; description?: string } = { title: title ?? fallbackTitle }
  if (typeof data.description === "string") frontmatter.description = data.description
  return { frontmatter, body: rest.replace(/^\n+/, "") }
}

function writeFile(path: string, text: string) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, text)
}

function navOf(locale: string, repo: Source, docs: RepoDocs, titles: Record<string, string>) {
  const labels = docs.labels[locale]
  const item = (slug: string): NavItem => ({
    slug,
    label: titles[slug] ?? slug,
    href: docsUrl(locale, repo.name, slug),
  })
  const home: NavGroup = { items: [item("index")] }
  const groups: NavGroup[] = [home]
  if (docs.hasNav) {
    for (const group of docs.groups) {
      const slugs = docs.pages.filter((p) => p.group === group.group).map((p) => p.slug)
      if (!slugs.length) continue
      groups.push({ label: labels?.groups[group.group] ?? group.label, items: slugs.map(item) })
    }
  } else {
    home.items.push(...docs.pages.filter((p) => p.slug !== "index").map((p) => item(p.slug)))
  }
  return groups
}

/**
 * Copies the files pages refer to: everything under docs/ but pages, manifests and internal/, so
 * a link to an example file stays on the site.
 */
function copyAssets(snap: Snapshot) {
  const out = join(publicDir, "docs-assets", docsDir(snap.repo.name))
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

/** The site's own docs/: the overview, at /docs/overview, read from the working tree. */
export const siteRepo: Source = {
  name: "overview",
  label: "Overview",
  github: "zeabur-oss/website",
  ref: "main",
}

async function siteDocs(): Promise<Snapshot> {
  return { ...(await fromDirectory(root, siteRepo.name)), repo: siteRepo }
}

/** The catalog pages always show the catalog's latest release. */
async function catalogData(repos: Latest[]): Promise<CatalogData> {
  const repo = repos.find((r) => r.name === "catalog")
  if (!repo) throw new Error("the catalog pages need the catalog repository")
  const snap = await snapshot(at(repo, "release"))
  return {
    github: repo.github,
    ref: snap.repo.ref,
    ...readCatalog(await releaseAsset(snap.repo, "api-v1.tar.gz")),
    files: Object.fromEntries(
      exampleFiles.map((f) => [f, readFileSync(join(snap.dir, f), "utf8")]),
    ) as Record<ExampleFile, string>,
  }
}

export async function sync() {
  const repos = await latest()
  const sources = repos.map((repo) => at(repo, onMain ? "main" : "release"))
  rmSync(content, { recursive: true, force: true })
  rmSync(pagesDir, { recursive: true, force: true })
  rmSync(join(publicDir, "docs-assets"), { recursive: true, force: true })
  for (const locale of locales) {
    rmSync(join(publicDir, localePrefix(locale), "docs"), { recursive: true, force: true })
  }
  const nav: SiteNav = {}
  const site: SiteData = {
    repos: [],
    releases: Object.fromEntries(repos.map((r) => [r.name, r.release])),
    pages: {},
    redirects: [],
  }
  const links: Record<string, RepoLinks> = {}
  for (const next of [siteDocs, ...sources.map((repo) => () => snapshot(repo))]) {
    const snap = await next()
    const { repo } = snap
    const docs = readRepoDocs(snap)
    site.repos.push(repo)
    const titles: Record<string, Record<string, string>> = {}
    for (const page of docs.pages) {
      for (const locale of locales) {
        const [contentLocale, source] = contentOf(page.files, locale)
        const navTitle = docs.labels[locale]?.pages[page.slug]
        const { frontmatter, body } = normalise(readText(snap, source), navTitle ?? page.slug)
        const ext = source.endsWith(".mdx") ? ".mdx" : ".md"
        const data = {
          ...frontmatter,
          repo: repo.name,
          contentLocale,
          sourcePath: source,
        }
        const path = pagePath(locale, repo.name, page.slug, ext)
        writeFile(path, `---\n${toYaml(data).trimEnd()}\n---\n\n${body}`)
        ;(titles[locale] ??= {})[page.slug] = navTitle ?? frontmatter.title
        site.pages[pageKey(locale, repo.name, page.slug)] = {
          repo: repo.name,
          slug: page.slug,
          locale,
          title: frontmatter.title,
          description: frontmatter.description,
          source,
          contentLocale,
        }
      }
    }
    for (const locale of locales) {
      ;(nav[locale] ??= {})[repo.name] = navOf(locale, repo, docs, titles[locale] ?? {})
    }
    for (const [from, to] of Object.entries(docs.redirects)) {
      for (const locale of locales) {
        site.redirects.push({
          from: `${localePrefix(locale)}/docs/${docsDir(repo.name)}/${from}`,
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
    if (!onMain) await writeSocialImage(snap)
    console.log(
      `${repo.name}@${repo.ref}: ${docs.pages.length} pages` +
        (docs.missing.length ? `, ${docs.missing.length} listed without a file` : ""),
    )
  }
  writeFile(join(content, "site.json"), JSON.stringify(site, null, 2))
  writeFile(join(content, "links.json"), JSON.stringify(links))
  writeFile(join(content, "nav.json"), JSON.stringify(nav, null, 2))
  writeFile(join(content, "catalog.json"), JSON.stringify(await catalogData(repos), null, 2))
  writeMarkdown(site, links)
  writeFile(join(publicDir, "llms.txt"), llmsTxt(nav.en ?? {}, site))
  writeFile(
    join(publicDir, "docs/versions.json"),
    JSON.stringify(
      Object.fromEntries(repos.map((r) => [r.name, { release: r.release.tag, main: r.main }])),
      null,
      2,
    ),
  )
}

/** Each page in each locale as Markdown, at its URL plus `.md`, with absolute links. */
function writeMarkdown(site: SiteData, links: Record<string, RepoLinks>) {
  const files = new Map(
    Object.values(links).map((repo) => [
      repo.name,
      {
        files: new Set(repo.files),
        translations: repo.translations,
        published: new Set(repo.published),
      },
    ]),
  )
  for (const page of Object.values(site.pages)) {
    const repo = links[page.repo]
    const repoFiles = files.get(page.repo)
    if (!repo || !repoFiles) continue
    const context: Context = { page, repo, files: repoFiles }
    const absolute = (url: string) => (url.startsWith("/") ? siteOrigin + url : url)
    const pageUrl = docsUrl(page.locale, page.repo, page.slug)
    const ext = page.source.endsWith(".mdx") ? ".mdx" : ".md"
    const { body } = splitFrontmatter(
      readFileSync(pagePath(page.locale, page.repo, page.slug, ext), "utf8"),
    )
    const markdown = toMarkdown({
      title: page.title,
      description: page.description,
      body,
      mdx: ext === ".mdx",
      url: (href, image) =>
        href.startsWith("#")
          ? siteOrigin + pageUrl + href
          : absolute(image ? rewriteSrc(href, context) : rewriteHref(href, context)),
    })
    writeFile(join(publicDir, markdownPath(pageUrl).slice(1)), markdown)
  }
}

if (import.meta.main) await sync()
