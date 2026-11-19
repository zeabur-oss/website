import { sourceLocale, type SiteLocale } from "../../lib/urls.ts"

/** A figure's text in `locale`, or in the source language until that locale is written. */
export function figureCopy<T>(
  copy: { [K in typeof sourceLocale]: T } & Partial<Record<SiteLocale, T>>,
  locale: SiteLocale,
) {
  return copy[locale] ?? copy[sourceLocale]
}

/** A field path or label key cut after each `.` and `/`, where a long one may wrap. */
export function pathParts(path: string) {
  return path.split(/(?<=[./])/)
}
