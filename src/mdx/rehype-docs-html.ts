import type { Element, Root } from "hast"
import { visit } from "unist-util-visit"
import type { VFile } from "vfile"
import { contextOf, rewriteHref, rewriteSrc } from "./remark-docs.ts"

const darkQuery = /prefers-color-scheme:\s*dark/

/**
 * Raw HTML in Markdown pages (README tables and pictures): rewrites its links and image paths,
 * and turns `<picture>` with a dark `<source>` into two images that follow the site's theme
 * instead of the system's.
 */
export function rehypeDocsHtml() {
  return (tree: Root, file: VFile) => {
    const context = contextOf(file)
    if (!context) return
    visit(tree, "element", (node: Element) => {
      const props = node.properties
      if (node.tagName === "a" && typeof props.href === "string") {
        props.href = rewriteHref(props.href, context)
      }
      if (node.tagName === "img" && typeof props.src === "string") {
        props.src = rewriteSrc(props.src, context)
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
        properties: { ...img.properties, className: ["dark:hidden"] },
      }
      const darkImg: Element = {
        type: "element",
        tagName: "img",
        properties: {
          ...img.properties,
          src: rewriteSrc(String(dark.properties.srcSet ?? dark.properties.srcset ?? ""), context),
          className: ["hidden", "dark:block"],
        },
        children: [],
      }
      node.tagName = "span"
      node.properties = { className: ["contents"] }
      node.children = [lightImg, darkImg]
    })
  }
}
