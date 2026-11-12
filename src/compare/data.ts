// The products the comparison pages cover, and the rows every comparison has.

/** The ten rows of every comparison, in the order a person who runs servers decides them. */
export const criteria = [
  "runsOn",
  "machine",
  "license",
  "deploy",
  "members",
  "servers",
  "databases",
  "existing",
  "interface",
  "remove",
] as const
export type CriterionId = (typeof criteria)[number]

export const competitorIds = [
  "dokploy",
  "coolify",
  "portainer",
  "rancher",
  "headlamp",
  "lens",
] as const
export type CompetitorId = (typeof competitorIds)[number]

export type Product = {
  name: string
  /** The product's own site, and its repository when it has a public one. */
  url: string
  repository?: string
  operatingSystem: string
}

const servers = "Linux"
const desktops = "Windows, macOS, Linux"

export const zeabur: Product = {
  name: "Zeabur",
  url: "https://oss.zeabur.com",
  repository: "https://github.com/zeabur-oss/zeabur",
  operatingSystem: servers,
}

export const competitors: Record<CompetitorId, Product> = {
  dokploy: {
    name: "Dokploy",
    url: "https://dokploy.com",
    repository: "https://github.com/Dokploy/dokploy",
    operatingSystem: servers,
  },
  coolify: {
    name: "Coolify",
    url: "https://coolify.io",
    repository: "https://github.com/coollabsio/coolify",
    operatingSystem: servers,
  },
  portainer: {
    name: "Portainer",
    url: "https://www.portainer.io",
    repository: "https://github.com/portainer/portainer",
    operatingSystem: servers,
  },
  rancher: {
    name: "Rancher",
    url: "https://www.rancher.com",
    repository: "https://github.com/rancher/rancher",
    operatingSystem: servers,
  },
  headlamp: {
    name: "Headlamp",
    url: "https://headlamp.dev",
    repository: "https://github.com/kubernetes-sigs/headlamp",
    operatingSystem: desktops,
  },
  lens: { name: "Lens", url: "https://lenshq.io", operatingSystem: desktops },
}

/** The day the pages were first published. */
export const published = "2026-11-12"

export const comparisonSlug = (id: CompetitorId) => `zeabur-vs-${id}`
export const correctionsUrl =
  "https://github.com/zeabur-oss/website/issues/new?template=comparison-correction.yml"
