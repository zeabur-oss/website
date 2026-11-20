import type { PageRow, PageText } from "../../lib/site-pages.ts"
import type { SiteLocale } from "../../lib/urls.ts"

/** What every section of a product page gets. */
export type SectionProps = {
  locale: SiteLocale
  row: PageRow
  text: PageText
  /** The place of the section's first numbered item on the page, from 0. */
  first: number
}

/** A place on the page, such as "04". */
export const number = (i: number) => String(i + 1).padStart(2, "0")

/** The commands named `key`, which a page's text refers to. */
export function command(commands: Record<string, string>, key: string) {
  const code = commands[key]
  if (code === undefined) throw new Error(`no commands named ${key}`)
  return code
}
