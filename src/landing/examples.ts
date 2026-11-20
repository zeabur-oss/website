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
const zeatendArchive = `zeatend-${zeatendTag}-linux-amd64.tar.gz`
export const zeatendExample = `# On the Linux server; arm64 has its own archive.
curl -fLO https://github.com/zeabur-oss/zeatend/releases/download/${zeatendTag}/${zeatendArchive}
tar -xzf ${zeatendArchive}
sudo install zeatend /usr/local/bin/
sudo zeatend`
