// The site's pages in the order the header and the home page list them. A page is one row here
// and one src/content/pages/<locale>/<slug>.mdx per locale.
import { getEntry } from "astro:content"
import { productIcon, productName, releaseTag, type ProductId } from "./products.ts"
import { productUrl, type SiteLocale } from "./urls.ts"

export type NavGroup = "manage" | "install" | "components"

type Row = {
  slug: string
  group: NavGroup
  /** The repository the page's product ships from: its docs, source, release and, by default, name and icon. */
  repo: ProductId
  /** A page about one part of its repository's release has a name and an icon of its own. */
  name?: string
  icon?: string
  /** The docs page to read first, under the repository's docs. */
  docs?: string
  /**
   * The release files the page offers, by the start of their names, and the Homebrew cask that
   * installs them, shown once the tap has it.
   */
  downloads?: { files: string; cask?: string }
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
    name: "Zeabur Desktop",
    icon: "desktop",
    docs: "install/desktop",
    downloads: { files: "zeabur-desktop-", cask: "zeabur-oss/tap/zeabur-desktop" },
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
  {
    slug: "identity",
    repo: "identity",
    docs: "get-started",
    group: "components",
    story: "steps",
    example: true,
  },
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

/** The row of a page, with its name, icon and the release docs.lock.json pins for its repository. */
export function pageRow(slug: string) {
  const row = siteRows.find((r) => r.slug === slug)
  if (!row) throw new Error(`no page row for ${slug}`)
  const tag = releaseTag(row.repo)
  return {
    ...row,
    name: row.name ?? productName[row.repo],
    icon: row.icon ?? productIcon[row.repo],
    tag,
    beta: tag.includes("-"),
  }
}

/** Every row for `locale`. */
export async function sitePages(locale: SiteLocale): Promise<SitePage[]> {
  return Promise.all(
    siteRows.map(async ({ slug }): Promise<SitePage> => {
      const row = pageRow(slug)
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
