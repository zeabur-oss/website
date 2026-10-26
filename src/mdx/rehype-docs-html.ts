import type { Element, Root } from "hast"
import rehypeRaw from "rehype-raw"
import { visit } from "unist-util-visit"
import type { VFile } from "vfile"
import { contextOf, rewriteHref, rewriteSrc } from "./remark-docs.ts"

const darkQuery = /prefers-color-scheme:\s*dark/

/**
 * Raw HTML in Markdown pages (README tables and pictures): rewrites its links and image paths,
 * marks paragraphs that are a single link, and turns `<picture>` with a dark `<source>` into two
 * images that follow the site's theme instead of the system's.
 */
export function rehypeDocsHtml() {
  // Astro parses raw HTML in Markdown only after the rehype plugins, so do it first here. MDX
  // has no raw HTML.
  const raw = rehypeRaw()
  return (tree: Root, file: VFile) => {
    const context = contextOf(file)
    if (!context) return
    const parsed = file.path.endsWith(".md") ? (raw(tree, file) as Root) : tree
    visit(parsed, "element", (node: Element) => {
      const props = node.properties
      if (node.tagName === "a" && "dataRewritten" in props) delete props.dataRewritten
      else if (node.tagName === "a" && typeof props.href === "string") {
        props.href = rewriteHref(props.href, context)
      }
      if (node.tagName === "img" && typeof props.src === "string") {
        props.src = rewriteSrc(props.src, context)
      }
      if (node.tagName === "p" && isLoneLink(node)) {
        node.properties = { ...props, className: ["docs-next"] }
        return
      }
      if (node.tagName !== "picture") return
      const children = node.children.filter((c): c is Element => c.type === "element")
      const img = children.find((c) => c.tagName === "img")
      const dark = children.find(
        (c) => c.tagName === "source" && darkQuery.test(String(c.properties.media ?? "")),
      )
      if (!img || !dark) return
      const lightImg: Element = {
        ...img,
        properties: { ...img.properties, className: ["theme-light"] },
      }
      const darkImg: Element = {
        type: "element",
        tagName: "img",
        properties: {
          ...img.properties,
          src: rewriteSrc(String(dark.properties.srcSet ?? dark.properties.srcset ?? ""), context),
          className: ["theme-dark"],
        },
        children: [],
      }
      node.tagName = "span"
      node.properties = { className: ["themed"] }
      node.children = [lightImg, darkImg]
    })
    return parsed
  }
}

/** A paragraph that is only a link, such as "[Install Zeabur on one server](…)": shown as a link
 * with an arrow rather than as prose. */
function isLoneLink(node: Element) {
  const kids = node.children.filter((c) => !(c.type === "text" && !c.value.trim()))
  return kids.length === 1 && kids[0]!.type === "element" && kids[0]!.tagName === "a"
}
