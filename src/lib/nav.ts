// The site's navigation, shared by the header, its small-screen menu and the footer.
import { chrome } from "./chrome.ts"
import { productIcon, productName, type ProductId } from "./products.ts"
import { blogUrl, docsUrl, homeUrl, productUrl, type SiteLocale } from "./urls.ts"

export type NavItem = {
  name: string
  href: string
  line?: string
  icon?: string
  /** Not released yet: shown with "Coming soon". */
  soon?: boolean
}
type NavGroup = { label: string; items: NavItem[] }

/** A section of the home page, from any page of the site. */
const homeSection = (locale: string, id: string) => `${homeUrl(locale)}#${id}`

export function siteNav(locale: SiteLocale) {
  const t = chrome[locale]
  const product = (id: ProductId): NavItem => ({
    name: productName[id],
    href: productUrl(locale, id),
    line: t.products[id].line,
    icon: productIcon[id],
  })
  const groups: NavGroup[] = [
    {
      label: t.groups.manage,
      items: [
        product("zeabur"),
        {
          name: "Zeabur Desktop",
          href: homeSection(locale, "soon"),
          line: t.upcoming.desktop,
          icon: "desktop",
          soon: true,
        },
      ],
    },
    {
      label: t.groups.install,
      items: [
        {
          name: "Zeatend",
          href: homeSection(locale, "soon"),
          line: t.upcoming.zeatend,
          icon: "hard-drives",
          soon: true,
        },
      ],
    },
    {
      label: t.groups.components,
      items: [product("identity"), product("builder"), product("catalog")],
    },
  ]
  const zeaburDocs = (slug?: string) => docsUrl(locale, "zeabur", slug)
  const useCaseDocs = {
    cluster: zeaburDocs("reference/zeaburctl"),
    machine: zeaburDocs("install/personal"),
    team: zeaburDocs("get-started/quickstart"),
  }
  const useCases: NavItem[] = (["cluster", "machine", "team"] as const).map((id) => ({
    name: t.useCases[id].name,
    line: t.useCases[id].line,
    href: useCaseDocs[id],
  }))
  return {
    groups,
    useCases,
    docs: zeaburDocs(),
    trust: zeaburDocs("reference/security"),
    blog: blogUrl(locale),
    start: zeaburDocs("get-started/quickstart"),
  }
}
