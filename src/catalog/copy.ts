// The catalog list (/catalog/browse) and the page of each template and component.
import type { SiteLocale } from "../lib/urls.ts"

type Default = "recommended" | "optional"

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
  /** The facts someone choosing a server reads first. */
  glance: {
    memory: string
    memoryValue: (amount: string) => string
    memoryNote: string
    cpu: string
    cpus: (names: string[]) => string
    card: (amount: string) => string
  }
  details: string
  /** The button to the project's own site. */
  about: (name: string) => string
  tests: {
    title: string
    body: string
    cols: [string, string, string, string, string]
  }
  facts: {
    title: string
    version: string
    license: string
    homepage: string
    source: string
    capability: string
  }
  security: string
  template: {
    kind: string
    pageTitle: (name: string) => string
    deploy: string
    deployCli: string
    needs: { title: string; body: string }
    start: { deploy: string; docs: (name: string) => string }
    values: {
      title: string
      none: string
      required: string
      optional: string
      default: string
      generated: string
      generatedBody: string
    }
    resources: {
      title: string
      body: string
      ports: string
      cpu: string
      memory: string
      range: (from: string, to: string) => string
      cores: (n: string) => string
    }
    risks: { title: string; risk: string; mitigation: string }
  }
  component: {
    kind: string
    pageTitle: (name: string) => string
    install: string
    list: string
    defaults: { title: string; value: (oneMachine: Default, severalMachines: Default) => string }
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
    glance: {
      memory: "Memory when idle",
      memoryValue: (amount) => `about ${amount}`,
      memoryNote:
        "CI measures it once the app is ready and before any traffic. Leave room for more.",
      cpu: "Tested on",
      cpus: (names) => `${names.join(" and ")} servers`,
      card: (amount) => `${amount} idle`,
    },
    details: "Technical details",
    about: (name) => `About ${name}`,
    tests: {
      title: "Tested in CI",
      body: "CI installs these exact files on a new cluster, waits until they are ready, then records the idle memory.",
      cols: ["Distribution", "Platform", "Kubernetes", "Passed", "Idle memory"],
    },
    facts: {
      title: "This release",
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
      start: {
        deploy: "How to deploy a template",
        docs: (name) => `${name} docs`,
      },
      values: {
        title: "Values you provide",
        none: "You don’t fill in anything when you deploy.",
        required: "Required",
        optional: "Optional",
        default: "Default",
        generated: "Made for you",
        generatedBody:
          "These values are generated at deploy and kept in a Kubernetes Secret, shown as Secret/key.",
      },
      resources: {
        title: "Resources",
        body: "Each service is guaranteed the first amount and can use up to the second.",
        ports: "Ports",
        cpu: "CPU",
        memory: "Memory",
        range: (from, to) => `${from} to ${to}`,
        cores: (n) => `${n} ${n === "1" ? "core" : "cores"}`,
      },
      risks: { title: "Known risks", risk: "Risk", mitigation: "How it is handled" },
    },
    component: {
      kind: "Cluster component",
      pageTitle: (name) => `${name} for your own Kubernetes cluster · Zeabur Catalog`,
      install: "Install with Zeabur",
      list: "Every component",
      defaults: {
        title: "Installed by default",
        value: (one, several) =>
          one === several
            ? { recommended: "Recommended", optional: "Optional" }[one]
            : `${one === "recommended" ? "Recommended" : "Optional"} on one machine, ${several} on several`,
      },
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
    glance: {
      memory: "閒置時的記憶體",
      memoryValue: (amount) => `約 ${amount}`,
      memoryNote: "CI 在應用程式就緒、還沒有流量時量到的。實際使用會更多，記得留點空間。",
      cpu: "測試過的伺服器",
      cpus: (names) => names.join(" 和 "),
      card: (amount) => `閒置 ${amount}`,
    },
    details: "技術細節",
    about: (name) => `認識 ${name}`,
    tests: {
      title: "CI 測試結果",
      body: "CI 會把這些檔案原封不動裝到新的叢集，等到它就緒，再記下閒置時的記憶體用量。",
      cols: ["發行版", "平台", "Kubernetes", "通過日期", "閒置記憶體"],
    },
    facts: {
      title: "這個版本",
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
      start: {
        deploy: "怎麼部署範本",
        docs: (name) => `${name} 說明文件`,
      },
      values: {
        title: "要填的值",
        none: "部署時不用填任何東西。",
        required: "必填",
        optional: "選填",
        default: "預設值",
        generated: "自動產生",
        generatedBody: "這些值會在部署時自動產生，存在 Kubernetes Secret 裡，格式是 Secret/key。",
      },
      resources: {
        title: "資源",
        body: "每個服務保證拿到前面的量，最多可以用到後面的量。",
        ports: "連接埠",
        cpu: "CPU",
        memory: "記憶體",
        range: (from, to) => `${from} 到 ${to}`,
        cores: (n) => `${n} 核`,
      },
      risks: { title: "已知風險", risk: "風險", mitigation: "怎麼處理" },
    },
    component: {
      kind: "叢集元件",
      pageTitle: (name) => `在自己的 Kubernetes 叢集安裝 ${name} · Zeabur Catalog`,
      install: "用 Zeabur 安裝",
      list: "所有元件",
      defaults: {
        title: "預設是否安裝",
        value: (one, several) => {
          const word = { recommended: "建議安裝", optional: "選用" }
          return one === several ? word[one] : `一台機器${word[one]}，多台機器${word[several]}`
        },
      },
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
    glance: {
      memory: "空闲时的内存",
      memoryValue: (amount) => `约 ${amount}`,
      memoryNote: "CI 在应用就绪、还没有流量时测到的。实际使用会更多，记得留点余量。",
      cpu: "测试过的服务器",
      cpus: (names) => names.join(" 和 "),
      card: (amount) => `空闲 ${amount}`,
    },
    details: "技术细节",
    about: (name) => `了解 ${name}`,
    tests: {
      title: "CI 测试结果",
      body: "CI 会把这些文件原样装到新的集群，等到它就绪，再记下空闲时的内存用量。",
      cols: ["发行版", "平台", "Kubernetes", "通过日期", "空闲内存"],
    },
    facts: {
      title: "这个版本",
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
      start: {
        deploy: "怎么部署模板",
        docs: (name) => `${name} 文档`,
      },
      values: {
        title: "要填的值",
        none: "部署时不用填任何东西。",
        required: "必填",
        optional: "选填",
        default: "默认值",
        generated: "自动生成",
        generatedBody: "这些值会在部署时自动生成，存在 Kubernetes Secret 里，格式是 Secret/key。",
      },
      resources: {
        title: "资源",
        body: "每个服务保证拿到前面的量，最多可以用到后面的量。",
        ports: "端口",
        cpu: "CPU",
        memory: "内存",
        range: (from, to) => `${from} 到 ${to}`,
        cores: (n) => `${n} 核`,
      },
      risks: { title: "已知风险", risk: "风险", mitigation: "怎么处理" },
    },
    component: {
      kind: "集群组件",
      pageTitle: (name) => `在自己的 Kubernetes 集群安装 ${name} · Zeabur Catalog`,
      install: "用 Zeabur 安装",
      list: "所有组件",
      defaults: {
        title: "默认是否安装",
        value: (one, several) => {
          const word = { recommended: "建议安装", optional: "可选" }
          return one === several ? word[one] : `一台机器${word[one]}，多台机器${word[several]}`
        },
      },
      needs: "需要",
      capability: (name) => `任一个提供 ${name} 的组件`,
      releases: "会安装的内容",
      usedBy: "需要它的模板",
    },
  },
}
