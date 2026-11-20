import { expect, test } from "bun:test"

import { firstLine, linkEvent } from "../../src/lib/analytics.ts"

test("a release file link is a download, with its tag and file name", () => {
  expect(
    linkEvent(
      "https://github.com/zeabur-oss/desktop/releases/download/v0.1.0/Zeabur.Desktop_0.1.0_aarch64.dmg",
    ),
  ).toEqual({
    name: "download_clicked",
    props: { repo: "desktop", tag: "v0.1.0", file: "Zeabur.Desktop_0.1.0_aarch64.dmg" },
  })
  expect(
    linkEvent("https://github.com/zeabur-oss/zeatend/releases/latest/download/zeatend.tar.gz"),
  ).toEqual({
    name: "download_clicked",
    props: { repo: "zeatend", tag: "latest", file: "zeatend.tar.gz" },
  })
})

test("release pages, repositories and the organisation stay apart", () => {
  expect(linkEvent("https://github.com/zeabur-oss/zeabur/releases/tag/v0.2.0")).toEqual({
    name: "releases_clicked",
    props: { repo: "zeabur" },
  })
  expect(linkEvent("https://github.com/zeabur-oss/zeabur/stargazers")).toEqual({
    name: "github_clicked",
    props: { repo: "zeabur" },
  })
  expect(linkEvent("https://github.com/zeabur-oss")).toEqual({
    name: "github_clicked",
    props: { repo: undefined },
  })
})

test("other links send nothing", () => {
  expect(linkEvent("https://github.com/zeabur-ossx/zeabur")).toBeUndefined()
  expect(linkEvent("https://oss.zeabur.com/docs/")).toBeUndefined()
  expect(linkEvent("")).toBeUndefined()
})

test("copied code is grouped by its first line", () => {
  expect(firstLine("  curl -fLO https://example.com/a\nsha256sum -c a.sha256")).toBe(
    "curl -fLO https://example.com/a",
  )
  expect(firstLine("# On the server\u007fcurl -fLO https://example.com/a")).toBe(
    "curl -fLO https://example.com/a",
  )
  expect(firstLine("# only a comment")).toBe("# only a comment")
  expect(firstLine("x".repeat(200))).toHaveLength(120)
})
