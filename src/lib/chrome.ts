// The words around every page: header, footer, the product list. Product pages and the landing
// have their own copy in src/landing/.
import type { ProductId } from "./products.ts"
import type { SiteLocale } from "./urls.ts"

type Chrome = {
  lang: string
  nav: {
    products: string
    useCases: string
    docs: string
    trust: string
    blog: string
    start: string
    /** The accessible name of the GitHub link when the star count is known. */
    stars: (count: string) => string
    language: string
    theme: string
    github: string
    menu: string
    home: string
    /** The mark beside the Zeabur logo. */
    openSource: string
  }
  /** `short` fits the docs sidebar's product menu in two lines. */
  products: Record<ProductId, { line: string; short: string }>
  /** The three groups of the product menu. */
  groups: { manage: string; install: string; components: string }
  /** One line each for the products of the next release. The tag beside them is not translated. */
  upcoming: { desktop: string; zeatend: string }
  useCases: Record<"cluster" | "machine" | "team", { name: string; line: string }>
  footer: { about: string; license: string; resources: string }
}

const zhTW: Chrome = {
  lang: "繁體中文",
  nav: {
    products: "產品",
    useCases: "使用情境",
    docs: "文件",
    trust: "安全",
    blog: "部落格",
    start: "開始使用",
    stars: (count) => `GitHub，${count} 顆星`,
    language: "語言",
    theme: "切換亮色或暗色",
    github: "GitHub",
    menu: "選單",
    home: "首頁",
    openSource: "開源版",
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
    about: "在自己的 Kubernetes 上部署和管理服務。",
    license: "原始碼採 Apache-2.0 授權",
    resources: "資源",
  },
  groups: { manage: "管理", install: "安裝", components: "元件" },
  upcoming: {
    desktop: "電腦上的 App，讀你的 kubeconfig",
    zeatend: "獨立的 Kubernetes 安裝程式",
  },
  useCases: {
    cluster: { name: "已有 Kubernetes", line: "用自己的 kubeconfig 開啟" },
    machine: { name: "只有一台機器", line: "從一台 Linux 伺服器開始" },
    team: { name: "帶團隊維運", line: "每個人用自己的權限" },
  },
}

const zhCN: Chrome = {
  lang: "简体中文",
  nav: {
    products: "产品",
    useCases: "使用场景",
    docs: "文档",
    trust: "安全",
    blog: "博客",
    start: "开始使用",
    stars: (count) => `GitHub，${count} 颗星`,
    language: "语言",
    theme: "切换浅色或深色",
    github: "GitHub",
    menu: "菜单",
    home: "首页",
    openSource: "开源版",
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
    about: "在自己的 Kubernetes 上部署和管理服务。",
    license: "源代码采用 Apache-2.0 许可证",
    resources: "资源",
  },
  groups: { manage: "管理", install: "安装", components: "组件" },
  upcoming: {
    desktop: "电脑上的 App，读取你的 kubeconfig",
    zeatend: "独立的 Kubernetes 安装程序",
  },
  useCases: {
    cluster: { name: "已有 Kubernetes", line: "用自己的 kubeconfig 打开" },
    machine: { name: "只有一台机器", line: "从一台 Linux 服务器开始" },
    team: { name: "带团队运维", line: "每个人用自己的权限" },
  },
}

const en: Chrome = {
  lang: "English",
  nav: {
    products: "Product",
    useCases: "Use cases",
    docs: "Docs",
    trust: "Security",
    blog: "Blog",
    start: "Get started",
    stars: (count) => `GitHub, ${count} stars`,
    language: "Language",
    theme: "Switch between light and dark",
    github: "GitHub",
    menu: "Menu",
    home: "Home",
    openSource: "Open Source",
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
    about: "Deploy and run services on your own Kubernetes.",
    license: "Source under Apache-2.0",
    resources: "Resources",
  },
  groups: { manage: "Manage", install: "Install", components: "Components" },
  upcoming: {
    desktop: "A desktop app that reads your kubeconfig",
    zeatend: "A Kubernetes installer of its own",
  },
  useCases: {
    cluster: { name: "A cluster you already have", line: "Open it with your own kubeconfig" },
    machine: { name: "One machine", line: "Start from one Linux server" },
    team: { name: "Running it with a team", line: "Everyone works with their own rights" },
  },
}

export const chrome: Record<SiteLocale, Chrome> = { en, "zh-TW": zhTW, "zh-CN": zhCN }
