// Words on more than one page: the header, the footer, the product list and the product pages'
// section labels. CONTRIBUTING.md lists where every other text lives.
import type { ProductId } from "./products.ts"
import type { SiteLocale } from "./urls.ts"

type Chrome = {
  lang: string
  nav: {
    products: string
    docs: string
    /** The list of templates and components. */
    templates: string
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
  useCases: Record<"team" | "machine", { name: string; line: string }>
  /** `short` fits the docs sidebar's product menu in two lines. */
  products: Record<ProductId, { short: string }>
  footer: { about: string; license: string; products: string; resources: string; source: string }
  /** The labels of the product pages' sections. */
  sections: Record<"how" | "highlights" | "screens" | "features" | "details" | "start", string>
}

const zhTW: Chrome = {
  lang: "繁體中文",
  nav: {
    products: "專案",
    docs: "文件",
    templates: "範本",
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
  useCases: {
    team: { name: "團隊的叢集", line: "已經有 Kubernetes，成員各用自己的帳號和權限" },
    machine: { name: "一台機器", line: "從一台 Linux 伺服器裝好整套" },
  },
  products: {
    zeabur: {
      short: "部署和管理服務的網頁介面",
    },
    identity: {
      short: "用通行密鑰登入 kubectl",
    },
    builder: {
      short: "從 commit 建置映像檔",
    },
    catalog: {
      short: "測試過的元件和範本",
    },
    zeatend: {
      short: "把 Linux 伺服器裝成叢集",
    },
  },
  footer: {
    about: "Zeabur 的開源專案：在自己的 Kubernetes 上部署、登入、建置和安裝元件。",
    license: "原始碼採 Apache-2.0 授權",
    products: "專案",
    resources: "資源",
    source: "原始碼",
  },
  sections: {
    how: "運作方式",
    highlights: "重點",
    screens: "畫面",
    features: "功能",
    details: "範圍",
    start: "開始",
  },
}

const zhCN: Chrome = {
  lang: "简体中文",
  nav: {
    products: "项目",
    docs: "文档",
    templates: "模板",
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
  useCases: {
    team: { name: "团队的集群", line: "已经有 Kubernetes，成员各用自己的账号和权限" },
    machine: { name: "一台机器", line: "从一台 Linux 服务器装好整套" },
  },
  products: {
    zeabur: {
      short: "部署和管理服务的 Web 界面",
    },
    identity: {
      short: "用通行密钥登录 kubectl",
    },
    builder: {
      short: "从 commit 构建镜像",
    },
    catalog: {
      short: "测试过的组件和模板",
    },
    zeatend: {
      short: "把 Linux 服务器装成集群",
    },
  },
  footer: {
    about: "Zeabur 的开源项目：在自己的 Kubernetes 上部署、登录、构建和安装组件。",
    license: "源代码采用 Apache-2.0 许可证",
    products: "项目",
    resources: "资源",
    source: "源代码",
  },
  sections: {
    how: "运作方式",
    highlights: "要点",
    screens: "画面",
    features: "功能",
    details: "范围",
    start: "开始",
  },
}

const en: Chrome = {
  lang: "English",
  nav: {
    products: "Projects",
    docs: "Docs",
    templates: "Templates",
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
  useCases: {
    team: {
      name: "A team's cluster",
      line: "You run Kubernetes; each member uses their own account and rights",
    },
    machine: { name: "One machine", line: "Set up everything on one Linux server" },
  },
  products: {
    zeabur: {
      short: "Deploy and run services",
    },
    identity: {
      short: "Passkey sign-in for kubectl",
    },
    builder: {
      short: "Build images from commits",
    },
    catalog: {
      short: "Tested components and templates",
    },
    zeatend: {
      short: "Turn a Linux server into a cluster",
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
  sections: {
    how: "How it works",
    highlights: "Highlights",
    screens: "Screens",
    features: "Features",
    details: "Scope",
    start: "Get started",
  },
}

export const chrome: Record<SiteLocale, Chrome> = { en, "zh-TW": zhTW, "zh-CN": zhCN }
