import { defineConfig } from "fumadocs-mdx/config"
import rehypeRaw from "rehype-raw"
import { rehypeDocsHtml } from "./src/mdx/rehype-docs-html.ts"
import { remarkDocs } from "./src/mdx/remark-docs.ts"

// MDX nodes pass through rehype-raw untouched; it only parses the raw HTML of Markdown pages.
const mdxNodes = [
  "mdxFlowExpression",
  "mdxJsxFlowElement",
  "mdxJsxTextElement",
  "mdxTextExpression",
  "mdxjsEsm",
]

export default defineConfig({
  mdxOptions: {
    remarkPlugins: (v) => [remarkDocs, ...v],
    rehypePlugins: (v) => [[rehypeRaw, { passThrough: mdxNodes }], rehypeDocsHtml, ...v],
    remarkImageOptions: { external: false, onError: "ignore" },
  },
})
