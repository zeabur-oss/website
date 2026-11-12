import type { HomeCopy } from "./index.ts"

export const zhCN: HomeCopy = {
  hero: {
    team: {
      eyebrow: "团队共用集群",
      title: "团队共用一个集群，权限归 RBAC 管",
      sub: "Zeabur 把集群整理成项目和服务。成员用通行密钥登录，每次读写都以本人身份发给 Kubernetes，能做什么由 RBAC 决定。改配置之前，Zeabur 会先列出这次要写进集群的内容。",
      primary: "安装到集群",
      secondary: "看看权限怎么分",
      soon: "Kubernetes 1.30 及以上的集群，运行 `zeaburctl install` 就能装好 Zeabur 和 Zeabur Identity。团队用的 K3s 集群加上 Zeabur，一台 2 vCPU、2 GiB 内存的机器就能装下。",
    },
    machine: {
      eyebrow: "只有一台机器",
      title: "一台机器，2 GiB 内存就能搭个集群",
      sub: "在云服务商的网页终端里粘贴一行命令，Zeatend 会带你在这台 Linux 服务器上装好 K3s、RKE2 或 KubeSolo 集群，最后给你一份 kubeconfig。Zeatend 不装 Zeabur，在自己电脑上用这份 kubeconfig 打开 Zeabur 就行。",
      primary: "安装到我的服务器",
      secondary: "查看机器要求",
      next: "以后要给团队用，在同一个 K3s 或 RKE2 集群上运行 `zeaburctl install`，装上 Zeabur 和 Zeabur Identity。",
    },
  },
  proof: [
    {
      title: "Apache-2.0 许可证",
      body: "Zeabur 以及 Identity、Builder、Catalog 都用这个许可证，源码在 GitHub。",
    },
    {
      title: "没有自己的数据库",
      body: "在 Zeabur 里看到的项目、服务和域名，都是直接从 Kubernetes 读出来的。",
    },
    {
      title: "权限由 Kubernetes RBAC 决定",
      body: "Zeabur 自己没有集群权限，每个请求都带着登录者的身份。",
    },
  ],
  walk: {
    title: "worker 一直在重启",
    intro: "shop 项目的 worker 一直在重启。从项目页到日志，在 Zeabur 里是这样一步步找到原因的。",
    steps: [
      {
        title: "找到出问题的服务",
        body: "项目页把有问题的服务排在最上面：worker 1/2 就绪，重启了 14 次，旁边就是日志按钮。不用先敲 `kubectl get pods` 挨个找。",
      },
      {
        title: "看懂发生了什么",
        body: "服务页写着：容器已经重启 14 次，集群每次重试前都等得更久。接着告诉你错误在上一次运行的日志里。原始的 `CrashLoopBackOff` 和判断依据收在下面，展开就能看到。",
      },
      {
        title: "看日志，或者把诊断发给同事",
        body: "点“打开日志”，就能看到上一次运行最后打印的错误。要找人帮忙，就点“复制诊断”发给同事，对方看到的是同一份说明。",
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
  },
  review: {
    title: "写入前先检查变更",
    body: "点“检查变更”会列出这次要写进集群的差异。点应用之前，集群里什么都不会变。",
    conflict:
      "检查完到应用之间，同事要是用 kubectl 改了同一个对象，Zeabur 会拒绝这次应用，让你重新检查，你不会把同事刚换上的镜像改回去。",
    gitops:
      "由 Helm、Argo CD 或 Flux 管理的服务会标出来，配置字段在 Zeabur 里改不了，要回到原来的 values 或 Git 仓库去改。重启只会加一个 annotation，所以照样能重启。",
  },
  local: {
    title: "在本地打开，集群里什么都不用装",
    body: "在自己电脑上运行 `zeaburctl ui`，就用手上的 kubeconfig 打开 Zeabur，只监听 127.0.0.1。能做什么，取决于这份 kubeconfig 的权限。按 Ctrl-C 就关掉了。",
  },
  lockin: {
    title: "卸载 Zeabur，服务照常运行",
    body: "服务本来就是 Kubernetes 对象。卸载 Zeabur 之后，Deployment、Service、Ingress、环境变量和卷都留在原来的 Namespace 里，服务继续运行。",
    gitops: "用 Helm、Argo CD 或 Flux 部署的服务，打开 Zeabur 就能看到，不用导入。",
    existing:
      "其他工具创建的 Namespace 也会列在项目页。点“使用这个 Namespace”只会加一个标签，里面的对象都不会改动。",
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
  soon: [
    "Zeatend：在终端里把 Linux 服务器装成 K3s、RKE2 或 KubeSolo 集群，之后的升级和维护也归它管。",
    "`zeaburctl install`：在 Kubernetes 1.30 及以上的集群装好 Zeabur 和 Zeabur Identity。Ingress、证书和指标组件只补装缺的。",
    "服务器连不上 GitHub 时，配好镜像源和代理就能装。",
    "Zeabur Desktop：Windows 和 macOS 上的桌面应用。读取 kubeconfig，列出可以搜索的 context，选一个就打开 Zeabur。",
  ],
  cta: {
    title: "先用手上的 kubeconfig 打开看看",
    body: "`zeaburctl ui` 在你的电脑上运行，集群里不用先装任何东西。",
    primary: "开始使用",
    secondary: "查看文档",
  },
  alt: {
    invite: "邀请成员窗口，选择了指定项目，blog 的角色为查看者，shop 的角色为开发者",
    namespaces: "“项目”页的“其他 Namespace”列出集群中尚未成为项目的 Namespace",
  },
}
