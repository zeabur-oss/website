// The site's pages in the order the header and the home page list them. A page is one row here
// and one src/content/pages/<locale>/<slug>.mdx per locale.
import { getEntry } from "astro:content"
import { desktopRelease } from "./github.ts"
import { productIcon, productName, releaseTag, type ProductId } from "./products.ts"
import { productUrl, type SiteLocale } from "./urls.ts"

export type NavGroup = "manage" | "install" | "components"

type Row = {
  slug: string
  group: NavGroup
  /** The repository the product ships from: its docs, source and, unless `app`, name and icon. */
  repo: ProductId
  /** An app that ships in its repository's releases, with a name and icon of its own. */
  app?: { name: string; icon: string }
  /** What the page's story walks through: Zeabur's jobs on its own screens, or the steps. */
  story?: "chapters" | "steps"
  /** The start section shows a file to copy instead of the three ways to start. */
  example?: boolean
  /** The page links to the catalog's browse page. */
  browse?: boolean
  /** The first column of the details table holds names to copy, set in monospace. */
  monoNames?: boolean
}

const siteRows: Row[] = [
  { slug: "zeabur", repo: "zeabur", group: "manage", story: "chapters" },
  {
    slug: "desktop",
    repo: "zeabur",
    app: { name: "Zeabur Desktop", icon: "desktop" },
    group: "manage",
    story: "steps",
  },
  {
    slug: "zeatend",
    repo: "zeatend",
    group: "install",
    story: "steps",
    example: true,
    monoNames: true,
  },
  { slug: "identity", repo: "identity", group: "components", story: "steps", example: true },
  { slug: "builder", repo: "builder", group: "components", story: "steps", example: true },
  {
    slug: "catalog",
    repo: "catalog",
    group: "components",
    story: "steps",
    example: true,
    browse: true,
    monoNames: true,
  },
]

export type SitePage = {
  slug: string
  name: string
  icon: string
  group: NavGroup
  href: string
  released: boolean
  /** The release tag, once released. */
  tag?: string
  navLine: string
  landingLine: string
}

export const pageEntry = (locale: SiteLocale, slug: string) =>
  getEntry("pages", `${locale}/${slug}`)

/**
 * The row of a page, with its name, icon and the release it shows: for an app, the newest release
 * with its files, which can be a pre-release; otherwise the release docs.lock.json pins.
 */
export async function pageRow(slug: string) {
  const row = siteRows.find((r) => r.slug === slug)
  if (!row) throw new Error(`no page row for ${slug}`)
  const app = row.app ? await desktopRelease() : undefined
  return {
    ...row,
    name: row.app?.name ?? productName[row.repo],
    icon: row.app?.icon ?? productIcon[row.repo],
    tag: app ? app.tag : releaseTag(row.repo),
    beta: app?.prerelease ?? false,
  }
}

/** Every row for `locale`. */
export async function sitePages(locale: SiteLocale): Promise<SitePage[]> {
  return Promise.all(
    siteRows.map(async ({ slug }): Promise<SitePage> => {
      const row = await pageRow(slug)
      const entry = await pageEntry(locale, slug)
      if (!entry) throw new Error(`no page ${locale}/${slug}`)
      const released = entry.data.status === "released"
      return {
        slug,
        name: row.name,
        icon: row.icon,
        group: row.group,
        href: productUrl(locale, slug),
        released,
        tag: released ? row.tag : undefined,
        navLine: entry.data.lines.nav,
        landingLine: entry.data.lines.landing,
      }
    }),
  )
}
