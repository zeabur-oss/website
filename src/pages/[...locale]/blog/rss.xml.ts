import type { APIContext } from "astro"
import { feed } from "../../../blog/rss.ts"
import { localePaths, type SiteLocale } from "../../../lib/urls.ts"

export const getStaticPaths = localePaths
export const GET = ({ props }: APIContext<{ locale: SiteLocale }>) => feed(props.locale)
