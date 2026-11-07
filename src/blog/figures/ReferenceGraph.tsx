import { useId, useState, type KeyboardEvent } from "react"
import cube from "@phosphor-icons/core/assets/regular/cube.svg?raw"
import globe from "@phosphor-icons/core/assets/regular/globe.svg?raw"
import hardDrives from "@phosphor-icons/core/assets/regular/hard-drives.svg?raw"
import key from "@phosphor-icons/core/assets/regular/key.svg?raw"
import plugs from "@phosphor-icons/core/assets/regular/plugs.svg?raw"
import sliders from "@phosphor-icons/core/assets/regular/sliders-horizontal.svg?raw"
import { Button } from "@zeabur/design-system/components/button"
import { Label } from "@zeabur/design-system/components/label"
import { Switch } from "@zeabur/design-system/components/switch"
import { ToggleGroup, ToggleGroupItem } from "@zeabur/design-system/components/toggle-group"
import type { SiteLocale } from "../../lib/urls.ts"
import { detectTool, ownership, selects, type Labels, type Ownership } from "./rules.ts"
import { figureCopy } from "./text.ts"

type SelectorMode = "app" | "appTier" | "none"
type State = { workerImports: boolean; selector: SelectorMode; helm: boolean }
const DEFAULT: State = { workerImports: true, selector: "app", helm: false }
const SELECTORS: Record<SelectorMode, Labels | undefined> = {
  app: { app: "web" },
  appTier: { app: "web", tier: "api" },
  none: undefined,
}

type Kind = "Ingress" | "Service" | "Deployment" | "Secret" | "ConfigMap" | "PersistentVolumeClaim"
type NodeId = "ingress" | "service" | "web" | "worker" | "secret" | "pvc" | "config" | "old"
const inner = (svg: string) => svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "")
const KIND_ICONS: Record<Kind, string> = {
  Ingress: inner(globe),
  Service: inner(plugs),
  Deployment: inner(cube),
  Secret: inner(key),
  ConfigMap: inner(sliders),
  PersistentVolumeClaim: inner(hardDrives),
}

const NODES: Record<NodeId, { kind: Kind; name: string }> = {
  ingress: { kind: "Ingress", name: "web" },
  service: { kind: "Service", name: "web" },
  web: { kind: "Deployment", name: "web" },
  worker: { kind: "Deployment", name: "worker" },
  secret: { kind: "Secret", name: "db-credentials" },
  pvc: { kind: "PersistentVolumeClaim", name: "uploads" },
  config: { kind: "ConfigMap", name: "app-config" },
  old: { kind: "Secret", name: "old-token" },
}
const NODE_IDS = Object.keys(NODES) as NodeId[]

/** A reference zeabur-graph keeps: the workload it ties `to` to, and the field that names it. */
type Ref = { workload: "web" | "worker"; to: NodeId; holder: NodeId; path: string }

const POD = "spec.template.spec"
const WEB_POD_LABELS = { app: "web" }
const WORKER_POD_LABELS = { app: "worker" }

function references(state: State): Ref[] {
  const refs: Ref[] = [
    {
      workload: "web",
      to: "secret",
      holder: "web",
      path: `${POD}.containers[name=app].env[name=DATABASE_URL].valueFrom.secretKeyRef`,
    },
    {
      workload: "web",
      to: "config",
      holder: "web",
      path: `${POD}.containers[name=app].envFrom[0].configMapRef`,
    },
    {
      workload: "web",
      to: "pvc",
      holder: "web",
      path: `${POD}.volumes[name=uploads].persistentVolumeClaim`,
    },
  ]
  if (state.workerImports) {
    refs.push({
      workload: "worker",
      to: "config",
      holder: "worker",
      path: `${POD}.containers[name=worker].envFrom[0].configMapRef`,
    })
  }
  const selector = SELECTORS[state.selector]
  const selected: Ref["workload"][] = []
  if (selects(selector, WEB_POD_LABELS)) selected.push("web")
  if (selects(selector, WORKER_POD_LABELS)) selected.push("worker")
  for (const workload of selected) {
    refs.push({ workload, to: "service", holder: "service", path: "spec.selector" })
    refs.push({
      workload,
      to: "ingress",
      holder: "ingress",
      path: "spec.rules[0].http.paths[0].backend.service",
    })
  }
  return refs
}

