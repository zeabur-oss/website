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
  /** The product menu. The names are not translated. */
  menu: Record<"gui" | "desktop" | "zeatend", { name: string; line: string }>
  /** The use cases, one for each reader the home page speaks to. */
  useCases: Record<"team" | "provider" | "homelab", { name: string; line: string }>
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
  menu: {
    gui: { name: "Zeabur GUI", line: "在瀏覽器部署和管理服務" },
    desktop: {
      name: "Zeabur Desktop",
      line: "Windows 和 macOS 的桌面 App，選好 kubeconfig 裡的叢集就能打開 Zeabur GUI",
    },
    zeatend: { name: "Zeatend", line: "在終端機架設和升級 K3s、RKE2、KubeSolo 叢集" },
  },
  useCases: {
    team: { name: "產品團隊", line: "已經有叢集，想讓開發者自己部署" },
    provider: { name: "代管服務商", line: "替客戶架叢集，讓客戶自己部署" },
    homelab: { name: "Homelab", line: "家裡的叢集，跟原本的工具一起用" },
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
  menu: {
    gui: { name: "Zeabur GUI", line: "在浏览器里部署和管理服务" },
    desktop: {
      name: "Zeabur Desktop",
      line: "Windows 和 macOS 上的桌面应用，选好 kubeconfig 里的集群就能打开 Zeabur GUI",
    },
    zeatend: { name: "Zeatend", line: "在终端里搭建和升级 K3s、RKE2、KubeSolo 集群" },
  },
  useCases: {
    team: { name: "产品团队", line: "已经有集群，想让开发自己部署" },
    provider: { name: "服务商", line: "替客户搭集群，让客户自己部署" },
    homelab: { name: "Homelab", line: "家里的集群，跟原来的工具一起用" },
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
  menu: {
    gui: { name: "Zeabur GUI", line: "Deploy and manage services in the browser" },
    desktop: {
      name: "Zeabur Desktop",
      line: "A Windows and macOS app that opens any cluster in your kubeconfig",
    },
    zeatend: {
      name: "Zeatend",
      line: "Set up and upgrade K3s, RKE2 and KubeSolo clusters from a terminal",
    },
  },
  useCases: {
    team: {
      name: "Product teams",
      line: "You have a cluster and want developers to deploy on their own",
    },
    provider: {
      name: "Service providers",
      line: "You run clusters for clients and want them to deploy on their own",
    },
    homelab: {
      name: "Homelab",
      line: "Use Zeabur on your home cluster next to the tools you already run",
    },
  },
}

export const chrome: Record<SiteLocale, Chrome> = { en, "zh-TW": zhTW, "zh-CN": zhCN }
