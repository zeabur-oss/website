import { expect, test } from "bun:test"
import { detectPlatform, downloadTable, fileFor } from "../src/lib/desktop-download.ts"
import { pickDesktop } from "../src/lib/github.ts"

const release = (tag: string, prerelease: boolean, files: string[], draft = false) => ({
  tag_name: tag,
  html_url: `https://github.com/zeabur-oss/zeabur/releases/tag/${tag}`,
  draft,
  prerelease,
  assets: files.map((name) => ({ name, browser_download_url: `https://example.test/${name}` })),
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
  expect(picked.files).toEqual([
    {
      name: "zeabur-desktop-v0.3.0-beta.1-darwin-arm64.dmg",
      url: "https://example.test/zeabur-desktop-v0.3.0-beta.1-darwin-arm64.dmg",
    },
  ])
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

test("the macOS app's update archive is not a file to download", () => {
  const picked = pickDesktop([
    release("v0.3.0", false, [
      "zeabur-desktop-v0.3.0-darwin-arm64.app.tar.gz",
      "zeabur-desktop-v0.3.0-darwin-arm64.dmg",
    ]),
  ])
  expect(picked.files.map((f) => f.name)).toEqual(["zeabur-desktop-v0.3.0-darwin-arm64.dmg"])
})

const files = [
  "darwin-arm64.dmg",
  "windows-amd64-setup.exe",
  "windows-amd64-portable.exe",
  "linux-amd64.deb",
  "linux-amd64.AppImage",
  "linux-arm64.AppImage",
].map((rest) => ({ name: `zeabur-desktop-v0.3.0-${rest}` }))

const ua = {
  mac: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15",
  windows:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
  linux: "Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0",
  linuxArm: "Mozilla/5.0 (X11; Linux aarch64; rv:140.0) Gecko/20100101 Firefox/140.0",
  iphone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
  android:
    "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36",
}

const chosen = (userAgent: string, hints?: Parameters<typeof detectPlatform>[1]) => {
  const platform = detectPlatform(userAgent, hints)
  return platform && fileFor(platform, files)?.file.name
}

test("each computer gets the file that installs on it", () => {
  expect(chosen(ua.mac)).toBe("zeabur-desktop-v0.3.0-darwin-arm64.dmg")
  expect(chosen(ua.windows)).toBe("zeabur-desktop-v0.3.0-windows-amd64-setup.exe")
  expect(chosen(ua.linux)).toBe("zeabur-desktop-v0.3.0-linux-amd64.AppImage")
  expect(chosen(ua.linuxArm)).toBe("zeabur-desktop-v0.3.0-linux-arm64.AppImage")
  expect(chosen(ua.linux, { platform: "Linux", mobile: false, architecture: "arm" })).toBe(
    "zeabur-desktop-v0.3.0-linux-arm64.AppImage",
  )
})

test("a computer without a build, or a phone, gets no file", () => {
  expect(chosen(ua.mac, { platform: "macOS", mobile: false, architecture: "x86" })).toBeUndefined()
  expect(
    chosen(ua.windows, { platform: "Windows", mobile: false, architecture: "arm" }),
  ).toBeUndefined()
  expect(chosen(ua.iphone)).toBeUndefined()
  expect(chosen(ua.android)).toBeUndefined()
})

test("the list groups files by system and leaves out ways with no file", () => {
  const table = downloadTable(files).map((g) => ({
    os: g.os,
    rows: g.rows.map((r) => `${r.kind}:${r.builds.map((b) => b.arch).join(",")}`),
  }))
  expect(table).toEqual([
    { os: "macos", rows: ["dmg:arm64"] },
    { os: "windows", rows: ["setup:amd64", "portable:amd64"] },
    { os: "linux", rows: ["deb:amd64", "appimage:amd64,arm64"] },
  ])
})
