import type { HomeCopy } from "./index.ts"

export const en: HomeCopy = {
  hero: {
    team: {
      eyebrow: "For teams",
      title: "Share a cluster without handing out cluster-admin.",
      sub: "Zeabur shows your cluster as projects and services. Members sign in with a passkey, and every read and write reaches Kubernetes as that person, so RBAC decides what they can do. Zeabur lists each change for review before it writes anything.",
      primary: "Install in your cluster",
      secondary: "See how permissions work",
      soon: "On Kubernetes 1.30 or later, `zeaburctl install` adds Zeabur and Zeabur Identity. A team's K3s cluster with Zeabur runs on one machine with 2 vCPU and 2 GiB of memory.",
    },
    machine: {
      eyebrow: "One machine",
      title: "Turn one machine with 2 GiB of memory into a cluster.",
      sub: "Paste one line into your hosting provider's web terminal. Zeatend walks you through turning the Linux server into a K3s, RKE2 or KubeSolo cluster, then hands you a kubeconfig. Zeatend doesn't install Zeabur: open Zeabur on your own computer with that kubeconfig.",
      primary: "Install on my server",
      secondary: "Check requirements",
      next: "When the team joins, run `zeaburctl install` on the same K3s or RKE2 cluster to add Zeabur and Zeabur Identity.",
    },
  },
  proof: [
    {
      title: "Apache-2.0",
      body: "Covers Zeabur, Identity, Builder and Catalog. The source is on GitHub.",
    },
    {
      title: "No database of its own",
      body: "Every project, service and domain you see comes straight from Kubernetes.",
    },
    {
      title: "Permissions come from RBAC",
      body: "Zeabur has no cluster permissions of its own. Every request carries the signed-in person's identity.",
    },
  ],
  walk: {
    title: "worker keeps restarting",
    intro:
      "shop's worker is stuck in a crash loop. Here's the path from the project page to the error.",
    steps: [
      {
        title: "Find the service",
        body: "The project page puts the failing service first: worker, 1/2 ready, 14 restarts, with Open logs beside it. You don't have to scan `kubectl get pods` output.",
      },
      {
        title: "See what happened",
        body: "The service page says the container has restarted 14 times and the cluster waits longer before each retry. It points you to the previous run's logs. Expand the details for the raw `CrashLoopBackOff` and the evidence behind the diagnosis.",
      },
      {
        title: "Read the logs or share the diagnosis",
        body: "Open logs shows the last error the previous run printed. If you need help, Copy diagnosis gives your teammate the same explanation you're reading.",
      },
    ],
  },
  perm: {
    title: "In shop, erin can deploy and alice can only look",
    body: "When you invite someone, you choose Developer or Viewer for each project. Zeabur records it in a Kubernetes RoleBinding that kubectl shows too.",
    erin: "erin is a Developer in shop. She can deploy, edit variables, restart, read logs and open a terminal.",
    alice:
      "alice is a Viewer in shop. She sees status and events. Opening logs shows a permission error, and she can't change anything.",
    invite:
      "Members sign in with a passkey through Zeabur Identity. An invitation link works once and expires after 7 days.",
    scope: "Members and roles come with a team install.",
  },
  review: {
    title: "Review before anything is written",
    body: "Review changes shows the diff Zeabur is about to write. Nothing in the cluster changes until you apply.",
    conflict:
      "If a teammate changes the same object with kubectl after your review, Zeabur rejects the apply and asks you to review again. You won't roll back the image they just shipped.",
    gitops:
      "Services managed by Helm, Argo CD or Flux are marked, and their fields can't be edited in Zeabur. Change the values file or the Git repository instead. Restart still works, since it only adds an annotation.",
  },
  local: {
    title: "Open it locally. Nothing goes into the cluster.",
    body: "Run `zeaburctl ui` on your computer and Zeabur opens with the kubeconfig you already use. It listens only on 127.0.0.1 and has exactly that kubeconfig's permissions. Ctrl-C closes it.",
  },
  lockin: {
    title: "Remove Zeabur and your services keep running",
    body: "Services are Kubernetes objects. Removing Zeabur leaves Deployments, Services, Ingresses, variables and volumes in their Namespaces, and your services keep running.",
    gitops:
      "Services you deployed with Helm, Argo CD or Flux show up in Zeabur without importing anything.",
    existing:
      "Namespaces created by other tools are listed on the projects page. Use this Namespace adds one label and leaves the objects inside untouched.",
    uninstall: {
      title: "How to remove it",
      after: "Kubernetes, cluster components and project Namespaces stay.",
      link: "Steps to remove Zeabur",
    },
  },
  license: {
    title: "Apache-2.0 licensed",
    body: "Zeabur, Zeabur Identity, Zeabur Builder and Zeabur Catalog are Apache-2.0 licensed, and the source is on GitHub.",
  },
  safety: {
    title: "Security",
    hardening:
      "Clusters the installer creates with K3s follow the K3s hardening guide. The guide also lists what's left for the administrator.",
    hardeningLink: "K3s hardening guide",
    gitops:
      "Zeabur marks services managed by Helm, Argo CD or Flux, and their fields can't be edited in Zeabur.",
  },
  soon: [
    "Zeatend: a terminal UI that turns a Linux server into a K3s, RKE2 or KubeSolo cluster, then upgrades and maintains it.",
    "`zeaburctl install`: adds Zeabur and Zeabur Identity to a cluster on Kubernetes 1.30 or later, and installs ingress, certificate and metrics components only when they're missing.",
    "Servers that can't reach GitHub install through registry mirrors and a proxy.",
    "Zeabur Desktop: an app for Windows and macOS that reads your kubeconfig, lists your contexts with search, and opens Zeabur for the one you pick.",
  ],
  cta: {
    title: "Try it with the kubeconfig you already have",
    body: "`zeaburctl ui` runs on your computer and installs nothing in the cluster.",
    primary: "Get started",
    secondary: "Read the docs",
  },
}
