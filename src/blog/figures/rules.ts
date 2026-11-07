// The few rules of zeabur-graph and zeabur-model that the figures let a reader try, for the
// objects the figures show. Keep them in step with those crates.

export type Labels = Record<string, string>

/** zeabur-model `label`: a key with an empty value counts as not set. */
const mark = (labels: Labels, key: string) => (labels[key] ? labels[key] : undefined)

/** One step of `<template>-<set>-<ordinal>`: the part of the name it read and whether it fits. */
export type ClaimStep = { part: string; ok: boolean }

/** zeabur-graph `created_by_claim_template`, step by step: template, dash, set, dash, ordinal. */
export function claimSteps(claim: string, template: string, set: string) {
  const expected = [template, "-", set, "-"]
  const steps: ClaimStep[] = []
  let rest = claim
  for (const want of expected) {
    if (!rest.startsWith(want)) {
      steps.push({ part: rest, ok: false })
      return { steps, matches: false, failedAt: steps.length - 1, rest }
    }
    steps.push({ part: want, ok: true })
    rest = rest.slice(want.length)
  }
  const ok = /^[0-9]+$/.test(rest)
  steps.push({ part: rest, ok })
  return { steps, matches: ok, failedAt: ok ? -1 : 4, rest }
}

export const MARKS = {
  argoTrackingId: "argocd.argoproj.io/tracking-id",
  argoInstance: "argocd.argoproj.io/instance",
  fluxKustomization: "kustomize.toolkit.fluxcd.io/name",
  fluxHelmRelease: "helm.toolkit.fluxcd.io/name",
  helmReleaseName: "meta.helm.sh/release-name",
  managedBy: "app.kubernetes.io/managed-by",
  component: "app.kubernetes.io/component",
  group: "zeabur.com/group",
} as const

export type Tool = "argocd" | "flux" | "helm"

/** zeabur-model `detect_tool` and zeabur-graph `provenance`, with the mark that decided. */
export function detectTool(labels: Labels, annotations: Labels) {
  const managedBy = mark(labels, MARKS.managedBy) ?? null
  const found = (tool: Tool, by: string) => ({ tool, by, managedBy, warnBeforeEdit: true })
  if (mark(annotations, MARKS.argoTrackingId)) return found("argocd", MARKS.argoTrackingId)
  if (mark(labels, MARKS.argoInstance)) return found("argocd", MARKS.argoInstance)
  if (mark(labels, MARKS.fluxKustomization)) return found("flux", MARKS.fluxKustomization)
  if (mark(labels, MARKS.fluxHelmRelease)) return found("flux", MARKS.fluxHelmRelease)
  if (mark(annotations, MARKS.helmReleaseName)) return found("helm", MARKS.helmReleaseName)
  if (managedBy?.toLowerCase() === "helm") return found("helm", MARKS.managedBy)
  return { tool: null, by: null, managedBy, warnBeforeEdit: false }
}

/** zeabur-model `resolve_group`: the group label, else the component label, else `default`. */
export function resolveGroup(labels: Labels) {
  const explicit = mark(labels, MARKS.group)
  if (explicit) return { group: explicit, by: MARKS.group }
  const component = mark(labels, MARKS.component)
  if (component) return { group: component, by: MARKS.component }
  return { group: "default", by: null }
}

export type Ownership = "owned" | "shared" | "orphan"

/** zeabur-graph `attribute`: how many different workloads refer to a resource. */
export function ownership(workloads: string[]): Ownership {
  const count = new Set(workloads).size
  return count === 0 ? "orphan" : count === 1 ? "owned" : "shared"
}

/** zeabur-graph `selector_relations`: an empty or missing selector selects nothing. */
export function selects(selector: Labels | undefined, podLabels: Labels) {
  if (!selector || Object.keys(selector).length === 0) return false
  return Object.entries(selector).every(([key, value]) => podLabels[key] === value)
}