type Box = { x: number; y: number; w: number }
type EdgeId = "route" | "sel" | "secret" | "pvc" | "config" | "worker"
type Layout = {
  width: number
  height: number
  h: number
  labels: boolean
  boxes: Record<NodeId, Box>
  edges: Record<EdgeId, string>
}

const WIDE: Layout = {
  width: 664,
  height: 316,
  h: 56,
  labels: true,
  boxes: {
    ingress: { x: 1, y: 24, w: 150 },
    service: { x: 1, y: 176, w: 150 },
    web: { x: 252, y: 100, w: 160 },
    worker: { x: 252, y: 240, w: 160 },
    secret: { x: 512, y: 4, w: 150 },
    pvc: { x: 512, y: 82, w: 150 },
    config: { x: 512, y: 160, w: 150 },
    old: { x: 512, y: 250, w: 150 },
  },
  edges: {
    route: "M76 80 V176",
    sel: "M151 204 L252 128",
    secret: "M412 120 L512 32",
    pvc: "M412 128 L512 110",
    config: "M412 136 L512 182",
    worker: "M412 268 L512 196",
  },
}
const NARROW: Layout = {
  width: 326,
  height: 354,
  h: 56,
  labels: false,
  boxes: {
    ingress: { x: 14, y: 1, w: 146 },
    service: { x: 178, y: 1, w: 146 },
    web: { x: 14, y: 110, w: 146 },
    worker: { x: 178, y: 110, w: 146 },
    secret: { x: 14, y: 220, w: 146 },
    config: { x: 178, y: 220, w: 146 },
    pvc: { x: 14, y: 296, w: 146 },
    old: { x: 178, y: 296, w: 146 },
  },
  edges: {
    route: "M160 29 H178",
    sel: "M251 57 L87 110",
    secret: "M87 166 V220",
    pvc: "M14 138 H5 V324 H14",
    config: "M120 166 L230 220",
    worker: "M251 166 V220",
  },
}
const EDGE_ENDS: Record<EdgeId, [NodeId, NodeId]> = {
  route: ["ingress", "service"],
  sel: ["service", "web"],
  secret: ["web", "secret"],
  pvc: ["web", "pvc"],
  config: ["web", "config"],
  worker: ["worker", "config"],
}
const EDGE_LABEL_AT: Record<EdgeId, [number, number]> = {
  route: [76, 128],
  sel: [201, 166],
  secret: [462, 76],
  pvc: [462, 119],
  config: [462, 159],
  worker: [462, 232],
}

const copy = {
  "zh-TW": {
    kinds: {
      Ingress: "Ingress",
      Service: "Kubernetes Service",
      Deployment: "Deployment",
      Secret: "機密變數",
      ConfigMap: "設定檔",
      PersistentVolumeClaim: "磁碟",
    } satisfies Record<Kind, string>,
    edges: {
      route: "backend.service",
      sel: "spec.selector",
      secret: "env.valueFrom",
      pvc: "volumes",
      config: "envFrom",
      worker: "envFrom",
    } satisfies Record<EdgeId, string>,
    removed: "已移除",
    noSelector: "沒有 selector",
    selectorMiss: "selector 不符合",
    controls: {
      worker: "worker 用 envFrom 匯入 app-config",
      selector: "Kubernetes Service web 的 selector",
      selectors: {
        app: "app: web",
        appTier: "app: web, tier: api",
        none: "移除 selector",
      } satisfies Record<SelectorMode, string>,
      helm: "替 Deployment web 加上 meta.helm.sh/release-name",
      reset: "回到預設",
    },
    helmWarn: "Helm 管理，修改前提醒",
    hint: "選取圖上的物件，查看參照它的欄位。",
    refsOut: "它參照的物件",
    refsIn: "參照它的工作負載",
    none: "沒有",
    explain: {
      owned: (owners: string) => `只有 ${owners} 參照，所以是 owned。`,
      shared: (owners: string) =>
        `${owners} 都參照，所以是 shared；從一個服務修改，也會影響其他服務。`,
      orphan: "沒有工作負載參照，所以是 orphan，留在專案的其他資源裡。",
    },
    serviceNone: "沒有 selector，無法比對 Pod template，不歸給任何工作負載。",
    serviceMiss: "selector 要求 app: web 和 tier: api，web 的 Pod template 沒有 tier，不符合。",
    configSummary: (status: string) => `設定檔 app-config：${status}`,
    and: "和",
  },
}

