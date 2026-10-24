import lock from "../../docs.lock.json"

export const lockedRefs = Object.fromEntries(lock.repos.map((r) => [r.name, r.ref])) as Record<
  string,
  string
>

export const builderExample = `apiVersion: builder.zeabur.com/v1alpha1
kind: Build
metadata: {name: whoami, namespace: team-a}
spec:
  source: {git: {url: https://github.com/traefik/whoami}}
  builderRef: dockerfile`

export const catalogExample = `apiVersion: catalog.zeabur.com/v1
kind: Component
metadata:
  name: cert-manager
  description: >
    cert-manager is the standard Kubernetes certificate controller (CNCF
    graduated). Its issuers live in the cluster, so it renews certificates
    itself.
  license: Apache-2.0
  homepage: https://cert-manager.io
maturity: cncf-graduated
defaults:
  single-node: recommended
  multi-node: recommended
# Gateway API CRDs come with ingress; the controller exits without them.
requires: [ingress]

releases:
  - name: cert-manager
    namespace: cert-manager
    chart: oci://quay.io/jetstack/charts/cert-manager
    version: v1.21.2
    ...`
