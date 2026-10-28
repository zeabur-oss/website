import { readFileSync } from "node:fs"
import { join } from "node:path"
import { shotUrl } from "./urls.ts"

let sizes: Record<string, [number, number]> | undefined

function load() {
  sizes ??= JSON.parse(readFileSync(join(process.cwd(), "content/shots.json"), "utf8"))
  return sizes!
}

/**
 * The shot in `locale`, or in English when it was taken for fewer locales; undefined when the
 * build has neither, such as before the repository's release publishes its screenshots.
 */
export function findShot(repo: string, locale: string, theme: string, id: string) {
  for (const l of [locale, "en"]) {
    const size = load()[`${repo}/${l}/${theme}/${id}`]
    if (size) return { src: shotUrl(repo, l, theme, id), width: size[0], height: size[1] }
  }
}

export type ScreenshotProps = {
  id: string
  alt: string
  repo?: string
  locale?: string
  theme?: "light" | "dark"
  dark?: boolean
}

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

/**
 * A docs screenshot. Shots are taken at twice the pixel density, so the CSS size is half the
 * file's, and the image never shows wider than that. A shot the build does not have is left out
 * rather than shown as a broken image; with `dark`, a missing theme shows the other in both.
 */
export function screenshotHtml(
  props: ScreenshotProps,
  page: { repo: string; contentLocale: string },
) {
  const repo = props.repo ?? page.repo
  const locale = props.locale ?? page.contentLocale
  const find = (theme: string) => findShot(repo, locale, theme, props.id)
  const img = (shot: NonNullable<ReturnType<typeof findShot>>, className: string) =>
    `<img src="${shot.src}" alt="${escape(props.alt)}" width="${shot.width / 2}" height="${shot.height / 2}" style="max-width:min(100%,${shot.width / 2}px)" loading="lazy" decoding="async" class="${className}">`
  const [light, dark] = props.dark ? [find("light"), find("dark")] : [find(props.theme ?? "light")]
  const body =
    light && dark
      ? img(light, "theme-light") + img(dark, "theme-dark")
      : light || dark
        ? img((light ?? dark)!, "")
        : ""
  return body ? `<figure class="docs-shot">${body}</figure>` : ""
}
