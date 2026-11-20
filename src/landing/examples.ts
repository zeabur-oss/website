import { releaseTag } from "../lib/products.ts"

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

export const identityExample = `export ZEABUR_IDENTITY_ISSUER=https://login.example.com
zeabur-identityctl crds | kubectl apply --server-side -f -
zeabur-identityctl manifests --image "$ZEABUR_IDENTITY_IMAGE" \\
  --serve-arg=--invitations | kubectl apply --server-side -f -
# Prints kube-apiserver's configuration and how to install it
# for your distribution:
zeabur-identityctl kube-config --distro k3s > authn.yaml
# A one-time link: open it and create your passkey.
zeabur-identityctl setup-link --username admin`

const zeatendTag = releaseTag("zeatend")
const zeatendArch = `arch=$(uname -m | sed 's/x86_64/amd64/; s/aarch64/arm64/')`
const zeatendInstall = "sudo install -m 0755 zeatend /usr/local/bin/zeatend"
const zeatendExample = `version=${zeatendTag}
${zeatendArch}
base=https://github.com/zeabur-oss/zeatend/releases/download/$version
curl -fsSLO "$base/zeatend-$version-linux-$arch.tar.gz" &&
  curl -fsSLO "$base/SHA256SUMS" &&
  sha256sum --ignore-missing -c SHA256SUMS &&
  tar -xzf "zeatend-$version-linux-$arch.tar.gz" zeatend &&
  ${zeatendInstall}`

/** The commands of the Zeatend page: the hero's short path and one block for each start step. */
export const zeatendCommands: Record<string, string> = {
  quick: `${zeatendArch}
url=https://github.com/zeabur-oss/zeatend/releases/download/${zeatendTag}
curl -fsSL "$url/zeatend-${zeatendTag}-linux-$arch.tar.gz" | tar -xzf - zeatend &&
  ${zeatendInstall} &&
  sudo zeatend`,
  download: zeatendExample,
  install: "sudo zeatend",
  check: "sudo zeatend doctor",
}
