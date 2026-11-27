import { hasCask } from "../../lib/github.ts"
import { release } from "../../lib/releases.ts"
import { downloadTable, fileFor, oses, type Arch, type Os } from "../../lib/downloads.ts"
import type { PageRow, PageText } from "../../lib/site-pages.ts"

/** The installers a downloads page offers from its latest release, or undefined for other pages. */
export async function pageDownloads(row: PageRow, text: PageText) {
  const words = text.download
  if (row.start.kind !== "downloads") return undefined
  if (!words) throw new Error(`${row.slug} offers downloads but its text has no download words`)
  const { files: prefix, cask } = row.start
  const latest = release(row.repo)
  const files = latest.files.filter((f) => f.name.startsWith(prefix))
  const archName = (os: Os, arch: Arch) =>
    os === "macos" && arch === "arm64" ? words.apple : arch === "arm64" ? "Arm64" : "x64"
  // The main button's file for each computer, which the page's script picks from.
  const choices = Object.fromEntries(
    oses.flatMap((os) =>
      (["arm64", "amd64"] as const).flatMap((arch) => {
        const c = fileFor({ os, arch }, files)
        if (!c) return []
        const caption = [archName(os, arch), c.ext, latest.tag].filter(Boolean).join(" · ")
        return [[`${os}-${arch}`, { url: c.file.url, label: words.for[os], caption }]]
      }),
    ),
  )
  return {
    words,
    archName,
    choices,
    href: files.length > 0 ? "#downloads" : latest.page,
    page: latest.page,
    table: downloadTable(files),
    brew: cask && (await hasCask(cask)) ? `brew install --cask ${cask}` : undefined,
  }
}
