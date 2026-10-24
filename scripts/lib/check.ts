import { createProcessor } from "@mdx-js/mdx"
import type { Expression } from "estree"
import type { Root } from "mdast"
import type { MdxJsxAttribute, MdxJsxExpressionAttribute } from "mdast-util-mdx-jsx"
import remarkGfm from "remark-gfm"
import { visit } from "unist-util-visit"
import { z } from "zod"
import { htmlElements, registry, type ComponentName } from "../../src/docs-components/registry.ts"
import { classifyLink, resolveImage, type RepoFiles } from "../../src/mdx/links.ts"
import { shotPattern } from "../../src/lib/urls.ts"
import {
  isLocaleName,
  readRepoDocs,
  readText,
  readYaml,
  reservedNames,
  sourceHash,
  splitFrontmatter,
  type RepoDocs,
} from "./docs.ts"
import type { Snapshot } from "./repos.ts"

export type Finding = {
  /** `error` fails the check; `stale` and `warning` are reported only. */
  level: "error" | "warning" | "stale"
  file: string
  message: string
}

const navSchema = z.array(
  z.strictObject({ group: z.string(), label: z.string(), pages: z.array(z.string()).min(1) }),
)
const translatedNavSchema = z.array(
  z.strictObject({
    group: z.string(),
    label: z.string().optional(),
    pages: z.record(z.string(), z.string()).optional(),
  }),
)
const shotsSchema = z.array(
  z.looseObject({
    id: z.string(),
    locales: z.array(z.string()).optional(),
    themes: z.array(z.string()).optional(),
  }),
)

const parsers = {
  md: createProcessor({ format: "md", remarkPlugins: [remarkGfm] }),
  mdx: createProcessor({ format: "mdx", remarkPlugins: [remarkGfm] }),
}

/** Evaluates a JSX attribute written as a literal: strings, numbers, booleans, arrays, objects. */
function literal(node: Expression): unknown {
  switch (node.type) {
    case "Literal":
      return node.value
    case "TemplateLiteral":
      if (node.expressions.length) throw new Error("template literals with expressions")
      return node.quasis.map((q) => q.value.cooked).join("")
    case "ArrayExpression":
      return node.elements.map((e) => {
        if (!e || e.type === "SpreadElement") throw new Error("spread or empty array items")
        return literal(e)
      })
    case "ObjectExpression":
      return Object.fromEntries(
        node.properties.map((p) => {
          if (p.type !== "Property" || p.computed) throw new Error("computed or spread properties")
          const key =
            p.key.type === "Identifier" ? p.key.name : String((p.key as { value: unknown }).value)
          return [key, literal(p.value as Expression)]
        }),
      )
    case "UnaryExpression":
      if (node.operator === "-") return -(literal(node.argument) as number)
      break
  }
  throw new Error(`${node.type} is not a literal`)
}

function props(attributes: (MdxJsxAttribute | MdxJsxExpressionAttribute)[]) {
  const out: Record<string, unknown> = {}
  for (const attr of attributes) {
    if (attr.type === "mdxJsxExpressionAttribute") throw new Error("spread props")
    if (attr.value === null || attr.value === undefined) out[attr.name] = true
    else if (typeof attr.value === "string") out[attr.name] = attr.value
    else {
      const statement = attr.value.data?.estree?.body[0]
      if (statement?.type !== "ExpressionStatement")
        throw new Error(`${attr.name}: not an expression`)
      out[attr.name] = literal(statement.expression)
    }
  }
  return out
}

type Shot = z.infer<typeof shotsSchema>[number]

export type CheckOptions = {
  /** The same repository at an earlier ref: pages it published need a redirect if they are gone. */
  base?: Snapshot
}

export function checkRepo(snap: Snapshot, options: CheckOptions = {}): Finding[] {
  const findings: Finding[] = []
  const add = (level: Finding["level"], file: string, message: string) =>
    findings.push({ level, file, message })
  const docs = readRepoDocs(snap)
  const published = new Set(docs.pages.map((p) => p.slug))
  const repoFiles: RepoFiles = { files: snap.files, translations: docs.translations, published }

  // nav.yaml
  if (!snap.files.has("docs/nav.yaml")) {
    add(
      "warning",
      "docs/nav.yaml",
      "missing: the README is the home page and every page directly in docs/ is published",
    )
  } else {
    const nav = navSchema.safeParse(readYaml(snap, "docs/nav.yaml"))
    if (!nav.success) add("error", "docs/nav.yaml", z.prettifyError(nav.error))
    for (const { slug } of docs.missing)
      add("error", "docs/nav.yaml", `lists ${slug}, which has no file`)
  }
  for (const locale of docs.translations) {
    const path = `docs/${locale}/nav.yaml`
    if (!snap.files.has(path)) continue
    const nav = translatedNavSchema.safeParse(readYaml(snap, path))
    if (!nav.success) {
      add("error", path, z.prettifyError(nav.error))
      continue
    }
    for (const entry of nav.data) {
      const group = docs.groups.find((g) => g.group === entry.group)
      if (!group) {
        add("error", path, `group ${entry.group} is not in docs/nav.yaml`)
        continue
      }
      for (const page of Object.keys(entry.pages ?? {})) {
        if (!group.pages.includes(page))
          add("error", path, `${entry.group}/${page} is not in docs/nav.yaml`)
      }
    }
  }

  // Reserved names
  for (const page of docs.pages) {
    for (const segment of page.slug.split("/")) {
      if (page.slug === "index") break
      if (reservedNames.includes(segment) || isLocaleName(segment)) {
        add(
          "error",
          "docs/nav.yaml",
          `${page.slug}: "${segment}" is reserved for translations or docs/ folders`,
        )
      }
    }
  }

  // Redirects
  for (const [from, to] of Object.entries(docs.redirects)) {
    if (!published.has(to))
      add("error", "docs/redirects.yaml", `${from} goes to ${to}, which is not published`)
    if (published.has(from))
      add("error", "docs/redirects.yaml", `${from} is a published page; its redirect hides it`)
  }
  if (options.base) {
    for (const page of readRepoDocs(options.base).pages) {
      if (!published.has(page.slug) && !(page.slug in docs.redirects)) {
        add(
          "error",
          "docs/redirects.yaml",
          `${page.slug} was published at ${options.base.repo.ref} and is gone; add a redirect`,
        )
      }
    }
  }

  // Pages
  const shots = readYaml<Shot[]>(snap, "docs/shots.yaml")
  const shotList = shots ? shotsSchema.safeParse(shots) : undefined
  for (const page of docs.pages) {
    for (const [locale, path] of Object.entries(page.files)) {
      if (path) checkPage(snap, docs, repoFiles, page.files.en, locale, path, shotList?.data, add)
    }
  }

  // Pages that nothing publishes
  for (const path of snap.files) {
    if (!/^docs\/.+\.mdx?$/.test(path) || path.startsWith("docs/internal/")) continue
    const parts = path
      .slice(5)
      .replace(/\.mdx?$/, "")
      .split("/")
    if (docs.translations.includes(parts[0]!)) parts.shift()
    if (!published.has(parts.join("/"))) add("warning", path, "not in nav.yaml, so not published")
  }
  return findings
}

