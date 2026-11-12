import { z } from "zod"

const repository = z.object({ stargazers_count: z.number().int().nonnegative() })

let pending: Promise<number | undefined> | undefined

/** Stars of zeabur-oss/zeabur, read once per build. Undefined when GitHub does not answer. */
export function githubStars(): Promise<number | undefined> {
  pending ??= readStars()
  return pending
}

async function readStars() {
  try {
    const token = process.env.GITHUB_TOKEN
    const response = await fetch("https://api.github.com/repos/zeabur-oss/zeabur", {
      headers: {
        Accept: "application/vnd.github+json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) return undefined
    return repository.parse(await response.json()).stargazers_count
  } catch {
    return undefined
  }
}

/** 1234 → "1.2K", in the locale's own short form. */
export function shortCount(count: number, locale: string) {
  return new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }).format(
    count,
  )
}
