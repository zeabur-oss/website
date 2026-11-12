import type { HomeCopy } from "./index.ts"

export const en: HomeCopy = {
  home: {
    hero: {
      title: "Open-source deploys on Kubernetes. Your services stay in your cluster.",
      sub: "Zeabur is an open-source interface for deploying on Kubernetes. Deploy from Git, a container image or Docker Compose, and review each change before it's written. Your services are plain Kubernetes objects, so they keep running if you stop using Zeabur.",
      primary: "Get started",
      secondary: "View on GitHub",
      note: "You need a Kubernetes cluster or a Linux server.",
    },
    more: {
      team: "How product teams use it",
      provider: "How service providers use it",
      homelab: "How homelabs use it",
    },
    permTitle: "Kubernetes RBAC decides who can do what",
    openTitle: "Open it with the kubeconfig you have",
    cta: {
      title: "Start from what you have",
      body: "If you have a cluster, install with Helm or open it locally with `zeaburctl ui`. The docs go from install to your first service.",
    },
  },
  hero: {
    switch: {
      label: "Who it's for",
      team: "Product teams",
      provider: "Service providers",
      homelab: "Homelab",
    },
    team: {
      title: "Heroku-style deploys on the Kubernetes you already run",
      sub: "Deploy from Git, a container image or Docker Compose, and set domains, HTTPS, variables and databases in one place. Zeabur works on the cluster you already run, and services deployed with Helm, Argo CD or Flux show up as they are. When something breaks, the page says what happened and what to try next, so developers can look into it themselves.",
      primary: "Install in your cluster",
      secondary: "See how deploys work",
      note: "Installing needs cluster-admin. To look first, run `zeaburctl ui` on your computer.",
      alt: "The shop project page with web, worker and a database. worker is first under Needs attention.",
      soon: "On Kubernetes 1.30 or later, `zeaburctl install` adds Zeabur and Zeabur Identity and keeps the ingress, certificate and metrics components you already have.",
      meta: "Zeabur for product teams: deploy on the Kubernetes you run",
    },
    provider: {
      title: "Run Kubernetes for your clients without doing every deploy yourself.",
      sub: "Zeatend sets up K3s or RKE2 on your client's servers and handles upgrades later. Add Zeabur, invite the client's team, and make each person a Developer or Viewer per project. Developers deploy, read logs and restart services in Zeabur GUI on their own.",
      primary: "See how Zeatend works",
      secondary: "See how permissions work",
      note: "A K3s cluster with Zeabur runs on one machine with 2 vCPU and 2 GiB of memory.",
      alt: "Zeatend's terminal UI turning a Linux server into a K3s cluster.",
      meta: "Zeabur for service providers: clusters for clients who deploy",
    },
    homelab: {
      title: "Free and open source, next to your Helm charts and Argo CD apps",
      sub: "Zeabur is Apache-2.0. Services from Helm, Argo CD or Flux show up marked, and their fields stay read-only in Zeabur, so you keep managing them with the tools you already use. To try it, run `zeaburctl ui` on your computer. Nothing goes into the cluster.",
      primary: "Open it locally",
      secondary: "View on GitHub",
      note: "A personal install on KubeSolo has no members or roles, and Zeabur Identity sign-in doesn't work there.",
      alt: "Other Namespaces on the projects page, with services managed by Helm or Argo CD marked.",
      meta: "Zeabur for homelabs: free, open source, next to Helm",
    },
  },
  proof: {
    license: {
      title: "Apache-2.0",
      body: "Covers Zeabur, Identity, Builder and Catalog. The source is on GitHub.",
    },
    state: {
      title: "No database of its own",
      body: "Every project, service and domain you see comes straight from Kubernetes.",
    },
    rbac: {
      title: "Permissions come from RBAC",
      body: "Zeabur has no cluster permissions of its own. Every request carries the signed-in person's identity.",
    },
    review: {
      title: "Review before writing",
      body: "Review changes shows the diff before anything reaches the cluster.",
    },
    roles: {
      title: "Roles per project",
      body: "Each member is a Developer or Viewer per project, stored as a Kubernetes RoleBinding.",
    },
    lockin: {
      title: "Remove it, services stay up",
      body: "Removing Zeabur leaves every service's Kubernetes objects in place.",
    },
    gitops: {
      title: "GitOps settings stay in Git",
      body: "Services managed by Helm, Argo CD or Flux are marked and read-only in Zeabur.",
    },
    local: {
      title: "Runs on your computer",
      body: "`zeaburctl ui` runs on your machine and listens only on 127.0.0.1.",
    },
  },
  walk: {
    title: "worker keeps restarting",
    intro:
      "shop's worker is stuck in a crash loop. Here's the path from the project page to the error.",
    steps: [
      {
        title: "Find the service",
        body: "The project page puts the failing service first: worker, 1/2 ready, 14 restarts, with Open logs beside it. You don't have to scan `kubectl get pods` output.",
        alt: "The shop project page. worker is crash-looping and listed first under Needs attention.",
      },
      {
        title: "See what happened",
        body: "The service page says the container has restarted 14 times and the cluster waits longer before each retry. It points you to the previous run's logs. Expand the details for the raw `CrashLoopBackOff` and the evidence behind the diagnosis.",
        alt: "worker's service page: the container has restarted 14 times, with what to do next and an Open logs button.",
      },
      {
        title: "Read the logs or share the diagnosis",
        body: "Open logs shows the last error the previous run printed. If you need help, Copy diagnosis gives your teammate the same explanation you're reading.",
        alt: "Logs from worker's previous run, ending with the error.",
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
    deniedAlt: "alice opens worker's logs and sees a permission error.",
  },
  review: {
    title: "Review before anything is written",
    body: "Review changes shows the diff Zeabur is about to write. Nothing in the cluster changes until you apply.",
    conflict:
      "If a teammate changes the same object with kubectl after your review, Zeabur rejects the apply and asks you to review again. You won't roll back the image they just shipped.",
    gitops:
      "Services managed by Helm, Argo CD or Flux are marked, and their fields can't be edited in Zeabur. Change the values file or the Git repository instead. Restart still works, since it only adds an annotation.",
    alt: "Review changes for web. The YAML diff changes NODE_ENV from production to staging.",
  },
  local: {
    title: "Open it locally. Nothing goes into the cluster.",
    body: "Run `zeaburctl ui` on your computer and Zeabur GUI opens with the kubeconfig you already use. It listens only on 127.0.0.1 and can do exactly what that kubeconfig's identity is allowed to do. Ctrl-C closes it.",
    chip: "Zeabur GUI",
    alt: "Diagram: Zeabur GUI on a laptop reaches the cluster's Kubernetes API with a kubeconfig. Nothing is installed in the cluster.",
  },
  lockin: {
    title: "Remove Zeabur and your services keep running",
    body: "Services are Kubernetes objects. Removing Zeabur leaves Deployments, Services, Ingresses, variables and volumes in their Namespaces, and your services keep running.",
    gitops:
      "Services you deployed with Helm, Argo CD or Flux show up in Zeabur without importing anything.",
    existing:
      "Namespaces created by other tools are listed on the projects page. Use this Namespace adds one label and leaves the objects inside untouched.",
    alt: "Diagram: after Zeabur is removed, Deployments, Services, Ingresses and volumes stay in their Namespaces and keep running.",
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
  zeatend: {
    title: "From one pasted line to a cluster",
    body: "Paste one line into your hosting provider's web terminal. Zeatend's terminal UI walks you through turning the Linux server into a K3s, RKE2 or KubeSolo cluster, hardens the host along the way, and hands you a kubeconfig. Zeatend handles cluster upgrades later too. It doesn't install Zeabur: open Zeabur GUI on your own computer with that kubeconfig.",
    path: [
      "Paste one line",
      "Zeatend terminal UI",
      "K3s, RKE2 or KubeSolo",
      "kubeconfig",
      "Open Zeabur GUI",
    ],
    mirror:
      "Servers that can't reach GitHub install through the mirrors and proxy you set, with a guide for each step.",
    alt: "Five stops: paste one line in a web terminal, Zeatend terminal UI, a K3s, RKE2 or KubeSolo cluster, a kubeconfig, then Zeabur GUI.",
  },
  soon: [
    "`zeaburctl install`: adds Zeabur and Zeabur Identity to a cluster on Kubernetes 1.30 or later, and installs ingress, certificate and metrics components only when they're missing.",
    "Zeabur Desktop: an app for Windows and macOS that reads your kubeconfig, lists your contexts with search, and opens Zeabur for the one you pick.",
  ],
  dokploy: {
    title: "Coming from Dokploy?",
    intro:
      "Dokploy deploys on Docker and Zeabur deploys on Kubernetes. The steps feel alike; what runs underneath differs, and these points change with it.",
    points: [
      {
        title: "Deploying",
        body: "You still deploy from Git, an image or Docker Compose, and set domains and HTTPS on the service. Before you apply, Zeabur lists what it will write to the cluster.",
      },
      {
        title: "One server",
        body: "One server is enough: the installer sets up K3s or RKE2 on it. For yourself alone, the personal install uses KubeSolo (single-node Kubernetes), with no members or roles: whoever holds the kubeconfig controls the cluster.",
      },
      {
        title: "Memory on a small server",
        body: "Kubernetes takes some memory of its own. Dokploy's docs ask for at least 2 GB; Zeabur's team install needs 4 GiB today and the personal install 1.5 GiB. These are the documented minimums, not measurements.",
        soon: "The team install runs on a machine with 2 vCPU and 2 GiB of memory.",
      },
      {
        title: "Templates",
        body: "Dokploy's README lists more than 600 templates; Zeabur Catalog has far fewer. Before you move, check that the apps you need are there. If not, deploy them from an image or Compose.",
      },
      {
        title: "What changes on Kubernetes",
        body: "Services become Kubernetes Deployments, Services and Ingresses that kubectl can show. Kubernetes schedules across machines instead of Docker Swarm. Compose import only creates services with an `image:`; deploy `build:`-only services from Git.",
      },
      {
        title: "Running both, or leaving",
        body: "Both installers need ports 80 and 443 free, so run them on separate servers while you move, then switch DNS. If you stop using Zeabur, your services' Kubernetes objects stay and keep running.",
      },
      {
        title: "Licence",
        body: "Zeabur, Zeabur Identity, Zeabur Builder and Zeabur Catalog are Apache-2.0, with no paid edition. Most of Dokploy is Apache-2.0; its `/proprietary` directory is under a source-available licence.",
      },
    ],
    link: "Compare Zeabur and Dokploy side by side",
  },
  cta: {
    primary: "Get started",
    secondary: "Read the docs",
    providerPrimary: "Watch Zeatend on GitHub",
    team: {
      title: "Try it with the kubeconfig you already have",
      body: "`zeaburctl ui` runs on your computer and installs nothing in the cluster.",
    },
    provider: {
      title: "Follow Zeatend on GitHub",
      body: "Zeatend is in early development. Watch the repository to see when it's ready.",
    },
    homelab: {
      title: "The source is on GitHub",
      body: "Zeabur, Zeabur Identity, Zeabur Builder and Zeabur Catalog are Apache-2.0. Issues and pull requests are welcome.",
    },
  },
}
