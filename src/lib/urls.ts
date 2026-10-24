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
