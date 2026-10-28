// Checks a repository's docs/ (nav.yaml, links, redirects, frontmatter, MDX components)
// and lists stale translations. Exits 1 on errors only.
//   bun scripts/docs-check.ts                            every repository in docs.lock.json
//   bun scripts/docs-check.ts <dir> [--base <rev>]       a working tree, as each repository's CI does
import { basename, resolve } from "node:path"
import { parseArgs } from "node:util"
import { checkRepo } from "./lib/check.ts"
import type { Finding } from "./lib/findings.ts"
import { fromDirectory, fromRevision, readLock, snapshot, type Snapshot } from "./lib/repos.ts"

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { base: { type: "string" }, name: { type: "string" } },
})

const targets: { snap: Snapshot; base?: Snapshot }[] = []
if (positionals.length) {
  const dir = resolve(positionals[0]!)
  const name = values.name ?? basename(dir)
  const snap = await fromDirectory(dir, name)
  const base = values.base ? await fromRevision(dir, values.base, name) : undefined
  targets.push({ snap, base })
} else {
  for (const repo of readLock()) targets.push({ snap: await snapshot(repo) })
}

const order: Finding["level"][] = ["error", "stale", "warning"]
let errors = 0
for (const { snap, base } of targets) {
  const findings = checkRepo(snap, { base }).sort(
    (a, b) => order.indexOf(a.level) - order.indexOf(b.level) || a.file.localeCompare(b.file),
  )
  const count = (level: Finding["level"]) => findings.filter((f) => f.level === level).length
  errors += count("error")
  console.log(
    `${snap.repo.name}@${snap.repo.ref.slice(0, 8)}: ${count("error")} errors, ` +
      `${count("stale")} stale translations, ${count("warning")} warnings`,
  )
  for (const f of findings) {
    const line = f.line === undefined ? "" : `line ${f.line}: `
    console.log(`  ${f.level.padEnd(7)} ${f.file}: ${line}${f.message}`)
  }
}
process.exit(errors ? 1 : 0)
