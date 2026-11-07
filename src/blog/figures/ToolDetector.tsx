import { useId, useState } from "react"
import { Input } from "@zeabur/design-system/components/input"
import { Switch } from "@zeabur/design-system/components/switch"
import { ToggleGroup, ToggleGroupItem } from "@zeabur/design-system/components/toggle-group"
import type { SiteLocale } from "../../lib/urls.ts"
import { MARKS, detectTool, resolveGroup, type Labels, type Tool } from "./rules.ts"
import { figureCopy } from "./text.ts"

type Where = "label" | "annotation"
const ROWS: { key: string; where: Where; sample: string }[] = [
  { key: MARKS.argoTrackingId, where: "annotation", sample: "shop:apps/Deployment:shop/web" },
  { key: MARKS.argoInstance, where: "label", sample: "shop" },
  { key: MARKS.fluxKustomization, where: "label", sample: "apps" },
  { key: MARKS.fluxHelmRelease, where: "label", sample: "web" },
  { key: MARKS.helmReleaseName, where: "annotation", sample: "web" },
  { key: MARKS.managedBy, where: "label", sample: "Helm" },
  { key: MARKS.component, where: "label", sample: "frontend" },
  { key: MARKS.group, where: "label", sample: "storefront" },
]

type Preset = "helm" | "flux" | "argo" | "plain" | "other" | "empty"
const PRESETS: Record<Preset, Record<string, string>> = {
  helm: {
    [MARKS.helmReleaseName]: "web",
    [MARKS.managedBy]: "Helm",
    [MARKS.component]: "frontend",
  },
  flux: {
    [MARKS.fluxHelmRelease]: "web",
    [MARKS.helmReleaseName]: "web",
    [MARKS.managedBy]: "Helm",
    [MARKS.component]: "frontend",
  },
  argo: {
    [MARKS.argoTrackingId]: "shop:apps/Deployment:shop/web",
    [MARKS.managedBy]: "Helm",
    [MARKS.component]: "frontend",
  },
  plain: {},
  other: { [MARKS.managedBy]: "kustomize" },
  empty: { [MARKS.managedBy]: "" },
}

type Marks = Record<string, { on: boolean; value: string }>
const fromPreset = (preset: Preset): Marks =>
  Object.fromEntries(
    ROWS.map((row) => {
      const value = PRESETS[preset][row.key]
      return [row.key, { on: value !== undefined, value: value ?? row.sample }]
    }),
  )

const STEPS: { tool: Tool; keys: string[] }[] = [
  { tool: "argocd", keys: [MARKS.argoTrackingId, MARKS.argoInstance] },
  { tool: "flux", keys: [MARKS.fluxKustomization, MARKS.fluxHelmRelease] },
  { tool: "helm", keys: [MARKS.helmReleaseName, MARKS.managedBy] },
]

const copy = {
  "zh-TW": {
    presets: "選一組標記",
    preset: {
      helm: "只有 Helm 的標記",
      flux: "Flux 加 Helm 的標記",
      argo: "Argo CD 加 Helm 的標記",
      plain: "沒有標記",
      other: "managed-by 是其他值",
      empty: "managed-by 是空字串",
    } satisfies Record<Preset, string>,
    marks: "Deployment web 的 metadata",
    where: { label: "label", annotation: "annotation" } satisfies Record<Where, string>,
    valueOf: (key: string) => `${key} 的值`,
    emptyValue: "空字串視為沒有設定",
    steps: "依序檢查",
    tools: { argocd: "Argo CD", flux: "Flux", helm: "Helm" } satisfies Record<Tool, string>,
    hit: "辨識到",
    miss: "沒有標記",
    skipped: "前面已辨識，略過",
    result: "結果",
    managedBy: (tool: string) => `由 ${tool} 管理`,
    unknown: "沒有辨識到管理工具",
    warn: "修改前會提醒：下次同步或升級可能蓋掉這次修改。",
    noWarn: "修改前不會提醒。",
    raw: "managed-by 原文",
    none: "沒有",
    group: "分組",
    groupFrom: (key: string) => `（來自 ${key}）`,
    groupDefault: "（兩個分組 label 都沒有）",
  },
}