function checkPage(
  snap: Snapshot,
  docs: RepoDocs,
  repoFiles: RepoFiles,
  original: string | undefined,
  locale: string,
  path: string,
  shots: Shot[] | undefined,
  add: (level: Finding["level"], file: string, message: string) => void,
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
        path,
        "Markdown page: rename it to .mdx with title and description in frontmatter",
      )
    else if (typeof data.title !== "string") add("error", path, "frontmatter needs a title")
    const allowed = translation ? ["title", "description", "source"] : ["title", "description"]
    for (const key of Object.keys(data)) {
      if (!allowed.includes(key))
        add("error", path, `frontmatter field "${key}" is not allowed (${allowed.join(", ")})`)
    }
  }
  if (translation) {
    const expected = sourceHash(readText(snap, original!))
    if (data.source === undefined)
      add("stale", path, `no source hash; the original ${original} is ${expected}`)
    else if (data.source !== expected)
      add("stale", path, `translated from ${data.source}; ${original} is now ${expected}`)
  }

  let tree: Root
  try {
    tree = (mdx ? parsers.mdx : parsers.md).parse(body) as Root
  } catch (error) {
    add("error", path, `does not parse: ${(error as Error).message}`)
    return
  }

  const checkShot = (where: string, id: string, shotLocale?: string, theme?: string) => {
    if (!shots)
      return add("error", path, `${where}: screenshot ${id}, but there is no docs/shots.yaml`)
    const shot = shots.find((s) => s.id === id)
    if (!shot) return add("error", path, `${where}: screenshot ${id} is not in docs/shots.yaml`)
    if (
      shotLocale &&
      shot.locales &&
      !shot.locales.includes(shotLocale) &&
      !shot.locales.includes("en")
    ) {
      add("error", path, `${where}: screenshot ${id} is not taken in ${shotLocale}`)
    }
    if (theme && theme !== "light" && !(shot.themes ?? ["light"]).includes(theme)) {
      add("error", path, `${where}: screenshot ${id} has no ${theme} theme`)
    }
  }
  const checkRef = (href: string, line: number | undefined, image: boolean) => {
    const where = `line ${line ?? "?"}`
    const shot = shotPattern.exec(href)
    if (shot) {
      if (shot[1] === snap.repo.name) checkShot(where, shot[4]!, locale, shot[3])
      return
    }
    const target = classifyLink(href, path, repoFiles)
    if (target.kind === "missing") {
      if (image && resolveImage(target.path, repoFiles)) return
      add("error", path, `${where}: ${href} points to ${target.path}, which does not exist`)
    } else if (target.kind === "unpublished") {
      add("error", path, `${where}: ${href} is a page that nav.yaml does not publish`)
    } else if (target.kind === "page" && !target.exists) {
      add("error", path, `${where}: ${href} points to ${target.path}, which does not exist`)
    }
  }

  visit(tree, (node) => {
    const start = node.position?.start.line
    const line = start === undefined ? undefined : start + offset
    switch (node.type) {
      case "mdxjsEsm":
        add(
          "error",
          path,
          `line ${line}: no import or export; components come from the site's registry`,
        )
        break
      case "link":
      case "definition":
        checkRef(node.url, line, false)
        break
      case "image":
        checkRef(node.url, line, true)
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
          add("error", path, `line ${line}: <${name}> is not in src/docs-components/registry.ts`)
          break
        }
        let value: Record<string, unknown>
        try {
          value = props(node.attributes)
        } catch (error) {
          add(
            "error",
            path,
            `line ${line}: <${name}> props must be literals (${(error as Error).message})`,
          )
          break
        }
        const result = registry[name as ComponentName].safeParse(value)
        if (!result.success) {
          add(
            "error",
            path,
            `line ${line}: <${name}> ${z.prettifyError(result.error).replaceAll("\n", " ")}`,
          )
        } else if (name === "Screenshot") {
          const shot = result.data as {
            id: string
            repo?: string
            locale?: string
            theme?: string
            dark?: boolean
          }
          if (!shot.repo || shot.repo === snap.repo.name) {
            checkShot(`line ${line}`, shot.id, shot.locale ?? locale, shot.theme)
            if (shot.dark) checkShot(`line ${line}`, shot.id, shot.locale ?? locale, "dark")
          }
        }
        break
      }
    }
  })
}
