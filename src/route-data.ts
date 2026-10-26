import { readFileSync } from "node:fs"
import { join } from "node:path"
import { defineRouteMiddleware } from "@astrojs/starlight/route-data"
import { getCollection } from "astro:content"
import type { StarlightRouteData } from "@astrojs/starlight/route-data"
import type { SiteData, SiteNav } from "../scripts/sync-docs.ts"
import { localePrefix, locales, siteOrigin } from "./lib/urls.ts"
import { jsonLd, OG_HEIGHT, OG_WIDTH, ogLocale, organization, summary } from "./lib/seo.ts"

type SidebarEntry = StarlightRouteData["sidebar"][number]
type SidebarLink = Extract<SidebarEntry, { type: "link" }>

const read = <T>(name: string): T =>
  JSON.parse(readFileSync(join(process.cwd(), "content", name), "utf8"))
const nav = read<SiteNav>("nav.json")
const site = read<SiteData>("site.json")

/**
 * Each repository is its own section: the sidebar and the previous and next links stay inside it,
 * and "Edit page" opens the page's source in its repository.
 */
export const onRequest = defineRouteMiddleware(async (context) => {
  const route = context.locals.starlightRoute
  await searchHead(route, context.url.pathname)
  const data = route.entry.data as { repo?: string; sourcePath?: string }
  if (!data.repo) return
  const repo = site.repos.find((r) => r.name === data.repo)!
  const here = context.url.pathname.replace(/\/$/, "")
  const links: SidebarLink[] = []
  const link = (item: { label: string; href: string }): SidebarLink => {
    const entry: SidebarLink = {
      type: "link",
      label: item.label,
      href: item.href,
      isCurrent: item.href === here,
      badge: undefined,
      attrs: {},
    }
    links.push(entry)
    return entry
  }
  const sidebar: SidebarEntry[] = []
  for (const group of nav[route.lang]?.[repo.name] ?? []) {
    const entries = group.items.map(link)
    if (group.label) {
      sidebar.push({
        type: "group",
        label: group.label,
        entries,
        // Only the group with the current page starts open, so the list stays short.
        collapsed: !entries.some((e) => e.isCurrent),
        badge: undefined,
      })
    } else {
      sidebar.push(...entries)
    }
  }
  route.sidebar = sidebar
  const at = links.findIndex((l) => l.isCurrent)
  route.pagination = {
    prev: at > 0 ? links[at - 1] : undefined,
    next: at >= 0 ? links[at + 1] : undefined,
  }
  route.editUrl = new URL(`https://github.com/${repo.github}/blob/main/${data.sourcePath}`)
})

let written: Map<string, string> | undefined

/**
 * A page shown in another language because it has no translation (scripts/sync-docs.ts copies
 * it in) points search engines at the page in the language it is written in. Every page lists
 * only the languages it is really written in.
 */
async function searchHead(route: StarlightRouteData, pathname: string) {
  written ??= new Map(
    (await getCollection("docs")).map((e) => [
      `/${e.id}`.toLowerCase(),
      (e.data as { contentLocale?: string }).contentLocale ?? "",
    ]),
  )
  const data = route.entry.data as { title: string; description?: string; contentLocale?: string }
  const here = pathname.replace(/\/$/, "")
  const prefix = localePrefix(route.lang)
  const path = prefix && here.startsWith(prefix) ? here.slice(prefix.length) : here
  const at = (lang: string) => `${localePrefix(lang)}${path}`
  const ownLanguage = (lang: string) => written!.get(at(lang).toLowerCase()) === lang
  const contentLocale = data.contentLocale ?? route.lang
  const canonical = `${siteOrigin}${at(contentLocale)}`
  if (data.contentLocale) route.entryMeta = { ...route.entryMeta, lang: contentLocale }
  const languages = locales.filter(ownLanguage)
  const head = route.head.filter(
    (tag) =>
      !(
        tag.tag === "link" &&
        tag.attrs?.rel === "alternate" &&
        typeof tag.attrs.hreflang === "string"
      ),
  )
  if (languages.length > 1) {
    for (const lang of languages)
      head.push({
        tag: "link",
        attrs: { rel: "alternate", hreflang: lang, href: `${siteOrigin}${at(lang)}` },
      })
    const fallback = languages.includes("en") ? "en" : languages[0]!
    head.push({
      tag: "link",
      attrs: { rel: "alternate", hreflang: "x-default", href: `${siteOrigin}${at(fallback)}` },
    })
  }
  for (const tag of head) {
    if (tag.tag === "link" && tag.attrs?.rel === "canonical") tag.attrs.href = canonical
    if (tag.tag === "meta" && tag.attrs?.property === "og:url") tag.attrs.content = canonical
    if (tag.tag === "meta" && tag.attrs?.property === "og:locale")
      tag.attrs.content = ogLocale(contentLocale)
  }
  const description = data.description ?? summary(route.entry.body ?? "")
  if (!data.description && description) {
    head.push(
      { tag: "meta", attrs: { name: "description", content: description } },
      { tag: "meta", attrs: { property: "og:description", content: description } },
    )
  }
  head.push(
    jsonLd({
      "@type": "TechArticle",
      headline: data.title,
      description,
      inLanguage: contentLocale,
      url: canonical,
      isPartOf: { "@type": "WebSite", name: "Zeabur OSS", url: siteOrigin },
      publisher: organization,
    }),
  )
  const image = route.entry.id === "404" ? `/og/404/${route.lang}` : `/og${at(contentLocale)}`
  head.push(
    {
      tag: "meta",
      attrs: { property: "og:image", content: `${siteOrigin}${image.toLowerCase()}.png` },
    },
    { tag: "meta", attrs: { property: "og:image:width", content: String(OG_WIDTH) } },
    { tag: "meta", attrs: { property: "og:image:height", content: String(OG_HEIGHT) } },
    { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
  )
  if (route.entry.id === "404")
    head.push({ tag: "meta", attrs: { name: "robots", content: "noindex" } })
  route.head = head
}
