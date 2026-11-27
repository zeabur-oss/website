// Reads the built site (bun run build first): a link in a docs page's text must not send a page
// that the site serves to GitHub. Links to other files in a repository (CONTRIBUTING.md, source
// files) are fine.
import { expect, test } from "bun:test"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { group } from "../src/lib/capture.ts"

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
    for (const match of text.matchAll(/href="(https:\/\/github\.com\/[^"]+)"/g)) {
      const href = group(match)
      const path =
        /^\/[^/]+\/([^/]+)\/(?:blob|tree)\/[^/]+\/docs\/(?:zh-TW\/|zh-CN\/)?(.+?)(?:\.mdx?)?\/?$/.exec(
          new URL(href).pathname,
        )
      if (!path) continue
      const [, repo = "", slug = ""] = path
      const served = join(dist, "docs", repo, slug.replace(/(^|\/)index$/, ""), "index.html")
      if (existsSync(served)) {
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
    else if (!existsSync(join(dist, group(image))))
      missing.push(`${page.slice(dist.length)}: ${group(image)}`)
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
    for (const link of links) {
      const path = group(link)
      if (!built(path)) missing.push(`${page.slice(dist.length)}: ${path}`)
    }
  }
  expect(missing).toEqual([])
})

test("every link in llms.txt is a built Markdown page", () => {
  const text = readFileSync(join(dist, "llms.txt"), "utf8")
  const missing = [...text.matchAll(/\]\(https:\/\/oss\.zeabur\.com(\/[^)]*)\)/g)]
    .map((match) => group(match))
    .filter((path) => !path.endsWith(".md") || !existsSync(join(dist, path)))
  expect(missing).toEqual([])
})

test("every docs page links to its built Markdown copy", () => {
  const missing: string[] = []
  for (const page of pages(join(dist, "docs"))) {
    const html = readFileSync(page, "utf8")
    if (html.includes('http-equiv="refresh"')) continue
    const link =
      /<link rel="alternate" type="text\/markdown" href="https:\/\/oss\.zeabur\.com([^"]+)"/.exec(
        html,
      )
    if (!link || !existsSync(join(dist, group(link)))) missing.push(page.slice(dist.length))
  }
  expect(missing).toEqual([])
})

test("docs links between repositories stay in the page's channel", () => {
  const wrong: string[] = []
  for (const page of pages(join(dist, "docs"))) {
    const html = readFileSync(page, "utf8")
    const start = html.indexOf('class="sl-markdown-content')
    if (start < 0) continue
    const onMain = /^\/docs\/[^/]+\/main(\/|$)/.test(page.slice(dist.length))
    for (const match of html.slice(start).matchAll(/href="\/docs\/([^/"#]+)(\/[^"#]*)?/g)) {
      const [, repo = "", rest = ""] = match
      const linksMain = rest === "/main" || rest.startsWith("/main/")
      const mainPage = join(dist, "docs", repo, "main", rest, "index.html")
      if (onMain ? !linksMain && existsSync(mainPage) : linksMain)
        wrong.push(`${page.slice(dist.length)}: ${match[0]}`)
    }
  }
  expect(wrong).toEqual([])
})

test("pages of main are left out of search engines and the sitemap", () => {
  const page = readFileSync(join(dist, "docs/builder/main/index.html"), "utf8")
  expect(page).toContain('<meta name="robots" content="noindex"')
  expect(page).toContain('<link rel="canonical" href="https://oss.zeabur.com/docs/builder"')
  const sitemap = readFileSync(join(dist, "sitemap-0.xml"), "utf8")
  expect(sitemap).not.toContain("/main<")
  expect(sitemap).not.toContain("/main/")
})

test("pages of main load bundles that are in the build", () => {
  const missing = new Set<string>()
  for (const page of pages(join(dist, "docs/builder/main"))) {
    for (const [src] of readFileSync(page, "utf8").matchAll(/\/_astro\/[^"' )]+/g))
      if (!existsSync(join(dist, src))) missing.add(src)
  }
  expect([...missing]).toEqual([])
})
