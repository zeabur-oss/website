import { readFileSync } from "node:fs"
import { join } from "node:path"
import type { SiteData } from "../../scripts/sync-docs.ts"
import type { ProductId } from "./products.ts"
import { docsUrl, releaseSection } from "./urls.ts"

let site: SiteData | undefined

// content/site.json comes from scripts/sync-docs.ts, which `bun run build` runs first.
const siteData = () =>
  (site ??= JSON.parse(readFileSync(join(process.cwd(), "content/site.json"), "utf8")) as SiteData)

/** The latest full release of a product, which the docs sync read. */
export function releaseTag(id: ProductId): string {
  const repo = siteData().repos.find((r) => r.name === id)
  if (!repo) throw new Error(`content/site.json has no ${id}`)
  return repo.ref
}

/**
 * For a page of main's docs, the same page in the latest release, or the release's first page
 * when the release has no such page. Undefined for a page of a release.
 */
export function releasePage(locale: string, section: string, pathname: string) {
  const release = releaseSection(section)
  if (release === section) return undefined
  const here = pathname.replace(/\/$/, "")
  const base = docsUrl(locale, section)
  const slug = here === base ? "index" : here.slice(base.length + 1)
  const found = siteData().pages[`${locale}/${release}/${slug}`] !== undefined
  const repo = siteData().repos.find((r) => r.name === release)
  return {
    href: docsUrl(locale, release, found ? slug : "index"),
    /** Whether `href` is the same page, not the release's first page. */
    same: found,
    tag: repo?.ref ?? "",
    commit: siteData().repos.find((r) => r.name === section)?.ref ?? "",
  }
}
