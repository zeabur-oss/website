import { locales } from "../lib/urls.ts"
import { competitorIds, type CompetitorId } from "./data.ts"
import { compareCopy } from "./copy/index.ts"

/** The comparisons that have their page copy in every language. */
export const publishedComparisons: CompetitorId[] = competitorIds.filter((id) =>
  locales.every((locale) => compareCopy[locale].pages[id]),
)
