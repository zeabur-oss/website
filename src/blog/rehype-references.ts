import type { Element, Root, Text } from "hast"
import { visit } from "unist-util-visit"
import type { VFile } from "vfile"
import { isSiteLocale } from "../lib/urls.ts"
import { blogCopy } from "./copy.ts"

const notePrefix = "user-content-fn-"

/** A post's footnotes as its references: the heading in the post's language, and each back link named by its note's number. */
export function rehypeReferences() {
  return (tree: Root, file: VFile) => {
    const locale = /\/src\/content\/blog\/([^/]+)\//.exec(file.path ?? "")?.[1]
    if (!isSiteLocale(locale)) return
    const copy = blogCopy[locale]
    let number = 0
    visit(tree, "element", (node: Element) => {
      if (node.properties.id === "footnote-label") {
        node.children = [{ type: "text", value: copy.references } satisfies Text]
        delete node.properties.className
        return
      }
      const id = node.properties.id
      if (node.tagName !== "li" || typeof id !== "string" || !id.startsWith(notePrefix)) return
      number++
      const label = copy.backToCitation(String(number))
      visit(node, "element", (link: Element) => {
        if ("dataFootnoteBackref" in link.properties) link.properties.ariaLabel = label
      })
    })
  }
}
