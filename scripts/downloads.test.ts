import { expect, test } from "bun:test"
import { detectPlatform, downloadTable, fileFor } from "../src/lib/downloads.ts"

test("the table lists only installers, not the update archive or other files of the release", () => {
  const table = downloadTable(
    [
      "zeabur-desktop-v0.3.0-darwin-arm64.app.tar.gz",
      "zeabur-desktop-v0.3.0-darwin-arm64.dmg",
      "zeaburctl-v0.3.0-darwin-arm64.tar.gz",
      "SHA256SUMS",
    ].map((name) => ({ name })),
  )
  expect(table).toEqual([
    {
      os: "macos",
      rows: [
        {
          kind: "dmg",
          ext: ".dmg",
          builds: [{ arch: "arm64", file: { name: "zeabur-desktop-v0.3.0-darwin-arm64.dmg" } }],
        },
      ],
    },
  ])
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
