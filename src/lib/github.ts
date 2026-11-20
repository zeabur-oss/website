// The star count beside the GitHub link, read once at build time. A build without network or over
// the rate limit shows the link without a count.
import { githubOrg } from "./site.ts"

export const starredRepo = `${githubOrg}/zeabur`

async function read(): Promise<number | undefined> {
  const headers: Record<string, string> = { accept: "application/vnd.github+json" }
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  try {
    const response = await fetch(`https://api.github.com/repos${new URL(starredRepo).pathname}`, {
      headers,
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) return undefined
    const body = (await response.json()) as { stargazers_count?: unknown }
    return typeof body.stargazers_count === "number" ? body.stargazers_count : undefined
  } catch {
    return undefined
  }
}

let stars: Promise<number | undefined> | undefined

/** The count in the page's language, such as "1.2K" or "1,234", or undefined. */
export async function starCount(locale: string): Promise<string | undefined> {
  stars ??= read()
  const count = await stars
  if (count === undefined) return undefined
  return new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }).format(
    count,
  )
}

/** A release as the GitHub API returns it, with the fields the Desktop page reads. */
type Release = {
  tag_name: string
  html_url: string
  draft: boolean
  prerelease: boolean
  assets: { name: string; browser_download_url: string }[]
}

function isRelease(value: unknown): value is Release {
  if (typeof value !== "object" || value === null) return false
  const r: Partial<Record<keyof Release, unknown>> = value
  return (
    typeof r.tag_name === "string" &&
    typeof r.html_url === "string" &&
    typeof r.draft === "boolean" &&
    typeof r.prerelease === "boolean" &&
    Array.isArray(r.assets) &&
    r.assets.every(
      (a: unknown) =>
        typeof a === "object" &&
        a !== null &&
        "name" in a &&
        typeof a.name === "string" &&
        "browser_download_url" in a &&
        typeof a.browser_download_url === "string",
    )
  )
}

export type DesktopRelease = {
  /** The release page, or the list of releases when no release has Desktop's files. */
  page: string
  tag?: string
  prerelease: boolean
  /** Desktop's files to install, with their download links; not the macOS app's update archive. */
  files: { name: string; url: string }[]
}

const desktopPrefix = "zeabur-desktop-"

const noDesktop: DesktopRelease = { page: `${starredRepo}/releases`, prerelease: false, files: [] }

/**
 * The newest release with Desktop's files in a reply of GitHub's list of releases, which comes
 * newest first. Pre-releases count: GitHub never marks one as latest.
 */
export function pickDesktop(body: unknown): DesktopRelease {
  if (!Array.isArray(body)) return noDesktop
  const release = body
    .filter(isRelease)
    .find((r) => !r.draft && r.assets.some((a) => a.name.startsWith(desktopPrefix)))
  if (!release) return noDesktop
  return {
    page: release.html_url,
    tag: release.tag_name,
    prerelease: release.prerelease,
    files: release.assets
      .filter((a) => a.name.startsWith(desktopPrefix) && !a.name.endsWith(".tar.gz"))
      .map((a) => ({ name: a.name, url: a.browser_download_url })),
  }
}

async function readDesktop(): Promise<DesktopRelease> {
  const headers: Record<string, string> = { accept: "application/vnd.github+json" }
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  try {
    const response = await fetch(
      `https://api.github.com/repos${new URL(starredRepo).pathname}/releases?per_page=30`,
      { headers, signal: AbortSignal.timeout(5000) },
    )
    if (!response.ok) return noDesktop
    return pickDesktop(await response.json())
  } catch {
    return noDesktop
  }
}

let desktop: Promise<DesktopRelease> | undefined

/**
 * The newest release of Zeabur with Zeabur Desktop's files, read once at build time. A build
 * without network links the list of releases.
 */
export function desktopRelease(): Promise<DesktopRelease> {
  desktop ??= readDesktop()
  return desktop
}

/** The command that installs Desktop from Zeabur's Homebrew tap. */
export const desktopBrew = "brew install --cask zeabur-oss/tap/zeabur-desktop"

async function readCask(): Promise<boolean> {
  try {
    const response = await fetch(
      `https://raw.githubusercontent.com/${new URL(githubOrg).pathname.slice(1)}/homebrew-tap/main/Casks/zeabur-desktop.rb`,
      { method: "HEAD", signal: AbortSignal.timeout(5000) },
    )
    return response.ok
  } catch {
    return false
  }
}

let cask: Promise<boolean> | undefined

/**
 * Whether the Homebrew tap has Desktop's cask, read once at build time. The tap gets it with the
 * first release that is not a pre-release.
 */
export function desktopCask(): Promise<boolean> {
  cask ??= readCask()
  return cask
}
