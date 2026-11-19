// Reads the components (components/<id>.yaml) and application templates
// (templates/<id>/template.yaml) of a catalog snapshot, with the CI runs that tested them
// (measurements/). The formats are in zeabur-oss/catalog: docs/reference/component-format.mdx,
// docs/reference/template-format.mdx and docs/reference/releases.mdx.
import { createHash } from "node:crypto"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { parse as parseYaml } from "yaml"
import { z } from "zod"
import { siteLocales, type Locale } from "./docs.ts"
import type { Snapshot } from "./repos.ts"

const localized = <T extends z.ZodRawShape>(shape: T) =>
  z.object({
    ...shape,
    locales: z.record(z.string(), z.object(shape).partial()).optional(),
  })

const metadata = localized({ summary: z.string() }).extend({
  name: z.string(),
  license: z.string(),
  homepage: z.string().url(),
})

const requirement = z.union([
  z.object({ component: z.string() }),
  z.object({ capability: z.string() }),
])

const templateFile = z.object({
  metadata: metadata.extend({ version: z.string() }),
  requires: z.array(z.object({ component: z.string() })).default([]),
  services: z.array(z.object({ name: z.string() })),
  security: localized({ summary: z.string() }).extend({
    risks: z.array(localized({ risk: z.string(), mitigation: z.string() })).default([]),
  }),
})

const defaultState = z.enum(["recommended", "optional"])

const componentFile = z.object({
  metadata,
  provides: z.object({ capability: z.string() }),
  defaults: z.object({ "single-node": defaultState, "multi-node": defaultState }),
  requires: z.array(requirement).default([]),
  distributions: z.array(z.string()),
  releases: z.array(z.object({ name: z.string(), version: z.string().optional() })),
  security: z.object({ summary: z.string() }),
})

const measurementFile = z.object({
  environments: z.array(
    z.object({
      distribution: z.string(),
      platform: z.object({ os: z.string(), architecture: z.string() }),
      kubernetesVersion: z.string(),
      result: z.enum(["passed", "failed"]),
      pods: z.array(z.object({ memory: z.string() })),
      sourceDigest: z.string(),
      measuredAt: z.string(),
    }),
  ),
})

/** A text in each site locale; a locale the catalog does not translate gets the English text. */
export type Localized = Record<Locale, string>

/** The newest CI run on one distribution and platform that installed these very files and passed. */
export type TestRun = {
  distribution: string
  /** `linux/amd64`. */
  platform: string
  kubernetesVersion: string
  /** `YYYY-MM-DD`. */
  date: string
  /** Idle memory of all its pods together, in MiB. */
  memoryMiB: number
}

type Entry = {
  id: string
  name: string
  summary: Localized
  /** An SPDX expression. */
  license: string
  homepage: string
  /** The file in the repository. */
  source: string
  /** Empty when no passing run tested the files of this release. */
  tests: TestRun[]
}

export type CatalogTemplate = Entry & {
  version: string
  /** Component IDs the cluster needs first. */
  requires: string[]
  services: string[]
  security: { summary: Localized; risks: { risk: Localized; mitigation: Localized }[] }
}

export type CatalogComponent = Entry & {
  capability: string
  defaults: { singleNode: z.infer<typeof defaultState>; multiNode: z.infer<typeof defaultState> }
  requires: ({ component: string } | { capability: string })[]
  distributions: string[]
  releases: { name: string; version?: string }[]
  /** English only in the catalog. */
  security: string
}

function pick<K extends string>(
  value: Record<K, string> & { locales?: Record<string, Partial<Record<K, string>>> },
  key: K,
): Localized {
  const out = {} as Localized
  for (const locale of siteLocales) out[locale] = value.locales?.[locale]?.[key] ?? value[key]
  return out
}

function parse<T extends z.ZodType>(schema: T, snap: Snapshot, path: string): z.infer<T> {
  const parsed = schema.safeParse(parseYaml(readFileSync(join(snap.dir, path), "utf8")))
  if (!parsed.success) throw new Error(`${path}: ${z.prettifyError(parsed.error)}`)
  return parsed.data
}

