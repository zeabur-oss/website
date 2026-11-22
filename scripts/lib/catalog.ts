// Reads the catalog from the API of the release that docs.lock.json pins (`api-v1.tar.gz`), as
// the catalog's docs/reference/releases.mdx describes it. API v1 has no READMEs and no template
// measurements (zeabur-oss/catalog#458), so these two come from the repository at the same tag.
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { z } from "zod"
import { locales, type SiteLocale } from "../../src/lib/urls.ts"
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

const quantities = z.object({ cpu: z.string(), memory: z.string() })

const input = z.union([
  z.object({ generate: z.object({}), secret: z.object({ name: z.string(), key: z.string() }) }),
  localized({ label: z.string(), description: z.string() }).extend({
    required: z.boolean(),
    default: z.string().optional(),
  }),
])

const measurement = z.object({
  distribution: z.string(),
  profile: z.string(),
  platform: z.object({ os: z.string(), architecture: z.string() }),
  kubernetesVersion: z.string(),
  result: z.string(),
  pods: z
    .array(z.object({ workload: z.string(), memory: z.string(), cpu: z.string() }))
    .default([]),
  sourceDigest: z.string(),
  measuredAt: z.string(),
})

const entry = z.object({ id: z.string(), sourceDigest: z.string() })

const catalogFile = z.object({ components: z.array(entry), templates: z.array(entry) })

const defaultState = z.enum(["recommended", "optional"])

const componentFile = entry.extend({
  declaration: z.object({
    metadata,
    provides: z.object({ capability: z.string() }),
    defaults: z.object({ "single-node": defaultState, "multi-node": defaultState }),
    requires: z.array(requirement).default([]),
    distributions: z.array(z.string()),
    releases: z.array(z.object({ name: z.string(), version: z.string().optional() })),
    security: z.object({ summary: z.string() }),
  }),
  measurements: z.array(measurement),
})

const templateFile = entry.extend({
  template: z.object({
    metadata: localized({ summary: z.string() }).extend({
      name: z.string(),
      license: z.string(),
      homepage: z.string().url(),
      docs: z.string().url(),
      version: z.string(),
    }),
    requires: z.array(z.object({ component: z.string() })).default([]),
    services: z.array(
      z.object({
        name: z.string(),
        ports: z.array(z.object({ name: z.string(), port: z.number() })).default([]),
        resources: z.object({ requests: quantities, limits: quantities }),
      }),
    ),
    inputs: z.array(input).default([]),
    security: localized({ summary: z.string() }).extend({
      risks: z.array(localized({ risk: z.string(), mitigation: z.string() })).default([]),
    }),
  }),
})

/** `measurements/templates/<id>.json` in the repository. */
const templateMeasurements = z.object({ environments: z.array(measurement) })

/** A text in each site locale; a locale the catalog does not translate gets the English text. */
export type Localized = Record<SiteLocale, string>

/**
 * The level-2 sections of a template README (`templates/<id>/README.md`, `README.<locale>.md`)
 * in their order, with their heading in each locale, as `readmeSections` in the catalog's
 * tools/internal/templates/readme.go.
 */
const templateReadme = {
  introduction: { en: "Introduction", "zh-TW": "簡介", "zh-CN": "简介" },
  "getting-started": { en: "Getting started", "zh-TW": "開始使用", "zh-CN": "开始使用" },
  configuration: { en: "Configuration", "zh-TW": "設定", "zh-CN": "配置" },
  troubleshooting: { en: "Troubleshooting", "zh-TW": "疑難排解", "zh-CN": "故障排除" },
} as const satisfies Record<string, Localized>

/**
 * The level-2 sections of a component README (`components/<id>/README.md`,
 * `README.<locale>.md`), as `componentSections` in the catalog's tools/internal/catalog/readme.go.
 */
const componentReadme = {
  introduction: { en: "Introduction", "zh-TW": "簡介", "zh-CN": "简介" },
  "before-you-install": { en: "Before you install", "zh-TW": "安裝前準備", "zh-CN": "安装前准备" },
  "use-it": { en: "Use it", "zh-TW": "使用方式", "zh-CN": "使用方法" },
  "remove-it": { en: "Remove it", "zh-TW": "移除", "zh-CN": "移除" },
  troubleshooting: { en: "Troubleshooting", "zh-TW": "疑難排解", "zh-CN": "故障排除" },
} as const satisfies Record<string, Localized>

