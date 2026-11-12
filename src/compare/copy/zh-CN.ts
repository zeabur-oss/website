import type { CompareCopy } from "./index.ts"

export const zhCN: CompareCopy = {
  criteria: {
    runsOn: "运行在哪里",
    machine: "机器要求",
    license: "许可证和费用",
    deploy: "怎么部署",
    members: "成员和权限",
    servers: "多台机器",
    databases: "数据库和备份",
    existing: "现有工作负载",
    interface: "界面",
    remove: "卸载之后",
  },
  criterion: "项目",
  checked: "检查日期",
  lastChecked: "最后检查",
  notDocumented: "“文档未提及”表示官方文档没写到，不代表没有这个功能。",
  before: {
    title: "选定前再确认",
    body: "升级和回滚的方式、备份怎么还原、路由和 HTTPS 证书由谁管理、存储坏了怎么恢复、监控和求助渠道。上表有两边官方文档的链接，没写清楚的再去各自的社区问。",
  },
  soon: {
    title: "Zeabur 尚未发布的功能（Coming soon）",
    intro: "还没发布，表格不算在内：",
  },
  corrections: {
    title: "数据有误",
    body: "两边的功能都会变。发现哪一格过时或写错了，到 GitHub 反馈，附上官方文档的链接。确认后会更新表格和最后检查日期。",
    link: "反馈对比页错误",
  },
  hub: {
    title: "Zeabur 与同类自建工具对比",
    description:
      "Zeabur 开源版和 Dokploy 等自建部署工具的对比。每页同样十个项目，每一行附官方来源和检查日期，也写明对方更合适的情况。",
    heading: "Zeabur 与同类自建工具对比",
    intro:
      "Zeabur 开源版是跑在 Kubernetes 上的开源部署界面，适合已经有集群、或者打算用 Kubernetes 的团队。只有 Docker 主机、或者只想查看集群的话，别的工具可能更合适，下表按用途列出。",
    disclosure: "这些页面由 Zeabur 开源版的维护者撰写，Zeabur 是对比的其中一方。",
    uses: {
      title: "按用途找工具",
      need: "你的情况",
      tools: "可以先看",
      rows: [
        {
          need: "只有 Docker 主机，不想管 Kubernetes",
          tools: "Dokploy, Coolify, CapRover, Dokku",
        },
        {
          need: "已经有 Kubernetes，想让开发自己部署",
          tools: "Zeabur, Kubero",
        },
        {
          need: "只想查看和修改集群里的对象",
          tools: "Headlamp, k9s, Freelens",
        },
        {
          need: "要在一个地方管很多集群",
          tools: "Rancher",
        },
      ],
    },
    pages: "逐一对比",
    method: {
      title: "怎么查的",
      body: "每一格只写官方文档、价格页、许可证文件或 GitHub releases 写明的内容，附上那句话所在的页面和检查日期。不放跑分、内存实测或用户数。",
    },
  },
  pages: {
    dokploy: {
      title: "Zeabur 和 Dokploy 对比：多台服务器用 Docker Swarm 还是 Kubernetes",
      description:
        "Dokploy 用 Docker 和 Traefik 部署，文档写至少 2 GB 内存；Zeabur 开源版跑在 Kubernetes 上，权限交给 RBAC。用十个项目对比，每一行附官方来源和检查日期。",
      heading: "Zeabur 和 Dokploy 对比",
      line: "Dokploy 用 Docker 加 Traefik，可以管远程服务器或 Swarm 集群；Zeabur 用 Kubernetes。",
      link: "Zeabur 和 Dokploy 对比",
      checked: "2026-11-12",
      versions: "Zeabur v0.2.0、Dokploy v0.31.1",
      summary:
        "两个都是可以自建的开源部署平台。主要区别在底层跑什么：Dokploy 用 Docker 和 Traefik，可以用 SSH 管远程服务器，或组成 Docker Swarm；Zeabur 开源版管理 Kubernetes 集群，集群里原有的东西它也能看到。",
      disclosure:
        "本页由 Zeabur 开源版的维护者撰写，Zeabur 是对比的其中一方。表格每一行都附有官方来源和检查日期，发现错误欢迎反馈。",
      shortAnswer: "先看结论",
      chooseThem: {
        title: "这些情况选 Dokploy",
        points: [
          "手上有一台或几台 Linux 服务器，想用 Docker 部署，不想管 Kubernetes。",
          "服务器只有 2 GB 内存，而且需要多人使用。Dokploy 文档写的是至少 2 GB 内存、30 GB 磁盘。Zeabur 的团队安装目前要 4 GiB；个人安装 1.5 GiB 就能装，但没有成员和权限。",
          "想直接用现成的应用。Dokploy 的 README 写有 600 多个模板，Zeabur 目录有 33 个。先确认目录里有没有你要的应用。",
          "Docker Compose 文件里用 `build:` 从源码构建，或者要用 Swarm 的 Stack。Dokploy 可以直接部署 Compose 和 Stack；Zeabur 导入 Compose 时只创建有 `image:` 的服务。",
          "想挑构建方式：Dokploy 有 Nixpacks、Railpack、Dockerfile、Heroku buildpacks、Paketo 和静态站点，也能把构建放到另一台服务器上。Zeabur 用 Railpack 或 Dockerfile 构建。",
          "需要 SAML 或 OIDC 单点登录、SCIM 或审计日志，并且愿意付费。Dokploy 把这些放在付费版本里。",
        ],
      },
      chooseZeabur: {
        title: "这些情况选 Zeabur",
        points: [
          "团队已经在用 Kubernetes，或者想在一台机器上就用标准的 Kubernetes 对象。以后不用 Zeabur，这些对象也还在。",
          "有服务是用 Helm、Argo CD 或 Flux 部署的。Zeabur 会列出这些服务并做标记，只允许重启，配置要回到原来的 values 或 Git 仓库去改。",
          "希望项目权限由 Kubernetes RBAC 管。成员在每个项目里是开发者或查看者，Zeabur 以登录者的身份访问集群。",
          "要跨多台机器，让 Kubernetes 决定服务调度到哪一台。RKE2 支持三台控制平面节点，可以容忍其中一台故障；应用能不能持续服务，还要看副本数和存储。",
          "希望每个组件都用 OSI 认可的许可证。Zeabur、Identity、Builder 和 Catalog 都是 Apache-2.0。",
          "已经有集群，想先看看再决定：在自己电脑上运行 `zeaburctl ui`，用手上的 kubeconfig 打开，集群里不用装任何东西。",
        ],
      },
      table: "逐项对比",
      rows: {
        runsOn: {
          zeabur: {
            text: "Kubernetes：安装程序装 K3s 或 RKE2，单机可以用 KubeSolo（单节点 Kubernetes）；也可以装进现有集群（Kubernetes 1.30 及以上）。",
            links: [
              {
                text: "安装",
                url: "https://oss.zeabur.com/zh-CN/docs/zeabur/get-started/quickstart/",
              },
            ],
          },
          them: {
            text: "Docker 加 Traefik。可以用 SSH 管远程服务器，或用 Docker Swarm 组成集群。Kubernetes：文档未提及。",
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
            text: "团队安装至少 4 GiB 内存；个人安装至少 1.5 GiB；装在服务器上时，80、443、6443、10250 端口要空着；用 `zeaburctl ui` 在自己电脑上打开时，集群里不用装东西。",
            links: [
              {
                text: "个人安装",
                url: "https://oss.zeabur.com/zh-CN/docs/zeabur/install/personal/",
              },
            ],
          },
          them: {
            text: "“at least 2GB of RAM and 30GB of disk space”，80、443、3000 端口要空着。",
            links: [
              {
                text: "安装",
                url: "https://docs.dokploy.com/docs/core/installation",
              },
            ],
          },
        },
        license: {
          zeabur: {
            text: "Apache-2.0，没有付费版。",
            links: [
              {
                text: "GitHub",
                url: "https://github.com/zeabur-oss/zeabur",
              },
            ],
          },
          them: {
            text: "Apache-2.0，但 `/proprietary` 目录用 Dokploy Source Available License（不是 OSI 许可证），生产环境使用需要另签商业协议。单点登录、SCIM、自定义角色和审计日志要付费；付费版本每台服务器每月 4.50 美元起。",
            links: [
              {
                text: "许可证文件",
                url: "https://raw.githubusercontent.com/Dokploy/dokploy/canary/LICENSE.MD",
              },
              {
                text: "价格",
                url: "https://dokploy.com/pricing",
              },
            ],
          },
        },
        deploy: {
          zeabur: {
            text: "Git（GitHub App 或任意 Git 地址，用 Railpack 或 Dockerfile 构建）、上传文件夹、容器镜像、Docker Compose（只创建有 `image:` 的服务）、目录模板、定时任务。",
            links: [
              {
                text: "从 Git 部署",
                url: "https://oss.zeabur.com/zh-CN/docs/zeabur/deploy/git/",
              },
            ],
          },
          them: {
            text: "Git（GitHub、GitLab、Bitbucket、Gitea），push 后由 webhook 自动部署；Docker Hub 镜像；Docker Compose 和 Stack。构建可选 Nixpacks（默认）、Railpack、Dockerfile、Heroku buildpacks、Paketo、静态站点；README 写着“+600 Templates”。",
            links: [
              {
                text: "构建方式",
                url: "https://docs.dokploy.com/docs/core/applications/build-type",
              },
            ],
          },
        },
        members: {
          zeabur: {
            text: "团队安装：成员用通行密钥登录，每个项目选开发者或查看者，写成 Kubernetes RoleBinding。个人安装没有成员，拿到 kubeconfig 就能控制整个集群。",
            links: [
              {
                text: "权限",
                url: "https://oss.zeabur.com/zh-CN/docs/zeabur/reference/permissions/",
              },
            ],
          },
          them: {
            text: "默认角色有 Owner、Admin、Member。自定义角色、单点登录（OIDC、SAML）、SCIM 和审计日志要付费；价格页列出双因素认证从每月 15 美元的版本起提供。",
            links: [
              {
                text: "价格",
                url: "https://dokploy.com/pricing",
              },
              {
                text: "付费功能",
                url: "https://docs.dokploy.com/docs/core/enterprise",
              },
            ],
          },
        },
        servers: {
          zeabur: {
            text: "由 Kubernetes 调度。安装程序创建的 K3s 只能加工作节点；RKE2 可以加工作节点和控制平面节点。个人安装只有这一台。",
            links: [
              {
                text: "节点",
                url: "https://oss.zeabur.com/zh-CN/docs/zeabur/cluster/nodes/",
              },
            ],
          },
          them: {
            text: "可以用 SSH 添加远程服务器，分为部署用和构建用，只跑部署的服务器大约占 250 MB 内存。也能用“Add Node”组成 Docker Swarm 集群，集群需要一个镜像仓库。",
            links: [
              {
                text: "远程服务器",
                url: "https://docs.dokploy.com/docs/core/remote-servers",
              },
              {
                text: "集群",
                url: "https://docs.dokploy.com/docs/core/cluster",
              },
            ],
          },
        },
        databases: {
          zeabur: {
            text: "PostgreSQL、MongoDB、MySQL、MariaDB、Dragonfly，由各自的 operator 管理，数据库备份到 S3。卷用 K8up，整个项目用 Velero。",
            links: [
              {
                text: "数据库",
                url: "https://oss.zeabur.com/zh-CN/docs/zeabur/deploy/databases/",
              },
            ],
          },
          them: {
            text: "Postgres、MySQL、MariaDB、MongoDB、Redis，可以自动备份到 S3。Dokploy 自己的 Postgres 和 `/etc/dokploy` 也能备份到 S3。",
            links: [
              {
                text: "备份",
                url: "https://docs.dokploy.com/docs/core/databases/backups",
              },
            ],
          },
        },
        existing: {
          zeabur: {
            text: "其他工具创建的 Namespace 会直接出现在项目页，不用导入。Helm、Argo CD、Flux 管理的服务只能重启。",
            links: [
              {
                text: "工作方式",
                url: "https://oss.zeabur.com/zh-CN/docs/zeabur/get-started/how-it-works/",
              },
            ],
          },
          them: {
            text: "Dokploy 管的是 Docker 主机，没有 Kubernetes 对象要接管。现有的 Docker Compose 文件和镜像可以直接部署。",
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
            text: "网页界面（装在集群里，或者用 `zeaburctl ui` 在本地打开）；命令行 `zeaburctl`，有 Linux 和 Apple 芯片 Mac 版，Windows 要用 WSL。",
            links: [
              {
                text: "zeaburctl",
                url: "https://oss.zeabur.com/zh-CN/docs/zeabur/reference/zeaburctl/",
              },
            ],
          },
          them: {
            text: "网页界面和 REST API（`/swagger` 有 Swagger UI，API 密钥放在 `x-api-key` 请求头里）。命令行工具：文档未提及。",
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
            text: "Deployment、Service、Ingress、环境变量和卷都留在原来的 Namespace 里，服务继续运行；Ingress 控制器和 cert-manager 这些组件也保留。",
            links: [
              {
                text: "卸载 Zeabur",
                url: "https://oss.zeabur.com/zh-CN/docs/zeabur/leave/uninstall/",
              },
            ],
          },
          them: {
            text: "删除 dokploy、dokploy-traefik、dokploy-postgres、dokploy-redis 这几个 Swarm 服务及其卷、网络，以及 `/etc/dokploy`。已部署的应用会怎样：文档未提及。",
            links: [
              {
                text: "卸载",
                url: "https://docs.dokploy.com/docs/core/uninstall",
              },
            ],
          },
        },
      },
      releases:
        "版本（2026-11-12）：Zeabur v0.2.0 于 2026-11-08 发布，还在 1.0 之前。Dokploy v0.31.1 于 2026-11-12 发布，上一版 v0.31.0 在 2026-11-05，同样在 1.0 之前。两边升级前都先看更新日志。",
      differ: {
        title: "区别在哪里",
        points: [
          "**Docker Swarm 还是 Kubernetes。** 其他区别大多由此而来。Dokploy 把容器直接跑在 Docker 上，一台小机器就够，Compose 文件和 Stack 也能直接用；需要多台时，可以用 SSH 添加远程服务器，或者用 Swarm 把服务器串起来。Zeabur 用的是 Kubernetes 对象，所以能和 Helm、Argo CD、kubectl 一起用；代价是内存，团队安装目前要 4 GiB。",
          "**权限放在哪里。** Dokploy 的角色存在 Dokploy 里，自定义角色和单点登录要付费。Zeabur 没有自己的权限数据，角色写成 Kubernetes 的 RoleBinding，用 kubectl 也能查到。",
          "**卸载之后。** Dokploy 的卸载步骤会一并删掉 dokploy-traefik 服务，域名转发和 HTTPS 证书要另外接手；文档没写应用的容器会不会保留。Zeabur 卸载后，服务、Ingress 控制器和 cert-manager 都还在，但成员角色会一起删除。动手前先确认路由、证书续期和备份由谁接手。",
        ],
      },
      soon: [
        "小机器：团队安装可以在 2 vCPU、2 GiB 内存的机器上运行。",
        "Zeatend：在云服务商的网页终端里粘贴一行命令，用终端界面把 Linux 服务器装成 K3s、RKE2 或 KubeSolo 集群。",
        "`zeaburctl install`：一行命令把 Zeabur 装进现有集群，已有的组件不重复安装。",
      ],
      moving: {
        title: "从 Dokploy 迁移过来",
        body: "Zeabur 可以导入 Docker Compose 文件，但只创建有 `image:` 的服务，只有 `build:` 的服务要改用“从 Git 部署”。导入时可以把数据库换成 operator 管理的服务，其他服务里能识别的连接字符串会一起改掉。导入不会迁移数据：数据库和卷会新建为空的，上线前要先把数据迁过去。两边的安装都要求 80 和 443 端口空着，迁移期间把 Zeabur 装在另一台服务器上，迁完再切换 DNS。",
        link: {
          text: "导入 Docker Compose 服务",
          url: "https://oss.zeabur.com/zh-CN/docs/zeabur/deploy/compose/",
        },
        back: "反过来，不用 Zeabur 时，服务本来就是 Kubernetes 对象，会留在集群里继续运行；要迁回 Docker 主机，配置和数据得自己迁。",
      },
      method:
        "表格内容来自两边的官方文档、价格页、GitHub 仓库和许可证文件，于 2026-11-12 读取。表格只引用这些来源，没有自行测量性能或内存。",
      trademark:
        "Dokploy 是其所有者的商标。本页只用名称指代该产品，与 Dokploy 没有合作或背书关系。",
    },
  },
}