/** Go's dirhash.Hash1 over `name → repository path`: the `sourceDigest` measurements name. */
function digest(snap: Snapshot, files: [name: string, path: string][]) {
  const lines = files
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([name, path]) => {
      const sum = createHash("sha256")
        .update(readFileSync(join(snap.dir, path)))
        .digest("hex")
      return `${sum}  ${name}\n`
    })
  return `h1:${createHash("sha256").update(lines.join("")).digest("base64")}`
}

const mebibytes = (quantity: string) => {
  const [, value, unit = ""] = /^(\d+(?:\.\d+)?)([KMG]i)?$/.exec(quantity) ?? []
  if (value === undefined) throw new Error(`unknown memory quantity "${quantity}"`)
  return Number(value) * { "": 1 / 2 ** 20, Ki: 1 / 1024, Mi: 1, Gi: 1024 }[unit]!
}

/**
 * As `testedOn` in the catalog's docs/reference/installers.mdx: on each distribution and
 * platform, the newest passing run of these files counts when no failed run of them is newer; a
 * pass on the same day wins.
 */
function testsOf(snap: Snapshot, measurement: string, sourceDigest: string): TestRun[] {
  const path = join(snap.dir, measurement)
  if (!existsSync(path)) return []
  const runs = measurementFile
    .parse(JSON.parse(readFileSync(path, "utf8")))
    .environments.filter((run) => run.sourceDigest === sourceDigest)
    .sort((a, b) => b.measuredAt.localeCompare(a.measuredAt))
  const tests: TestRun[] = []
  const seen = new Set<string>()
  for (const run of runs) {
    const platform = `${run.platform.os}/${run.platform.architecture}`
    const key = `${run.distribution} ${platform}`
    if (seen.has(key)) continue
    const failedLater = runs.some(
      (r) =>
        r.result === "failed" &&
        `${r.distribution} ${r.platform.os}/${r.platform.architecture}` === key &&
        r.measuredAt > run.measuredAt,
    )
    if (run.result !== "passed" || failedLater) continue
    seen.add(key)
    tests.push({
      distribution: run.distribution,
      platform,
      kubernetesVersion: run.kubernetesVersion,
      date: run.measuredAt,
      memoryMiB: Math.round(run.pods.reduce((sum, pod) => sum + mebibytes(pod.memory), 0)),
    })
  }
  return tests
}

export function readTemplates(snap: Snapshot): CatalogTemplate[] {
  const sources = [...snap.files].filter((f) => /^templates\/[^/]+\/template\.yaml$/.test(f)).sort()
  return sources.map((source) => {
    const id = source.split("/")[1]!
    const { metadata, requires, services, security } = parse(templateFile, snap, source)
    const dir = `templates/${id}/`
    const files = [...snap.files]
      .filter((f) => f.startsWith(dir))
      .map((f): [string, string] => [f.slice(dir.length), f])
    return {
      id,
      name: metadata.name,
      summary: pick(metadata, "summary"),
      license: metadata.license,
      homepage: metadata.homepage,
      source,
      tests: testsOf(snap, `measurements/templates/${id}.json`, digest(snap, files)),
      version: metadata.version,
      requires: requires.map((r) => r.component),
      services: services.map((s) => s.name),
      security: {
        summary: pick(security, "summary"),
        risks: security.risks.map((r) => ({
          risk: pick(r, "risk"),
          mitigation: pick(r, "mitigation"),
        })),
      },
    }
  })
}

export function readComponents(snap: Snapshot): CatalogComponent[] {
  const sources = [...snap.files].filter((f) => /^components\/[^/]+\.yaml$/.test(f)).sort()
  return sources.map((source) => {
    const id = source.slice("components/".length, -".yaml".length)
    const c = parse(componentFile, snap, source)
    return {
      id,
      name: c.metadata.name,
      summary: pick(c.metadata, "summary"),
      license: c.metadata.license,
      homepage: c.metadata.homepage,
      source,
      tests: testsOf(
        snap,
        `measurements/components/${id}.json`,
        digest(snap, [[`${id}.yaml`, source]]),
      ),
      capability: c.provides.capability,
      defaults: { singleNode: c.defaults["single-node"], multiNode: c.defaults["multi-node"] },
      requires: c.requires,
      distributions: c.distributions,
      releases: c.releases,
      security: c.security.summary,
    }
  })
}
