// The site's pages in the order the header and the home page list them. This list is the only one:
// each row is a route under every locale, and has a text file
// src/content/pages/<locale>/<slug>.yaml for each locale.
import { getEntry } from "astro:content"
import {
  builderExample,
  catalogExample,
  identityExample,
  zeatendCommands,
} from "../landing/examples.ts"
import { productIcon, productName, type ProductId } from "./products.ts"
import { releaseTag } from "./releases.ts"
import { productUrl, type SiteLocale } from "./urls.ts"

export type NavGroup = "manage" | "install" | "components"

/** The sections of a product page after its hero, in the order the page shows them. */
export type Section =
  /** Zeabur's jobs, each on its own screen. */
  | "chapters"
  /** The page's steps beside one stage. */
  | "steps"
  | "highlights"
  /** The steps as a numbered list, for a page whose story is chapters. */
  | "how"
  | "features"
  | "screens"
  | "details"
  | "start"

/** What the start section offers. */
type Start =
  /** The ways to start Zeabur, as on the home page. */
  | { kind: "ways" }
  /**
   * First steps, each with the commands its `code` names; the hero shows the commands named
   * `quick`.
   */
  | { kind: "commands"; commands: Record<string, string> }
  /** A file to copy beside the link to the docs. */
  | { kind: "file"; file: string }
  /**
   * The release files whose names start with `files`, and the Homebrew cask that installs them,
   * shown once the tap has it.
   */
  | { kind: "downloads"; files: string; cask?: string }

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
  sections: Section[]
  start: Start
  /** The hero links to the catalog's browse page. */
  browse?: boolean
  /** The first column of the details table holds names to copy, set in monospace. */
  monoNames?: boolean
}

const steps: Section[] = ["steps", "highlights", "details", "start"]

const siteRows: Row[] = [
  {
    slug: "zeabur",
    repo: "zeabur",
    group: "manage",
    sections: ["chapters", "highlights", "how", "features", "details", "start"],
    start: { kind: "ways" },
  },
  {
    slug: "desktop",
    repo: "zeabur",
    name: "Zeabur Desktop",
    icon: "desktop",
    docs: "install/desktop",
    group: "manage",
    sections: steps,
    start: { kind: "downloads", files: "zeabur-desktop-", cask: "zeabur-oss/tap/zeabur-desktop" },
  },
  {
    slug: "zeatend",
    repo: "zeatend",
    docs: "get-started/install",
    group: "install",
    sections: steps,
    start: { kind: "commands", commands: zeatendCommands },
    monoNames: true,
  },
  {
    slug: "identity",
    repo: "identity",
    docs: "get-started/quickstart",
    group: "components",
    sections: ["steps", "highlights", "screens", "details", "start"],
    start: { kind: "file", file: identityExample },
  },
  {
    slug: "builder",
    repo: "builder",
    group: "components",
    sections: steps,
    start: { kind: "file", file: builderExample },
  },
  {
    slug: "catalog",
    repo: "catalog",
    group: "components",
    sections: steps,
    start: { kind: "file", file: catalogExample },
    browse: true,
    monoNames: true,
  },
]

export const pageSlugs = siteRows.map((r) => r.slug)

export type PageRow = ReturnType<typeof pageRow>

/** The row of a page, with its name, icon and the latest release of its repository. */
export function pageRow(slug: string) {
  const row = siteRows.find((r) => r.slug === slug)
  if (!row) throw new Error(`no page row for ${slug}`)
  return {
    ...row,
    name: row.name ?? productName[row.repo],
    icon: row.icon ?? productIcon[row.repo],
    tag: releaseTag(row.repo),
  }
}

/** The text of a page in `locale`. */
export async function pageText(locale: SiteLocale, slug: string) {
  const entry = await getEntry("pages", `${locale}/${slug}`)
  if (!entry) throw new Error(`no text for ${locale}/${slug}`)
  return entry.data
}

export type PageText = Awaited<ReturnType<typeof pageText>>

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

/** Every page for `locale`. */
export async function sitePages(locale: SiteLocale): Promise<SitePage[]> {
  return Promise.all(
    pageSlugs.map(async (slug): Promise<SitePage> => {
      const row = pageRow(slug)
      const text = await pageText(locale, slug)
      const released = text.status === "released"
      return {
        slug,
        name: row.name,
        icon: row.icon,
        group: row.group,
        href: productUrl(locale, slug),
        released,
        tag: released ? row.tag : undefined,
        navLine: text.lines.nav,
        landingLine: text.lines.landing,
      }
    }),
  )
}