export default function ReferenceGraph({ label, locale }: { label: string; locale: SiteLocale }) {
  const t = figureCopy(copy, locale)
  const uid = useId()
  const [state, setState] = useState<State>(DEFAULT)
  const [selected, setSelected] = useState<NodeId | null>(null)

  const refs = references(state)
  const ownersOf = (id: NodeId) => [
    ...new Set(refs.filter((r) => r.to === id).map((r) => r.workload)),
  ]
  const statusOf = (id: NodeId): Ownership | null =>
    NODES[id].kind === "Deployment" ? null : ownership(ownersOf(id))
  const helm = detectTool({}, state.helm ? { "meta.helm.sh/release-name": "web" } : {})
  const selectedWeb = refs.some((r) => r.to === "service")
  const present: Record<EdgeId, boolean> = {
    route: true,
    sel: selectedWeb,
    secret: true,
    pvc: true,
    config: true,
    worker: state.workerImports,
  }
  const edgeText = (id: EdgeId) => {
    if (present[id]) return t.edges[id]
    if (id === "sel") return state.selector === "none" ? t.noSelector : t.selectorMiss
    return `${t.edges[id]} · ${t.removed}`
  }
  const join = (names: string[]) => names.join(` ${t.and} `)
  const statusLine = (id: NodeId) => {
    if (id === "web" && helm.warnBeforeEdit) return t.helmWarn
    const status = statusOf(id)
    if (!status) return null
    const owners = ownersOf(id)
    return owners.length ? `${status} · ${owners.join(", ")}` : status
  }
  const configStatus = statusLine("config") ?? ""

  const lit = new Set<EdgeId>()
  if (selected) {
    for (const [id, ends] of Object.entries(EDGE_ENDS) as [EdgeId, [NodeId, NodeId]][]) {
      if (ends.includes(selected)) lit.add(id)
    }
  }
  const toggle = (id: NodeId) => setSelected((current) => (current === id ? null : id))
  const onKey = (id: NodeId) => (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      toggle(id)
    } else if (event.key === "Escape") {
      setSelected(null)
    }
  }

  const graph = (layout: Layout, className: string) => (
    <svg
      className={`imagery ${className}`}
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      role="group"
      aria-label={label}
    >
      <g aria-hidden="true">
        {(Object.keys(layout.edges) as EdgeId[]).map((id) => (
          <path
            key={id}
            className={lit.has(id) && present[id] ? "img-link img-accent-stroke" : "img-link"}
            d={layout.edges[id]}
            strokeDasharray={present[id] ? undefined : "4 4"}
            opacity={present[id] ? 1 : 0.6}
          />
        ))}
      </g>
      {layout.labels && (
        <g aria-hidden="true">
          {(Object.keys(layout.edges) as EdgeId[]).map((id) => {
            const [x, y] = EDGE_LABEL_AT[id]
            const text = edgeText(id)
            const w = [...text].reduce(
              (sum, c) => sum + (c.charCodeAt(0) > 0x2e80 ? 10.5 : 6.4),
              10,
            )
            return (
              <g key={id}>
                <rect className="img-frame" x={x - w / 2} y={y - 9} width={w} height={18} rx={3} />
                <text
                  className={present[id] ? "img-kind" : "img-kind img-faint"}
                  x={x}
                  y={y + 3.5}
                  textAnchor="middle"
                >
                  {text}
                </text>
              </g>
            )
          })}
        </g>
      )}
      {NODE_IDS.map((id) => {
        const b = layout.boxes[id]
        const node = NODES[id]
        const status = statusOf(id)
        const line = statusLine(id)
        return (
          <g
            key={id}
            className="fig-graph-node"
            role="button"
            tabIndex={0}
            aria-pressed={selected === id}
            aria-label={[`${t.kinds[node.kind]} ${node.name}`, line].filter(Boolean).join("，")}
            onClick={() => toggle(id)}
            onKeyDown={onKey(id)}
          >
            <rect
              className={selected === id ? "img-card img-box-accent" : "img-card"}
              x={b.x}
              y={b.y}
              width={b.w}
              height={layout.h}
              rx={6}
              strokeDasharray={status === "orphan" ? "4 3" : undefined}
            />
            <svg
              className={selected === id ? "fig-graph-icon img-accent-text" : "fig-graph-icon"}
              x={b.x + b.w - 26}
              y={b.y + 8}
              width={16}
              height={16}
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: KIND_ICONS[node.kind] }}
            />
            <text className="img-kind" x={b.x + 10} y={b.y + 17}>
              {node.kind === "Service" ? "Service" : t.kinds[node.kind]}
            </text>
            <text className="img-name" x={b.x + 10} y={b.y + 34}>
              {node.name}
            </text>
            {line && (
              <text
                className={
                  id === "config" || (id === "web" && helm.warnBeforeEdit)
                    ? "img-kind img-accent-text"
                    : "img-kind"
                }
                x={b.x + 10}
                y={b.y + 49}
              >
                {line}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )

  const panel = () => {
    if (!selected) return <p className="fig-note">{t.hint}</p>
    const node = NODES[selected]
    const status = statusOf(selected)
    const out = refs.filter((r) => r.holder === selected && r.holder !== r.to)
    const incoming = refs.filter((r) => r.to === selected)
    let explain: string | null = null
    if (selected === "service" && !selectedWeb)
      explain = state.selector === "none" ? t.serviceNone : t.serviceMiss
    else if (status === "orphan") explain = t.explain.orphan
    else if (status) explain = t.explain[status](join(ownersOf(selected)))
    return (
      <>
        <p className="fig-name">
          {t.kinds[node.kind]} <span className="fig-mono">{node.name}</span>
        </p>
        {explain && <p className="fig-note">{explain}</p>}
        {node.kind === "Deployment" ? (
          <>
            <p className="fig-kind fig-graph-sub">{t.refsOut}</p>
            <ul>
              {out.map((r) => (
                <li key={r.path}>
                  <span className="fig-mono">{NODES[r.to].name}</span>
                  <span className="fig-path">{r.path}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <p className="fig-kind fig-graph-sub">{t.refsIn}</p>
            {incoming.length === 0 ? (
              <p className="fig-faint">{t.none}</p>
            ) : (
              <ul>
                {incoming.map((r) => (
                  <li key={r.workload + r.path}>
                    <span className="fig-mono">
                      {r.holder === r.workload
                        ? `Deployment ${r.workload}`
                        : `${t.kinds[NODES[r.holder].kind]} ${NODES[r.holder].name} → ${r.workload}`}
                    </span>
                    <span className="fig-path">{r.path}</span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </>
    )
  }

  return (
    <div className="fig fig-graph">
      <div className="fig-graph-controls">
        <div className="fig-graph-switch">
          <Switch
            id={`${uid}-worker`}
            checked={state.workerImports}
            onCheckedChange={(workerImports) => setState((s) => ({ ...s, workerImports }))}
          />
          <Label htmlFor={`${uid}-worker`}>{t.controls.worker}</Label>
        </div>
        <div className="fig-graph-selector">
          <span className="fig-note" id={`${uid}-selector`}>
            {t.controls.selector}
          </span>
          <ToggleGroup
            variant="outline"
            size="sm"
            className="flex-wrap"
            aria-labelledby={`${uid}-selector`}
            value={[state.selector]}
            onValueChange={(value) => {
              const selector = value[0] as SelectorMode | undefined
              if (selector) setState((s) => ({ ...s, selector }))
            }}
          >
            {(Object.keys(SELECTORS) as SelectorMode[]).map((mode) => (
              <ToggleGroupItem key={mode} value={mode} className="font-mono">
                {t.controls.selectors[mode]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <div className="fig-graph-switch">
          <Switch
            id={`${uid}-helm`}
            checked={state.helm}
            onCheckedChange={(on) => setState((s) => ({ ...s, helm: on }))}
          />
          <Label htmlFor={`${uid}-helm`}>{t.controls.helm}</Label>
        </div>
        <div>
          <Button
            variant="outline"
            size="sm"
            disabled={
              state.workerImports && state.selector === "app" && !state.helm && selected === null
            }
            onClick={() => {
              setState(DEFAULT)
              setSelected(null)
            }}
          >
            {t.controls.reset}
          </Button>
        </div>
      </div>
      {graph(WIDE, "fig-graph-wide")}
      {graph(NARROW, "fig-graph-narrow")}
      <p className="fig-graph-summary" aria-live="polite">
        {t.configSummary(configStatus)}
      </p>
      <div className="fig-graph-panel" aria-live="polite">
        {panel()}
      </div>
    </div>
  )
}
