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
