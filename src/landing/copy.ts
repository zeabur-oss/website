import type { SiteLocale } from "../lib/urls.ts"

type Product = { tagline: string; summary: string; points: string[]; docs: string }
type Way = { title: string; body: string; link: string }

export type LandingCopy = {
  title: string
  description: string
  hero: { title: string; lead: string; start: string; source: string }
  facts: { label: string; value: string }[]
  shots: Record<"project" | "diagnosis" | "database" | "cluster" | "installer", string>
  projects: { title: string; lead: string; more: string }
  zeabur: Product
  identity: Product
  builder: Product
  catalog: Product
  start: { title: string; lead: string; server: Way; cluster: Way; laptop: Way }
  leave: { title: string; body: string; link: string }
}

const zhTW: LandingCopy = {
  title: "Zeabur 開源專案",
  description:
    "在自己的 Kubernetes 上部署和管理服務。Zeabur、Zeabur Identity、Zeabur Builder 和 Zeabur Catalog 都採 Apache-2.0 授權。",
  hero: {
    title: "在自己的 Kubernetes 上部署和管理服務",
    lead: "Zeabur 把叢集整理成專案和服務，用白話說明哪裡出了問題。改設定前，先列出這次會寫入哪些欄位，確認後才套用。整套都裝在你自己的伺服器上。",
    start: "在一台伺服器安裝",
    source: "GitHub 上的原始碼",
  },
  facts: [
    { label: "授權", value: "Apache-2.0" },
    { label: "版本", value: "0.1.0，映像檔已發佈，API 可能再調整" },
    {
      label: "裝在哪裡",
      value: "一台 Linux 伺服器、既有的 Kubernetes 叢集，或用 zeaburctl 在自己的電腦開啟",
    },
  ],
  shots: {
    project: "shop 專案的地圖。worker 反覆崩潰，所以排在「需要處理」的第一列。",
    diagnosis: "worker 重新啟動了 14 次。錯誤在重新啟動前那一次的記錄裡，旁邊就是開啟記錄的按鈕。",
    database:
      "只有一個執行個體的 PostgreSQL。它故障時沒有其他執行個體接手，所以 Zeabur 提醒你設定備份。",
    cluster: "叢集頁：Kubernetes 1.34 即將停止支援、節點記憶體用到 91%、磁碟用到 88%。",
    installer: "Zeabur Installer 安裝前的確認頁：記憶體夠不夠、要裝哪些元件、大約要多久。",
  },
  projects: {
    title: "四個專案",
    lead: "可以整套一起用，也可以只拿其中一個，放進你現有的叢集。",
    more: "看看能做什麼",
  },
  zeabur: {
    tagline: "部署和管理服務的網頁介面",
    summary: "把叢集整理成專案和服務，說明哪裡出錯、該怎麼處理。",
    points: [
      "每個請求都帶著你自己的憑證，能不能做由 kube-apiserver 決定。",
      "改設定前先列出會寫入的欄位和目前由誰管理，確認後才套用。",
      "所有狀態都在 Kubernetes 物件裡，沒有資料庫。一個專案就是一個 Namespace。",
    ],
    docs: "Zeabur 文件",
  },
  identity: {
    tagline: "用通行密鑰登入 kubectl",
    summary: "kubectl 透過瀏覽器用通行密鑰登入，拿到幾分鐘就到期的 token。",
    points: [
      "kubectl 會打開瀏覽器，用 Touch ID、Windows Hello 或安全金鑰登入，拿到幾分鐘就到期的 token。",
      "管理員有專用帳號，只能用通行密鑰登入，token 5 分鐘到期，工作時會自動換新。",
      "一個約 20 MB 的 pod，跑在它保護的叢集裡，不需要資料庫。",
    ],
    docs: "Identity 文件",
  },
  builder: {
    tagline: "推送 commit，拿到映像檔 digest",
    summary: "用 BuildKit 從 Git 建置映像檔的 Kubernetes operator。",
    points: [
      "用 BuildKit 從 Git 建置映像檔的 Kubernetes operator。",
      "每個新 commit 建置一次，推到 registry，再把映像檔寫進 status.latestImage，交給你的部署工具。",
    ],
    docs: "Builder 文件",
  },
  catalog: {
    tagline: "測試過的元件與範本",
    summary: "叢集元件和應用程式範本，每一項都由 CI 安裝並測試。",
    points: [
      "元件是 ingress、憑證、監控、資料庫 operator 這類叢集層級的東西。每一項寫明用哪個 chart、哪個版本、哪些 values，以及原因。",
      "範本是 n8n、Dify、WordPress 這類應用程式，固定映像檔版本，也設好資源需求和上限。",
      "CI 會安裝並測試每一項。每次發版產生一份有簽章的 bundle。",
    ],
    docs: "Catalog 說明",
  },
  start: {
    title: "從手邊的環境開始",
    lead: "三種裝法開啟的是同一套介面，差別在 Zeabur 跑在哪裡、用誰的憑證。",
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
  leave: {
    title: "移除 Zeabur，服務照常執行",
    body: "Zeabur 自己不存資料。移除 chart 後，Deployment、Service、Ingress 和資料都留在叢集裡，可以繼續用 kubectl、Helm、Argo CD 或 Flux 管理。",
    link: "移除 Zeabur 的步驟",
  },
}

const zhCN: LandingCopy = {
  title: "Zeabur 开源项目",
  description:
    "在自己的 Kubernetes 上部署和管理服务。Zeabur、Zeabur Identity、Zeabur Builder 和 Zeabur Catalog 均采用 Apache-2.0 许可证。",
  hero: {
    title: "在自己的 Kubernetes 上部署和管理服务",
    lead: "Zeabur 把集群整理成项目和服务，用大白话说明哪里出了问题。改配置前，先列出这次会写入哪些字段，确认后才应用。整套都装在你自己的服务器上。",
    start: "在一台服务器上安装",
    source: "GitHub 上的源代码",
  },
  facts: [
    { label: "许可证", value: "Apache-2.0" },
    { label: "版本", value: "0.1.0，镜像已发布，API 可能还会调整" },
    {
      label: "装在哪里",
      value: "一台 Linux 服务器、现有的 Kubernetes 集群，或用 zeaburctl 在自己的电脑上打开",
    },
  ],
  shots: {
    project: "shop 项目的拓扑图。worker 反复崩溃，所以排在“需要处理”的第一行。",
    diagnosis: "worker 重启了 14 次。错误在重启前那一次运行的日志里，旁边就是打开日志的按钮。",
    database: "只有一个实例的 PostgreSQL。它故障时没有其他实例接手，所以 Zeabur 提醒你设置备份。",
    cluster: "集群页：Kubernetes 1.34 即将停止支持，节点内存用到 91%，磁盘用到 88%。",
    installer: "Zeabur Installer 安装前的确认页：内存够不够、要装哪些组件、大约要多久。",
  },
  projects: {
    title: "四个项目",
    lead: "可以整套一起用，也可以只用其中一个，放进你现有的集群。",
    more: "看看能做什么",
  },
  zeabur: {
    tagline: "部署和管理服务的 Web 界面",
    summary: "把集群整理成项目和服务，说明哪里出错、该怎么处理。",
    points: [
      "每个请求都带着你自己的凭据，能不能执行由 kube-apiserver 决定。",
      "改配置前先列出会写入的字段和当前由谁管理，确认后才应用。",
      "所有状态都在 Kubernetes 对象里，没有数据库。一个项目就是一个 Namespace。",
    ],
    docs: "Zeabur 文档",
  },
  identity: {
    tagline: "用通行密钥登录 kubectl",
    summary: "kubectl 通过浏览器用通行密钥登录，拿到几分钟就过期的 token。",
    points: [
      "kubectl 会打开浏览器，用 Touch ID、Windows Hello 或安全密钥登录，拿到几分钟就过期的 token。",
      "管理员有专用账号，只能用通行密钥登录，token 5 分钟过期，工作时会自动换新。",
      "一个约 20 MB 的 Pod，运行在它保护的集群里，不需要数据库。",
    ],
    docs: "Identity 文档",
  },
  builder: {
    tagline: "推送 commit，拿到镜像 digest",
    summary: "用 BuildKit 从 Git 构建镜像的 Kubernetes Operator。",
    points: [
      "用 BuildKit 从 Git 构建镜像的 Kubernetes Operator。",
      "每个新 commit 构建一次，推送到镜像仓库，再把镜像写进 status.latestImage，交给你的部署工具。",
    ],
    docs: "Builder 文档",
  },
  catalog: {
    tagline: "经过测试的组件与模板",
    summary: "集群组件和应用模板，每一项都由 CI 安装并测试。",
    points: [
      "组件是 Ingress、证书、监控、数据库 Operator 这类集群级别的东西。每一项都写明用哪个 Chart、哪个版本、哪些 values，以及原因。",
      "模板是 n8n、Dify、WordPress 这类应用，固定镜像版本，也设置好资源请求和上限。",
      "CI 会安装并测试每一项。每次发版生成一份带签名的 bundle。",
    ],
    docs: "Catalog 说明",
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
  leave: {
    title: "移除 Zeabur，服务照常运行",
    body: "Zeabur 自己不存数据。移除 Chart 后，Deployment、Service、Ingress 和数据都留在集群里，可以继续用 kubectl、Helm、Argo CD 或 Flux 管理。",
    link: "移除 Zeabur 的步骤",
  },
}

const en: LandingCopy = {
  title: "Zeabur Open Source",
  description:
    "Deploy and run services on your own Kubernetes. Zeabur, Zeabur Identity, Zeabur Builder and Zeabur Catalog are Apache-2.0 licensed.",
  hero: {
    title: "Deploy and run services on your own Kubernetes",
    lead: "Zeabur shows your cluster as projects and services and tells you in plain words what's wrong. Before a change goes in, you see the exact fields it writes, then you apply it. It all runs on your own servers.",
    start: "Install on one server",
    source: "Source on GitHub",
  },
  facts: [
    { label: "License", value: "Apache-2.0" },
    { label: "Version", value: "0.1.0, images published. The API may change" },
    {
      label: "Runs on",
      value:
        "One Linux server, a Kubernetes cluster you already have, or your own machine with zeaburctl",
    },
  ],
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
  projects: {
    title: "Four projects",
    lead: "Use them together, or pick one and add it to the cluster you already have.",
    more: "See what it does",
  },
  zeabur: {
    tagline: "A web interface to deploy and run services",
    summary: "Shows the cluster as projects and services, what is wrong and what to do.",
    points: [
      "Every request carries your own credential, and kube-apiserver decides what you can do.",
      "A change first lists the fields it writes and who owns them now. It applies when you confirm.",
      "All state lives in Kubernetes objects, with no database. A project is a namespace.",
    ],
    docs: "Zeabur docs",
  },
  identity: {
    tagline: "Sign in to kubectl with a passkey",
    summary:
      "kubectl signs in through your browser with a passkey and gets a token that expires in minutes.",
    points: [
      "kubectl opens your browser. You sign in with Touch ID, Windows Hello or a security key and get a token that expires in minutes.",
      "Admins have their own accounts, passkey only, with tokens that last 5 minutes and renew while they work.",
      "One pod of about 20 MB, running inside the cluster it protects, with no database.",
    ],
    docs: "Identity docs",
  },
  builder: {
    tagline: "Push a commit, get an image digest",
    summary: "A Kubernetes operator that builds container images from Git with BuildKit.",
    points: [
      "A Kubernetes operator that builds container images from Git with BuildKit.",
      "Each new commit is built and pushed to your registry. The image goes into status.latestImage for your rollout tool to pick up.",
    ],
    docs: "Builder docs",
  },
  catalog: {
    tagline: "Tested components and templates",
    summary: "Cluster components and app templates, each installed and tested in CI.",
    points: [
      "Components are cluster-wide pieces like ingress, certificates, metrics and database operators. Each one says which chart, which version, which values, and why.",
      "Templates are apps like n8n, Dify and WordPress, with pinned images and resource requests and limits already set.",
      "CI installs and tests every one of them. Each release ships one signed bundle.",
    ],
    docs: "About Catalog",
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
  leave: {
    title: "Remove Zeabur, and your services keep running",
    body: "Zeabur keeps no data of its own. Uninstall the chart and your Deployments, Services, Ingresses and data stay in the cluster, ready for kubectl, Helm, Argo CD or Flux.",
    link: "How to remove Zeabur",
  },
}

export const landingCopy: Record<SiteLocale, LandingCopy> = { en, "zh-TW": zhTW, "zh-CN": zhCN }
