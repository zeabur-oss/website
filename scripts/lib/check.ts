import { z } from "zod"
import type { RepoFiles } from "../../src/mdx/links.ts"
import { checkPage, shotsSchema, type Shot } from "./check-page.ts"
import { isLocaleName, readRepoDocs, readYaml, reservedNames } from "./docs.ts"
import type { Add, Finding } from "./findings.ts"
import type { Snapshot } from "./repos.ts"

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

export type CheckOptions = {
  /** The same repository at an earlier ref: pages it published need a redirect if they are gone. */
  base?: Snapshot
}

export function checkRepo(snap: Snapshot, options: CheckOptions = {}): Finding[] {
  const findings: Finding[] = []
  const add: Add = (level, code, file, message, line) =>
    findings.push({ level, code, file, line, message })
  const docs = readRepoDocs(snap)
  const published = new Set(docs.pages.map((p) => p.slug))
  const repoFiles: RepoFiles = { files: snap.files, translations: docs.translations, published }

  // nav.yaml
  if (!snap.files.has("docs/nav.yaml")) {
    add(
      "warning",
      "nav-missing",
      "docs/nav.yaml",
      "missing: the README is the home page and every page directly in docs/ is published",
    )
  } else {
    const nav = navSchema.safeParse(readYaml(snap, "docs/nav.yaml"))
    if (!nav.success) add("error", "nav-invalid", "docs/nav.yaml", z.prettifyError(nav.error))
    for (const { slug } of docs.missing)
      add("error", "nav-page-missing", "docs/nav.yaml", `lists ${slug}, which has no file`)
  }
  for (const locale of docs.translations) {
    const path = `docs/${locale}/nav.yaml`
    if (!snap.files.has(path)) continue
    const nav = translatedNavSchema.safeParse(readYaml(snap, path))
    if (!nav.success) {
      add("error", "nav-invalid", path, z.prettifyError(nav.error))
      continue
    }
    for (const entry of nav.data) {
      const group = docs.groups.find((g) => g.group === entry.group)
      if (!group) {
        add("error", "nav-group-unknown", path, `group ${entry.group} is not in docs/nav.yaml`)
        continue
      }
      for (const page of Object.keys(entry.pages ?? {})) {
        if (!group.pages.includes(page))
          add("error", "nav-page-unknown", path, `${entry.group}/${page} is not in docs/nav.yaml`)
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
          "reserved-name",
          "docs/nav.yaml",
          `${page.slug}: "${segment}" is reserved for translations or docs/ folders`,
        )
      }
    }
  }

  // Redirects
  for (const [from, to] of Object.entries(docs.redirects)) {
    if (!published.has(to))
      add(
        "error",
        "redirect-target-unpublished",
        "docs/redirects.yaml",
        `${from} goes to ${to}, which is not published`,
      )
    if (published.has(from))
      add(
        "error",
        "redirect-hides-page",
        "docs/redirects.yaml",
        `${from} is a published page; its redirect hides it`,
      )
  }
  if (options.base) {
    for (const page of readRepoDocs(options.base).pages) {
      if (!published.has(page.slug) && !(page.slug in docs.redirects)) {
        add(
          "error",
          "redirect-needed",
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
      if (path) checkPage(snap, repoFiles, page.files.en, locale, path, shotList?.data, add)
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
    if (!published.has(parts.join("/")))
      add("warning", "unpublished-file", path, "not in nav.yaml, so not published")
  }
  return findings
}
