import { mkdirSync, renameSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { root } from "./lib/repos.ts"
import type { SiteData } from "./sync-docs.ts"
import { docsUrl, locales, localePrefix, siteOrigin } from "../src/lib/urls.ts"

const out = join(root, "dist/client")
const site: SiteData = await Bun.file(join(root, "content/site.json")).json()

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")

function redirect(from: string, to: string) {
  const file = join(out, from, "index.html")
  if (Bun.file(file).size > 0) throw new Error(`redirect ${from} would replace a page`)
  mkdirSync(dirname(file), { recursive: true })
  const href = escape(to)
  writeFileSync(
    file,
    `<!doctype html><meta charset="utf-8"><title>Redirecting</title><link rel="canonical" href="${escape(siteOrigin + to)}"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=${href}"><a href="${href}">${href}</a>\n`,
  )
}

const redirects = [
  ...site.redirects,
  ...locales.map((locale) => ({
    from: `${localePrefix(locale)}/docs`,
    to: docsUrl(locale, "zeabur"),
  })),
]
for (const { from, to } of redirects) redirect(from, to)

renameSync(join(out, "404/index.html"), join(out, "404.html"))
rmSync(join(out, "404"), { recursive: true })
console.log(`postbuild: ${redirects.length} redirects, 404.html`)
