// The catalog list (/catalog/browse) and the page of each template and component.
import type { SiteLocale } from "../lib/urls.ts"

type CatalogCopy = {
  title: string
  description: (templates: number, components: number) => string
  /** The link to the list from the Catalog page and the footer. */
  browse: string
  search: string
  placeholder: string
  kinds: { all: string; templates: string; components: string }
  /** `{count}` and `{total}` are filled in on the page as the list is filtered. */
  shownAll: string
  shownSome: string
  none: string
  back: string
  tested: (date: string) => string
  untested: string
  tests: {
    title: string
    body: string
    cols: [string, string, string, string, string]
  }
  facts: { version: string; license: string; homepage: string; source: string; capability: string }
  security: string
  template: {
    kind: string
    pageTitle: (name: string) => string
    deploy: string
    deployCli: string
    needs: { title: string; body: string }
    runs: string
    risks: { title: string; risk: string; mitigation: string }
  }
  component: {
    kind: string
    pageTitle: (name: string) => string
    install: string
    list: string
    defaults: { title: string; singleNode: string; multiNode: string }
    state: { recommended: string; optional: string }
    needs: string
    capability: (name: string) => string
    releases: string
    usedBy: string
  }
}

export const catalogCopy: Record<SiteLocale, CatalogCopy> = {
  en: {
    title: "Templates and components",
    description: (t, c) =>
      `${t} app templates and ${c} cluster components you can install with Zeabur on your own server. CI installs them on Kubernetes, and each one shows the day it last passed.`,
    browse: "Browse the catalog",
    search: "Search the catalog",
    placeholder: "n8n, PostgreSQL, backup…",
    kinds: { all: "All", templates: "App templates", components: "Cluster components" },
    shownAll: "{total} in all",
    shownSome: "{count} of {total}",
    none: "Nothing matches. Try a shorter word.",
    back: "All templates and components",
    tested: (date) => `Tested ${date}`,
    untested: "No CI run in this release",
    tests: {
      title: "Tested in CI",
      body: "CI installs these exact files on a new cluster, waits until they are ready, then records the idle memory.",
      cols: ["Distribution", "Platform", "Kubernetes", "Passed", "Idle memory"],
    },
    facts: {
      version: "Version",
      license: "Licence",
      homepage: "Homepage",
      source: "Source file",
      capability: "Provides",
    },
    security: "Security",
    template: {
      kind: "App template",
      pageTitle: (name) => `Deploy ${name} on your own server · Zeabur Catalog`,
      deploy: "Deploy with Zeabur",
      deployCli: "Deploy with the catalog command",
      needs: {
        title: "What the cluster needs",
        body: "Zeabur suggests the components a cluster is missing. Without Zeabur, install them first.",
      },
      runs: "What runs",
      risks: { title: "Known risks", risk: "Risk", mitigation: "How it is handled" },
    },
    component: {
      kind: "Cluster component",
      pageTitle: (name) => `${name} for your own Kubernetes cluster · Zeabur Catalog`,
      install: "Install with Zeabur",
      list: "Every component",
      defaults: {
        title: "Installed by default",
        singleNode: "Single node",
        multiNode: "Multi-node",
      },
      state: { recommended: "Recommended", optional: "Optional" },
      needs: "Needs",
      capability: (name) => `any ${name} component`,
      releases: "What it installs",
      usedBy: "Templates that need it",
    },
  },
  "zh-TW": {
    title: "範本和元件",
    description: (t, c) =>
      `${t} 個應用程式範本和 ${c} 個叢集元件，都可以用 Zeabur 裝到自己的伺服器。CI 會在 Kubernetes 上實際安裝，每一個都標出最近一次通過測試的日期。`,
    browse: "瀏覽範本和元件",
    search: "搜尋 Catalog",
    placeholder: "n8n、PostgreSQL、備份……",
    kinds: { all: "全部", templates: "應用程式範本", components: "叢集元件" },
    shownAll: "共 {total} 個",
    shownSome: "找到 {count} 個",
    none: "沒有符合的項目，換個短一點的詞試試。",
    back: "所有範本和元件",
    tested: (date) => `${date} 測試通過`,
    untested: "這個版本沒有 CI 測試紀錄",
    tests: {
      title: "CI 測試結果",
      body: "CI 會把這些檔案原封不動裝到新的叢集，等到它就緒，再記下閒置時的記憶體用量。",
      cols: ["發行版", "平台", "Kubernetes", "通過日期", "閒置記憶體"],
    },
    facts: {
      version: "版本",
      license: "授權",
      homepage: "官方網站",
      source: "原始檔案",
      capability: "提供的功能",
    },
    security: "安全性",
    template: {
      kind: "應用程式範本",
      pageTitle: (name) => `在自己的伺服器部署 ${name} · Zeabur Catalog`,
      deploy: "用 Zeabur 部署",
      deployCli: "用 catalog 指令部署",
      needs: {
        title: "叢集需要的元件",
        body: "Zeabur 會提示叢集缺哪些元件。沒有用 Zeabur 的話，請先自己裝好。",
      },
      runs: "會跑哪些服務",
      risks: { title: "已知風險", risk: "風險", mitigation: "怎麼處理" },
    },
    component: {
      kind: "叢集元件",
      pageTitle: (name) => `在自己的 Kubernetes 叢集安裝 ${name} · Zeabur Catalog`,
      install: "用 Zeabur 安裝",
      list: "所有元件",
      defaults: { title: "預設是否安裝", singleNode: "單節點", multiNode: "多節點" },
      state: { recommended: "建議安裝", optional: "選用" },
      needs: "需要",
      capability: (name) => `任一個提供 ${name} 的元件`,
      releases: "會安裝的內容",
      usedBy: "需要它的範本",
    },
  },
  "zh-CN": {
    title: "模板和组件",
    description: (t, c) =>
      `${t} 个应用模板和 ${c} 个集群组件，都可以用 Zeabur 装到自己的服务器。CI 会在 Kubernetes 上实际安装，每一个都标出最近一次通过测试的日期。`,
    browse: "浏览模板和组件",
    search: "搜索 Catalog",
    placeholder: "n8n、PostgreSQL、备份……",
    kinds: { all: "全部", templates: "应用模板", components: "集群组件" },
    shownAll: "共 {total} 个",
    shownSome: "找到 {count} 个",
    none: "没有符合的项目，换个短一点的词试试。",
    back: "所有模板和组件",
    tested: (date) => `${date} 测试通过`,
    untested: "这个版本没有 CI 测试记录",
    tests: {
      title: "CI 测试结果",
      body: "CI 会把这些文件原样装到新的集群，等到它就绪，再记下空闲时的内存用量。",
      cols: ["发行版", "平台", "Kubernetes", "通过日期", "空闲内存"],
    },
    facts: {
      version: "版本",
      license: "许可",
      homepage: "官方网站",
      source: "源文件",
      capability: "提供的功能",
    },
    security: "安全性",
    template: {
      kind: "应用模板",
      pageTitle: (name) => `在自己的服务器部署 ${name} · Zeabur Catalog`,
      deploy: "用 Zeabur 部署",
      deployCli: "用 catalog 命令部署",
      needs: {
        title: "集群需要的组件",
        body: "Zeabur 会提示集群缺哪些组件。没有用 Zeabur 的话，请先自己装好。",
      },
      runs: "会运行哪些服务",
      risks: { title: "已知风险", risk: "风险", mitigation: "怎么处理" },
    },
    component: {
      kind: "集群组件",
      pageTitle: (name) => `在自己的 Kubernetes 集群安装 ${name} · Zeabur Catalog`,
      install: "用 Zeabur 安装",
      list: "所有组件",
      defaults: { title: "默认是否安装", singleNode: "单节点", multiNode: "多节点" },
      state: { recommended: "建议安装", optional: "可选" },
      needs: "需要",
      capability: (name) => `任一个提供 ${name} 的组件`,
      releases: "会安装的内容",
      usedBy: "需要它的模板",
    },
  },
}
