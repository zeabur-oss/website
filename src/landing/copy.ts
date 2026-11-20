import { releaseTag } from "../lib/products.ts"
import type { SiteLocale } from "../lib/urls.ts"

// The home page's words, one key per string. zh-TW is written first, then zh-CN and English;
// all three say the same things.

const zeaburVersion = releaseTag("zeabur")

type Entrance = { title: string; body: string; link: string }
type Point = { title: string; body: string; link: string }
type Step = { title: string; body: string }
type MemberId = "desktop"

export type LandingCopy = {
  title: string
  description: string
  hero: {
    meta: string
    title: string
    lead: string
    start: string
    source: string
    team: Entrance
    machine: Entrance
  }
  shots: Record<
    "project" | "diagnosis" | "change-review" | "database" | "cluster" | "installer",
    string
  >
  deploy: { label: string; title: string; body: string }
  trace: { label: string; title: string; steps: [Step, Step, Step] }
  roles: { label: string; title: string; points: [Point, Point, Point] }
  leave: { label: string; title: string; body: string; link: string }
  start: {
    label: string
    title: string
    lead: string
    agent: { title: string; body: string }
    zeatend: { title: string; body: string; steps: string; cluster: string }
    manual: { title: string; body: string; server: string; cluster: string; laptop: string }
  }
  members: {
    label: string
    title: string
    lead: string
    lines: Record<MemberId, string>
    community: string
  }
  discord: { label: string; title: string; body: string; link: string }
}

const zhTW: LandingCopy = {
  title: "Zeabur 開源專案",
  description:
    "在自己的 Kubernetes 上部署和管理服務。Zeabur 的開源專案都採 Apache-2.0 授權，包括新加入的 Zeatend。",
  hero: {
    meta: `Apache-2.0 · Zeabur ${zeaburVersion}`,
    title: "你熟悉的 Zeabur，裝在自己的伺服器上",
    lead: "一樣用 Git、Docker Compose 或範本部署，一樣的專案和服務。差別是伺服器是你的：費用只有主機，資料留在自己的機器，原始碼全部公開。",
    start: "開始使用",
    source: "GitHub 上的原始碼",
    team: {
      title: "已經有 Kubernetes 叢集",
      body: "用 Helm chart 裝進去，成員各用自己的帳號和權限操作。",
      link: "裝進既有叢集",
    },
    machine: {
      title: "只有一臺 Linux 伺服器",
      body: "Zeabur Installer 檢查伺服器，一次裝好叢集和整套服務。",
      link: "在一臺伺服器安裝",
    },
  },
  shots: {
    project: "shop 專案的地圖。worker 反覆崩潰，所以排在「需要處理」的第一列。",
    diagnosis:
      "worker 重新啟動了 14 次。錯誤在重新啟動前那一次執行的日誌裡，旁邊就是開啟日誌的按鈕。",
    "change-review": "儲存 web 的變更前，先看 YAML 差異：NODE_ENV 從 production 改成 staging。",
    database:
      "只有一個執行個體的 PostgreSQL。它故障時沒有其他執行個體接手，所以 Zeabur 提醒你設定備份。",
    cluster: "叢集頁：Kubernetes 1.34 即將停止支援、節點記憶體用到 91%、磁碟用到 88%。",
    installer: "Zeabur Installer 安裝前的確認頁：記憶體夠不夠、要裝哪些元件、大約要多久。",
  },
  deploy: {
    label: "部署",
    title: "按下部署，服務就上線",
    body: "選一個 Git 儲存庫、Docker Compose 檔或範本。Zeabur 建置好就啟動，把服務放上架構圖，連線也一起畫出來。",
  },
  trace: {
    label: "出問題時",
    title: "服務出錯，三步找到原因",
    steps: [
      {
        title: "看到哪裡出錯",
        body: "首頁把叢集裡每個問題依原因分組：叢集本身、叢集外部、設定，或應用程式自己出錯。worker 反覆崩潰，列在「應用程式出錯」。",
      },
      {
        title: "找到原因",
        body: "worker 重新啟動了 14 次。錯誤在重新啟動前那一次執行的日誌裡，按一下就能開啟。",
      },
      {
        title: "確認後才套用",
        body: "儲存之前，先列出這次會寫入的欄位。看過差異、按下確認，變更才會寫回叢集。",
      },
    ],
  },
  roles: {
    label: "權限",
    title: "每個人用自己的權限",
    points: [
      {
        title: "用登入者自己的憑證",
        body: "每個請求都帶著你自己的憑證，能做什麼由 Kubernetes RBAC 決定。",
        link: "Zeabur 需要的權限",
      },
      {
        title: "用通行密鑰登入",
        body: "成員用 Zeabur Identity 的通行密鑰登入，kubectl 拿到的 token 幾分鐘就到期。",
        link: "Zeabur Identity",
      },
      {
        title: "沒有自己的資料庫",
        body: "所有狀態都在 Kubernetes 物件裡。一個專案就是一個 Namespace。",
        link: "安全設計",
      },
    ],
  },
  leave: {
    label: "移除",
    title: "移除 Zeabur，服務照常執行",
    body: "Zeabur 自己不存資料。移除 chart 後，Deployment、Service、Ingress 和資料都留在叢集裡，可以繼續用 kubectl、Helm、Argo CD 或 Flux 管理。",
    link: "移除 Zeabur 的步驟",
  },
  start: {
    label: "開始",
    title: "選一種方式開始",
    lead: "依你想自己動手的程度選擇。三種方式裝好的是同一套 Zeabur。",
    agent: {
      title: "交給 AI 代理",
      body: "之後只要把一段提示貼給 Claude 或 Codex，它就會幫你安裝 Zeabur，或把 zeabur.com 上的專案搬過來。",
    },
    zeatend: {
      title: "用 Zeatend 一步步安裝",
      body: "在伺服器上執行 Zeatend，照著終端機畫面選好發行版和設定，就能把這台伺服器裝成 Kubernetes 叢集。叢集裝好後，再用 Helm chart 裝上 Zeabur。",
      steps: "Zeatend 的安裝步驟",
      cluster: "用 Helm chart 裝上 Zeabur",
    },
    manual: {
      title: "自己動手安裝",
      body: "給想看清楚每個物件的叢集管理員。這幾種方式現在就能用：",
      server: "在一臺伺服器安裝",
      cluster: "用 Helm chart 裝進既有叢集",
      laptop: "用 zeaburctl 在自己的電腦開啟",
    },
  },
  members: {
    label: "專案",
    title: "Zeabur 開源的所有專案",
    lead: "可以整套一起用，也可以只拿其中一個，放進你現有的叢集。",
    lines: {
      desktop: "在自己的電腦開啟 Zeabur。",
    },
    community: "在 GitHub 上追蹤進度、回報問題，或讀部落格上的設計說明。",
  },
  discord: {
    label: "社群",
    title: "加入 Zeabur 的 Discord",
    body: "安裝或使用時卡住了，可以在這裡發問；想要什麼功能，也可以直接提出來。",
    link: "加入 Discord",
  },
}

