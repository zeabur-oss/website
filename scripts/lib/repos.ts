import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { join, relative, resolve } from "node:path"
import { $ } from "bun"

export type LockRepo = {
  name: string
  label: string
  github: string
  ref: string
  /** A sibling checkout to read `ref` from instead of GitHub. */
  local?: string
  /** A release tag whose `docs-shots-<tag>.tar` asset holds the screenshots. */
  shots?: string
}

export type Snapshot = {
  repo: LockRepo
  /** Holds `docs/` and `README.md` of the repository at `ref`. */
  dir: string
  /** Every file path in the repository at `ref`. */
  files: Set<string>
}

export const root = resolve(import.meta.dirname, "../..")

export function readLock(path = join(root, "docs.lock.json")): LockRepo[] {
  return JSON.parse(readFileSync(path, "utf8")).repos
}

/**
 * Gets `docs/` and `README.md` of a repository at its locked ref. A local checkout is used when
 * the lock names one and DOCS_SOURCE is not "github"; otherwise GitHub's tarball of the ref.
 */
export async function snapshot(repo: LockRepo): Promise<Snapshot> {
  const dir = join(root, ".cache/repos", `${repo.name}-${repo.ref}`)
  const listing = join(dir, ".files.json")
  if (existsSync(listing)) {
    return { repo, dir, files: new Set(JSON.parse(readFileSync(listing, "utf8"))) }
  }
  rmSync(dir, { recursive: true, force: true })
  mkdirSync(dir, { recursive: true })
  const local =
    repo.local && process.env.DOCS_SOURCE !== "github" ? resolve(root, repo.local) : null
  let files: string[]
  if (local) {
    await $`git -C ${local} cat-file -e ${repo.ref + "^{commit}"}`.quiet()
    files = (await $`git -C ${local} ls-tree -r --name-only ${repo.ref}`.text()).split("\n")
    files = files.filter(Boolean)
    const wanted = ["docs", "README.md"].filter((p) =>
      files.some((f) => f === p || f.startsWith(p + "/")),
    )
    const tar = join(dir, ".archive.tar")
    await $`git -C ${local} archive --format=tar -o ${tar} ${repo.ref} ${wanted}`.quiet()
    await $`tar -xf ${tar} -C ${dir}`.quiet()
    rmSync(tar)
  } else {
    const url = `https://codeload.github.com/${repo.github}/tar.gz/${repo.ref}`
    const headers: Record<string, string> = {}
    if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`
    const response = await fetch(url, { headers })
    if (!response.ok) throw new Error(`${url}: ${response.status}`)
    const tgz = join(dir, ".archive.tgz")
    writeFileSync(tgz, new Uint8Array(await response.arrayBuffer()))
    await $`tar -xzf ${tgz} -C ${dir} --strip-components=1`.quiet()
    rmSync(tgz)
    files = walk(dir).map((p) => relative(dir, p))
  }
  writeFileSync(listing, JSON.stringify(files))
  return { repo, dir, files: new Set(files) }
}

export function walk(dir: string): string[] {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && !entry.name.startsWith(".files"))
    .map((entry) => join(entry.parentPath, entry.name))
}

/** A working tree as a snapshot, for checking a repository in its own CI. */
export async function fromDirectory(dir: string, name: string): Promise<Snapshot> {
  const tracked = await $`git -C ${dir} ls-files --cached --others --exclude-standard`
    .nothrow()
    .text()
  const files = tracked
    ? tracked.split("\n").filter(Boolean)
    : walk(dir).map((p) => relative(dir, p))
  const repo = { name, label: name, github: `zeabur-oss/${name}`, ref: "HEAD" }
  return { repo, dir, files: new Set(files) }
}
