import { existsSync } from "node:fs"
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
export const identityShot = (name: string) => image("identity", `images/${name}-light.avif`)

// The container is 1240px wide at most, with 16px or 48px gutters.
export const sizes = {
  full: "(min-width: 1336px) 1240px, (min-width: 768px) calc(100vw - 96px), calc(100vw - 32px)",
  wide: "(min-width: 1336px) 819px, (min-width: 1024px) calc(66vw - 64px), (min-width: 768px) calc(100vw - 96px), calc(100vw - 32px)",
  half: "(min-width: 1336px) 608px, (min-width: 768px) calc(50vw - 60px), calc(100vw - 32px)",
}
