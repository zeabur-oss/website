import { readFileSync } from "node:fs"
import { join, relative } from "node:path"
import type { Program } from "estree"
import type { Image, Link, Root } from "mdast"
import type { MdxjsEsm } from "mdast-util-mdxjs-esm"
import { visit } from "unist-util-visit"
import type { VFile } from "vfile"
import type { RepoLinks, SiteData, SitePage } from "../../scripts/sync-docs.ts"
import { registry } from "../docs-components/registry.ts"
import { avifFileSize } from "../lib/avif.ts"
import { buildPath, docsDir, docsUrl, localePrefix, locales } from "../lib/urls.ts"
import {
  classifyLink,
  githubDocsLink,
  isDocsAsset,
  resolveImage,
  slugOfPath,
  type RepoFiles,
} from "./links.ts"

const root = join(import.meta.dirname, "../..")
const components = join(root, "src/docs-components/index.ts")

export type Context = { page: SitePage; repo: RepoLinks; files: RepoFiles }

let cache:
  | { site: SiteData; repos: Map<string, { links: RepoLinks; files: RepoFiles }> }
  | undefined

function load() {
  if (cache) return cache
  const site: SiteData = JSON.parse(readFileSync(join(root, "content/site.json"), "utf8"))
  const links: Record<string, RepoLinks> = JSON.parse(
    readFileSync(join(root, "content/links.json"), "utf8"),
  )
  const repos = new Map<string, { links: RepoLinks; files: RepoFiles }>()
  for (const [name, repo] of Object.entries(links)) {
    repos.set(name, {
      links: repo,
      files: {
        files: new Set(repo.files),
        translations: repo.translations,
        published: new Set(repo.published),
      },
    })
  }
  cache = { site, repos }
  return cache
}

/** The synced page a file is: src/content/docs/[<locale>/]docs/<repo>/<slug>.mdx. */
export function contextOf(file: VFile): Context | undefined {
  if (!file.path) return undefined
  const [first = "", ...rest] = relative(join(root, "src/content/docs"), file.path)
    .replace(/\.mdx?$/, "")
    .split("/")
  const written = (locales as readonly string[]).includes(first)
  const locale = written ? first : "en"
  const [docs, ...slug] = written ? rest : [first, ...rest]
  if (docs !== "docs") return undefined
  const { site, repos } = load()
  const page = site.pages[`${locale}/${slug.join("/")}`]
  const repo = page && repos.get(page.repo)
  if (!page || !repo) return undefined
  return { page, repo: repo.links, files: repo.files }
}

/** A GitHub URL of a published docs page, of any repository the site carries, as its site URL. */
function siteUrlOfGithub(href: string, locale: string) {
  const link = githubDocsLink(href)
  if (!link) return undefined
  const repo = [...load().repos.values()].find((r) => r.links.github === link.github)
  if (!repo) return undefined
  const slug = slugOfPath(link.path, repo.links.translations)
  if (slug === undefined || !repo.files.published.has(slug)) return undefined
  return docsUrl(locale, repo.links.name, slug) + link.hash
}

/**
 * The site URL for a link in a page. Pages, and files under docs/, stay on the site. Links to the
 * rest of the repository go to GitHub at the tag or commit the page comes from.
 */
export function rewriteHref(href: string, { page, repo, files }: Context): string {
  const target = classifyLink(href, page.source, files)
  switch (target.kind) {
    case "anchor":
      return href
    case "external":
      return siteUrlOfGithub(href, page.locale) ?? href
    case "site":
      return (
        (localePrefix(page.locale) + buildPath(target.path)).replace(/(.)\/$/, "$1") + target.hash
      )
    case "page":
      return docsUrl(page.locale, repo.name, target.slug) + target.hash
    case "file":
      if (isDocsAsset(target.path))
        return `/docs-assets/${docsDir(repo.name)}/${target.path}${target.hash}`
      return `https://github.com/${repo.github}/blob/${repo.ref}/${target.path}${target.hash}`
    case "dir":
      return `https://github.com/${repo.github}/tree/${repo.ref}/${target.path}${target.hash}`
    default:
      return `https://github.com/${repo.github}/blob/${repo.ref}/${target.path}${target.hash}`
  }
}

export function rewriteSrc(src: string, { page, repo, files }: Context): string {
  const target = classifyLink(src, page.source, files)
  if (target.kind === "site") return target.path
  if (target.kind === "external" || target.kind === "anchor") return src
  const path = resolveImage(target.path, files)
  return path ? `/docs-assets/${docsDir(repo.name)}/${path}` : src
}

function importNode(names: string[]): MdxjsEsm {
  const source = JSON.stringify(components)
  const estree = {
    type: "Program",
    sourceType: "module",
    body: [
      {
        type: "ImportDeclaration",
        attributes: [],
        specifiers: names.map((name) => ({
          type: "ImportSpecifier",
          imported: { type: "Identifier", name },
          local: { type: "Identifier", name },
        })),
        source: { type: "Literal", value: components, raw: source },
      },
    ],
  } satisfies Program
  return {
    type: "mdxjsEsm",
    value: `import { ${names.join(", ")} } from ${source}`,
    data: { estree },
  }
}

/** Screenshots are taken at twice the pixel density, so an AVIF shows at half its size. */
function halfSize(src: string) {
  if (!/^\/(docs-assets|blog)\//.test(src) || !src.endsWith(".avif")) return undefined
  const [width, height] = avifFileSize(join(root, "public", src))
  return { width: width / 2, height: height / 2 }
}

/** Docs and blog images load lazily, at the size they show. */
function imageProperties(src: string) {
  return { loading: "lazy", decoding: "async", ...halfSize(src) }
}

/**
 * Rewrites links and images of the pages that scripts/sync-docs.ts wrote, and imports the
 * registry's components an MDX page uses: pages never import anything themselves.
 */
export function remarkDocs() {
  return (tree: Root, file: VFile) => {
    const context = contextOf(file)
    if (!context) {
      visit(tree, "image", (image: Image) => {
        image.data = {
          ...image.data,
          hProperties: { ...image.data?.hProperties, ...imageProperties(image.url) },
        }
      })
      return
    }
    const mdx = file.path.endsWith(".mdx")
    visit(tree, (node) => {
      if (node.type === "link" || node.type === "definition") {
        ;(node as Link).url = rewriteHref((node as Link).url, context)
        // rehypeDocsHtml must not rewrite this link a second time.
        node.data = { ...node.data, hProperties: { ...node.data?.hProperties, dataRewritten: "" } }
        return
      }
      if (node.type !== "image") return
      const image = node as Image
      image.url = rewriteSrc(image.url, context)
      image.data = {
        ...image.data,
        hProperties: { ...image.data?.hProperties, ...imageProperties(image.url) },
      }
    })
    if (!mdx) return
    const used = new Set<string>()
    visit(tree, (node) => {
      if (
        (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
        node.name &&
        node.name in registry
      ) {
        used.add(node.name)
      }
    })
    if (used.size) tree.children.unshift(importNode([...used].sort()))
  }
}
