// The site's own pages (src/content/pages/<locale>/<slug>.mdx): every slug exists in every locale.
import { readdirSync } from "node:fs"
import { locales } from "../../src/lib/urls.ts"
import type { Finding } from "./findings.ts"

export function checkSitePages(dir: string): Finding[] {
  const slugs = (locale: string) => {
    try {
      return readdirSync(`${dir}/${locale}`)
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => file.slice(0, -".mdx".length))
    } catch {
      return []
    }
  }
  const all = new Set(locales.flatMap(slugs))
  return locales.flatMap((locale) => {
    const have = new Set(slugs(locale))
    return [...all]
      .filter((slug) => !have.has(slug))
      .map((slug): Finding => ({
        level: "error",
        code: "page-translation-missing",
        file: `${locale}/${slug}.mdx`,
        message: "every locale needs the page: add this file with the same slug",
      }))
  })
}
