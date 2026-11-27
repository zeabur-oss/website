import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { join, relative, resolve } from "node:path"
import { $ } from "bun"
import { productIds, productName } from "../../src/lib/products.ts"
import { mainSection } from "../../src/lib/urls.ts"

/** The docs of one repository at one ref. */
export type Source = {
  /** The part of the URL after /docs/: `builder` for the release, `builder/main` for main. */
  name: string
  label: string
  github: string
  /** The release tag, or the commit of main or of a local check. */
  ref: string
  channel: "release" | "main"
  /** The release's page and files, for the release channel. */
  release?: { page: string; files: { name: string; url: string }[] }
}

export type Snapshot = {
  repo: Source
  /** Holds `docs/` and `README.md` of the repository at `ref`. */
  dir: string
  /** Every file path in the repository at `ref`. */
  files: Set<string>
}

export const root = resolve(import.meta.dirname, "../..")

/** The fields of a GitHub release the site reads. */
export type ReleaseInfo = {
  tag_name: string
  draft: boolean
  prerelease: boolean
  html_url: string
  assets: { name: string; browser_download_url: string }[]
}

/** The highest full release: no draft, no pre-release, a tag like v0.2.0. */
export function latestRelease<T extends Omit<ReleaseInfo, "html_url" | "assets">>(
  releases: T[],
): T | undefined {
  return releases
    .filter((r) => !r.draft && !r.prerelease && /^v\d+\.\d+\.\d+$/.test(r.tag_name))
    .sort((a, b) => Bun.semver.order(b.tag_name, a.tag_name))[0]
}

async function github(path: string, accept = "application/vnd.github+json") {
  const headers: Record<string, string> = { accept }
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  const url = `https://api.github.com/repos/${path}`
  const response = await fetch(url, { headers })
  if (!response.ok) throw new Error(`${url}: ${response.status}`)
  return response
}

/**
 * Each product repository twice: at its latest full release and at the commit main is at now,
 * from GitHub's API.
 */
export async function latestSources(): Promise<Source[]> {
  const sources = await Promise.all(
    productIds.map(async (id): Promise<Source[]> => {
      const repo = { label: productName[id], github: `zeabur-oss/${id}` }
      const releases: ReleaseInfo[] = await (
        await github(`${repo.github}/releases?per_page=100`)
      ).json()
      const latest = latestRelease(releases)
      if (!latest) throw new Error(`${repo.github} has no full release`)
      const main = await (
        await github(`${repo.github}/commits/main`, "application/vnd.github.sha")
      ).text()
      return [
        {
          ...repo,
          name: id,
          ref: latest.tag_name,
          channel: "release",
          release: {
            page: latest.html_url,
            files: latest.assets.map((a) => ({ name: a.name, url: a.browser_download_url })),
          },
        },
        { ...repo, name: mainSection(id), ref: main, channel: "main" },
      ]
    }),
  )
  return sources.flat()
}

/** Gets `docs/` and `README.md` of a repository at its ref, from GitHub's tarball. */
export async function snapshot(repo: Source): Promise<Snapshot> {
  const dir = join(root, ".cache/repos", `${repo.github.replace("/", "-")}-${repo.ref}`)
  const url = `https://codeload.github.com/${repo.github}/tar.gz/${repo.ref}`
  const headers: Record<string, string> = {}
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  return { repo, dir, files: new Set(await unpack(url, dir, headers, ["--strip-components=1"])) }
}

/** Unpacks the `.tar.gz` asset `name` of the public release at the source's tag; returns its directory. */
export async function releaseAsset(repo: Source, name: string): Promise<string> {
  const dir = join(root, ".cache/assets", `${repo.name}-${repo.ref}-${name}`)
  await unpack(`https://github.com/${repo.github}/releases/download/${repo.ref}/${name}`, dir, {})
  return dir
}

/** Downloads a `.tar.gz` into `dir` once and returns its file paths. */
async function unpack(
  url: string,
  dir: string,
  headers: Record<string, string>,
  flags: string[] = [],
): Promise<string[]> {
  const listing = join(dir, ".files.json")
  if (existsSync(listing)) return JSON.parse(readFileSync(listing, "utf8"))
  rmSync(dir, { recursive: true, force: true })
  mkdirSync(dir, { recursive: true })
  const response = await fetch(url, { headers })
  if (!response.ok) throw new Error(`${url}: ${response.status}`)
  const tgz = join(dir, ".archive.tgz")
  writeFileSync(tgz, new Uint8Array(await response.arrayBuffer()))
  await $`tar -xzf ${tgz} -C ${dir} ${flags}`.quiet()
  rmSync(tgz)
  const files = walk(dir).map((p) => relative(dir, p))
  writeFileSync(listing, JSON.stringify(files))
  return files
}

export function walk(dir: string): string[] {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && !entry.name.startsWith(".files"))
    .map((entry) => join(entry.parentPath, entry.name))
}

const local = (name: string, ref: string): Source => ({
  name,
  label: name,
  github: `zeabur-oss/${name}`,
  ref,
  channel: "release",
})

/** A working tree's own commit `rev` as a snapshot, the base that docs-check compares with. */
export async function fromRevision(dir: string, rev: string, name: string): Promise<Snapshot> {
  const out = join(root, ".cache/base", name)
  rmSync(out, { recursive: true, force: true })
  mkdirSync(out, { recursive: true })
  const files = (await $`git -C ${dir} ls-tree -r --name-only ${rev}`.text())
    .split("\n")
    .filter(Boolean)
  const wanted = ["docs", "README.md"].filter((p) =>
    files.some((f) => f === p || f.startsWith(p + "/")),
  )
  await $`git -C ${dir} archive --format=tar ${rev} ${wanted} | tar -xf - -C ${out}`.quiet()
  return { repo: local(name, rev), dir: out, files: new Set(files) }
}

/** A working tree as a snapshot, for checking a repository in its own CI. */
export async function fromDirectory(dir: string, name: string): Promise<Snapshot> {
  const tracked = await $`git -C ${dir} ls-files --cached --others --exclude-standard`
    .nothrow()
    .text()
  const files = tracked
    ? tracked.split("\n").filter(Boolean)
    : walk(dir).map((p) => relative(dir, p))
  return { repo: local(name, "HEAD"), dir, files: new Set(files) }
}
