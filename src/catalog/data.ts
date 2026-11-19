import { readFileSync } from "node:fs"
import { join } from "node:path"
import type { CatalogData } from "../../scripts/sync-docs.ts"
import { localePrefix } from "../lib/urls.ts"

// content/ comes from scripts/sync-docs.ts, which `bun run build` runs first.
export const catalog: CatalogData = JSON.parse(
  readFileSync(join(process.cwd(), "content/catalog.json"), "utf8"),
)

export type EntryKind = "templates" | "components"

/** The searchable list of every component and template. */
export const browseUrl = (locale: string) => `${localePrefix(locale)}/catalog/browse`

export const entryUrl = (locale: string, kind: EntryKind, id: string) =>
  `${localePrefix(locale)}/catalog/${kind}/${id}`

export const sourceUrl = (path: string) =>
  `https://github.com/${catalog.github}/blob/${catalog.ref}/${path}`

/** The newest passing run, which the list shows. */
export const lastTested = (tests: { date: string }[]) =>
  tests.reduce<string | undefined>((d, t) => (!d || t.date > d ? t.date : d), undefined)
