// The comparison pages' words, one object per language. A comparison is published when every
// language has its page. Text between backticks is shown as code, and between ** in bold.
import type { SiteLocale } from "../../lib/urls.ts"
import type { CompetitorId, CriterionId } from "../data.ts"
import { en } from "./en.ts"
import { zhCN } from "./zh-CN.ts"
import { zhTW } from "./zh-TW.ts"

type Link = { text: string; url: string }
/** What one product does for one row, with the official pages that say so. */
type Cell = { text: string; links: Link[] }
type Choice = { title: string; points: string[] }

export type ComparisonCopy = {
  /** The browser title: both names, then the difference that decides between them. */
  title: string
  description: string
  heading: string
  /** The page's name and one line about it, on the hub. */
  link: string
  line: string
  /** The day every row was last checked, and the two versions read. */
  checked: string
  versions: string
  summary: string
  disclosure: string
  shortAnswer: string
  /** Conditions a reader can check, the other product's first. */
  chooseThem: Choice
  chooseZeabur: Choice
  table: string
  rows: Record<CriterionId, { zeabur: Cell; them: Cell }>
  releases: string
  /** Where the largest differences in the table come from. */
  differ: Choice
  /** What Zeabur has not released, kept out of the table. */
  soon: string[]
  /** Moving from the other product, and what stays when Zeabur goes. */
  moving: { title: string; body: string; link: Link; back: string }
  method: string
  trademark: string
}

export type CompareCopy = {
  criteria: Record<CriterionId, string>
  criterion: string
  checked: string
  lastChecked: string
  notDocumented: string
  before: { title: string; body: string }
  soon: { title: string; intro: string }
  corrections: { title: string; body: string; link: string }
  hub: {
    title: string
    description: string
    heading: string
    intro: string
    disclosure: string
    /** Which tools to look at for which situation. */
    uses: { title: string; need: string; tools: string; rows: { need: string; tools: string }[] }
    pages: string
    method: { title: string; body: string }
  }
  pages: Partial<Record<CompetitorId, ComparisonCopy>>
}

export const compareCopy: Record<SiteLocale, CompareCopy> = { en, "zh-TW": zhTW, "zh-CN": zhCN }
