// The site's navigation, shared by the header, its small-screen menu and the footer.
import { chrome } from "./chrome.ts"
import { productName } from "./products.ts"
import { blogUrl, docsUrl, homeUrl, productUrl, type SiteLocale } from "./urls.ts"

type NavItem = {
  name: string
  href: string
  line?: string
  icon?: string
  /** Not released yet: shown with "Stay tuned". */
  soon?: boolean
}

type NavGroup = { title: string; items: NavItem[] }

/** A part of the home page, from any page of the site. */
const homeSection = (locale: string, id: string) =>
  `${homeUrl(locale) === "/" ? "" : homeUrl(locale)}/#${id}`

export function siteNav(locale: SiteLocale) {
  const t = chrome[locale]
  const zeaburDocs = (slug?: string) => docsUrl(locale, "zeabur", slug)
  const product: NavGroup[] = [
    {
      title: t.groups.manage,
      items: [
        {
          name: productName.zeabur,
          line: t.products.zeabur.line,
          href: productUrl(locale, "zeabur"),
          icon: "squares-four",
        },
        {
          name: "Zeabur Desktop",
          line: t.members.desktop,
          href: homeSection(locale, "members"),
          icon: "desktop",
          soon: true,
        },
      ],
    },
    {
      title: t.groups.install,
      items: [
        {
          name: "Zeabur Zeatend",
          line: t.members.zeatend,
          href: homeSection(locale, "members"),
          icon: "terminal-window",
          soon: true,
        },
        { name: t.groups.allInstalls, href: homeSection(locale, "start"), icon: "arrow-down" },
      ],
    },
    {
      title: t.groups.components,
      items: (["identity", "builder", "catalog"] as const).map((id) => ({
        name: productName[id],
        line: t.products[id].line,
        href: productUrl(locale, id),
      })),
    },
  ]
  const useCases: NavItem[] = [
    { ...t.useCases.team, href: zeaburDocs("install/existing-cluster"), icon: "users-three" },
    { ...t.useCases.machine, href: zeaburDocs("get-started/quickstart"), icon: "hard-drives" },
  ]
  return {
    product,
    useCases,
    docs: zeaburDocs(),
    security: zeaburDocs("reference/security"),
    blog: blogUrl(locale),
    start: homeSection(locale, "start"),
  }
}
