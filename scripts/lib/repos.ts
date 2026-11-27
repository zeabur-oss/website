import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { join, relative, resolve } from "node:path"
import { $ } from "bun"
import { productIds, productName } from "../../src/lib/products.ts"

/** The docs of one repository at one ref. */
export type Source = {
  name: string
  label: string
  github: string
  /** The release tag, or the commit of a local check. */
  ref: string
}

/** A full release with its page and files. */
export type Release = { tag: string; page: string; files: { name: string; url: string }[] }

/** A product repository at its latest full release. */
export type Latest = { repo: Source; release: Release }

export type Snapshot = {
  repo: Source
  /** Holds `docs/` and `README.md` of the repository at `ref`. */
  dir: string
  /** Every file path in the repository at `ref`. */
  files: Set<string>
}

export const root = resolve(import.meta.dirname, "../..")

/** The fields of a GitHub release the site reads. */
type ReleaseReply = {
  tag_name: string
  draft: boolean
  prerelease: boolean
  html_url: string
  assets: { name: string; browser_download_url: string }[]
}

/** The highest full release: no draft, no pre-release, a tag like v0.2.0. */
export function latestRelease<T extends Pick<ReleaseReply, "tag_name" | "draft" | "prerelease">>(
  releases: T[],
): T | undefined {
  return releases
    .filter((r) => !r.draft && !r.prerelease && /^v\d+\.\d+\.\d+$/.test(r.tag_name))
    .sort((a, b) => Bun.semver.order(b.tag_name, a.tag_name))[0]
}

async function github(path: string) {
  const headers: Record<string, string> = { accept: "application/vnd.github+json" }
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  const url = `https://api.github.com/repos/${path}`
  const response = await fetch(url, { headers })
  if (!response.ok) throw new Error(`${url}: ${response.status}`)
  return response
}

/** Each product repository's latest full release, from GitHub's API. */
export function latest(): Promise<Latest[]> {
  return Promise.all(
    productIds.map(async (id) => {
      const repo = `zeabur-oss/${id}`
      const releases: ReleaseReply[] = await (await github(`${repo}/releases?per_page=100`)).json()
      const release = latestRelease(releases)
      if (!release) throw new Error(`${repo} has no full release`)
      return {
        repo: { name: id, label: productName[id], github: repo, ref: release.tag_name },
        release: {
          tag: release.tag_name,
          page: release.html_url,
          files: release.assets.map((a) => ({ name: a.name, url: a.browser_download_url })),
        },
      }
    }),
  )
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
