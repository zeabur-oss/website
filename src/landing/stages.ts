import { catalog } from "../catalog/data.ts"
import { excerpt } from "../catalog/examples.ts"
import { identityShot, zeatendScreen, type ShotImage } from "./shots.ts"

// What the stage of a product page shows at each of its three steps: a panel with the object
// of that step, and the pipeline below it with the step's place lit. Field names and formats
// follow each product's docs.

export type Panel = { title: string } & (
  | { code: string; marks?: number[] }
  | { image: ShotImage; alt: string; whole?: boolean }
)
export type Node = { icon: string; name: string; sub: string }
export type Stage = { panels: Panel[]; nodes: Node[] }

const builder: Stage = {
  panels: [
    {
      title: "Build · team-a/whoami",
      code: `apiVersion: builder.zeabur.com/v1alpha1
kind: Build
metadata: {name: whoami, namespace: team-a}
spec:
  source: {git: {url: https://github.com/traefik/whoami}}
  builderRef: dockerfile
status:
  resolvedRef: main
  remoteRevision: 3e1a9c2`,
      marks: [7, 8],
    },
    {
      title: "BuildRun · team-a",
      code: `apiVersion: builder.zeabur.com/v1alpha1
kind: BuildRun
metadata: {namespace: team-a}
spec:
  buildRef: whoami
status:
  phase: Building
# A Job runs buildctl against the namespace's buildkitd.`,
      marks: [6],
    },
    {
      title: "Build · team-a/whoami",
      code: `status:
  resolvedRef: main
  latestRevision: 3e1a9c2
  latestImage: >-
    registry.example.com/team-a/whoami
    :main-1761058800-3e1a9c2@sha256:9f86d081…`,
      marks: [2, 3, 4, 5],
    },
  ],
  nodes: [
    { icon: "git-branch", name: "Git", sub: "main → 3e1a9c2" },
    { icon: "hammer", name: "BuildRun", sub: "buildkitd" },
    { icon: "package", name: "Registry", sub: "team-a/whoami" },
  ],
}

const traefikFile = "components/traefik/component.yaml"
const traefikYaml = excerpt(traefikFile, catalog.files[traefikFile], {
  keys: ["apiVersion", "kind", "metadata", "provides", "releases"],
  omitMetadata: ["locales", "license", "homepage"],
  release: { name: "traefik", keys: ["name", "chart", "version"] },
  noHeader: true,
})
const traefik = catalog.components.find((c) => c.id === "traefik")
const traefikRun = traefik?.tests.find((t) => t.distribution === "rke2") ?? traefik?.tests[0]
if (!traefikRun) throw new Error("the catalog stage needs a passing run of traefik")
const json = JSON.stringify
const runJson = `{
  "id": "traefik",
  "measurements": [{
    "distribution": ${json(traefikRun.distribution)},
    "profile": ${json(traefikRun.profile)},
    "result": "passed",
    "pods": [
${traefikRun.pods.map((p) => `      {"workload": ${json(p.workload)}, "memory": ${json(p.memory)}, "cpu": ${json(p.cpu)}}`).join(",\n")}
    ],
    "measuredAt": ${json(traefikRun.date)}
  }]
}`
// Lines whose start the panels light.
const marked = (code: string, starts: RegExp) =>
  code.split("\n").flatMap((line, i) => (starts.test(line) ? [i] : []))

const catalogStage: Stage = {
  panels: [
    {
      title: traefikFile,
      code: traefikYaml,
      marks: marked(traefikYaml, /^provides:|^ {4}version:/),
    },
    {
      title: "v1/components/traefik.json",
      code: runJson,
      marks: marked(runJson, /"(distribution|memory)":/),
    },
    {
      title: "github.com/zeabur-oss/catalog/releases",
      code: `bundle.tar.gz
api-v1.tar.gz
SHA256SUMS
SHA256SUMS.sigstore.json

$ cosign verify-blob SHA256SUMS --bundle SHA256SUMS.sigstore.json …
Verified OK`,
      marks: [6],
    },
  ],
  nodes: [
    { icon: "file-text", name: "components/", sub: "traefik/component.yaml" },
    { icon: "flask", name: "e2e", sub: `${traefikRun.distribution} · ${traefikRun.profile}` },
    { icon: "seal-check", name: "Release", sub: "Sigstore" },
  ],
}

const identity = (alt: string): Stage => ({
  panels: [
    {
      title: "kubectl",
      code: `$ kubectl get pods
# kubectl opens https://login.example.com in your browser.`,
      marks: [0],
    },
    { title: "login.example.com", image: identityShot("sign-in", "dark"), alt, whole: true },
    {
      title: "kubectl",
      code: `$ kubectl auth whoami
ATTRIBUTE   VALUE
Username    zeabur:alice
Groups      [zeabur:dev system:authenticated]`,
      marks: [2, 3],
    },
  ],
  nodes: [
    { icon: "terminal-window", name: "kubectl", sub: "get pods" },
    { icon: "fingerprint", name: "Zeabur Identity", sub: "passkey" },
    { icon: "shield-check", name: "kube-apiserver", sub: "OpenID Connect" },
  ],
})

const zeatend = (locale: string, alts: string[]): Stage => ({
  panels: ["server", "review", "done"].map((name, i) => ({
    title: "sudo zeatend",
    image: zeatendScreen(locale, name),
    alt: alts[i] ?? "",
    whole: true,
  })),
  nodes: [
    { icon: "hard-drives", name: "Server", sub: "sudo zeatend" },
    { icon: "list-checks", name: "Review", sub: "zeatend plan" },
    { icon: "check-circle", name: "Install", sub: "zeatend apply" },
  ],
})

// Desktop's panels are drawn scenes (scenes/DesktopScenes.astro); the stage keeps the pipeline.
const desktop: Stage = {
  panels: [],
  nodes: [
    { icon: "file-text", name: "kubeconfig", sub: "context" },
    { icon: "app-window", name: "Zeabur OSS", sub: "zeabur-local" },
    { icon: "heartbeat", name: "Home", sub: "attention" },
  ],
}

/** The stage of a page whose story walks through steps; `alts` describe the steps. */
export const stageOf = (slug: string, locale: string, alts: string[], signInAlt: string): Stage => {
  switch (slug) {
    case "builder":
      return builder
    case "catalog":
      return catalogStage
    case "identity":
      return identity(signInAlt)
    case "zeatend":
      return zeatend(locale, alts)
    case "desktop":
      return desktop
    default:
      throw new Error(`no stage for ${slug}`)
  }
}
