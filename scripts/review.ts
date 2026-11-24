// Screenshots of the served site at three widths, light and dark, for review.
//   bun scripts/review.ts <base-url> <out-dir> [path…]
// REVIEW_THEMES=light takes one theme, REVIEW_SCALE=2 takes them at twice the pixel density.
import { mkdirSync } from "node:fs"
import { join } from "node:path"
import { chromium } from "playwright-core"

const [base = "http://localhost:4321", out = "review", ...given] = process.argv.slice(2)
const paths = given.length
  ? given
  : [
      "/",
      "/zh-TW",
      "/zh-CN",
      "/zeabur",
      "/zh-TW/identity",
      "/zh-CN/builder",
      "/catalog",
      "/catalog/browse",
      "/zh-TW/catalog/templates/n8n",
      "/catalog/components/cert-manager",
      "/blog",
      "/zh-TW/blog",
      "/zh-TW/blog/rebuilding-zeabur",
      "/docs/zeabur",
      "/zh-TW/docs/catalog",
      "/docs/zeabur/install/one-command",
      "/zh-TW/docs/zeabur/install/one-command",
      "/zh-CN/docs/zeabur/install/one-command",
      "/docs/identity/get-started",
      "/zh-TW/docs/identity/get-started",
      "/zh-CN/docs/identity/get-started",
    ]
const widths = [390, 1440, 1960]
const themes = (process.env.REVIEW_THEMES ?? "light,dark").split(",")
const scale = Number(process.env.REVIEW_SCALE ?? 1)

mkdirSync(out, { recursive: true })
// The flake provides full Chromium, not the headless shell.
const browser = await chromium.launch({ channel: "chromium" })
const problems: string[] = []
for (const theme of themes) {
  for (const width of widths) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      colorScheme: theme as "light" | "dark",
      deviceScaleFactor: scale,
    })
    const page = await context.newPage()
    page.on("pageerror", (error) => problems.push(`${page.url()}: ${error.message}`))
    page.on("console", (m) => m.type() === "error" && problems.push(`${page.url()}: ${m.text()}`))
    for (const path of paths) {
      await page.goto(base + path, { waitUntil: "networkidle" })
      // Lazy images load before the full-page shot.
      await page.evaluate(async () => {
        for (const img of document.querySelectorAll("img")) img.loading = "eager"
        await Promise.all([...document.images].map((i) => i.decode().catch(() => {})))
        // Sections that come in on scroll are shown as they end up.
        for (const el of document.querySelectorAll("[data-reveal], .stagger"))
          el.classList.add("is-in")
        await new Promise((done) => setTimeout(done, 1200))
      })
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      if (overflow > 0) problems.push(`${path} at ${width}: ${overflow}px horizontal overflow`)
      const name = `${path.replace(/^\//, "").replaceAll("/", "_") || "en"}-${width}-${theme}.png`
      await page.screenshot({ path: join(out, name), fullPage: true })
    }
    await context.close()
  }
}
await browser.close()
for (const problem of new Set(problems)) console.log(problem)
console.log(`screenshots in ${out}`)
