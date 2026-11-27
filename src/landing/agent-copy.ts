import { agentGuideMarkdown } from "../lib/agent-guide.ts"
import type { SiteLocale } from "../lib/urls.ts"

// The words of the agent page. zh-TW is written first, then zh-CN and English; all three say the
// same things. The prompt matches the one on the guide's docs page in the same language.

export type AgentCopy = {
  meta: { title: string; description: string }
  label: string
  title: string
  lead: string
  prompt: { label: string; text: string; where: string }
  copy: { label: string; done: string; failed: string }
  soon: string
  guide: string
  install: string
  manual: string
  does: { title: string; steps: string[] }
  you: { title: string; items: string[]; after: string }
  /** Prompts for one catalog entry. `<id>` in `text` is the entry the catalog page links with. */
  catalog: {
    title: string
    body: string
    templates: { label: string; text: (docs: string, section: string) => string }
    components: { label: string; text: (docs: string, section: string) => string }
  }
}

const zhTW: AgentCopy = {
  meta: {
    title: "交給 Agent：從 Zeabur 搬到自己的伺服器",
    description:
      "在 Claude Code 或 Codex 貼上一句話，Agent 會準備伺服器、裝好 Zeabur 開源版，把 Zeabur 上的服務搬過來。",
  },
  label: "交給 Agent",
  title: "貼上一句話，讓 Agent 幫你搬家",
  lead: "Zeabur 會在 2026 年 12 月 31 日停止運作。Claude Code 或 Codex 這類 Coding Agent 可以準備伺服器、裝好 Zeabur 開源版，再把你在 Zeabur 的服務搬過來。要花錢或改動的地方，都會先問你。",
  prompt: {
    label: "在 Claude Code 或 Codex 貼上",
    text: `讀 ${agentGuideMarkdown("zh-TW")}，把我在 Zeabur 的服務搬到我自己的伺服器上，用 Zeabur 開源版管理。`,
    where: "在你自己的電腦上執行 Agent。電腦要能用 SSH 連到新伺服器，也要能登入 Zeabur 的 CLI。",
  },
  copy: { label: "複製這句話", done: "已複製", failed: "無法複製" },
  soon: "搬家指南會跟著下一版 Zeabur 開源版推出，屆時這裡會放上要貼的那句話。在那之前，可以自己動手安裝。",
  guide: "Agent 照著做的完整指南",
  install: "只要安裝 Zeabur 開源版，不搬家",
  manual: "自己動手安裝",
  does: {
    title: "Agent 會做什麼",
    steps: [
      "列出 Zeabur 上的專案、服務、變數、資料庫和網域，並匯出資料。",
      "建議一台伺服器，寫出方案、地區和每月價格。",
      "用 Zeatend 在新伺服器裝好 Kubernetes，再用一個 helm install 裝好 Zeabur 開源版。",
      "在 Zeabur 開源版重新建立每個服務、還原資料，再用 sslip.io 的網址逐一測試。",
      "你同意後切換：停掉 Zeabur 的服務，最後同步一次資料。",
      "告訴你 Zeabur 開源版的網址，說明之後怎麼部署和備份。",
    ],
  },
  you: {
    title: "你要自己做的事",
    items: [
      "確認伺服器的方案和價格，並在服務商自己的頁面付款。",
      "每次寫入新叢集之前，看過要改的內容再同意。",
      "開啟管理員連結，在自己的裝置建立通行密鑰。",
      "同意切換的時間，並修改網域的 DNS 紀錄。",
      "確定不再需要後，才刪除 Zeabur 上的服務。",
    ],
    after: "在你刪除舊的服務之前，都可以切回 Zeabur。",
  },
  catalog: {
    title: "部署範本或安裝元件",
    body: "已經有 Zeabur 開源版的叢集，也可以請 Agent 部署 Zeabur Catalog 的範本或安裝元件。每個改動都會先給你看，你同意後才套用。",
    templates: {
      label: "部署範本",
      text: (docs, section) =>
        `把 Zeabur Catalog 範本 <id> 部署到我的 Zeabur 開源版叢集。照著 ${docs} 裡「${section}」那一節做。`,
    },
    components: {
      label: "安裝元件",
      text: (docs, section) =>
        `在我的叢集安裝 Zeabur Catalog 元件 <id>。照著 ${docs} 裡「${section}」那一節做。`,
    },
  },
}

