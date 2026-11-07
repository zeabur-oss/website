import { parse } from "acorn"
import type { Root } from "mdast"
import type { MdxJsxFlowElement } from "mdast-util-mdx-jsx"
import { visit } from "unist-util-visit"
import type { VFile } from "vfile"

const noteComponent = new URL("./TermNote.astro", import.meta.url).pathname

export function remarkTerms() {
  return (tree: Root, file: VFile) => {
    if (!/\/src\/content\/blog\//.test(file.path ?? "")) return
    const selectors: string[] = []
    visit(tree, "paragraph", (paragraph, index, parent) => {
      if (index === undefined || !parent) return
      const notes: MdxJsxFlowElement[] = []
      visit(paragraph, "mdxJsxTextElement", (term) => {
        if (term.name !== "Term") return
        const id = `term-${selectors.length + 1}`
        term.attributes.push({ type: "mdxJsxAttribute", name: "id", value: id })
        selectors.push(`.term-block:has(#${id}:checked) #${id}-note`)
        notes.push({
          type: "mdxJsxFlowElement",
          name: "BlogTermNote",
          attributes: [...term.attributes],
          children: [{ type: "paragraph", data: { hName: "span" }, children: term.children }],
        })
        term.children = []
      })
      if (!notes.length) return
      parent.children.splice(index, 1, {
        type: "mdxJsxFlowElement",
        name: "div",
        attributes: [{ type: "mdxJsxAttribute", name: "class", value: "term-block group/terms" }],
        children: [
          paragraph,
          {
            type: "mdxJsxFlowElement",
            name: "div",
            attributes: [
              {
                type: "mdxJsxAttribute",
                name: "class",
                value:
                  "grid gap-[0.6em] group-has-checked/terms:mt-[0.2em] group-has-checked/terms:mb-[1.4em] print:hidden",
              },
            ],
            children: notes,
          },
        ],
      })
      return index + 1
    })
    if (!selectors.length) return
    const value = `import BlogTermNote from ${JSON.stringify(noteComponent)}`
    tree.children.unshift({
      type: "mdxjsEsm",
      value,
      data: { estree: parse(value, { ecmaVersion: "latest", sourceType: "module" }) as never },
    })
    const css = JSON.stringify(`${selectors.join(",")}{--term-display:block;--term-opacity:1}`)
    tree.children.push({
      type: "mdxJsxFlowElement",
      name: "style",
      attributes: [],
      children: [
        {
          type: "mdxFlowExpression",
          value: css,
          data: { estree: parse(css, { ecmaVersion: "latest", sourceType: "module" }) as never },
        },
      ],
    })
  }
}