const zhCN: LandingCopy = {
  title: "Zeabur 开源项目",
  description:
    "在自己的 Kubernetes 上部署和管理服务。Zeabur 的开源项目都采用 Apache-2.0 许可证，包括新加入的 Zeatend。",
  hero: {
    meta: `Apache-2.0 · Zeabur ${zeaburVersion}`,
    title: "你熟悉的 Zeabur，装在自己的服务器上",
    lead: "一样用 Git、Docker Compose 或模板部署，一样的项目和服务。区别是服务器是你的：费用只有主机，数据留在自己的机器上，源代码全部公开。",
    start: "开始使用",
    source: "GitHub 上的源代码",
    team: {
      title: "已经有 Kubernetes 集群",
      body: "用 Helm chart 装进去，成员各用自己的账号和权限操作。",
      link: "装进现有集群",
    },
    machine: {
      title: "只有一台 Linux 服务器",
      body: "Zeabur Installer 检查服务器，一次装好集群和整套服务。",
      link: "在一台服务器上安装",
    },
  },
  shots: {
    project: "shop 项目的地图。worker 反复崩溃，所以排在“需要处理”的第一行。",
    diagnosis: "worker 重启了 14 次。错误在重启前那一次运行的日志里，旁边就是打开日志的按钮。",
    "change-review": "保存 web 的变更前，先看 YAML 差异：NODE_ENV 从 production 改成 staging。",
    database: "只有一个实例的 PostgreSQL。它出故障时没有其他实例接手，所以 Zeabur 提醒你设置备份。",
    cluster: "集群页：Kubernetes 1.34 即将停止支持，节点内存用到 91%，磁盘用到 88%。",
    installer: "Zeabur Installer 安装前的确认页：内存够不够、要装哪些组件、大约要多久。",
  },
  deploy: {
    label: "部署",
    title: "按下部署，服务就上线",
    body: "选一个 Git 仓库、Docker Compose 文件或模板。Zeabur 构建好就启动，把服务放上架构图，连接也一起画出来。",
  },
  trace: {
    label: "出问题时",
    title: "服务出错，三步找到原因",
    steps: [
      {
        title: "看到哪里出错",
        body: "首页把集群里每个问题按原因分组：集群本身、集群外部、配置，或应用自己出错。worker 反复崩溃，列在“应用出错”。",
      },
      {
        title: "找到原因",
        body: "worker 重启了 14 次。错误在重启前那一次运行的日志里，点一下就能打开。",
      },
      {
        title: "确认后才应用",
        body: "保存之前，先列出这次会写入的字段。看过差异、点了确认，变更才会写回集群。",
      },
    ],
  },
  roles: {
    label: "权限",
    title: "每个人用自己的权限",
    points: [
      {
        title: "用登录者自己的凭据",
        body: "每个请求都带着你自己的凭据，能做什么由 Kubernetes RBAC 决定。",
        link: "Zeabur 需要的权限",
      },
      {
        title: "用通行密钥登录",
        body: "成员用 Zeabur Identity 的通行密钥登录，kubectl 拿到的 token 几分钟就过期。",
        link: "Zeabur Identity",
      },
      {
        title: "没有自己的数据库",
        body: "所有状态都在 Kubernetes 对象里。一个项目就是一个 Namespace。",
        link: "安全设计",
      },
    ],
  },
  leave: {
    label: "移除",
    title: "移除 Zeabur，服务照常运行",
    body: "Zeabur 自己不存数据。卸载 chart 后，Deployment、Service、Ingress 和数据都留在集群里，可以继续用 kubectl、Helm、Argo CD 或 Flux 管理。",
    link: "移除 Zeabur 的步骤",
  },
  start: {
    label: "开始",
    title: "选一种方式开始",
    lead: "按你想自己动手的程度来选。三种方式装好的是同一套 Zeabur。",
    agent: {
      title: "交给 AI 智能体",
      body: "之后只要把一段提示词贴给 Claude 或 Codex，它就会帮你安装 Zeabur，或者把 zeabur.com 上的项目迁移过来。",
    },
    zeatend: {
      title: "用 Zeatend 一步步安装",
      body: "在服务器上运行 Zeatend，在终端界面里选好发行版和配置，就能把这台服务器装成 Kubernetes 集群。集群装好后，再用 Helm chart 装上 Zeabur。",
      steps: "Zeatend 的安装步骤",
      cluster: "用 Helm chart 装上 Zeabur",
    },
    manual: {
      title: "自己动手安装",
      body: "给想看清每个对象的集群管理员。下面几种方式现在就能用：",
      server: "在一台服务器上安装",
      cluster: "用 Helm chart 装进现有集群",
      laptop: "用 zeaburctl 在自己的电脑上打开",
    },
  },
  members: {
    label: "项目",
    title: "Zeabur 开源的全部项目",
    lead: "可以整套一起用，也可以只拿其中一个，放进你现有的集群。",
    lines: {
      desktop: "在自己的电脑上打开 Zeabur。",
    },
    community: "在 GitHub 上跟进进度、反馈问题，或者读博客上的设计说明。",
  },
  discord: {
    label: "社区",
    title: "加入 Zeabur 的 Discord",
    body: "安装或使用时卡住了，可以在这里提问；想要什么功能，也可以直接提出来。",
    link: "加入 Discord",
  },
}

