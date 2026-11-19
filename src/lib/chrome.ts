// The words around every page: header, footer, the product list. Product pages and the landing
// have their own copy in src/landing/.
import type { ProductId } from "./products.ts"
import type { SiteLocale } from "./urls.ts"

type Chrome = {
  lang: string
  nav: {
    products: string
    docs: string
    blog: string
    language: string
    theme: string
    github: string
    menu: string
    home: string
    /** The mark beside the Zeabur logo. */
    openSource: string
    product: string
    useCases: string
    security: string
    start: string
    /** Beside work that is not released yet. */
    soon: string
    stars: (count: string) => string
  }
  groups: { manage: string; install: string; components: string; allInstalls: string }
  /** Members without a product page of their own yet. */
  members: Record<"desktop" | "zeatend", string>
  useCases: Record<"team" | "machine", { name: string; line: string }>
  /** `short` fits the docs sidebar's product menu in two lines. */
  products: Record<ProductId, { line: string; short: string }>
  footer: { about: string; license: string; products: string; resources: string; source: string }
}

const zhTW: Chrome = {
  lang: "繁體中文",
  nav: {
    products: "專案",
    docs: "文件",
    blog: "部落格",
    language: "語言",
    theme: "切換亮色或暗色",
    github: "GitHub",
    menu: "選單",
    home: "首頁",
    openSource: "開源",
    product: "產品",
    useCases: "使用情境",
    security: "安全與信任",
    start: "開始使用",
    soon: "敬請期待",
    stars: (count) => `GitHub 上有 ${count} 個星號`,
  },
  groups: { manage: "管理", install: "安裝", components: "元件", allInstalls: "所有安裝方式" },
  members: {
    desktop: "在自己的電腦開啟 Zeabur",
    zeatend: "把一台 Linux 伺服器變成 Kubernetes 叢集",
  },
  useCases: {
    team: { name: "團隊的叢集", line: "已經有 Kubernetes，成員各用自己的帳號和權限" },
    machine: { name: "一台機器", line: "從一台 Linux 伺服器裝好整套" },
  },
  products: {
    zeabur: {
      line: "在自己的叢集部署和管理服務的網頁介面",
      short: "部署和管理服務的網頁介面",
    },
    identity: {
      line: "用通行密鑰登入 kubectl，權杖幾分鐘就到期",
      short: "用通行密鑰登入 kubectl",
    },
    builder: {
      line: "推送 commit，拿到映像檔 digest",
      short: "從 commit 建置映像檔",
    },
    catalog: {
      line: "CI 測試過的叢集元件和應用程式範本",
      short: "測試過的元件和範本",
    },
  },
  footer: {
    about: "Zeabur 的開源專案：在自己的 Kubernetes 上部署、登入、建置和安裝元件。",
    license: "原始碼採 Apache-2.0 授權",
    products: "專案",
    resources: "資源",
    source: "原始碼",
  },
}

const zhCN: Chrome = {
  lang: "简体中文",
  nav: {
    products: "项目",
    docs: "文档",
    blog: "博客",
    language: "语言",
    theme: "切换浅色或深色",
    github: "GitHub",
    menu: "菜单",
    home: "首页",
    openSource: "开源",
    product: "产品",
    useCases: "使用场景",
    security: "安全与信任",
    start: "开始使用",
    soon: "敬请期待",
    stars: (count) => `GitHub 上有 ${count} 个星标`,
  },
  groups: { manage: "管理", install: "安装", components: "组件", allInstalls: "所有安装方式" },
  members: {
    desktop: "在自己的电脑上打开 Zeabur",
    zeatend: "把一台 Linux 服务器变成 Kubernetes 集群",
  },
  useCases: {
    team: { name: "团队的集群", line: "已经有 Kubernetes，成员各用自己的账号和权限" },
    machine: { name: "一台机器", line: "从一台 Linux 服务器装好整套" },
  },
  products: {
    zeabur: {
      line: "在自己的集群上部署和管理服务的 Web 界面",
      short: "部署和管理服务的 Web 界面",
    },
    identity: {
      line: "用通行密钥登录 kubectl，令牌几分钟就过期",
      short: "用通行密钥登录 kubectl",
    },
    builder: {
      line: "推送 commit，拿到镜像 digest",
      short: "从 commit 构建镜像",
    },
    catalog: {
      line: "经过 CI 测试的集群组件和应用模板",
      short: "测试过的组件和模板",
    },
  },
  footer: {
    about: "Zeabur 的开源项目：在自己的 Kubernetes 上部署、登录、构建和安装组件。",
    license: "源代码采用 Apache-2.0 许可证",
    products: "项目",
    resources: "资源",
    source: "源代码",
  },
}

const en: Chrome = {
  lang: "English",
  nav: {
    products: "Projects",
    docs: "Docs",
    blog: "Blog",
    language: "Language",
    theme: "Switch between light and dark",
    github: "GitHub",
    menu: "Menu",
    home: "Home",
    openSource: "Open Source",
    product: "Product",
    useCases: "Use cases",
    security: "Security and trust",
    start: "Get started",
    soon: "Stay tuned",
    stars: (count) => `${count} stars on GitHub`,
  },
  groups: {
    manage: "Manage",
    install: "Install",
    components: "Components",
    allInstalls: "All ways to install",
  },
  members: {
    desktop: "Zeabur on your own computer",
    zeatend: "Turn one Linux server into a Kubernetes cluster",
  },
  useCases: {
    team: {
      name: "A team's cluster",
      line: "You run Kubernetes; each member uses their own account and rights",
    },
    machine: { name: "One machine", line: "Set up everything on one Linux server" },
  },
  products: {
    zeabur: {
      line: "A web interface to deploy and run services on your cluster",
      short: "Deploy and run services",
    },
    identity: {
      line: "kubectl signs in with a passkey, tokens last minutes",
      short: "Passkey sign-in for kubectl",
    },
    builder: {
      line: "Push a commit, get an image digest",
      short: "Build images from commits",
    },
    catalog: {
      line: "Cluster components and app templates, tested in CI",
      short: "Tested components and templates",
    },
  },
  footer: {
    about:
      "Zeabur's open-source projects: deploy, sign in, build and install components on your own Kubernetes.",
    license: "Source under Apache-2.0",
    products: "Projects",
    resources: "Resources",
    source: "Source",
  },
}

export const chrome: Record<SiteLocale, Chrome> = { en, "zh-TW": zhTW, "zh-CN": zhCN }
