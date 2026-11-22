// Reads the built site (bun run build first) against the catalog release that docs.lock.json pins.
import { expect, test } from "bun:test"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { readLock, root } from "./lib/repos.ts"

const dist = join(root, "dist")
const catalog = readLock().find((r) => r.name === "catalog")
if (!catalog) throw new Error("docs.lock.json has no catalog")
const api = join(root, ".cache/assets", `catalog-${catalog.ref}-api-v1.tar.gz`, "v1")
const source = join(root, ".cache/repos", `catalog-${catalog.ref}`)

type Entry = { id: string; sourceDigest: string }
type Run = { result: string; sourceDigest: string }
const index: { components: Entry[]; templates: Entry[] } = JSON.parse(
  readFileSync(join(api, "catalog.json"), "utf8"),
)
const json = (path: string) => JSON.parse(readFileSync(path, "utf8"))

/** Runs of an entry: the API has those of components, the repository those of templates. */
const runs = {
  components: (id: string): Run[] => json(join(api, "components", `${id}.json`)).measurements,
  templates: (id: string): Run[] => {
    const path = join(source, "measurements/templates", `${id}.json`)
    return existsSync(path) ? json(path).environments : []
  },
}

const page = (path: string) => readFileSync(join(dist, path, "index.html"), "utf8")

test("the browse page lists every component and template of the release", () => {
  expect(existsSync(dist), "run `bun run build` first").toBe(true)
  const browse = page("catalog/browse")
  const missing = (["components", "templates"] as const).flatMap((kind) =>
    index[kind]
      .map((e) => `/catalog/${kind}/${e.id}`)
      .filter((url) => !browse.includes(`"${url}"`)),
  )
  expect(missing).toEqual([])
})

test("every entry with a passing run of its released files shows a test date", () => {
  const undated = (["components", "templates"] as const).flatMap((kind) =>
    index[kind]
      .filter((e) =>
        runs[kind](e.id).some((r) => r.result === "passed" && r.sourceDigest === e.sourceDigest),
      )
      .map((e) => `catalog/${kind}/${e.id}`)
      .filter((path) => !/<time datetime="\d{4}-\d{2}-\d{2}">/.test(page(path))),
  )
  expect(undated).toEqual([])
})
