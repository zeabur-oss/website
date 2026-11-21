// The site's navigation, shared by the header, its small-screen menu and the footer.
import { chrome } from "./chrome.ts"
import { sitePages, type NavGroup, type SitePage } from "./site-pages.ts"
import { blogUrl, docsUrl, homeUrl, type SiteLocale } from "./urls.ts"

type NavItem = {
  name: string
  href: string
  line?: string
  icon?: string
  /** Not released yet: shown with "Stay tuned". */
  soon?: boolean
}

type NavSection = { title: string; items: NavItem[] }

/** A part of the home page, from any page of the site. */
const homeSection = (locale: string, id: string) =>
  `${homeUrl(locale) === "/" ? "" : homeUrl(locale)}/#${id}`

export async function siteNav(locale: SiteLocale) {
  const t = chrome[locale]
  const zeaburDocs = (slug?: string) => docsUrl(locale, "zeabur", slug)
  const pages = await sitePages(locale)
  const item = (p: SitePage): NavItem => ({
    name: p.name,
    line: p.navLine,
    href: p.href ?? homeSection(locale, "members"),
    icon: p.icon,
    soon: !p.released,
  })
  const group = (g: NavGroup) => pages.filter((p) => p.group === g).map(item)
  const product: NavSection[] = [
    { title: t.groups.manage, items: group("manage") },
    {
      title: t.groups.install,
      items: [
        ...group("install"),
        { name: t.groups.allInstalls, href: homeSection(locale, "start"), icon: "arrow-down" },
      ],
    },
    { title: t.groups.components, items: group("components") },
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
    overview: docsUrl(locale, "overview"),
    blog: blogUrl(locale),
    start: homeSection(locale, "start"),
  }
}