const zhCN: AgentCopy = {
  meta: {
    title: "交给 Agent：从 Zeabur 迁到自己的服务器",
    description:
      "在 Claude Code 或 Codex 粘贴一句话，Agent 会准备服务器、装好 Zeabur 开源版，把 Zeabur 上的服务迁过来。",
  },
  label: "交给 Agent",
  title: "粘贴一句话，让 Agent 帮你迁移",
  lead: "Zeabur 会在 2026 年 12 月 31 日停止运行。Claude Code 或 Codex 这类 Coding Agent 可以准备服务器、装好 Zeabur 开源版，再把你在 Zeabur 的服务迁过来。要花钱或改动的地方，都会先问你。",
  prompt: {
    label: "在 Claude Code 或 Codex 粘贴",
    text: `读 ${agentGuideMarkdown("zh-CN")}，把我在 Zeabur 的服务迁到我自己的服务器上，用 Zeabur 开源版管理。`,
    where: "在你自己的电脑上运行 Agent。电脑要能用 SSH 连到新服务器，也要能登录 Zeabur 的 CLI。",
  },
  copy: { label: "复制这句话", done: "已复制", failed: "无法复制" },
  soon: "迁移指南会随下一版 Zeabur 开源版推出，届时这里会放上要粘贴的那句话。在那之前，可以自己动手安装。",
  guide: "Agent 照着做的完整指南",
  install: "只安装 Zeabur 开源版，不迁移",
  manual: "自己动手安装",
  does: {
    title: "Agent 会做什么",
    steps: [
      "列出 Zeabur 上的项目、服务、变量、数据库和域名，并导出数据。",
      "推荐一台服务器，写明套餐、地区和每月价格。",
      "用 Zeatend 在新服务器上装好 Kubernetes，再用一个 helm install 装好 Zeabur 开源版。",
      "在 Zeabur 开源版重新创建每个服务、还原数据，再用 sslip.io 的地址逐个测试。",
      "你同意后切换：停掉 Zeabur 的服务，最后同步一次数据。",
      "告诉你 Zeabur 开源版的地址，说明之后怎么部署和备份。",
    ],
  },
  you: {
    title: "你要自己做的事",
    items: [
      "确认服务器的套餐和价格，并在服务商自己的页面付款。",
      "每次写入新集群之前，看过要改的内容再同意。",
      "打开管理员链接，在自己的设备上创建通行密钥。",
      "同意切换的时间，并修改域名的 DNS 记录。",
      "确定不再需要后，才删除 Zeabur 上的服务。",
    ],
    after: "在你删除旧的服务之前，都可以切回 Zeabur。",
  },
  catalog: {
    title: "部署模板或安装组件",
    body: "已经有 Zeabur 开源版的集群，也可以让 Agent 部署 Zeabur Catalog 的模板或安装组件。每个改动都会先给你看，你同意后才应用。",
    templates: {
      label: "部署模板",
      text: (docs, section) =>
        `把 Zeabur Catalog 模板 <id> 部署到我的 Zeabur 开源版集群。按照 ${docs} 中“${section}”一节操作。`,
    },
    components: {
      label: "安装组件",
      text: (docs, section) =>
        `在我的集群安装 Zeabur Catalog 组件 <id>。按照 ${docs} 中“${section}”一节操作。`,
    },
  },
}

const en: AgentCopy = {
  meta: {
    title: "Hand it to an agent: move from Zeabur to your own server",
    description:
      "Paste one sentence into Claude Code or Codex. The agent gets a server, installs Zeabur OSS, and moves your services over from Zeabur.",
  },
  label: "Hand it to an agent",
  title: "Paste one sentence, and an agent does the move",
  lead: "Zeabur stops running on December 31, 2026. A coding agent such as Claude Code or Codex can get a server, install Zeabur OSS, and move your services over from Zeabur. It asks you before anything that costs money or changes something.",
  prompt: {
    label: "Paste this into Claude Code or Codex",
    text: `Read ${agentGuideMarkdown("en")} and move my services off Zeabur onto my own server, managed by Zeabur OSS.`,
    where:
      "Run the agent on your own computer. The computer needs to reach the new server over SSH and to sign in to the Zeabur CLI.",
  },
  copy: { label: "Copy the sentence", done: "Copied", failed: "Copy failed" },
  soon: "The guide comes with the next Zeabur OSS release, and the sentence to paste will appear here then. Until then, you can install it yourself.",
  guide: "The full guide the agent follows",
  install: "Install Zeabur OSS only, without moving",
  manual: "Install it yourself",
  does: {
    title: "What the agent does",
    steps: [
      "Lists the projects, services, variables, databases and domains on Zeabur, and exports the data.",
      "Suggests a server, with the plan, region and monthly price.",
      "Sets up Kubernetes on the new server with Zeatend, then installs Zeabur OSS with one helm install.",
      "Creates each service again in Zeabur OSS, restores the data, and tests each service at an sslip.io address.",
      "When you agree, switches over: stops the services on Zeabur and syncs the data one last time.",
      "Gives you the address of Zeabur OSS, and how to deploy and back up from then on.",
    ],
  },
  you: {
    title: "What you do yourself",
    items: [
      "Confirm the server's plan and price, and pay on the provider's own page.",
      "Before each write to the new cluster, look at what changes and agree.",
      "Open the admin link and create a passkey on your own device.",
      "Agree on when to switch over, and change your domain's DNS records.",
      "Delete the services on Zeabur, once you're sure you no longer need them.",
    ],
    after: "Until you delete the old services, you can switch back to Zeabur.",
  },
  catalog: {
    title: "Deploy a template or install a component",
    body: "On a cluster that already runs Zeabur OSS, an agent can also deploy a Zeabur Catalog template or install a component. It shows you each change before it applies it.",
    templates: {
      label: "Deploy a template",
      text: (docs, section) =>
        `Deploy the Zeabur Catalog template <id> to my Zeabur OSS cluster. Follow ${docs}, section "${section}".`,
    },
    components: {
      label: "Install a component",
      text: (docs, section) =>
        `Install the Zeabur Catalog component <id> on my cluster. Follow ${docs}, section "${section}".`,
    },
  },
}

export const agentCopy: Record<SiteLocale, AgentCopy> = { en, "zh-TW": zhTW, "zh-CN": zhCN }
