import { describe, expect, test } from "bun:test"
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { checkRepo } from "./check.ts"
import { sourceHash } from "./docs.ts"
import { fromDirectory } from "./repos.ts"

const nav = `- group: start\n  label: Start\n  pages: [quickstart, install]\n`
const page = (body: string, front = "title: T") => `---\n${front}\n---\n\n${body}\n`

async function check(files: Record<string, string>, base?: Record<string, string>) {
  const make = async (tree: Record<string, string>) => {
    const dir = mkdtempSync(join(tmpdir(), "docs-check-"))
    for (const [path, text] of Object.entries(tree)) {
      mkdirSync(dirname(join(dir, path)), { recursive: true })
      writeFileSync(join(dir, path), text)
    }
    return fromDirectory(dir, "demo")
  }
  const findings = checkRepo(await make(files), { base: base ? await make(base) : undefined })
  return findings
    .filter((f) => f.level !== "warning")
    .map((f) => `${f.level} ${f.file}: ${f.message}`)
}

const repo = {
  "docs/nav.yaml": nav,
  "docs/index.mdx": page("Home. [Start](start/quickstart.mdx)"),
  "docs/start/quickstart.mdx": page("[Install](install.mdx#ports)"),
  "docs/start/install.mdx": page("Install."),
}

describe("docs-check", () => {
  test("a correct repository has no findings", async () => {
    expect(await check(repo)).toEqual([])
  })

  test("nav.yaml lists a page without a file", async () => {
    const { "docs/start/install.mdx": _, ...rest } = repo
    const found = await check({ ...rest, "docs/start/quickstart.mdx": page("Hi.") })
    expect(found).toEqual(["error docs/nav.yaml: lists start/install, which has no file"])
  })

  test("reserved names", async () => {
    const found = await check({
      "docs/nav.yaml": `- group: images\n  label: I\n  pages: [zh-TW]\n`,
      "docs/images/zh-TW.mdx": page("x"),
    })
    expect(found.some((f) => f.includes('"images" is reserved'))).toBe(true)
  })

  test("relative links: missing files and unpublished pages", async () => {
    const found = await check({
      ...repo,
      "docs/start/install.mdx": page(
        "[a](../nope.mdx) [b](../internal/testing.md) ![c](../images/x.png)",
      ),
      "docs/internal/testing.md": "# Testing\n",
    })
    expect(found).toEqual([
      "error docs/start/install.mdx: line 5: ../nope.mdx points to docs/nope.mdx, which does not exist",
      "error docs/start/install.mdx: line 5: ../internal/testing.md is a page that nav.yaml does not publish",
      "error docs/start/install.mdx: line 5: ../images/x.png points to docs/images/x.png, which does not exist",
    ])
  })

  test("a translation's image falls back to the original's", async () => {
    const found = await check({
      ...repo,
      "docs/images/x.png": "png",
      "docs/zh-TW/start/install.mdx": page(
        "![x](../images/x.png)",
        `title: 安裝\nsource: ${sourceHash(repo["docs/start/install.mdx"])}`,
      ),
    })
    expect(found).toEqual([])
  })

  test("removed pages need a redirect, and redirects go to published pages", async () => {
    const before = {
      ...repo,
      "docs/nav.yaml": nav.replace("install]", "install, old]"),
      "docs/start/old.mdx": page("x"),
    }
    expect(await check(repo, before)).toEqual([
      "error docs/redirects.yaml: start/old was published at HEAD and is gone; add a redirect",
    ])
    expect(
      await check({ ...repo, "docs/redirects.yaml": "start/old: start/gone\n" }, before),
    ).toEqual(["error docs/redirects.yaml: start/old goes to start/gone, which is not published"])
    expect(
      await check({ ...repo, "docs/redirects.yaml": "start/old: start/install\n" }, before),
    ).toEqual([])
  })

  test("frontmatter, imports and components", async () => {
    const found = await check({
      ...repo,
      "docs/start/install.mdx": page(
        [
          'import X from "./x"',
          '<Callout type="danger">Hi</Callout>',
          "<Fancy />",
          "<Tabs items={['a', 'b']}><Tab>a</Tab><Tab>b</Tab></Tabs>",
          "<Tabs items={list}><Tab>a</Tab></Tabs>",
        ].join("\n\n"),
        "title: T\nauthor: me",
      ),
    })
    expect(found).toEqual([
      'error docs/start/install.mdx: frontmatter field "author" is not allowed (title, description)',
      "error docs/start/install.mdx: line 6: no import or export; components come from the site's registry",
      expect.stringContaining("line 8: <Callout>"),
      "error docs/start/install.mdx: line 10: <Fancy> is not in src/docs-components/registry.ts",
      "error docs/start/install.mdx: line 14: <Tabs> props must be literals (Identifier is not a literal)",
    ])
  })

  test("screenshots must be declared in shots.yaml", async () => {
    const found = await check({
      ...repo,
      "docs/shots.yaml": "- id: home\n  path: /\n",
      "docs/start/install.mdx": page(
        '<Screenshot id="home" alt="Home" />\n\n<Screenshot id="nope" alt="x" />\n\n![x](https://oss.zeabur.com/shots/demo/en/dark/home.avif)',
      ),
    })
    expect(found).toEqual([
      "error docs/start/install.mdx: line 7: screenshot nope is not in docs/shots.yaml",
      "error docs/start/install.mdx: line 9: screenshot home has no dark theme",
    ])
  })

  test("stale translations are listed", async () => {
    const original = repo["docs/start/install.mdx"]
    const fresh = page("安裝。", `title: 安裝\nsource: ${sourceHash(original)}`)
    expect(await check({ ...repo, "docs/zh-TW/start/install.mdx": fresh })).toEqual([])
    const found = await check({
      ...repo,
      "docs/zh-TW/start/install.mdx": page("安裝。", "title: 安裝\nsource: 000000000000"),
    })
    expect(found).toEqual([
      `stale docs/zh-TW/start/install.mdx: translated from 0; docs/start/install.mdx is now ${sourceHash(original)}`,
    ])
  })
})
