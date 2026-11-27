// What the site reads from GitHub at build time: the star count and the files of each latest
// release. A build without network or over the rate limit leaves out what it could not read.
import { z } from "astro/zod"
import type { ProductId } from "./products.ts"
import { releaseTag } from "./releases.ts"
import { githubOrg } from "./site.ts"

export const starredRepo = `${githubOrg}/zeabur`

/** A reply of GitHub's REST API for `path` under /repos/zeabur-oss, or undefined on any failure. */
async function api<T>(path: string, schema: z.ZodType<T>): Promise<T | undefined> {
  const headers: Record<string, string> = { accept: "application/vnd.github+json" }
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  try {
    const response = await fetch(
      `https://api.github.com/repos${new URL(githubOrg).pathname}/${path}`,
      {
        headers,
        signal: AbortSignal.timeout(5000),
      },
    )
    if (!response.ok) return undefined
    const reply = schema.safeParse(await response.json())
    return reply.success ? reply.data : undefined
  } catch {
    return undefined
  }
}

const read = async () =>
  (await api("zeabur", z.object({ stargazers_count: z.number() })))?.stargazers_count

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

/** The fields of a GitHub release that the product pages read. */
const releaseReply = z.object({
  html_url: z.string(),
  assets: z.array(z.object({ name: z.string(), browser_download_url: z.string() })),
})

export type Release = {
  tag: string
  page: string
  /** The release's files with their download links. */
  files: { name: string; url: string }[]
}

async function readRelease(id: ProductId): Promise<Release> {
  const tag = releaseTag(id)
  const latest: Release = {
    tag,
    page: `${githubOrg}/${id}/releases/tag/${tag}`,
    files: [],
  }
  const reply = await api(`${id}/releases/tags/${tag}`, releaseReply)
  if (!reply) return latest
  return {
    ...latest,
    page: reply.html_url,
    files: reply.assets.map((a) => ({ name: a.name, url: a.browser_download_url })),
  }
}

const releases = new Map<ProductId, Promise<Release>>()

/**
 * The latest full release of a repository, with its files, read once per build. A build without
 * network gets the tag and its release page, without files.
 */
export function release(id: ProductId): Promise<Release> {
  let r = releases.get(id)
  if (!r) {
    r = readRelease(id)
    releases.set(id, r)
  }
  return r
}

async function readCask(cask: string): Promise<boolean> {
  const [owner, tap, name] = cask.split("/")
  try {
    const response = await fetch(
      `https://raw.githubusercontent.com/${owner}/homebrew-${tap}/main/Casks/${name}.rb`,
      { method: "HEAD", signal: AbortSignal.timeout(5000) },
    )
    return response.ok
  } catch {
    return false
  }
}

const casks = new Map<string, Promise<boolean>>()

/** Whether a Homebrew tap has `cask` (owner/tap/name), read once per build. */
export function hasCask(cask: string): Promise<boolean> {
  let c = casks.get(cask)
  if (!c) {
    c = readCask(cask)
    casks.set(cask, c)
  }
  return c
}
