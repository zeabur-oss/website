import { Callout } from "fumadocs-ui/components/callout"

// What a reader sees when the page is not written in the language they chose: [locale][content].
const notices: Record<string, Record<string, string>> = {
  en: { "zh-TW": "This page is only available in Traditional Chinese for now." },
  "zh-TW": { en: "這一頁還沒有繁體中文版，以下是英文原文。" },
  "zh-CN": {
    en: "这一页还没有简体中文版，以下是英文原文。",
    "zh-TW": "这一页还没有简体中文版，以下是繁体中文版。",
  },
}

export function FallbackNotice({
  locale,
  contentLocale,
}: {
  locale: string
  contentLocale: string
}) {
  if (locale === contentLocale) return null
  const text = notices[locale]?.[contentLocale]
  if (!text) return null
  return <Callout type="info">{text}</Callout>
}
