// Phosphor icons (@phosphor-icons/core, MIT), read at build time. Every icon on the site comes
// from here, Starlight's own included (see `starlightIcons`).
import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { dirname, join } from "node:path"

export type IconWeight = "regular" | "bold" | "fill" | "duotone" | "light" | "thin"

const assets = dirname(
  dirname(createRequire(import.meta.url).resolve("@phosphor-icons/core/regular/x.svg")),
)
const cache = new Map<string, string>()

/** The inner SVG of a Phosphor icon, in its 256 × 256 viewBox. */
export function iconBody(name: string, weight: IconWeight = "regular") {
  const key = `${weight}/${name}`
  let body = cache.get(key)
  if (body === undefined) {
    const file = join(
      assets,
      weight,
      weight === "regular" ? `${name}.svg` : `${name}-${weight}.svg`,
    )
    body = readFileSync(file, "utf8")
      .replace(/^<svg[^>]*>/, "")
      .replace(/<\/svg>\s*$/, "")
    cache.set(key, body)
  }
  return body
}

/** A data URI for CSS masks. */
export function iconDataUri(name: string, weight: IconWeight = "regular") {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">${iconBody(name, weight)}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

/** Starlight's built-in icon names, drawn with Phosphor instead. */
const starlightNames: Record<string, string> = {
  "up-caret": "caret-up",
  "down-caret": "caret-down",
  "right-caret": "caret-right",
  "left-caret": "caret-left",
  "up-arrow": "arrow-up",
  "down-arrow": "arrow-down",
  "right-arrow": "arrow-right",
  "left-arrow": "arrow-left",
  bars: "list",
  translate: "translate",
  pencil: "pencil-simple",
  pen: "pen",
  document: "file-text",
  "add-document": "file-plus",
  setting: "gear-six",
  external: "arrow-square-out",
  download: "download-simple",
  "cloud-download": "cloud-arrow-down",
  moon: "moon",
  sun: "sun",
  laptop: "desktop",
  "open-book": "book-open",
  information: "info",
  magnifier: "magnifying-glass",
  "forward-slash": "line-segment",
  close: "x",
  error: "warning-octagon",
  warning: "warning",
  "approve-check-circle": "check-circle",
  "approve-check": "check",
  rocket: "lightbulb",
  star: "star",
  puzzle: "puzzle-piece",
  "list-format": "list-bullets",
  heart: "heart",
  "seti:folder": "folder",
  "seti:default": "file",
  "link-alt": "link-simple",
  github: "github-logo",
  sidebar: "sidebar-simple",
  "right-sidebar": "sidebar-simple",
  header: "rows",
  "comment-alt": "chat-centered-text",
  "question-circle": "question",
  "code-branch": "git-branch",
  "mobile-android": "device-mobile",
  "expressive-code": "code",
}

/** Starlight draws its icons in a 24 × 24 viewBox: scale Phosphor's 256 down to it. */
export function starlightIcons() {
  return Object.fromEntries(
    Object.entries(starlightNames).map(([name, phosphor]) => [
      name,
      `<g transform="scale(0.09375)">${iconBody(phosphor)}</g>`,
    ]),
  )
}