/** A level-2 section of a README: its Markdown without the heading. */
export type ReadmeSection<Id extends string = string> = { id: Id; title: string; markdown: string }

/** The newest CI run on one distribution and platform that installed these very files and passed. */
export type TestRun = {
  distribution: string
  profile: string
  /** `linux/amd64`. */
  platform: string
  kubernetesVersion: string
  /** `YYYY-MM-DD`. */
  date: string
  /** Idle memory of all its pods together, in MiB. */
  memoryMiB: number
  /** Idle memory and CPU of one pod of each workload, as Kubernetes quantities. */
  pods: { workload: string; memory: string; cpu: string }[]
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

/** A value the person deploying gives. */
export type ProvidedInput = {
  label: Localized
  description: Localized
  required: boolean
  default?: string
}

/** A Kubernetes quantity, such as `250m` CPU or `512Mi` memory. */
type Quantities = { cpu: string; memory: string }

export type TemplateService = {
  name: string
  ports: { name: string; port: number }[]
  requests: Quantities
  limits: Quantities
}

export type CatalogTemplate = Entry & {
  version: string
  /** The upstream usage docs. */
  docs: string
  /** The README of each locale, by section. */
  readme: Record<SiteLocale, ReadmeSection<keyof typeof templateReadme>[]>
  /** Component IDs the cluster needs first. */
  requires: string[]
  services: TemplateService[]
  provided: ProvidedInput[]
  /** Values generated at deploy, as `<Secret>/<key>`. */
  generated: string[]
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
  /** The README of each locale, by section. */
  readme: Record<SiteLocale, ReadmeSection<keyof typeof componentReadme>[]>
}

function pick<K extends string>(
  value: Record<K, string> & { locales?: Record<string, Partial<Record<K, string>>> },
  key: K,
): Localized {
  const out = {} as Localized
  for (const locale of locales) out[locale] = value.locales?.[locale]?.[key] ?? value[key]
  return out
}

function readJson<T extends z.ZodType>(schema: T, dir: string, path: string): z.infer<T> {
  const parsed = schema.safeParse(JSON.parse(readFileSync(join(dir, path), "utf8")))
  if (!parsed.success) throw new Error(`${path}: ${z.prettifyError(parsed.error)}`)
  return parsed.data
}

/** The README at `<dir>/README[.<locale>].md` in each locale, split at its level-2 headings. */
function readmes<Id extends string>(
  snap: Snapshot,
  dir: string,
  headings: Record<Id, Localized>,
): Record<SiteLocale, ReadmeSection<Id>[]> {
  const ids = Object.keys(headings) as Id[]
  const one = (locale: SiteLocale) => {
    const path = `${dir}/README${locale === "en" ? "" : `.${locale}`}.md`
    const sections: ReadmeSection<Id>[] = []
    let fenced = false
    for (const line of readFileSync(join(snap.dir, path), "utf8").split("\n")) {
      if (line.startsWith("```")) fenced = !fenced
      const title = !fenced && line.startsWith("## ") ? line.slice(3).trim() : undefined
      if (title !== undefined) {
        const id = ids.find((k) => headings[k][locale] === title)
        if (!id) throw new Error(`${path}: unknown heading "${line}"`)
        sections.push({ id, title, markdown: "" })
      } else {
        const last = sections.at(-1)
        if (last) last.markdown += `${line}\n`
      }
    }
    return sections
  }
  return Object.fromEntries(locales.map((l) => [l, one(l)])) as Record<
    SiteLocale,
    ReadmeSection<Id>[]
  >
}

const mebibytes = (quantity: string) => {
  const [, value, unit = ""] = /^(\d+(?:\.\d+)?)([KMG]i)?$/.exec(quantity) ?? []
  if (value === undefined) throw new Error(`unknown memory quantity "${quantity}"`)
  return Number(value) * mebibytesPer(unit)
}

function mebibytesPer(unit: string): number {
  switch (unit) {
    case "":
      return 1 / 2 ** 20
    case "Ki":
      return 1 / 1024
    case "Mi":
      return 1
    case "Gi":
      return 1024
    default:
      throw new Error(`unknown memory unit "${unit}"`)
  }
}

/**
 * On each distribution and platform, the newest passing run of the released files when no run of
 * them that did not pass is newer; a pass on the same day wins. This is `testedOn` in the
 * catalog's docs/reference/installers.mdx without its filter on the pinned distribution versions,
 * so that runs on kind count: templates run only there.
 */
function testsOf(measurements: z.infer<typeof measurement>[], sourceDigest: string): TestRun[] {
  const runs = measurements
    .filter((run) => run.sourceDigest === sourceDigest)
    .sort((a, b) => b.measuredAt.localeCompare(a.measuredAt))
  const tests: TestRun[] = []
  const seen = new Set<string>()
  for (const run of runs) {
    const platform = `${run.platform.os}/${run.platform.architecture}`
    const key = `${run.distribution} ${platform}`
    if (seen.has(key)) continue
    const failedLater = runs.some(
      (r) =>
        r.result !== "passed" &&
        `${r.distribution} ${r.platform.os}/${r.platform.architecture}` === key &&
        r.measuredAt > run.measuredAt,
    )
    if (run.result !== "passed" || failedLater) continue
    seen.add(key)
    tests.push({
      distribution: run.distribution,
      profile: run.profile,
      platform,
      kubernetesVersion: run.kubernetesVersion,
      date: run.measuredAt,
      memoryMiB: Math.round(run.pods.reduce((sum, pod) => sum + mebibytes(pod.memory), 0)),
      pods: run.pods,
    })
  }
  return tests
}

/** The catalog: `api` is the unpacked `api-v1.tar.gz`, `snap` the repository at the same tag. */
export function readCatalog(api: string, snap: Snapshot) {
  const index = readJson(catalogFile, api, "v1/catalog.json")
  const components = index.components.map(({ id }): CatalogComponent => {
    const {
      sourceDigest,
      declaration: c,
      measurements,
    } = readJson(componentFile, api, `v1/components/${id}.json`)
    return {
      id,
      name: c.metadata.name,
      summary: pick(c.metadata, "summary"),
      license: c.metadata.license,
      homepage: c.metadata.homepage,
      source: `components/${id}/component.yaml`,
      tests: testsOf(measurements, sourceDigest),
      capability: c.provides.capability,
      defaults: { singleNode: c.defaults["single-node"], multiNode: c.defaults["multi-node"] },
      requires: c.requires,
      distributions: c.distributions,
      releases: c.releases,
      security: c.security.summary,
      readme: readmes(snap, `components/${id}`, componentReadme),
    }
  })
  const templates = index.templates.map(({ id }): CatalogTemplate => {
    const { sourceDigest, template: t } = readJson(templateFile, api, `v1/templates/${id}.json`)
    const measured = `measurements/templates/${id}.json`
    const runs = existsSync(join(snap.dir, measured))
      ? readJson(templateMeasurements, snap.dir, measured).environments
      : []
    return {
      id,
      name: t.metadata.name,
      summary: pick(t.metadata, "summary"),
      license: t.metadata.license,
      homepage: t.metadata.homepage,
      source: `templates/${id}/template.yaml`,
      tests: testsOf(runs, sourceDigest),
      version: t.metadata.version,
      docs: t.metadata.docs,
      readme: readmes(snap, `templates/${id}`, templateReadme),
      requires: t.requires.map((r) => r.component),
      services: t.services.map((s) => ({
        name: s.name,
        ports: s.ports,
        requests: s.resources.requests,
        limits: s.resources.limits,
      })),
      provided: t.inputs.flatMap((i) =>
        "secret" in i
          ? []
          : [
              {
                label: pick(i, "label"),
                description: pick(i, "description"),
                required: i.required,
                ...(i.default !== undefined && { default: i.default }),
              },
            ],
      ),
      generated: t.inputs.flatMap((i) =>
        "secret" in i ? [`${i.secret.name}/${i.secret.key}`] : [],
      ),
      security: {
        summary: pick(t.security, "summary"),
        risks: t.security.risks.map((r) => ({
          risk: pick(r, "risk"),
          mitigation: pick(r, "mitigation"),
        })),
      },
    }
  })
  return { components, templates }
}
