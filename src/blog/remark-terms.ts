import type { BlockContent, Paragraph, Root } from "mdast"
import type { MdxJsxAttribute, MdxJsxFlowElement } from "mdast-util-mdx-jsx"
import { visit } from "unist-util-visit"
import type { VFile } from "vfile"

const notesClass =
  "grid gap-[0.6em] overflow-clip group-has-checked/terms:mt-[0.2em] group-has-checked/terms:mb-[1.4em] print:hidden"

function element(
  name: string,
  attributes: MdxJsxFlowElement["attributes"],
  children: BlockContent[],
): MdxJsxFlowElement {
  return { type: "mdxJsxFlowElement", name, attributes, children }
}

function attribute(name: string, value: string): MdxJsxAttribute {
  return { type: "mdxJsxAttribute", name, value }
}

/**
 * Moves the explanation of each <Term> in a blog post below its paragraph, so the sentence is
 * never split. Each term gets an ID in post order. BlogPost.astro supplies TermNote.
 */
export function remarkTerms() {
  return (tree: Root, file: VFile) => {
    if (!file.path?.includes("/src/content/blog/")) return
    let count = 0
    visit(tree, "paragraph", (paragraph, index, parent) => {
      if (index === undefined || !parent) return
      const notes: MdxJsxFlowElement[] = []
      visit(paragraph, "mdxJsxTextElement", (term) => {
        if (term.name !== "Term") return
        term.attributes.push(attribute("id", `term-${++count}`))
        const text: Paragraph = {
          type: "paragraph",
          data: { hName: "span" },
          children: term.children,
        }
        notes.push(element("TermNote", [...term.attributes], [text]))
        term.children = []
      })
      if (!notes.length) return
      parent.children[index] = element(
        "div",
        [attribute("class", "term-block group/terms")],
        [paragraph, element("div", [attribute("class", notesClass)], notes)],
      )
      return index + 1
    })
  }
}