const en: LandingCopy = {
  title: "Zeabur Open Source",
  description:
    "Deploy and run services on your own Kubernetes. Every Zeabur open-source project is Apache-2.0 licensed, including the new Zeatend.",
  hero: {
    meta: `Apache-2.0 · Zeabur ${zeaburVersion}`,
    title: "The Zeabur you know, on your own server",
    lead: "Deploy from Git, Docker Compose or a template, with the same projects and services. The difference is that the server is yours: you pay only for the machine, your data stays on it, and all the code is public.",
    start: "Get started",
    source: "Source on GitHub",
    team: {
      title: "You already run Kubernetes",
      body: "Install the Helm chart. Each member works with their own account and rights.",
      link: "Install on a cluster",
    },
    machine: {
      title: "You have one Linux server",
      body: "Zeabur Installer checks the server and sets up the cluster and everything on it in one go.",
      link: "Install on one server",
    },
  },
  shots: {
    project:
      "The shop project as a map. worker keeps crashing, so it is first under Needs attention.",
    diagnosis:
      "worker has restarted 14 times. The error is in the logs of the run before the restart, and the button to open them is right there.",
    "change-review":
      "Before the change to web is saved, the YAML diff shows NODE_ENV going from production to staging.",
    database:
      "A PostgreSQL database with one instance. Nothing takes over if it fails, so Zeabur asks you to set up backups.",
    cluster:
      "The cluster page: Kubernetes 1.34 reaches end of life, a node is at 91% memory and its disk at 88%.",
    installer:
      "Zeabur Installer's review step before installing: whether memory is enough, which components go in, and how long it takes.",
  },
  deploy: {
    label: "Deploy",
    title: "Press deploy and the service is up",
    body: "Pick a Git repository, a Docker Compose file or a template. Zeabur builds it, starts it and puts the service on the map with its connections.",
  },
  trace: {
    label: "When it breaks",
    title: "A failing service, traced in three steps",
    steps: [
      {
        title: "See what's wrong",
        body: "Home groups every problem in the cluster by cause: the cluster, something outside it, a setting, or the app itself. worker keeps crashing, so it is under Errors in the app.",
      },
      {
        title: "Find the cause",
        body: "worker has restarted 14 times. The error is in the logs of the run before the restart, one click away.",
      },
      {
        title: "Confirm, then apply",
        body: "Before anything is saved, you see the fields it writes. The change reaches the cluster only after you've read the diff and confirmed.",
      },
    ],
  },
  roles: {
    label: "Access",
    title: "Everyone works with their own rights",
    points: [
      {
        title: "Your own credential",
        body: "Every request carries the signed-in person's credential, and Kubernetes RBAC decides what they can do.",
        link: "What Zeabur needs",
      },
      {
        title: "Passkey sign-in",
        body: "Members sign in with a passkey through Zeabur Identity, and kubectl gets a token that expires in minutes.",
        link: "Zeabur Identity",
      },
      {
        title: "No database of its own",
        body: "All state lives in Kubernetes objects. A project is a namespace.",
        link: "Security design",
      },
    ],
  },
  leave: {
    label: "Leaving",
    title: "Remove Zeabur, and your services keep running",
    body: "Zeabur keeps no data of its own. Uninstall the chart and your Deployments, Services, Ingresses and data stay in the cluster, ready for kubectl, Helm, Argo CD or Flux.",
    link: "How to remove Zeabur",
  },
  start: {
    label: "Start",
    title: "Pick a way to start",
    lead: "Choose by how hands-on you want to be. All three end with the same Zeabur.",
    agent: {
      title: "Hand it to an AI agent",
      body: "You'll paste a prompt into Claude or Codex, and it will install Zeabur for you or move your projects over from zeabur.com.",
    },
    zeatend: {
      title: "Step through it with Zeatend",
      body: "Run Zeatend on the server and pick a distribution and settings on its terminal screens. It turns the server into a Kubernetes cluster, and then you install Zeabur with the Helm chart.",
      steps: "Zeatend's install steps",
      cluster: "Install Zeabur with the Helm chart",
    },
    manual: {
      title: "Install it yourself",
      body: "For cluster admins who want to see every object. These work today:",
      server: "Install on one server",
      cluster: "Install the Helm chart on a cluster",
      laptop: "Open it on your own machine with zeaburctl",
    },
  },
  members: {
    label: "Projects",
    title: "Every Zeabur open-source project",
    lead: "Use them together, or pick one and add it to the cluster you already have.",
    lines: {
      desktop: "Zeabur on your own computer.",
    },
    community: "Follow the work and report issues on GitHub, or read the design notes on the blog.",
  },
  discord: {
    label: "Community",
    title: "Join Zeabur on Discord",
    body: "Ask there when you get stuck installing or using it, or suggest a feature you want.",
    link: "Join Discord",
  },
}

export const landingCopy: Record<SiteLocale, LandingCopy> = { en, "zh-TW": zhTW, "zh-CN": zhCN }
