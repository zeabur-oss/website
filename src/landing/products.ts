// The labels of the product pages' sections. The pages' own text is src/content/pages.
import type { SiteLocale } from "../lib/urls.ts"

export const sectionLabels: Record<
  SiteLocale,
  {
    how: string
    highlights: string
    screens: string
    features: string
    details: string
    start: string
  }
> = {
  "zh-TW": {
    how: "運作方式",
    highlights: "重點",
    screens: "畫面",
    features: "功能",
    details: "範圍",
    start: "開始",
  },
  "zh-CN": {
    how: "运作方式",
    highlights: "要点",
    screens: "画面",
    features: "功能",
    details: "范围",
    start: "开始",
  },
  en: {
    how: "How it works",
    highlights: "Highlights",
    screens: "Screens",
    features: "Features",
    details: "Scope",
    start: "Get started",
  },
}
