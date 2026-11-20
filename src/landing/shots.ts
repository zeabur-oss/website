import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { avifFileSize } from "../lib/avif.ts"

// Screenshots on the landing and the product pages, from the docs images sync-docs.ts copies to
// public/docs-assets/, and the widths they are shown at.

export type ShotImage = { src: string; width: number; height: number }

function image(repo: string, ...paths: string[]): ShotImage {
  for (const path of paths) {
    const src = `/docs-assets/${repo}/docs/${path}`
    const file = join(process.cwd(), "public", src)
    if (!existsSync(file)) continue
    const [width, height] = avifFileSize(file)
    return { src, width, height }
  }
  throw new Error(`${repo} has no docs/${paths.at(-1)}; run bun scripts/sync-docs.ts`)
}

/** A screenshot from Zeabur's docs, in `locale` or else in English. */
export const shot = (locale: string, id: string) =>
  image("zeabur", `${locale}/images/shots/${id}.avif`, `images/shots/${id}.avif`)

/** Zeabur Identity's sign-in pages, from its docs. */
export const identityShot = (name: string, theme: "light" | "dark" = "light") =>
  image("identity", `images/${name}-${theme}.avif`)

/** A screen of Zeatend's terminal interface, 80 × 24, from its docs. */
export function zeatendScreen(locale: string, name: string): ShotImage {
  const src = `/docs-assets/zeatend/docs/screens/80x24/${locale.replace("-", "_")}-${name}.svg`
  const svg = readFileSync(join(process.cwd(), "public", src), "utf8")
  const size = /<svg[^>]* width="(\d+)" height="(\d+)"/.exec(svg)
  if (!size) throw new Error(`${src}: no width and height`)
  return { src, width: Number(size[1]), height: Number(size[2]) }
}

// The container is 1440px wide at most, with 16px or 40px gutters and 24px between grid columns.
export const sizes = {
  full: "(min-width: 1440px) 1360px, (min-width: 768px) calc(100vw - 80px), calc(100vw - 32px)",
  wide: "(min-width: 1440px) 899px, (min-width: 1024px) calc(66.7vw - 61px), (min-width: 768px) calc(100vw - 80px), calc(100vw - 32px)",
  half: "(min-width: 1440px) 668px, (min-width: 768px) calc(50vw - 52px), calc(100vw - 32px)",
}