export default function ToolDetector({ label, locale }: { label: string; locale: SiteLocale }) {
  const t = figureCopy(copy, locale)
  const uid = useId()
  const [preset, setPreset] = useState<Preset | null>("flux")
  const [marks, setMarks] = useState<Marks>(() => fromPreset("flux"))

  const labels: Labels = {}
  const annotations: Labels = {}
  for (const row of ROWS) {
    const m = marks[row.key]
    if (m?.on) (row.where === "label" ? labels : annotations)[row.key] = m.value
  }
  const detection = detectTool(labels, annotations)
  const group = resolveGroup(labels)
  const decidedAt = STEPS.findIndex((step) => step.tool === detection.tool)

  const update = (key: string, change: Partial<{ on: boolean; value: string }>) => {
    setPreset(null)
    setMarks((current) => ({
      ...current,
      [key]: { on: false, value: "", ...current[key], ...change },
    }))
  }

  return (
    <div className="fig fig-tool" role="group" aria-label={label}>
      <div className="fig-tool-presets">
        <span className="fig-note">{t.presets}</span>
        <ToggleGroup
          variant="outline"
          size="sm"
          className="flex-wrap"
          aria-label={t.presets}
          value={preset ? [preset] : []}
          onValueChange={(value) => {
            const next = value[0] as Preset | undefined
            if (!next) return
            setPreset(next)
            setMarks(fromPreset(next))
          }}
        >
          {(Object.keys(PRESETS) as Preset[]).map((id) => (
            <ToggleGroupItem key={id} value={id}>
              {t.preset[id]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <fieldset className="fig-tool-marks">
        <legend className="fig-note">{t.marks}</legend>
        {ROWS.map((row, i) => {
          const m = marks[row.key] ?? { on: false, value: "" }
          const keyId = `${uid}-key-${i}`
          return (
            <div className="fig-tool-row" key={row.key}>
              <Switch
                size="sm"
                checked={m.on}
                aria-labelledby={keyId}
                onCheckedChange={(on) => update(row.key, { on })}
              />
              <span id={keyId} className="fig-tool-key">
                <span className="fig-tag">{t.where[row.where]}</span>{" "}
                <span className="fig-mono">{row.key}</span>
              </span>
              <Input
                size="sm"
                mono
                className="fig-tool-value"
                value={m.value}
                disabled={!m.on}
                aria-label={t.valueOf(row.key)}
                onChange={(event) => update(row.key, { value: event.target.value })}
              />
              {m.on && m.value === "" && (
                <span className="fig-note fig-tool-empty">{t.emptyValue}</span>
              )}
            </div>
          )
        })}
      </fieldset>

      <div className="fig-tool-out" aria-live="polite">
        <span className="fig-note">{t.steps}</span>
        <ol className="fig-tool-steps">
          {STEPS.map((step, i) => {
            const hit = i === decidedAt
            const skipped = decidedAt !== -1 && i > decidedAt
            return (
              <li
                key={step.tool}
                className={
                  hit ? "fig-card fig-accent" : skipped ? "fig-card fig-tool-skip" : "fig-card"
                }
              >
                <span className="fig-kind">
                  {i + 1}. {t.tools[step.tool]}
                </span>
                <span className={hit ? "fig-name" : "fig-note"}>
                  {hit ? t.hit : skipped ? t.skipped : t.miss}
                </span>
                {hit && detection.by && <span className="fig-path">{detection.by}</span>}
              </li>
            )
          })}
        </ol>
        <div className="fig-tool-result">
          <span className="fig-note">{t.result}</span>
          <strong className="fig-name">
            {detection.tool ? t.managedBy(t.tools[detection.tool]) : t.unknown}
          </strong>
          <span className={detection.warnBeforeEdit ? "fig-tool-warn" : "fig-note"}>
            {detection.warnBeforeEdit ? t.warn : t.noWarn}
          </span>
          <dl className="fig-tool-meta">
            <dt className="fig-note">{t.raw}</dt>
            <dd>
              {detection.managedBy === null ? (
                <span className="fig-faint">{t.none}</span>
              ) : (
                <span className="fig-mono">{detection.managedBy}</span>
              )}
            </dd>
            <dt className="fig-note">{t.group}</dt>
            <dd>
              <span className="fig-mono">{group.group}</span>{" "}
              <span className="fig-note">{group.by ? t.groupFrom(group.by) : t.groupDefault}</span>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  )
}
