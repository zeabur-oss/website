// Reads the built site (bun run build first): a link in a docs page's text must not send a page
// that the site serves to GitHub. Links to other files in a repository (CONTRIBUTING.md, source
// files) are fine.
import { expect, test } from "bun:test"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

const dist = join(import.meta.dir, "..", "dist")

function* pages(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) yield* pages(path)
    else if (entry.name === "index.html") yield path
  }
}

test("docs text links stay on the site", () => {
  expect(existsSync(dist), "run `bun run build` first").toBe(true)
  const wrong: string[] = []
  for (const page of pages(join(dist))) {
    const html = readFileSync(page, "utf8")
    const start = html.indexOf('class="sl-markdown-content')
    if (start < 0) continue
    // The text ends where Starlight's footer (with the edit link) starts.
    const end = html.indexOf("<footer", start)
    const text = html.slice(start, end < 0 ? undefined : end)
    for (const [, href] of text.matchAll(/href="(https:\/\/github\.com\/[^"]+)"/g)) {
      const path = new URL(href!).pathname
      if (
        /\/(blob|tree)\/[^/]+\/(docs\/.*\.mdx?|(zh-TW\/|zh-CN\/)?docs\/[a-z]+(\/|$))/.test(path)
      ) {
        wrong.push(`${page.slice(dist.length)}: ${href}`)
      }
    }
  }
  expect(wrong).toEqual([])
})

test("every page's social image is built", () => {
  const missing: string[] = []
  for (const page of [...pages(dist), join(dist, "404.html")]) {
    const html = readFileSync(page, "utf8")
    // Redirects for moved pages have no head of their own.
    if (html.includes('http-equiv="refresh"')) continue
    const image = html.match(
      /<meta property="og:image" content="https:\/\/oss\.zeabur\.com([^"]+)"/,
    )
    if (!image) missing.push(`${page.slice(dist.length)}: no og:image`)
    else if (!existsSync(join(dist, image[1]!)))
      missing.push(`${page.slice(dist.length)}: ${image[1]}`)
  }
  expect(missing).toEqual([])
})

test("language links and hreflang alternates go to built pages", () => {
  const built = (path: string) =>
    path === "/" || existsSync(join(dist, path, "index.html")) || existsSync(join(dist, path))
  const missing: string[] = []
  for (const page of [...pages(dist), join(dist, "404.html")]) {
    const html = readFileSync(page, "utf8")
    const links = [
      ...html.matchAll(/<a href="(\/[^"#]*)[^"]*" hreflang=/g),
      ...html.matchAll(
        /<link rel="alternate" hreflang="[^"]+" href="https:\/\/oss\.zeabur\.com(\/[^"#]*)/g,
      ),
    ]
    for (const [, path] of links) {
      if (!built(path!)) missing.push(`${page.slice(dist.length)}: ${path}`)
    }
  }
  expect(missing).toEqual([])
})
