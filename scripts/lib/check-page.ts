// One page in one locale: frontmatter, translation freshness, links, images and components.
import { createProcessor } from "@mdx-js/mdx"
import type { Root } from "mdast"
import remarkGfm from "remark-gfm"
import { visit } from "unist-util-visit"
import { z } from "zod"
import { htmlElements, registry, type ComponentName } from "../../src/docs-components/registry.ts"
import {
  classifyLink,
  githubDocsLink,
  githubFileLink,
  isDocsAsset,
  resolveImage,
  type RepoFiles,
} from "../../src/mdx/links.ts"
import { readText, sourceHash, splitFrontmatter } from "./docs.ts"
import type { Add } from "./findings.ts"
import { props } from "./jsx-props.ts"
import type { Snapshot } from "./repos.ts"

const parsers = {
  md: createProcessor({ format: "md", remarkPlugins: [remarkGfm] }),
  mdx: createProcessor({ format: "mdx", remarkPlugins: [remarkGfm] }),
}

export function checkPage(
  snap: Snapshot,
  repoFiles: RepoFiles,
  original: string | undefined,
  locale: string,
  path: string,
  add: Add,
) {
  const text = readText(snap, path)
  const isReadme = path === "README.md"
  const mdx = path.endsWith(".mdx")
  const { data, body } = splitFrontmatter(text)
  const offset = text.split("\n").length - body.split("\n").length
  const translation = locale !== "en" && !!original

  if (!isReadme) {
    if (!mdx)
      add(
        "warning",
        "markdown-page",
        path,
        "Markdown page: rename it to .mdx with title and description in frontmatter",
      )
    else if (typeof data.title !== "string")
      add("error", "frontmatter-title", path, "frontmatter needs a title")
    const allowed = translation ? ["title", "description", "source"] : ["title", "description"]
    for (const key of Object.keys(data)) {
      if (!allowed.includes(key))
        add(
          "error",
          "frontmatter-field",
          path,
          `frontmatter field "${key}" is not allowed (${allowed.join(", ")})`,
        )
    }
  }
  if (translation) {
    const expected = sourceHash(readText(snap, original!))
    if (data.source === undefined)
      add(
        "stale",
        "translation-no-source",
        path,
        `no source hash; the original ${original} is ${expected}`,
      )
    else if (data.source !== expected)
      add(
        "stale",
        "translation-stale",
        path,
        `translated from ${data.source}; ${original} is now ${expected}`,
      )
  }

  let tree: Root
  try {
    tree = (mdx ? parsers.mdx : parsers.md).parse(body) as Root
  } catch (error) {
    add("error", "parse-error", path, `does not parse: ${(error as Error).message}`)
    return
  }

  const checkRef = (href: string, line: number | undefined, image: boolean) => {
    const github = githubDocsLink(href)
    if (github) {
      const own = github.github === snap.repo.github
      const fix = own ? "a relative link to the file" : "https://oss.zeabur.com/docs/<repo>/<page>"
      add(
        "error",
        own ? "link-github-docs" : "link-github-docs-other",
        path,
        `${href} opens a docs page on GitHub; write ${fix}`,
        line,
      )
      return
    }
    const file = githubFileLink(href)
    if (file?.github === snap.repo.github) {
      add(
        "error",
        "link-github-own",
        path,
        `${href} is ${file.path} of this repository; write a relative link, which opens the ` +
          "release the docs describe",
        line,
      )
      return
    }
    const target = classifyLink(href, path, repoFiles)
    if (image && (target.kind === "file" || target.kind === "dir") && !isDocsAsset(target.path)) {
      // Only files under docs/ are copied to /docs-assets/, where the site serves images from.
      add(
        "error",
        "image-outside-docs",
        path,
        `${href} is ${target.path}, outside docs/, so the site cannot show it; move it under docs/`,
        line,
      )
    } else if (target.kind === "missing") {
      if (image && resolveImage(target.path, repoFiles)) return
      add(
        "error",
        "link-missing",
        path,
        `${href} points to ${target.path}, which does not exist`,
        line,
      )
    } else if (target.kind === "unpublished") {
      add(
        "error",
        "link-unpublished",
        path,
        `${href} is a page that nav.yaml does not publish`,
        line,
      )
    } else if (target.kind === "page" && !target.exists) {
      add(
        "error",
        "link-missing",
        path,
        `${href} points to ${target.path}, which does not exist`,
        line,
      )
    }
  }

  visit(tree, (node) => {
    const start = node.position?.start.line
    const line = start === undefined ? undefined : start + offset
    switch (node.type) {
      case "mdxjsEsm":
        add(
          "error",
          "import-export",
          path,
          "no import or export; components come from the site's registry",
          line,
        )
        break
      case "link":
      case "definition":
        checkRef(node.url, line, false)
        break
      case "image":
        checkRef(node.url, line, true)
        break
      case "imageReference":
        // The site rewrites a definition as a link, so the image would point to a GitHub page.
        add(
          "error",
          "image-reference",
          path,
          `![${node.alt ?? ""}][${node.identifier}] is a reference-style image; write it inline`,
          line,
        )
        break
      case "html":
        for (const m of node.value.matchAll(/\s(href|src|srcset)="([^"]+)"/g)) {
          checkRef(m[2]!.split(/[\s,]+/)[0]!, line, m[1] !== "href")
        }
        break
      case "mdxJsxFlowElement":
      case "mdxJsxTextElement": {
        const name = node.name
        if (!name) break
        if (htmlElements.includes(name)) break
        if (!(name in registry)) {
          add(
            "error",
            "component-unknown",
            path,
            `<${name}> is not in src/docs-components/registry.ts`,
            line,
          )
          break
        }
        let value: Record<string, unknown>
        try {
          value = props(node.attributes)
        } catch (error) {
          add(
            "error",
            "component-props-literal",
            path,
            `<${name}> props must be literals (${(error as Error).message})`,
            line,
          )
          break
        }
        const result = registry[name as ComponentName].safeParse(value)
        if (!result.success) {
          add(
            "error",
            "component-props-invalid",
            path,
            `<${name}> ${z.prettifyError(result.error).replaceAll("\n", " ")}`,
            line,
          )
        }
        break
      }
    }
  })
}
