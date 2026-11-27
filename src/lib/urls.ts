export const siteOrigin = "https://oss.zeabur.com"
/**
 * The site's languages, in the order a page without a translation falls back. Adding a language
 * is one row: its URL prefix, its Open Graph locale, its Han script (for fonts and word breaks)
 * and the text between the two halves of a title.
 */
export const localeTable = {
  en: { prefix: "", og: "en_US", han: null, titleGap: " " },
  "zh-TW": { prefix: "/zh-TW", og: "zh_TW", han: "tc", titleGap: "" },
  "zh-CN": { prefix: "/zh-CN", og: "zh_CN", han: "sc", titleGap: "" },
} as const satisfies Record<
  string,
  { prefix: string; og: string; han: "tc" | "sc" | null; titleGap: string }
>
export type SiteLocale = keyof typeof localeTable
export const locales = Object.keys(localeTable) as SiteLocale[]
/** The language every text exists in; a figure without a translation shows it. */
export const sourceLocale = "zh-TW" satisfies SiteLocale

export function isSiteLocale(value: unknown): value is SiteLocale {
  return (locales as readonly unknown[]).includes(value)
}

/** The row of `locale`; a language outside the table reads as English. */
export function localeInfo(locale: string) {
  return localeTable[isSiteLocale(locale) ? locale : "en"]
}

export function localePrefix(locale: string) {
  return localeInfo(locale).prefix
}

/** The docs of a repository's main branch are a section of their own, at /docs/<repo>/main. */
export const mainSection = (repo: string) => `${repo}/main`

/** The release section of a docs section: `builder` for both `builder` and `builder/main`. */
export const releaseSection = (section: string) => section.replace(/\/main$/, "")

export function docsUrl(locale: string, repo: string, slug = "index") {
  return `${localePrefix(locale)}/docs/${repo}${slug === "index" ? "" : `/${slug}`}`
}

/** The Markdown copy of a page (scripts/sync-docs.ts): its path plus `.md`, or `index.md` after a slash. */
export function markdownPath(pathname: string) {
  return pathname.endsWith("/") ? `${pathname}index.md` : `${pathname}.md`
}

/** Route params for a page in every locale: English at the root, the others under their prefix. */
export const localePaths = () =>
  locales.map((locale) => ({
    params: { locale: localePrefix(locale).slice(1) || undefined },
    props: { locale },
  }))

export const homeUrl = (locale: string) => localePrefix(locale) || "/"
export const productUrl = (locale: string, id: string) => `${localePrefix(locale)}/${id}`
export const blogUrl = (locale: string) => `${localePrefix(locale)}/blog`

const otherPrefix = new RegExp(
  `^(${locales
    .map((l) => localePrefix(l))
    .filter(Boolean)
    .join("|")})(?=/|$)`,
)

/** The same path in another locale. */
export function pathInLocale(pathname: string, locale: string) {
  const bare = pathname.replace(otherPrefix, "") || "/"
  const prefix = localePrefix(locale)
  return bare === "/" ? prefix || "/" : `${prefix}${bare}`.replace(/\/$/, "")
}
