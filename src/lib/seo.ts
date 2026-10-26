import { githubOrg } from "./site.ts"
import { siteOrigin } from "./urls.ts"

/** Social images are the size of the repository covers in the design system. */
export const OG_WIDTH = 1280
export const OG_HEIGHT = 640

/** `zh-TW` → `zh_TW`, the form Open Graph expects. */
export function ogLocale(lang: string) {
  return { en: "en_US", "zh-TW": "zh_TW", "zh-CN": "zh_CN" }[lang] ?? lang.replace("-", "_")
}

/** The first paragraph of a Markdown or MDX page as plain text, for its description. */
export function summary(body: string, max = 160) {
  const paragraph = body
    .replace(/<!--[\s\S]*?-->|\{\/\*[\s\S]*?\*\/\}/g, "")
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .find((block) => block && !/^(import |export |#|<|:::|```|\||- |\* |\d+\. |>|!\[)/.test(block))
  if (!paragraph) return ""
  const text = paragraph
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s*\n\s*/g, " ")
    .trim()
  // Search results show about half as many CJK characters as Latin ones.
  const limit = /[\u3400-\u9fff]/.test(text) ? Math.round(max / 2) : max
  return text.length > limit ? `${text.slice(0, limit - 1).trimEnd()}…` : text
}

export const organization = {
  "@type": "Organization",
  name: "Zeabur",
  url: "https://zeabur.com",
  logo: `${siteOrigin}/favicon.svg`,
  sameAs: [githubOrg],
}

/** A JSON-LD `<script>` for Starlight's head list. */
export function jsonLd(data: Record<string, unknown>) {
  return {
    tag: "script" as const,
    attrs: { type: "application/ld+json" },
    content: JSON.stringify({ "@context": "https://schema.org", ...data }),
  }
}
