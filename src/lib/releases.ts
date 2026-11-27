import { readFileSync } from "node:fs"
import { join } from "node:path"
import type { SiteData } from "../../scripts/sync-docs.ts"
import type { ProductId } from "./products.ts"

let releases: SiteData["releases"] | undefined

/** The latest full release of a product, with its page and files, which the docs sync read. */
export function release(id: ProductId) {
  // content/site.json comes from scripts/sync-docs.ts, which `bun run build` runs first.
  releases ??= (
    JSON.parse(readFileSync(join(process.cwd(), "content/site.json"), "utf8")) as SiteData
  ).releases
  const found = releases[id]
  if (!found) throw new Error(`content/site.json has no release of ${id}`)
  return found
}

export const releaseTag = (id: ProductId) => release(id).tag
