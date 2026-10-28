// The words around every page: header, footer, the product list. Product pages and the landing
// have their own copy in src/landing/.
import type { SiteLocale } from "./urls.ts"
import { docsUrl, localePrefix } from "./urls.ts"

export const productIds = ["zeabur", "identity", "builder", "catalog"] as const
export type ProductId = (typeof productIds)[number]

/** One Phosphor icon per product, the same in the header, the docs and the product pages. */
export const productIcon: Record<ProductId, string> = {
  zeabur: "squares-four",
  identity: "fingerprint",
  builder: "stack",
  catalog: "check-square-offset",
}

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
  }
  /** `short` fits the docs sidebar's product menu in two lines. */
  products: Record<ProductId, { name: string; line: string; short: string }>
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
  },
  products: {
    zeabur: {
      name: "Zeabur",
      line: "在自己的叢集部署和管理服務的網頁介面",
      short: "部署和管理服務的網頁介面",
    },
    identity: {
      name: "Zeabur Identity",
      line: "用通行密鑰登入 kubectl，權杖幾分鐘就到期",
      short: "用通行密鑰登入 kubectl",
    },
    builder: {
      name: "Zeabur Builder",
      line: "推送 commit，拿到映像檔 digest",
      short: "從 commit 建置映像檔",
    },
    catalog: {
      name: "Zeabur Catalog",
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
  },
  products: {
    zeabur: {
      name: "Zeabur",
      line: "在自己的集群上部署和管理服务的 Web 界面",
      short: "部署和管理服务的 Web 界面",
    },
    identity: {
      name: "Zeabur Identity",
      line: "用通行密钥登录 kubectl，令牌几分钟就过期",
      short: "用通行密钥登录 kubectl",
    },
    builder: {
      name: "Zeabur Builder",
      line: "推送 commit，拿到镜像 digest",
      short: "从 commit 构建镜像",
    },
    catalog: {
      name: "Zeabur Catalog",
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
  },
  products: {
    zeabur: {
      name: "Zeabur",
      line: "A web interface to deploy and run services on your cluster",
      short: "Deploy and run services",
    },
    identity: {
      name: "Zeabur Identity",
      line: "kubectl signs in with a passkey, tokens last minutes",
      short: "Passkey sign-in for kubectl",
    },
    builder: {
      name: "Zeabur Builder",
      line: "Push a commit, get an image digest",
      short: "Build images from commits",
    },
    catalog: {
      name: "Zeabur Catalog",
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

export const homeUrl = (locale: string) => localePrefix(locale) || "/"
export const productUrl = (locale: string, id: ProductId) => `${localePrefix(locale)}/${id}`
export const blogUrl = (locale: string) => `${localePrefix(locale)}/blog`
export const productDocsUrl = (locale: string, id: ProductId) => docsUrl(locale, id)

/** The same path in another locale: en has no prefix, the others are /zh-TW and /zh-CN. */
export function pathInLocale(pathname: string, locale: string) {
  const bare = pathname.replace(/^\/(zh-TW|zh-CN)(?=\/|$)/, "") || "/"
  const prefix = localePrefix(locale)
  return bare === "/" ? prefix || "/" : `${prefix}${bare}`.replace(/\/$/, "")
}
