import shots from "../../content/shots.json"
import { shotUrl } from "./urls.ts"

const sizes: Record<string, number[]> = shots

/** The shot in `locale`, or in English when it was taken for fewer locales. */
export function findShot(repo: string, locale: string, theme: string, id: string) {
  for (const l of [locale, "en"]) {
    const size = sizes[`${repo}/${l}/${theme}/${id}`]
    if (size) return { src: shotUrl(repo, l, theme, id), width: size[0], height: size[1] }
  }
  return { src: shotUrl(repo, locale, theme, id), width: undefined, height: undefined }
}
