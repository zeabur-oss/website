// Reads each repository's docs/ at the ref in docs.lock.json and writes what Fumadocs reads:
// content/docs/<locale>/<repo>/… with meta.json files, content/site.json, and the images and
// screenshots under public/.
//   bun scripts/sync-docs.ts
import { $ } from "bun"
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { stringify as toYaml } from "yaml"
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

const content = join(root, "content")
const publicDir = join(root, "public")

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

function writeMeta(locale: string, repo: LockRepo, docs: RepoDocs) {
  const base = join(content, "docs", locale, repo.name)
  const labels = docs.labels[locale]
  const pages = ["index"]
  if (docs.hasNav) {
    for (const group of docs.groups) {
      const names = docs.pages.filter((p) => p.group === group.group).map((p) => p.slug)
      if (!names.length) continue
      pages.push(`---${labels?.groups[group.group] ?? group.label}---`, `...${group.group}`)
      // A page may sit in a folder of its group (`databases/index`): list each folder once.
      const order = [...new Set(names.map((slug) => slug.split("/")[1]!))]
      writeFile(join(base, group.group, "meta.json"), JSON.stringify({ pages: order }, null, 2))
    }
  } else {
    pages.push(...docs.pages.filter((p) => p.slug !== "index").map((p) => p.slug))
  }
  writeFile(
    join(base, "meta.json"),
    JSON.stringify({ title: repo.label, root: true, pages }, null, 2),
  )
}

/** Copies the files pages refer to: everything under docs/ but pages, manifests and internal/. */
function copyAssets(snap: Snapshot) {
  const out = join(publicDir, "docs-assets", snap.repo.name)
  rmSync(out, { recursive: true, force: true })
  for (const path of snap.files) {
    const inDocs =
      path.startsWith("docs/") &&
      !path.startsWith("docs/internal/") &&
      !/\.(mdx?|ya?ml)$/.test(path)
    if (!inDocs) continue
    const from = join(snap.dir, path)
    if (!existsSync(from)) continue
    mkdirSync(dirname(join(out, path)), { recursive: true })
    copyFileSync(from, join(out, path))
  }
}

/** Width and height from an AVIF's `ispe` box. */
export function avifSize(bytes: Uint8Array): [number, number] | undefined {
  for (let i = 0; i + 16 < bytes.length; i++) {
    if (
      bytes[i] === 0x69 &&
      bytes[i + 1] === 0x73 &&
      bytes[i + 2] === 0x70 &&
      bytes[i + 3] === 0x65
    ) {
      const view = new DataView(bytes.buffer, bytes.byteOffset + i + 8, 8)
      return [view.getUint32(0), view.getUint32(4)]
    }
  }
  return undefined
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

export async function sync() {
  const lock = readLock()
  rmSync(content, { recursive: true, force: true })
  const site: SiteData = { repos: [], pages: {}, redirects: [] }
  const sizes: Record<string, [number, number]> = {}
  const links: Record<string, RepoLinks> = {}
  for (const repo of lock) {
    const snap = await snapshot(repo)
    const docs = readRepoDocs(snap)
    site.repos.push({ name: repo.name, label: repo.label, github: repo.github, ref: repo.ref })
    for (const page of docs.pages) {
      for (const locale of siteLocales) {
        const contentLocale = [locale, ...fallbackOrder].find((l) => page.files[l])!
        const source = page.files[contentLocale]!
        const navTitle = docs.labels[locale]?.pages[page.slug]
        const { frontmatter, body } = normalise(readText(snap, source), navTitle ?? page.slug)
        const ext = source.endsWith(".mdx") ? ".mdx" : ".md"
        const path = join(content, "docs", locale, repo.name, page.slug + ext)
        writeFile(path, `---\n${toYaml(frontmatter).trimEnd()}\n---\n\n${body}`)
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
    for (const locale of siteLocales) writeMeta(locale, repo, docs)
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
    const shots = await copyShots(repo, sizes)
    console.log(
      `${repo.name}@${repo.ref.slice(0, 8)}: ${docs.pages.length} pages` +
        (docs.missing.length ? `, ${docs.missing.length} listed without a file` : "") +
        `, ${shots} screenshots`,
    )
  }
  for (const locale of siteLocales) {
    writeFile(
      join(content, "docs", locale, "meta.json"),
      JSON.stringify({ pages: lock.map((r) => r.name) }, null, 2),
    )
  }
  writeFile(join(content, "site.json"), JSON.stringify(site, null, 2))
  writeFile(join(content, "links.json"), JSON.stringify(links))
  writeFile(join(content, "shots.json"), JSON.stringify(sizes, null, 2))
}

if (import.meta.main) await sync()
