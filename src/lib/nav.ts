// The site's navigation, shared by the header, its small-screen menu and the footer.
import { chrome } from "./chrome.ts"
import { productIds, productName } from "./products.ts"
import { audienceUrl, blogUrl, docsUrl, homeUrl, productUrl, type SiteLocale } from "./urls.ts"

export type NavItem = {
  name: string
  href: string
  line?: string
  icon?: string
  /** Not released yet: shown with "Coming soon". */
  soon?: boolean
}

/** A part of the home page, from any page of the site. */
const homeSection = (locale: string, id: string) => `${homeUrl(locale)}#${id}`

export function siteNav(locale: SiteLocale) {
  const t = chrome[locale]
  const zeaburDocs = (slug?: string) => docsUrl(locale, "zeabur", slug)
  const products: NavItem[] = [
    { ...t.menu.gui, href: productUrl(locale, "zeabur"), icon: "squares-four" },
    { ...t.menu.desktop, href: homeSection(locale, "soon"), icon: "desktop", soon: true },
    {
      ...t.menu.zeatend,
      href: homeSection(locale, "zeatend"),
      icon: "terminal-window",
      soon: true,
    },
  ]
  const components: NavItem[] = productIds
    .filter((id) => id !== "zeabur")
    .map((id) => ({ name: productName[id], href: productUrl(locale, id) }))
  const pages = { team: "teams", provider: "providers", homelab: "homelab" } as const
  const useCases: NavItem[] = (["team", "provider", "homelab"] as const).map((id) => ({
    ...t.useCases[id],
    href: audienceUrl(locale, pages[id]),
  }))
  return {
    products,
    components,
    useCases,
    docs: zeaburDocs(),
    trust: zeaburDocs("reference/security"),
    blog: blogUrl(locale),
    start: zeaburDocs("get-started/quickstart"),
  }
}
