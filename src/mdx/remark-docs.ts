import { readFileSync } from "node:fs"
import { join, relative } from "node:path"
import type { Image, Link, Root } from "mdast"
import type { MdxJsxAttribute, MdxJsxFlowElement } from "mdast-util-mdx-jsx"
import { visit } from "unist-util-visit"
import type { VFile } from "vfile"
import type { RepoLinks, SiteData, SitePage } from "../../scripts/sync-docs.ts"
import { docsUrl, localePrefix, shotPattern } from "../lib/urls.ts"
import { classifyLink, resolveImage, type RepoFiles } from "./links.ts"

const root = join(import.meta.dirname, "../..")

type Context = { page: SitePage; repo: RepoLinks; files: RepoFiles }

let cache: { site: SiteData; links: Record<string, RepoLinks>; files: Record<string, RepoFiles> }

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

export function contextOf(file: VFile): Context | undefined {
  if (!file.path) return undefined
  const key = relative(join(root, "content/docs"), file.path).replace(/\.mdx?$/, "")
  const { site, links, files } = load()
  const page = site.pages[key]
  if (!page) return undefined
  return { page, repo: links[page.repo]!, files: files[page.repo]! }
}

/** The site URL for a link in a page, or GitHub at the locked ref for files that are not pages. */
export function rewriteHref(href: string, { page, repo, files }: Context): string {
  const target = classifyLink(href, page.source, files)
  switch (target.kind) {
    case "external":
    case "anchor":
      return href
    case "site":
      return (localePrefix(page.locale) + target.path).replace(/(.)\/$/, "$1") + target.hash
    case "page":
      return docsUrl(page.locale, repo.name, target.slug) + target.hash
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

function attribute(name: string, value: string): MdxJsxAttribute {
  return { type: "mdxJsxAttribute", name, value }
}

/**
 * Rewrites links and images of the pages that scripts/sync-docs.ts wrote, and turns release
 * screenshots (`https://oss.zeabur.com/shots/…`) into `<Screenshot>` in the page's language.
 */
export function remarkDocs() {
  return (tree: Root, file: VFile) => {
    const context = contextOf(file)
    if (!context) return
    visit(tree, (node, index, parent) => {
      if (node.type === "link" || node.type === "definition") {
        ;(node as Link).url = rewriteHref((node as Link).url, context)
        return
      }
      if (node.type !== "image") return
      const image = node as Image
      const shot = shotPattern.exec(image.url)
      if (shot && parent && index !== undefined) {
        const [, repo, , theme, id] = shot
        const element: MdxJsxFlowElement = {
          type: "mdxJsxFlowElement",
          name: "Screenshot",
          attributes: [
            attribute("repo", repo!),
            attribute("id", id!),
            attribute("alt", image.alt ?? ""),
            attribute("locale", context.page.contentLocale),
            ...(theme === "dark" ? [attribute("theme", "dark")] : []),
          ],
          children: [],
        }
        // An image alone in its paragraph replaces the paragraph, so no <figure> sits in a <p>.
        if (parent.type === "paragraph" && parent.children.length === 1) {
          Object.assign(parent, element)
        } else {
          parent.children[index] = { ...element, type: "mdxJsxTextElement" } as never
        }
        return
      }
      image.url = rewriteSrc(image.url, context)
    })
  }
}
