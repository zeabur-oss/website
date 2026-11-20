// Docs pages as plain Markdown for coding agents and other tools (https://llmstxt.org/): the
// registry's components become Markdown, links become absolute URLs, and code blocks stay as they
// are.
import type { BlockContent, Heading, ListItem, PhrasingContent, Root, RootContent } from "mdast"
import type { MdxJsxFlowElement, MdxJsxTextElement } from "mdast-util-mdx-jsx"
import remarkGfm from "remark-gfm"
import remarkMdx from "remark-mdx"
import remarkParse from "remark-parse"
import remarkStringify from "remark-stringify"
import { unified } from "unified"
import { visit } from "unist-util-visit"
import { props } from "./jsx-props.ts"

export type MarkdownPage = {
  title: string
  description?: string
  body: string
  mdx: boolean
  /** The absolute URL of a link, or of an image when `image` is true, as the page writes it. */
  url: (href: string, image: boolean) => string
}

type Jsx = MdxJsxFlowElement | MdxJsxTextElement
type Node = RootContent

const text = (value: string): PhrasingContent => ({ type: "text", value })
const strong = (value: string): PhrasingContent => ({ type: "strong", children: [text(value)] })
const paragraph = (children: PhrasingContent[]): BlockContent => ({ type: "paragraph", children })
const item = (children: BlockContent[]): ListItem => ({ type: "listItem", spread: false, children })

/** A figure's flow as a list: each card, arrow and group is one item, in reading order. */
function figureItems(nodes: Node[]): ListItem[] {
  return nodes.flatMap((node): ListItem[] => {
    if (!isJsx(node)) return []
    const p = props(node.attributes) as Record<string, string | undefined>
    switch (node.name) {
      case "FigFlow":
        return figureItems(node.children)
      case "FigCard": {
        const line: PhrasingContent[] = [strong(p.title ?? "")]
        if (p.tag) line.push(text(` (${p.tag})`))
        if (p.note) line.push(text(`: ${p.note}`))
        return [item([paragraph(line)])]
      }
      case "FigArrow":
        return [item([paragraph([text(p.label ? `→ ${p.label}` : "→")])])]
      case "FigGroup": {
        const children: BlockContent[] = []
        if (p.label) children.push(paragraph([strong(p.label)]))
        children.push({
          type: "list",
          ordered: false,
          spread: false,
          children: figureItems(node.children),
        })
        return [item(children)]
      }
      default:
        return []
    }
  })
}

function isJsx(node: { type: string }): node is Jsx {
  return node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement"
}

/**
 * The Markdown a component stands for. `depth` is the level of the heading the component sits
 * under, so a tab's heading goes one level below it.
 */
function flatten(node: Jsx, depth: number): Node[] {
  const p = props(node.attributes)
  const inner = () => flattenAll(node.children as Node[], depth)
  switch (node.name) {
    case "Callout": {
      const children = inner() as BlockContent[]
      if (typeof p.title === "string") children.unshift(paragraph([strong(p.title)]))
      return [{ type: "blockquote", children }]
    }
    case "Tabs": {
      const items = (p.items as string[] | undefined) ?? []
      const tabs = node.children.filter(isJsx)
      return tabs.flatMap((tab, i): Node[] => {
        const value = props(tab.attributes).value
        const label = typeof value === "string" ? value : (items[i] ?? "")
        const heading: Heading = {
          type: "heading",
          depth: Math.min(depth + 1, 6) as Heading["depth"],
          children: [text(label)],
        }
        return [heading, ...flattenAll(tab.children as Node[], depth + 1)]
      })
    }
    case "Figure": {
      const label = typeof p.label === "string" ? p.label : ""
      return [
        paragraph([strong(label)]),
        { type: "list", ordered: false, spread: false, children: figureItems(node.children) },
      ]
    }
    case "br":
      return [{ type: "break" }]
    case "summary":
      return node.type === "mdxJsxFlowElement"
        ? [paragraph([{ type: "strong", children: inlineOf(inner()) }])]
        : [{ type: "strong", children: inlineOf(inner()) }]
    default:
      // Steps, Step, details, kbd, sub, sup: the content without the wrapper.
      return inner()
  }
}

/** The text-level content of nodes, for a wrapper that must stay inline. */
function inlineOf(nodes: Node[]): PhrasingContent[] {
  return nodes.flatMap((n) => (n.type === "paragraph" ? n.children : [n as PhrasingContent]))
}

function flattenAll(nodes: Node[], depth: number): Node[] {
  const out: Node[] = []
  let level = depth
  for (const node of nodes) {
    if (node.type === "heading") level = node.depth
    if (node.type === "mdxjsEsm" || node.type === "mdxFlowExpression") continue
    if (node.type === "mdxTextExpression") continue
    if (isJsx(node)) {
      out.push(...flatten(node, level))
      continue
    }
    if ("children" in node && Array.isArray(node.children)) {
      ;(node as { children: Node[] }).children = flattenAll(node.children as Node[], level)
    }
    out.push(node)
  }
  return out
}

/** Rewrites `href`, `src` and `srcset` in raw HTML, as the HTML pages do (src/mdx/rehype-docs-html.ts). */
function rewriteHtml(html: string, url: MarkdownPage["url"]) {
  return html.replace(
    /\b(href|src|srcset)=(["'])(.*?)\2/gi,
    (_, name: string, quote: string, value: string) => {
      const attr = name.toLowerCase()
      const rewritten =
        attr === "srcset"
          ? value
              .split(",")
              .map((part) => {
                const [first = "", ...rest] = part.trim().split(/\s+/)
                return [url(first, true), ...rest].join(" ")
              })
              .join(", ")
          : url(value, attr === "src")
      return `${name}=${quote}${rewritten}${quote}`
    },
  )
}

/** A docs page as Markdown: the title as `#`, the description as a quote, then the body. */
export function toMarkdown(page: MarkdownPage): string {
  const parser = unified().use(remarkParse).use(remarkGfm)
  if (page.mdx) parser.use(remarkMdx)
  const tree = parser.runSync(parser.parse(page.body)) as Root
  tree.children = flattenAll(tree.children, 1)
  visit(tree, (node) => {
    if (node.type === "link" || node.type === "image" || node.type === "definition") {
      node.url = page.url(node.url, node.type === "image")
    }
    if (node.type === "html") node.value = rewriteHtml(node.value, page.url)
  })
  const head = `# ${page.title}\n\n` + (page.description ? `> ${page.description}\n\n` : "")
  const body = unified()
    .use(remarkGfm, { tablePipeAlign: false })
    .use(remarkStringify, { bullet: "-", emphasis: "_", fences: true, rule: "-" })
    .stringify(tree)
  return head + body
}
