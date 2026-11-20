import { expect, test } from "bun:test"
import { pickDesktop } from "../src/lib/github.ts"

const release = (tag: string, prerelease: boolean, files: string[], draft = false) => ({
  tag_name: tag,
  html_url: `https://github.com/zeabur-oss/zeabur/releases/tag/${tag}`,
  draft,
  prerelease,
  assets: files.map((name) => ({ name })),
})

test("the newest release with Desktop's files wins, pre-release or not", () => {
  const picked = pickDesktop([
    release("v0.4.0", false, [], true),
    release("v0.3.1", false, ["zeaburctl-v0.3.1-linux-amd64.tar.gz"]),
    release("v0.3.0-beta.1", true, [
      "zeabur-desktop-v0.3.0-beta.1-darwin-arm64.dmg",
      "zeabur-v0.3.0-beta.1-linux-amd64.tar.gz",
    ]),
    release("v0.2.0", false, ["zeabur-desktop-v0.2.0-darwin-arm64.dmg"]),
  ])
  expect(picked.tag).toBe("v0.3.0-beta.1")
  expect(picked.prerelease).toBe(true)
  expect(picked.page).toBe("https://github.com/zeabur-oss/zeabur/releases/tag/v0.3.0-beta.1")
})

test("without a release with Desktop's files, the page links the list of releases", () => {
  for (const body of [
    [],
    [release("v0.2.0", false, ["SHA256SUMS"])],
    { message: "rate limited" },
  ]) {
    const picked = pickDesktop(body)
    expect(picked.tag).toBeUndefined()
    expect(picked.page).toBe("https://github.com/zeabur-oss/zeabur/releases")
  }
})
