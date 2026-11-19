import { expect, test } from "bun:test"
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { locales } from "../../src/lib/urls.ts"
import { checkSitePages } from "./site-pages.ts"

function pages(files: string[]) {
  const dir = mkdtempSync(join(tmpdir(), "site-pages-"))
  for (const locale of locales) mkdirSync(join(dir, locale))
  for (const file of files) writeFileSync(join(dir, file), "---\n---\n")
  return checkSitePages(dir).map((f) => f.file)
}

test("a page in every locale passes", () => {
  expect(pages(locales.map((l) => `${l}/start.mdx`))).toEqual([])
})

test("a locale without the page is reported", () => {
  expect(pages(["en/start.mdx", "zh-TW/start.mdx"])).toEqual(["zh-CN/start.mdx"])
})
