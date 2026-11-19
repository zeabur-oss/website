import { localeInfo } from "../lib/urls.ts"

const segmenters = new Map<string, Intl.Segmenter>()

/**
 * Keeps Chinese words and their closing punctuation together without changing copied text.
 * Consecutive single-character Han segments form one group (e.g. 叢 + 集).
 */
export function chineseTextSegments(text: string, locale: string): string[] {
  if (localeInfo(locale).han === null || !/\p{Script=Han}/u.test(text)) return [text]
  let segmenter = segmenters.get(locale)
  if (!segmenter) {
    segmenter = new Intl.Segmenter(localeInfo(locale).han === "sc" ? "zh-CN" : "zh-TW", {
      granularity: "word",
    })
    segmenters.set(locale, segmenter)
  }

  const words: string[] = []
  let singleHan = ""
  for (const { segment, isWordLike } of segmenter.segment(text)) {
    if (isWordLike && /^\p{Script=Han}$/u.test(segment)) {
      singleHan += segment
      continue
    }
    if (singleHan) {
      words.push(singleHan)
      singleHan = ""
    }
    words.push(segment)
  }
  if (singleHan) words.push(singleHan)

  const groups: string[] = []
  let opening = ""
  for (const word of words) {
    if (/^[\p{Ps}\p{Pi}「『“‘]+$/u.test(word)) {
      opening += word
    } else if (/^[\p{Pe}\p{Pf}、。，．：；？！…—,.;:!?%]+$/u.test(word) && groups.length) {
      groups[groups.length - 1] += opening + word
      opening = ""
    } else {
      groups.push(opening + word)
      opening = ""
    }
  }
  if (opening) groups.push(opening)
  return groups
}
