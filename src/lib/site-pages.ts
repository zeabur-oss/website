// The site's pages in the order the header and the home page list them. A page is one row here
// and one src/content/pages/<locale>/<slug>.mdx per locale. A row without a file is work that has
// no page yet, listed as "Stay tuned".
import { getEntry } from "astro:content"
import { landingCopy } from "../landing/copy.ts"
import { chrome } from "./chrome.ts"
import { productIcon, productName, releaseTag, type ProductId } from "./products.ts"
import { githubOrg } from "./site.ts"
import { productUrl, type SiteLocale } from "./urls.ts"

export type NavGroup = "manage" | "install" | "components"

type Row = {
  slug: string
  group: NavGroup
  /** The product whose release tag, name and icon the page shows. */
  repo?: ProductId
  /** Shown for a row without a repo. */
  name?: string
  icon?: string
  /** What the page's story walks through: Zeabur's jobs on its own screens, or the steps. */
  story?: "chapters" | "steps"
  /** The start section shows a file to copy instead of the three ways to start. */
  example?: boolean
  /** The page links to the catalog's browse page. */
  browse?: boolean
  /** The first column of the details table holds names to copy, set in monospace. */
  monoNames?: boolean
  /** The home page's link for a row without a page. */
  landingHref?: string
}

const siteRows: Row[] = [
  { slug: "zeabur", repo: "zeabur", group: "manage", story: "chapters" },
  { slug: "desktop", name: "Zeabur Desktop", icon: "desktop", group: "manage" },
  {
    slug: "zeatend",
    name: "Zeabur Zeatend",
    icon: "terminal-window",
    group: "install",
    landingHref: `${githubOrg}/zeatend`,
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
  /** The page itself; none while the row has no page. */
  href?: string
  landingHref?: string
  released: boolean
  /** The release tag, once released. */
  tag?: string
  navLine: string
  landingLine: string
  /** The social image of the page. */
  image: string
}

export const pageEntry = (locale: SiteLocale, slug: string) =>
  getEntry("pages", `${locale}/${slug}`)

/** Every row for `locale`, with its page when it has one. */
export async function sitePages(locale: SiteLocale): Promise<SitePage[]> {
  return Promise.all(
    siteRows.map(async (row): Promise<SitePage> => {
      const entry = await pageEntry(locale, row.slug)
      const released = entry?.data.status === "released"
      const name = row.repo ? productName[row.repo] : row.name!
      const icon = row.repo ? productIcon[row.repo] : row.icon!
      const base = {
        slug: row.slug,
        name,
        icon,
        group: row.group,
        landingHref: row.landingHref,
        image: `/og/${row.repo ?? row.slug}.png`,
      }
      if (!entry) {
        const slug = row.slug as "desktop" | "zeatend"
        return {
          ...base,
          released: false,
          navLine: chrome[locale].members[slug],
          landingLine: landingCopy[locale].members.lines[slug],
        }
      }
      return {
        ...base,
        href: productUrl(locale, row.slug),
        released,
        tag: released && row.repo ? releaseTag(row.repo) : undefined,
        navLine: entry.data.lines.nav,
        landingLine: entry.data.lines.landing,
      }
    }),
  )
}

/** The row of a page that has files. */
export function pageRow(slug: string) {
  const row = siteRows.find((r) => r.slug === slug)
  if (!row?.repo) throw new Error(`no page row for ${slug}`)
  return { ...row, repo: row.repo }
}
