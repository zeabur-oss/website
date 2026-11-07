import type { Element, Root, Text } from "hast"
import { visit } from "unist-util-visit"
import type { VFile } from "vfile"
import { isSiteLocale } from "../lib/urls.ts"
import { blogCopy } from "./copy.ts"

const notePrefix = "user-content-fn-"
const backPrefix = "#user-content-fnref-"

/** A post's footnotes as its references: the heading in the post's language, and each back link named by its note's number. */
export function rehypeReferences() {
  return (tree: Root, file: VFile) => {
    const locale = /\/src\/content\/blog\/([^/]+)\//.exec(file.path ?? "")?.[1]
    if (!isSiteLocale(locale)) return
    const copy = blogCopy[locale]
    const numbers = new Map<string, number>()
    visit(tree, "element", (node: Element) => {
      const id = node.properties.id
      if (node.tagName === "li" && typeof id === "string" && id.startsWith(notePrefix)) {
        numbers.set(id.slice(notePrefix.length), numbers.size + 1)
      }
    })
    visit(tree, "element", (node: Element) => {
      const props = node.properties
      if (props.id === "footnote-label") {
        node.children = [{ type: "text", value: copy.references } satisfies Text]
        delete props.className
        return
      }
      if (!("dataFootnoteBackref" in props) || typeof props.href !== "string") return
      const name = props.href.slice(backPrefix.length).replace(/-\d+$/, "")
      const number = numbers.get(name) ?? numbers.get(props.href.slice(backPrefix.length))
      if (number) props.ariaLabel = copy.backToCitation(String(number))
    })
  }
}
