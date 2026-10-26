import { describe, expect, test } from "bun:test"
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { checkRepo } from "./check.ts"
import { sourceHash } from "./docs.ts"
import { fromDirectory } from "./repos.ts"

const nav = `- group: start\n  label: Start\n  pages: [quickstart, install]\n`
const page = (body: string, front = "title: T") => `---\n${front}\n---\n\n${body}\n`

async function findings(files: Record<string, string>, base?: Record<string, string>) {
  const make = async (tree: Record<string, string>) => {
    const dir = mkdtempSync(join(tmpdir(), "docs-check-"))
    for (const [path, text] of Object.entries(tree)) {
      mkdirSync(dirname(join(dir, path)), { recursive: true })
      writeFileSync(join(dir, path), text)
    }
    return fromDirectory(dir, "demo")
  }
  return checkRepo(await make(files), { base: base ? await make(base) : undefined }).filter(
    (f) => f.level !== "warning",
  )
}

async function check(files: Record<string, string>, base?: Record<string, string>) {
  return (await findings(files, base)).map(
    (f) => `${f.level} ${f.code} ${f.file}${f.line === undefined ? "" : `:${f.line}`}`,
  )
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
    expect(found).toEqual(["error nav-page-missing docs/nav.yaml"])
  })

  test("reserved names", async () => {
    const found = await check({
      "docs/nav.yaml": `- group: images\n  label: I\n  pages: [zh-TW]\n`,
      "docs/images/zh-TW.mdx": page("x"),
    })
    expect(found).toContain("error reserved-name docs/nav.yaml")
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
      "error link-missing docs/start/install.mdx:5",
      "error link-unpublished docs/start/install.mdx:5",
      "error link-missing docs/start/install.mdx:5",
    ])
  })

  test("links that would send readers to GitHub", async () => {
    const files = {
      ...repo,
      LICENSE: "Apache",
      "src/main.rs": "fn main() {}",
      "docs/examples/a.yaml": "a: 1",
      "docs/start/install.mdx": page(
        "[a](../../LICENSE) [b](../../src) [c](../examples/a.yaml) " +
          "[d](https://github.com/zeabur-oss/demo/blob/main/docs/start/quickstart.mdx) " +
          "[e](https://github.com/zeabur-oss/identity/blob/main/docs/clients.md#cli) " +
          "[f](https://github.com/zeabur-oss/demo/blob/main/src/main.rs)",
      ),
    }
    expect(await check(files)).toEqual([
      "error link-outside-docs docs/start/install.mdx:5",
      "error link-outside-docs docs/start/install.mdx:5",
      "error link-github-docs docs/start/install.mdx:5",
      "error link-github-docs-other docs/start/install.mdx:5",
    ])
  })

  test("the README may link to files outside docs/", async () => {
    const { "docs/index.mdx": _, ...rest } = repo
    const found = await check({
      ...rest,
      LICENSE: "Apache",
      "src/main.rs": "fn main() {}",
      "README.md": "# Demo\n\n[a](LICENSE) [b](src) [c](src/main.rs#L1) [d](MISSING.md)\n",
    })
    expect(found).toEqual(["error link-missing README.md:3"])
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
    expect(await check(repo, before)).toEqual(["error redirect-needed docs/redirects.yaml"])
    expect(
      await check({ ...repo, "docs/redirects.yaml": "start/old: start/gone\n" }, before),
    ).toEqual(["error redirect-target-unpublished docs/redirects.yaml"])
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
      "error frontmatter-field docs/start/install.mdx",
      "error import-export docs/start/install.mdx:6",
      "error component-props-invalid docs/start/install.mdx:8",
      "error component-unknown docs/start/install.mdx:10",
      "error component-props-literal docs/start/install.mdx:14",
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
      "error shot-unknown docs/start/install.mdx:7",
      "error shot-theme docs/start/install.mdx:9",
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
    expect(found).toEqual(["stale translation-stale docs/zh-TW/start/install.mdx"])
  })
})
