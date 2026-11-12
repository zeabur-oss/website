import type { CompareCopy } from "./index.ts"

export const en: CompareCopy = {
  criteria: {
    runsOn: "Runs on",
    machine: "Minimum machine",
    license: "Licence and price",
    deploy: "Deploy from",
    members: "Members and permissions",
    servers: "More than one server",
    databases: "Databases and backups",
    existing: "Existing workloads",
    interface: "Interface",
    remove: "If you remove it",
  },
  criterion: "Criterion",
  checked: "Checked",
  lastChecked: "Last checked",
  notDocumented:
    '"Not documented" means the official docs don\'t cover it, not that the feature is missing.',
  before: {
    title: "Check before you choose",
    body: "Upgrade and rollback, restoring a backup, who manages routing and HTTPS certificates, recovering from a storage failure, monitoring and where to get help. Start from the official docs linked in the table, and ask each project's community about anything they leave unclear.",
  },
  soon: {
    title: "Coming soon in Zeabur",
    intro: "Not released yet, so the table leaves them out:",
  },
  corrections: {
    title: "Corrections",
    body: "Both products change. If a cell is out of date or wrong, open a correction on GitHub with a link to the official docs. Once confirmed, the table and the last-checked date are updated.",
    link: "Open a correction",
  },
  hub: {
    title: "Compare Zeabur with other self-hosted tools",
    description:
      "How Zeabur compares with Dokploy and other self-hosted deploy tools. Every page uses the same ten criteria, links official sources with check dates, and says when the other tool fits better.",
    heading: "Compare Zeabur with other self-hosted tools",
    intro:
      "Zeabur is an open-source deploy interface that runs on Kubernetes, for teams that already have a cluster or are moving to one. If you only have Docker hosts, or only want to browse a cluster, another tool may fit better. The table below sorts them by use.",
    disclosure:
      "The Zeabur maintainers wrote these pages, and Zeabur is one side of each comparison.",
    uses: {
      title: "Find a tool by what you need",
      need: "Your situation",
      tools: "Look at",
      rows: [
        {
          need: "Docker hosts only, no Kubernetes",
          tools: "Dokploy, Coolify, CapRover, Dokku",
        },
        {
          need: "You have Kubernetes and want developers to deploy on their own",
          tools: "Zeabur, Kubero",
        },
        {
          need: "You only want to browse and edit the cluster",
          tools: "Headlamp, k9s, Freelens",
        },
        {
          need: "You manage many clusters from one place",
          tools: "Rancher",
        },
      ],
    },
    pages: "Side-by-side pages",
    method: {
      title: "How these pages are made",
      body: "Each cell states only what official docs, pricing pages, licence files or GitHub releases say, with a link to the page and the date it was checked. No benchmarks, memory measurements or user counts.",
    },
  },
  pages: {
    dokploy: {
      title: "Zeabur vs Dokploy: Docker Swarm or Kubernetes for your servers",
      description:
        "Dokploy deploys with Docker and Traefik and asks for at least 2 GB of RAM. Zeabur runs on Kubernetes and leaves permissions to RBAC. Ten criteria side by side, with official sources and check dates.",
      heading: "Zeabur vs Dokploy",
      line: "Dokploy uses Docker and Traefik with remote servers or Swarm clusters; Zeabur uses Kubernetes.",
      link: "Zeabur vs Dokploy",
      checked: "2026-11-12",
      versions: "Zeabur v0.2.0, Dokploy v0.31.1",
      summary:
        "Both are open-source deployment platforms you host yourself. The main difference is what runs underneath: Dokploy uses Docker and Traefik and manages remote servers over SSH or a Docker Swarm, and Zeabur manages a Kubernetes cluster, including what's already in it.",
      disclosure:
        "The Zeabur maintainers wrote this page, and Zeabur is one side of the comparison. Every row links official sources and shows the date it was checked. If something is wrong, report it.",
      shortAnswer: "The short answer",
      chooseThem: {
        title: "Choose Dokploy if",
        points: [
          "You have one or a few Linux servers, want to deploy with Docker, and don't want to run Kubernetes.",
          "Your server has 2 GB of RAM and several people need access. Dokploy documents at least 2 GB of RAM and 30 GB of disk. A Zeabur team install needs 4 GiB today; the personal install fits in 1.5 GiB but has no members or roles.",
          "You want ready-made apps. Dokploy's README lists more than 600 templates; Zeabur's catalog has 33. Check that the apps you need are there.",
          "Your Compose files build from source with `build:`, or you use Swarm stacks. Dokploy deploys Compose and stacks directly; Zeabur's Compose import only creates services that have an `image:`.",
          "You want a choice of builders: Dokploy offers Nixpacks, Railpack, Dockerfile, Heroku buildpacks, Paketo and static sites, and can build on a separate server. Zeabur builds with Railpack or a Dockerfile.",
          "You need SAML or OIDC single sign-on, SCIM or audit logs and are willing to pay. Dokploy sells these as paid features.",
        ],
      },
      chooseZeabur: {
        title: "Choose Zeabur if",
        points: [
          "Your team already runs Kubernetes, or you want standard Kubernetes objects even on one machine. If you stop using Zeabur, those objects stay.",
          "Some services were deployed with Helm, Argo CD or Flux. Zeabur lists and marks them, allows restarts only, and points you to the values file or Git repository for changes.",
          "You want Kubernetes RBAC to enforce project access. Members are Developer or Viewer per project, and Zeabur accesses the cluster as the signed-in person.",
          "You need several machines and want Kubernetes to schedule across them. RKE2 supports three control-plane servers, so the control plane tolerates one failure; whether apps stay up also depends on replicas and storage.",
          "You want every component under an OSI-approved licence. Zeabur, Identity, Builder and Catalog are all Apache-2.0.",
          "You already have a cluster and want to look before installing anything. `zeaburctl ui` runs the UI on your computer against your kubeconfig; nothing is installed in the cluster.",
        ],
      },
      table: "Side by side",
      rows: {
        runsOn: {
          zeabur: {
            text: "Kubernetes. The installer sets up K3s or RKE2, or KubeSolo (single-node Kubernetes) for one machine; or install into an existing cluster (Kubernetes 1.30+).",
            links: [
              {
                text: "Install",
                url: "https://oss.zeabur.com/docs/zeabur/get-started/quickstart/",
              },
            ],
          },
          them: {
            text: "Docker with Traefik. Manages remote servers over SSH, or several servers as a Docker Swarm cluster. Kubernetes: not documented.",
            links: [
              {
                text: "README",
                url: "https://github.com/Dokploy/dokploy/blob/canary/README.md",
              },
            ],
          },
        },
        machine: {
          zeabur: {
            text: "Team install: 4 GiB of memory. Personal install for one user: 1.5 GiB. A server install needs ports 80, 443, 6443 and 10250 free. Opening a cluster with `zeaburctl ui` installs nothing in it.",
            links: [
              {
                text: "Personal use",
                url: "https://oss.zeabur.com/docs/zeabur/install/personal/",
              },
            ],
          },
          them: {
            text: '"At least 2GB of RAM and 30GB of disk space"; ports 80, 443 and 3000 must be free.',
            links: [
              {
                text: "Installation",
                url: "https://docs.dokploy.com/docs/core/installation",
              },
            ],
          },
        },
        license: {
          zeabur: {
            text: "Apache-2.0. No paid edition.",
            links: [
              {
                text: "GitHub",
                url: "https://github.com/zeabur-oss/zeabur",
              },
            ],
          },
          them: {
            text: "Apache-2.0, except the `/proprietary` directory, which is under the Dokploy Source Available License (not OSI-approved) and needs a commercial agreement for production use. Single sign-on, SCIM, custom roles and audit logs are paid; paid tiers start at $4.50 a month per server.",
            links: [
              {
                text: "Licence",
                url: "https://raw.githubusercontent.com/Dokploy/dokploy/canary/LICENSE.MD",
              },
              {
                text: "Pricing",
                url: "https://dokploy.com/pricing",
              },
            ],
          },
        },
        deploy: {
          zeabur: {
            text: "Git (GitHub App or any Git URL, built with Railpack or a Dockerfile), folder upload, container image, Docker Compose (services with `image:` only), catalog templates, cron jobs.",
            links: [
              {
                text: "Deploy from Git",
                url: "https://oss.zeabur.com/docs/zeabur/deploy/git/",
              },
            ],
          },
          them: {
            text: 'Git (GitHub, GitLab, Bitbucket, Gitea) with webhook auto-deploy, Docker Hub images, Docker Compose and stacks. Builders: Nixpacks (default), Railpack, Dockerfile, Heroku buildpacks, Paketo and static; the README says "+600 Templates".',
            links: [
              {
                text: "Build types",
                url: "https://docs.dokploy.com/docs/core/applications/build-type",
              },
            ],
          },
        },
        members: {
          zeabur: {
            text: "Team install: passkey sign-in, Developer or Viewer per project, stored as Kubernetes RoleBindings. Personal install has no members: whoever has the kubeconfig controls the cluster.",
            links: [
              {
                text: "Permissions",
                url: "https://oss.zeabur.com/docs/zeabur/reference/permissions/",
              },
            ],
          },
          them: {
            text: "Default roles are Owner, Admin and Member. Custom roles, single sign-on (OIDC, SAML), SCIM and audit logs are paid; the pricing page lists two-factor authentication from the $15-a-month tier up.",
            links: [
              {
                text: "Pricing",
                url: "https://dokploy.com/pricing",
              },
              {
                text: "Paid features",
                url: "https://docs.dokploy.com/docs/core/enterprise",
              },
            ],
          },
        },
        servers: {
          zeabur: {
            text: "Kubernetes schedules across nodes. On installer-made clusters, K3s adds workers only; RKE2 adds workers and control-plane servers. Personal install: one machine.",
            links: [
              {
                text: "Nodes",
                url: "https://oss.zeabur.com/docs/zeabur/cluster/nodes/",
              },
            ],
          },
          them: {
            text: "Remote servers over SSH, for deploys or builds; a deploy-only server uses about 250 MB of RAM. Docker Swarm clusters with Add Node, which need a Docker registry.",
            links: [
              {
                text: "Remote servers",
                url: "https://docs.dokploy.com/docs/core/remote-servers",
              },
              {
                text: "Cluster",
                url: "https://docs.dokploy.com/docs/core/cluster",
              },
            ],
          },
        },
        databases: {
          zeabur: {
            text: "PostgreSQL, MongoDB, MySQL, MariaDB and Dragonfly through their operators, with database backups to S3. Volumes with K8up, whole projects with Velero.",
            links: [
              {
                text: "Databases",
                url: "https://oss.zeabur.com/docs/zeabur/deploy/databases/",
              },
            ],
          },
          them: {
            text: "Postgres, MySQL, MariaDB, MongoDB and Redis, with automated backups to S3. Dokploy's own Postgres and `/etc/dokploy` can be backed up to S3 too.",
            links: [
              {
                text: "Backups",
                url: "https://docs.dokploy.com/docs/core/databases/backups",
              },
            ],
          },
        },
        existing: {
          zeabur: {
            text: "Namespaces made by other tools show up on the projects page without importing. Services managed by Helm, Argo CD or Flux can only be restarted.",
            links: [
              {
                text: "How it works",
                url: "https://oss.zeabur.com/docs/zeabur/get-started/how-it-works/",
              },
            ],
          },
          them: {
            text: "Dokploy manages Docker hosts, so there are no Kubernetes objects to take in. Existing Compose files and images deploy directly.",
            links: [
              {
                text: "Docker Compose",
                url: "https://docs.dokploy.com/docs/core/docker-compose",
              },
            ],
          },
        },
        interface: {
          zeabur: {
            text: "Web UI (in the cluster, or local with `zeaburctl ui`); `zeaburctl` CLI for Linux and Apple silicon Macs; Windows through WSL.",
            links: [
              {
                text: "zeaburctl",
                url: "https://oss.zeabur.com/docs/zeabur/reference/zeaburctl/",
              },
            ],
          },
          them: {
            text: "Web UI and REST API (Swagger UI at `/swagger`, API key in the `x-api-key` header). CLI: not documented.",
            links: [
              {
                text: "API",
                url: "https://docs.dokploy.com/docs/api",
              },
            ],
          },
        },
        remove: {
          zeabur: {
            text: "Deployments, Services, Ingresses, variables and volumes stay in their Namespaces and keep running; the ingress controller and cert-manager stay too.",
            links: [
              {
                text: "Uninstall",
                url: "https://oss.zeabur.com/docs/zeabur/leave/uninstall/",
              },
            ],
          },
          them: {
            text: "Removes the Swarm services dokploy, dokploy-traefik, dokploy-postgres and dokploy-redis, their volumes and networks, and `/etc/dokploy`. What happens to deployed apps: not documented.",
            links: [
              {
                text: "Uninstall",
                url: "https://docs.dokploy.com/docs/core/uninstall",
              },
            ],
          },
        },
      },
      releases:
        "Releases as of 2026-11-12: Zeabur v0.2.0 shipped on 2026-11-08 and is pre-1.0. Dokploy v0.31.1 shipped on 2026-11-12, a week after v0.31.0, and is pre-1.0 too. Read the changelog before upgrading either.",
      differ: {
        title: "Where they differ",
        points: [
          "**Docker Swarm or Kubernetes.** Most other differences follow from this one. Dokploy runs containers straight on Docker, so a small server is enough and Compose files and stacks work as they are; for more servers, it adds remote servers over SSH or joins them with Swarm. Zeabur works with Kubernetes objects, so Helm, Argo CD and kubectl keep working alongside it. The cost is memory: a team install needs 4 GiB today.",
          "**Where permissions live.** Dokploy keeps roles in Dokploy, and custom roles and single sign-on are paid. Zeabur has no permission store of its own: roles are Kubernetes RoleBindings that kubectl shows too.",
          "**After removal.** Dokploy's uninstall steps remove its Traefik service, so domain routing and HTTPS certificates need a new owner; the docs don't say whether app containers stay. Removing Zeabur keeps your services, the ingress controller and cert-manager, but removes member roles. Before you uninstall either, decide who takes over routing, certificate renewal and backups.",
        ],
      },
      soon: [
        "Smaller machines: the team install runs on 2 vCPU and 2 GiB of memory.",
        "Zeatend: paste one line into your hosting provider's web terminal, and a terminal UI turns the Linux server into a K3s, RKE2 or KubeSolo cluster.",
        "`zeaburctl install`: one command to add Zeabur to an existing cluster, reusing components it already has.",
      ],
      moving: {
        title: "Moving from Dokploy",
        body: "Zeabur imports Docker Compose files but only creates services that have an `image:`. Deploy `build:`-only services from Git instead. During import you can swap databases for operator-managed ones, and connection strings Zeabur recognises in other services are rewritten. The import doesn't move data: databases and volumes start empty, so migrate the data before you switch traffic. Both installers need ports 80 and 443 free, so put Zeabur on another server while you move, then switch DNS.",
        link: {
          text: "Import Docker Compose",
          url: "https://oss.zeabur.com/docs/zeabur/deploy/compose/",
        },
        back: "Going the other way, services deployed with Zeabur are already Kubernetes objects and keep running in the cluster when Zeabur is removed. Moving them back to a Docker host means moving their settings and data yourself.",
      },
      method:
        "The facts come from both projects' official docs, pricing pages, GitHub repositories and licence files, read on 2026-11-12. The table quotes those sources and adds no benchmarks of its own.",
      trademark:
        "Dokploy is a trademark of its owner. This page uses the name only to refer to that product and isn't affiliated with or endorsed by Dokploy.",
    },
  },
}
