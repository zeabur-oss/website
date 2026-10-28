import { readFileSync } from "node:fs"
import { join, relative } from "node:path"
import { parse } from "acorn"
import type { Image, Link, Root } from "mdast"
import type { MdxjsEsm } from "mdast-util-mdxjs-esm"
import { visit } from "unist-util-visit"
import type { VFile } from "vfile"
import type { RepoLinks, SiteData, SitePage } from "../../scripts/sync-docs.ts"
import { registry } from "../docs-components/registry.ts"
import { avifFileSize } from "../lib/avif.ts"
import { docsUrl, localePrefix, locales } from "../lib/urls.ts"
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

let cache: {
  site: SiteData
  links: Record<string, RepoLinks>
  files: Record<string, RepoFiles>
}

function load() {
  if (cache) return cache
  const site: SiteData = JSON.parse(readFileSync(join(root, "content/site.json"), "utf8"))
  const links: Record<string, RepoLinks> = JSON.parse(
    readFileSync(join(root, "content/links.json"), "utf8"),
  )
  const files: Record<string, RepoFiles> = {}
  for (const [name, repo] of Object.entries(links)) {
    files[name] = {
      files: new Set(repo.files),
      translations: repo.translations,
      published: new Set(repo.published),
    }
  }
  cache = { site, links, files }
  return cache
}

/** The synced page a file is: src/content/docs/[<locale>/]docs/<repo>/<slug>.mdx. */
export function contextOf(file: VFile): Context | undefined {
  if (!file.path) return undefined
  const parts = relative(join(root, "src/content/docs"), file.path)
    .replace(/\.mdx?$/, "")
    .split("/")
  const locale = (locales as readonly string[]).includes(parts[0]!) ? parts.shift()! : "en"
  if (parts.shift() !== "docs") return undefined
  const { site, links, files } = load()
  const page = site.pages[`${locale}/${parts.join("/")}`]
  if (!page) return undefined
  return { page, repo: links[page.repo]!, files: files[page.repo]! }
}

/** A GitHub URL of a published docs page, of any locked repository, as its site URL. */
function siteUrlOfGithub(href: string, locale: string) {
  const link = githubDocsLink(href)
  if (!link) return undefined
  const { links, files } = load()
  const repo = Object.values(links).find((r) => r.github === link.github)
  if (!repo) return undefined
  const slug = slugOfPath(link.path, repo.translations)
  if (slug === undefined || !files[repo.name]!.published.has(slug)) return undefined
  return docsUrl(locale, repo.name, slug) + link.hash
}

/**
 * The site URL for a link in a page. Pages, and files under docs/, stay on the site. Only links
 * to the rest of the repository go to GitHub at the locked ref; docs-check fails on those,
 * except in the README.
 */
export function rewriteHref(href: string, { page, repo, files }: Context): string {
  const target = classifyLink(href, page.source, files)
  switch (target.kind) {
    case "anchor":
      return href
    case "external":
      return siteUrlOfGithub(href, page.locale) ?? href
    case "site":
      return (localePrefix(page.locale) + target.path).replace(/(.)\/$/, "$1") + target.hash
    case "page":
      return docsUrl(page.locale, repo.name, target.slug) + target.hash
    case "file":
      if (isDocsAsset(target.path)) return `/docs-assets/${repo.name}/${target.path}${target.hash}`
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
  return path ? `/docs-assets/${repo.name}/${path}` : src
}

function importNode(names: string[]): MdxjsEsm {
  const value = `import { ${names.join(", ")} } from ${JSON.stringify(components)}`
  return {
    type: "mdxjsEsm",
    value,
    data: {
      estree: parse(value, { ecmaVersion: "latest", sourceType: "module" }) as never,
    },
  }
}

/** Screenshots are taken at twice the pixel density, so an AVIF shows at half its size. */
function halfSize(src: string) {
  if (!src.startsWith("/docs-assets/") || !src.endsWith(".avif")) return undefined
  const [width, height] = avifFileSize(join(root, "public", src))
  return { width: width / 2, height: height / 2 }
}

/**
 * Rewrites links and images of the pages that scripts/sync-docs.ts wrote, and imports the
 * registry's components an MDX page uses: pages never import anything themselves.
 */
export function remarkDocs() {
  return (tree: Root, file: VFile) => {
    const context = contextOf(file)
    if (!context) return
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
      const hProperties = { loading: "lazy", decoding: "async", ...halfSize(image.url) }
      image.data = { ...image.data, hProperties: { ...image.data?.hProperties, ...hProperties } }
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
