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

/** The most memory any passing run used once ready, which is what to plan a server for. */
export const idleMemory = (tests: { memoryMiB: number }[]) =>
  tests.length ? Math.max(...tests.map((t) => t.memoryMiB)) : undefined

export const formatMemory = (mib: number) =>
  mib < 1024 ? `${Math.max(10, Math.round(mib / 10) * 10)} MiB` : `${(mib / 1024).toFixed(1)} GiB`

/** CPU families the passing runs used, as a server's spec sheet names them. */
export const cpus = (tests: { platform: string }[]) =>
  (["amd64", "arm64"] as const).filter((arch) => tests.some((t) => t.platform.endsWith(`/${arch}`)))
