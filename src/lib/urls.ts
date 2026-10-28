export const siteOrigin = "https://oss.zeabur.com"
export const locales = ["en", "zh-TW", "zh-CN"] as const
export type SiteLocale = (typeof locales)[number]

export function isSiteLocale(value: unknown): value is SiteLocale {
  return (locales as readonly unknown[]).includes(value)
}

export function localePrefix(locale: string) {
  return locale === "en" ? "" : `/${locale}`
}

export function docsUrl(locale: string, repo: string, slug = "index") {
  return `${localePrefix(locale)}/docs/${repo}${slug === "index" ? "" : `/${slug}`}`
}

export function shotUrl(repo: string, locale: string, theme: string, id: string) {
  return `/shots/${repo}/${locale}/${theme}/${id}.avif`
}

/** `https://oss.zeabur.com/shots/<repo>/<locale>/<theme>/<id>.avif` */
export const shotPattern =
  /^https:\/\/oss\.zeabur\.com\/shots\/([a-z0-9-]+)\/([A-Za-z-]+)\/(light|dark)\/([a-z0-9-]+)\.avif$/

/** Route params for a page in every locale: English at the root, the others under their prefix. */
export const localePaths = () =>
  locales.map((locale) => ({
    params: { locale: locale === "en" ? undefined : locale },
    props: { locale },
  }))

export const homeUrl = (locale: string) => localePrefix(locale) || "/"
export const productUrl = (locale: string, id: string) => `${localePrefix(locale)}/${id}`
export const blogUrl = (locale: string) => `${localePrefix(locale)}/blog`

/** The same path in another locale: en has no prefix, the others are /zh-TW and /zh-CN. */
export function pathInLocale(pathname: string, locale: string) {
  const bare = pathname.replace(/^\/(zh-TW|zh-CN)(?=\/|$)/, "") || "/"
  const prefix = localePrefix(locale)
  return bare === "/" ? prefix || "/" : `${prefix}${bare}`.replace(/\/$/, "")
}
