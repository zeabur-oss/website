import type { SiteLocale } from "../lib/urls.ts"

type Way = { title: string; body: string; link: string }

/** Words the product pages share: screenshot captions and the three ways to start. */
export type LandingCopy = {
  shots: Record<"project" | "diagnosis" | "database" | "cluster" | "installer", string>
  start: { title: string; lead: string; server: Way; cluster: Way; laptop: Way }
}

const zhTW: LandingCopy = {
  shots: {
    project: "shop 專案的地圖。worker 反覆崩潰，所以排在「需要處理」的第一列。",
    diagnosis:
      "worker 重新啟動了 14 次。錯誤在重新啟動前那一次執行的日誌裡，旁邊就是開啟日誌的按鈕。",
    database:
      "只有一個執行個體的 PostgreSQL。它故障時沒有其他執行個體接手，所以 Zeabur 提醒你設定備份。",
    cluster: "叢集頁：Kubernetes 1.34 即將停止支援、節點記憶體用到 91%、磁碟用到 88%。",
    installer: "Zeabur Installer 安裝前的確認頁：記憶體夠不夠、要裝哪些元件、大約要多久。",
  },
  start: {
    title: "從手邊的環境開始",
    lead: "三種裝法開啟的是同一套介面，差別在 Zeabur 在哪裡執行、用誰的憑證。",
    server: {
      title: "一台 Linux 伺服器",
      body: "Zeabur Installer 的網頁介面會檢查伺服器、讓你選元件，一次裝好 RKE2、Zeabur Identity 和 Zeabur。",
      link: "在一台伺服器安裝",
    },
    cluster: {
      title: "既有的 Kubernetes 叢集",
      body: "用 Helm chart 安裝。成員用 Zeabur Identity 的通行密鑰登入，以自己的權限操作。",
      link: "裝進既有叢集",
    },
    laptop: {
      title: "自己的電腦",
      body: "zeaburctl ui 用目前的 kubeconfig 開啟介面，叢集裡不用另外安裝東西。",
      link: "zeaburctl 用法",
    },
  },
}

const zhCN: LandingCopy = {
  shots: {
    project: "shop 项目的拓扑图。worker 反复崩溃，所以排在“需要处理”的第一行。",
    diagnosis: "worker 重启了 14 次。错误在重启前那一次运行的日志里，旁边就是打开日志的按钮。",
    database: "只有一个实例的 PostgreSQL。它故障时没有其他实例接手，所以 Zeabur 提醒你设置备份。",
    cluster: "集群页：Kubernetes 1.34 即将停止支持，节点内存用到 91%，磁盘用到 88%。",
    installer: "Zeabur Installer 安装前的确认页：内存够不够、要装哪些组件、大约要多久。",
  },
  start: {
    title: "从手头的环境开始",
    lead: "三种装法打开的是同一套界面，区别在于 Zeabur 运行在哪里、用谁的凭据。",
    server: {
      title: "一台 Linux 服务器",
      body: "Zeabur Installer 的 Web 界面会检查服务器、让你选择组件，一次装好 RKE2、Zeabur Identity 和 Zeabur。",
      link: "在一台服务器上安装",
    },
    cluster: {
      title: "现有的 Kubernetes 集群",
      body: "用 Helm Chart 安装。成员用 Zeabur Identity 的通行密钥登录，以自己的权限操作。",
      link: "装进现有集群",
    },
    laptop: {
      title: "自己的电脑",
      body: "zeaburctl ui 用当前的 kubeconfig 打开界面，集群里不需要另外安装任何东西。",
      link: "zeaburctl 用法",
    },
  },
}

const en: LandingCopy = {
  shots: {
    project:
      "The shop project as a map. worker keeps crashing, so it is first under Needs attention.",
    diagnosis:
      "worker has restarted 14 times. The error is in the logs of the run before the restart, and the button to open them is right there.",
    database:
      "A PostgreSQL database with one instance. Nothing takes over if it fails, so Zeabur asks you to set up backups.",
    cluster:
      "The cluster page: Kubernetes 1.34 reaches end of life, a node is at 91% memory and its disk at 88%.",
    installer:
      "Zeabur Installer's review step before installing: whether memory is enough, which components go in, and how long it takes.",
  },
  start: {
    title: "Start with what you have",
    lead: "All three open the same interface. They differ in where Zeabur runs and whose credential it uses.",
    server: {
      title: "A Linux server",
      body: "The Zeabur Installer web UI checks the server, lets you pick components, and installs RKE2, Zeabur Identity and Zeabur in one go.",
      link: "Install on one server",
    },
    cluster: {
      title: "An existing Kubernetes cluster",
      body: "Install with the Helm chart. Your team signs in with a passkey through Zeabur Identity and works with their own rights.",
      link: "Install on a cluster",
    },
    laptop: {
      title: "Your own machine",
      body: "zeaburctl ui opens the interface with your current kubeconfig. Nothing gets installed in the cluster.",
      link: "Using zeaburctl",
    },
  },
}

export const landingCopy: Record<SiteLocale, LandingCopy> = { en, "zh-TW": zhTW, "zh-CN": zhCN }
