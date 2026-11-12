import type { HomeCopy } from "./index.ts"

export const zhCN: HomeCopy = {
  home: {
    hero: {
      title: "开源的 Kubernetes 部署界面，服务都留在你的集群里",
      sub: "Zeabur 是开源的部署界面。从 Git、镜像或 Docker Compose 部署，改配置前先检查这次的变更。服务本来就是 Kubernetes 对象，哪天不用 Zeabur 也照常运行。",
      primary: "开始使用",
      secondary: "去 GitHub 看源码",
      note: "需要一个 Kubernetes 集群，或者一台 Linux 服务器。",
    },
    more: {
      team: "产品团队怎么用",
      provider: "服务商怎么用",
      homelab: "Homelab 怎么用",
    },
    permTitle: "每个人能做什么，交给 Kubernetes RBAC",
    openTitle: "用手上的 kubeconfig 就能打开",
    cta: {
      title: "从手上有的开始",
      body: "已经有集群，可以用 Helm 装进去，或者在本地运行 `zeaburctl ui` 打开。文档从安装一直写到第一个服务上线。",
    },
  },
  hero: {
    switch: {
      label: "适合谁",
      team: "产品团队",
      provider: "服务商",
      homelab: "Homelab",
    },
    team: {
      title: "在现有的 Kubernetes 上，像用 PaaS 一样部署",
      sub: "从 Git、镜像或 Docker Compose 部署，域名、HTTPS、环境变量和数据库都在一个地方配。Zeabur 直接读写你现有的集群，用 Helm、Argo CD 或 Flux 部署的服务打开就能看到。服务出问题时，页面会写明原因和下一步，开发自己就能查。",
      primary: "安装到集群",
      secondary: "看看怎么部署",
      note: "安装需要集群管理员权限。想先看看，在自己电脑上运行 `zeaburctl ui` 就能打开。",
      alt: "shop 项目页，列出 web、worker 和数据库的状态，worker 排在“需要处理”的第一项。",
      soon: "Kubernetes 1.30 及以上的集群，运行 `zeaburctl install` 就能装好 Zeabur 和 Zeabur Identity。集群里已有的 Ingress、证书和指标组件会直接沿用。",
      meta: "产品团队：在现有的 Kubernetes 上部署｜Zeabur",
    },
    provider: {
      title: "集群你来搭，部署让客户自己来",
      sub: "用 Zeatend 在客户的服务器上装好 K3s 或 RKE2，以后的升级也交给它。再装上 Zeabur，邀请客户的成员，按项目给开发者或查看者权限。拿到开发者权限的人，部署、看日志、重启都能在 Zeabur GUI 里自己来。",
      primary: "看看 Zeatend 怎么搭集群",
      secondary: "看看权限怎么分",
      note: "K3s 集群加上 Zeabur，一台 2 vCPU、2 GiB 内存的机器就能装下。",
      alt: "Zeatend 的终端界面，正在把一台 Linux 服务器装成 K3s 集群。",
      meta: "服务商：给客户搭集群，部署交给客户｜Zeabur",
    },
    homelab: {
      title: "免费开源，跟你原来的 Helm、Argo CD 一起用",
      sub: "Zeabur 采用 Apache-2.0 许可证。用 Helm、Argo CD 或 Flux 部署的服务会直接列出来并做标记，字段在 Zeabur 里改不了，配置照样用原来的工具管理。想先看看，在自己电脑上运行 `zeaburctl ui`，集群里什么都不用装。",
      primary: "在本地打开",
      secondary: "去 GitHub 看源码",
      note: "用 KubeSolo 的个人安装没有成员和角色，也不能用 Zeabur Identity 登录。",
      alt: "项目页的其他 Namespace，Helm 或 Argo CD 管理的服务带有标记。",
      meta: "Homelab：免费开源，跟 Helm、Argo CD 一起用｜Zeabur",
    },
  },
  proof: {
    license: {
      title: "Apache-2.0 许可证",
      body: "Zeabur 以及 Identity、Builder、Catalog 都用这个许可证，源码在 GitHub。",
    },
    state: {
      title: "没有自己的数据库",
      body: "在 Zeabur 里看到的项目、服务和域名，都是直接从 Kubernetes 读出来的。",
    },
    rbac: {
      title: "权限由 Kubernetes RBAC 决定",
      body: "Zeabur 自己没有集群权限，每个请求都带着登录者的身份。",
    },
    review: {
      title: "写入前先检查变更",
      body: "点“检查变更”会先列出要写进集群的差异。",
    },
    roles: {
      title: "按项目分权限",
      body: "成员在每个项目里的角色是开发者或查看者，存成 Kubernetes 的 RoleBinding。",
    },
    lockin: {
      title: "卸载后服务照常运行",
      body: "卸载 Zeabur 后，服务的 Kubernetes 对象都留在原来的 Namespace 里。",
    },
    gitops: {
      title: "GitOps 的配置留在 Git",
      body: "Helm、Argo CD 和 Flux 管理的服务会标出来，字段在 Zeabur 里改不了。",
    },
    local: {
      title: "在本地打开",
      body: "`zeaburctl ui` 只在你的电脑上运行，只监听 127.0.0.1。",
    },
  },
  walk: {
    title: "worker 一直在重启",
    intro: "shop 项目的 worker 一直在重启。从项目页到日志，在 Zeabur 里是这样一步步找到原因的。",
    steps: [
      {
        title: "找到出问题的服务",
        body: "项目页把有问题的服务排在最上面：worker 1/2 就绪，重启了 14 次，旁边就是日志按钮。不用先敲 `kubectl get pods` 挨个找。",
        alt: "shop 项目页。worker 反复崩溃，排在“需要处理”的第一项。",
      },
      {
        title: "看懂发生了什么",
        body: "服务页写着：容器已经重启 14 次，集群每次重试前都等得更久。接着告诉你错误在上一次运行的日志里。原始的 `CrashLoopBackOff` 和判断依据收在下面，展开就能看到。",
        alt: "worker 的服务页：容器已经重启 14 次，附上处理方法和“打开日志”按钮。",
      },
      {
        title: "看日志，或者把诊断发给同事",
        body: "点“打开日志”，就能看到上一次运行最后打印的错误。要找人帮忙，就点“复制诊断”发给同事，对方看到的是同一份说明。",
        alt: "worker 上一次运行的日志，最后一行是错误信息。",
      },
    ],
  },
  perm: {
    title: "在 shop 里，erin 能部署，alice 只能看",
    body: "邀请成员时，每个项目选开发者或查看者。Zeabur 会写入 Kubernetes 的 RoleBinding，用 kubectl 也能查到。",
    erin: "erin 是 shop 的开发者，可以部署、改环境变量、重启、看日志，也能开终端。",
    alice: "alice 是 shop 的查看者，能看状态和事件；打开日志会提示权限不足，也改不了任何东西。",
    invite: "成员用 Zeabur Identity 的通行密钥登录。邀请链接 7 天内有效，只能用一次。",
    scope: "成员和角色只有团队安装才有。",
    deniedAlt: "alice 打开 worker 的日志，页面提示权限不足。",
  },
  review: {
    title: "写入前先检查变更",
    body: "点“检查变更”会列出这次要写进集群的差异。点应用之前，集群里什么都不会变。",
    conflict:
      "检查完到应用之间，同事要是用 kubectl 改了同一个对象，Zeabur 会拒绝这次应用，让你重新检查，你不会把同事刚换上的镜像改回去。",
    gitops:
      "由 Helm、Argo CD 或 Flux 管理的服务会标出来，配置字段在 Zeabur 里改不了，要回到原来的 values 或 Git 仓库去改。重启只会加一个 annotation，所以照样能重启。",
    alt: "web 的检查变更页面。YAML 差异：NODE_ENV 从 production 改成 staging。",
  },
  local: {
    title: "在本地打开，集群里什么都不用装",
    body: "在自己电脑上运行 `zeaburctl ui`，就用手上的 kubeconfig 打开 Zeabur GUI，只监听 127.0.0.1。能做什么，看这份 kubeconfig 的身份有哪些权限。按 Ctrl-C 就关掉了。",
    chip: "Zeabur GUI",
    alt: "示意图：笔记本上的 Zeabur GUI 用 kubeconfig 连到集群的 Kubernetes API，集群里没有装任何东西。",
  },
  lockin: {
    title: "卸载 Zeabur，服务照常运行",
    body: "服务本来就是 Kubernetes 对象。卸载 Zeabur 之后，Deployment、Service、Ingress、环境变量和卷都留在原来的 Namespace 里，服务继续运行。",
    gitops: "用 Helm、Argo CD 或 Flux 部署的服务，打开 Zeabur 就能看到，不用导入。",
    existing:
      "其他工具创建的 Namespace 也会列在项目页。点“使用这个 Namespace”只会加一个标签，里面的对象都不会改动。",
    alt: "示意图：卸载 Zeabur 之后，Deployment、Service、Ingress 和卷留在原来的 Namespace 里，服务照常运行。",
    uninstall: {
      title: "卸载步骤",
      after: "Kubernetes、集群组件和项目的 Namespace 都会保留。",
      link: "卸载 Zeabur 的步骤",
    },
  },
  license: {
    title: "Apache-2.0 许可证",
    body: "Zeabur、Zeabur Identity、Zeabur Builder 和 Zeabur Catalog 都采用 Apache-2.0 许可证，源码都在 GitHub 上。",
  },
  safety: {
    title: "安全",
    hardening:
      "安装程序创建的 K3s 集群，按 K3s 加固指南配置。哪些设置还要管理员自己处理，指南里也列了。",
    hardeningLink: "K3s 加固指南",
    gitops: "Helm、Argo CD 和 Flux 管理的服务会标出来，配置字段不能在 Zeabur 里修改。",
  },
  zeatend: {
    title: "从一行命令开始，把服务器装成集群",
    body: "在云服务商的网页终端里粘贴一行命令，Zeatend 的终端界面会带你把 Linux 服务器装成 K3s、RKE2 或 KubeSolo 集群，顺便加固主机配置，最后给你一份 kubeconfig。以后的集群升级也由 Zeatend 负责。Zeatend 不装 Zeabur，拿这份 kubeconfig 在自己电脑上打开 Zeabur GUI 就行。",
    path: [
      "在网页终端粘贴一行",
      "Zeatend 终端界面",
      "K3s、RKE2 或 KubeSolo",
      "kubeconfig",
      "打开 Zeabur GUI",
    ],
    mirror: "服务器连不上 GitHub 时，配好镜像源和代理，照着指南就能装。",
    alt: "五站路线：在网页终端粘贴一行、Zeatend 终端界面、K3s/RKE2/KubeSolo 集群、kubeconfig、打开 Zeabur GUI。",
  },
  soon: [
    "`zeaburctl install`：在 Kubernetes 1.30 及以上的集群装好 Zeabur 和 Zeabur Identity。Ingress、证书和指标组件只补装缺的。",
    "Zeabur Desktop：Windows 和 macOS 上的桌面应用。读取 kubeconfig，列出可以搜索的 context，选一个就打开 Zeabur。",
  ],
  dokploy: {
    title: "用过 Dokploy？先看这几点",
    intro:
      "Dokploy 在 Docker 上部署，Zeabur 在 Kubernetes 上部署。部署步骤很像，底层跑的东西不一样，下面几点会跟着变。",
    points: [
      {
        title: "部署步骤",
        body: "一样从 Git、镜像或 Docker Compose 部署，域名和 HTTPS 也在服务的设置里。在 Zeabur 点应用之前，页面会先列出这次要写进集群的变更。",
      },
      {
        title: "只有一台服务器",
        body: "一台服务器也能装：安装程序会在上面装好 K3s 或 RKE2。只给自己用的话，个人安装用的是 KubeSolo（单节点 Kubernetes），没有成员和角色，拿到 kubeconfig 的人能控制整个集群。",
      },
      {
        title: "小机器的内存",
        body: "Kubernetes 本身就要占一部分内存。Dokploy 文档写的是至少 2 GB；Zeabur 现在的团队安装要 4 GiB，个人安装 1.5 GiB。这些都是文档写的最低要求，不是实测数据。",
        soon: "团队安装在 2 vCPU、2 GiB 内存的机器上就能运行。",
      },
      {
        title: "模板",
        body: "Dokploy 的 README 写有 600 多个模板，Zeabur Catalog 的模板少得多。迁移之前，先确认你要的应用在不在目录里；不在的话，用镜像或 Compose 部署。",
      },
      {
        title: "换到 Kubernetes 之后",
        body: "服务会变成 Kubernetes 的 Deployment、Service 和 Ingress，用 kubectl 也能看到。多台机器由 Kubernetes 调度，不用 Docker Swarm。导入 Compose 时只创建有 `image:` 的服务，只有 `build:` 的服务改成从 Git 部署。",
      },
      {
        title: "并用和离开",
        body: "两边的安装都要求 80 和 443 端口空着，所以要并用的话，分开装在不同的服务器上，迁完再切换 DNS。哪天不用 Zeabur，卸载后服务的 Kubernetes 对象都还在，照常运行。",
      },
      {
        title: "许可证",
        body: "Zeabur、Zeabur Identity、Zeabur Builder 和 Zeabur Catalog 都采用 Apache-2.0 许可证，没有付费版。Dokploy 大部分代码是 Apache-2.0，`/proprietary` 目录用的是 source-available 许可证。",
      },
    ],
    link: "查看 Zeabur 和 Dokploy 的逐项对比",
  },
  cta: {
    primary: "开始使用",
    secondary: "查看文档",
    providerPrimary: "关注 Zeatend",
    team: {
      title: "先用手上的 kubeconfig 打开看看",
      body: "`zeaburctl ui` 在你的电脑上运行，集群里不用先装任何东西。",
    },
    provider: {
      title: "在 GitHub 关注 Zeatend",
      body: "Zeatend 还在早期开发阶段。想知道什么时候能用，去仓库看进度。",
    },
    homelab: {
      title: "源码都在 GitHub 上",
      body: "Zeabur、Zeabur Identity、Zeabur Builder 和 Zeabur Catalog 都采用 Apache-2.0 许可证，欢迎提 issue 和 PR。",
    },
  },
}
