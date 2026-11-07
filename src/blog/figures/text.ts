import type { SiteLocale } from "../../lib/urls.ts"

/** A figure's text in `locale`, or in zh-TW until that locale is written. */
export function figureCopy<T>(
  copy: { "zh-TW": T } & Partial<Record<SiteLocale, T>>,
  locale: SiteLocale,
) {
  return copy[locale] ?? copy["zh-TW"]
}

/** A field path or label key cut after each `.` and `/`, where a long one may wrap. */
export function pathParts(path: string) {
  return path.split(/(?<=[./])/)
}
