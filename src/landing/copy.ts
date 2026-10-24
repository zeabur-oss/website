import type { SiteLocale } from "../lib/urls.ts"

export type ProductCopy = { tagline: string; points: string[]; docs: string }

export type LandingCopy = {
  title: string
  description: string
  hero: { title: string; lead: string; status: string; start: string; source: string }
  heroAlt: string
  products: { title: string; lead: string }
  zeabur: ProductCopy & { alt: string }
  identity: ProductCopy & { alt: string; signInAlt: string }
  builder: ProductCopy & { file: string }
  catalog: ProductCopy & { file: string }
  start: {
    title: string
    server: { title: string; body: string; link: string }
    cluster: { title: string; body: string; link: string }
    laptop: { title: string; body: string; link: string }
    shotAlt: string
  }
  leave: { title: string; body: string; link: string }
  footer: { license: string; github: string; docs: string }
}

const zhTW: LandingCopy = {
  title: "Zeabur 開源專案",
  description:
    "在自己的 Kubernetes 上部署和管理服務。Zeabur、Zeabur Identity、Zeabur Builder 和 Zeabur Catalog 都採 Apache-2.0 授權。",
  hero: {
    title: "在自己的 Kubernetes 上部署和管理服務",
    lead: "Zeabur 把叢集整理成專案和服務，用白話說明哪裡出了問題。改設定前，先檢查這次會寫入哪些欄位，再套用。整套都裝在你自己的伺服器上，原始碼採 Apache-2.0 授權。",
    status: "目前是 0.0.1 pre-alpha 版本，還沒發佈映像檔，API 也可能再調整。",
    start: "在一台伺服器安裝",
    source: "在 GitHub 查看原始碼",
  },
  heroAlt: "shop 專案頁：服務、資料庫和它們之間的連線",
  products: {
    title: "四個專案",
    lead: "可以整套一起用，也可以只拿其中一個，放進你現有的叢集。",
  },
  zeabur: {
    tagline: "部署和管理服務的網頁介面",
    points: [
      "每個請求都帶著你自己的憑證，能不能做由 kube-apiserver 決定。",
      "改設定前先列出會寫入的欄位和目前由誰管理，確認後才套用。",
      "所有狀態都在 Kubernetes 物件裡，沒有資料庫。一個專案就是一個 Namespace。",
    ],
    docs: "Zeabur 文件",
    alt: "一個不斷當掉的服務：原因、該怎麼處理，以及判斷的依據",
  },
  identity: {
    tagline: "用通行密鑰登入 kubectl",
    points: [
      "kubectl 會打開瀏覽器，用 Touch ID、Windows Hello 或安全金鑰登入，拿到幾分鐘就到期的 token。",
      "平常的 token 只能查看。要改叢集時再驗證一次通行密鑰，取得 5 分鐘的管理員權限。",
      "一個約 20 MB 的 pod，跑在它保護的叢集裡，不需要資料庫。",
    ],
    docs: "Identity 文件",
    signInAlt: "登入頁：通行密鑰按鈕和「使用 GitHub 繼續」",
    alt: "管理員登入頁：kubectl 要求 5 分鐘的管理員權限，只能用通行密鑰",
  },
  builder: {
    tagline: "推送 commit，拿到映像檔 digest",
    points: [
      "用 BuildKit 從 Git 建置映像檔的 Kubernetes operator。",
      "每個新 commit 建置一次，推到 registry，再把映像檔寫進 status.latestImage，交給你的部署工具。",
    ],
    docs: "Builder 文件",
    file: "README.md 裡的 Build 範例",
  },
  catalog: {
    tagline: "測試過的元件與範本",
    points: [
      "元件是 ingress、憑證、監控、資料庫 operator 這類叢集層級的東西。每一項寫明用哪個 chart、哪個版本、哪些 values，以及原因。",
      "範本是 n8n、Dify、WordPress 這類應用程式，固定映像檔版本，也設好資源需求和上限。",
      "CI 會安裝並測試每一項。每次發版產生一份有簽章的 bundle。",
    ],
    docs: "Catalog 說明",
    file: "components/certificates/cert-manager.yaml",
  },
  start: {
    title: "從手邊的環境開始",
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
    shotAlt: "Zeabur Installer 的元件選擇步驟",
  },
  leave: {
    title: "移除 Zeabur，服務照常執行",
    body: "Zeabur 自己不存資料。移除 chart 後，Deployment、Service、Ingress 和資料都留在叢集裡，可以繼續用 kubectl、Helm、Argo CD 或 Flux 管理。",
    link: "移除 Zeabur 的步驟",
  },
  footer: { license: "Apache-2.0 授權", github: "GitHub", docs: "文件" },
}

const zhCN: LandingCopy = {
  title: "Zeabur 开源项目",
  description:
    "在自己的 Kubernetes 上部署和管理服务。Zeabur、Zeabur Identity、Zeabur Builder 和 Zeabur Catalog 均采用 Apache-2.0 许可证。",
  hero: {
    title: "在自己的 Kubernetes 上部署和管理服务",
    lead: "Zeabur 把集群整理成项目和服务，用大白话说明哪里出了问题。改配置前，先检查这次会写入哪些字段，再应用。整套都装在你自己的服务器上，源代码采用 Apache-2.0 许可证。",
    status: "目前是 0.0.1 pre-alpha 版本，还没有发布镜像，API 也可能还会调整。",
    start: "在一台服务器上安装",
    source: "在 GitHub 查看源代码",
  },
  heroAlt: "shop 项目页：服务、数据库以及它们之间的连接",
  products: {
    title: "四个项目",
    lead: "可以整套一起用，也可以只用其中一个，放进你现有的集群。",
  },
  zeabur: {
    tagline: "部署和管理服务的 Web 界面",
    points: [
      "每个请求都带着你自己的凭据，能不能执行由 kube-apiserver 决定。",
      "改配置前先列出会写入的字段和当前由谁管理，确认后才应用。",
      "所有状态都在 Kubernetes 对象里，没有数据库。一个项目就是一个 Namespace。",
    ],
    docs: "Zeabur 文档",
    alt: "一个反复崩溃的服务：原因、处理方法以及判断依据",
  },
  identity: {
    tagline: "用通行密钥登录 kubectl",
    points: [
      "kubectl 会打开浏览器，用 Touch ID、Windows Hello 或安全密钥登录，拿到几分钟就过期的 token。",
      "平时的 token 只能查看。要改集群时再验证一次通行密钥，获得 5 分钟的管理员权限。",
      "一个约 20 MB 的 Pod，运行在它保护的集群里，不需要数据库。",
    ],
    docs: "Identity 文档",
    signInAlt: "登录页：通行密钥按钮和“使用 GitHub 继续”",
    alt: "管理员登录页：kubectl 申请 5 分钟的管理员权限，只能用通行密钥",
  },
  builder: {
    tagline: "推送 commit，拿到镜像 digest",
    points: [
      "用 BuildKit 从 Git 构建镜像的 Kubernetes Operator。",
      "每个新 commit 构建一次，推送到镜像仓库，再把镜像写进 status.latestImage，交给你的部署工具。",
    ],
    docs: "Builder 文档",
    file: "README.md 里的 Build 示例",
  },
  catalog: {
    tagline: "经过测试的组件与模板",
    points: [
      "组件是 Ingress、证书、监控、数据库 Operator 这类集群级别的东西。每一项都写明用哪个 Chart、哪个版本、哪些 values，以及原因。",
      "模板是 n8n、Dify、WordPress 这类应用，固定镜像版本，也设置好资源请求和上限。",
      "CI 会安装并测试每一项。每次发版生成一份带签名的 bundle。",
    ],
    docs: "Catalog 说明",
    file: "components/certificates/cert-manager.yaml",
  },
  start: {
    title: "从手头的环境开始",
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
    shotAlt: "Zeabur Installer 的组件选择步骤",
  },
  leave: {
    title: "移除 Zeabur，服务照常运行",
    body: "Zeabur 自己不存数据。移除 Chart 后，Deployment、Service、Ingress 和数据都留在集群里，可以继续用 kubectl、Helm、Argo CD 或 Flux 管理。",
    link: "移除 Zeabur 的步骤",
  },
  footer: { license: "Apache-2.0 许可证", github: "GitHub", docs: "文档" },
}

const en: LandingCopy = {
  title: "Zeabur Open Source",
  description:
    "Deploy and run services on your own Kubernetes. Zeabur, Zeabur Identity, Zeabur Builder and Zeabur Catalog are Apache-2.0 licensed.",
  hero: {
    title: "Deploy and run services on your own Kubernetes",
    lead: "Zeabur shows your cluster as projects and services and tells you in plain words what's wrong. Before a change goes in, you see the exact fields it writes, then you apply it. It all runs on your own servers, and the source is Apache-2.0.",
    status: "This is 0.0.1 pre-alpha. There are no published images yet, and the API may change.",
    start: "Install on one server",
    source: "View source on GitHub",
  },
  heroAlt: "The shop project: its services, databases and the connections between them",
  products: {
    title: "Four projects",
    lead: "Use them together, or pick one and add it to the cluster you already have.",
  },
  zeabur: {
    tagline: "A web interface to deploy and run services",
    points: [
      "Every request carries your own credential, and kube-apiserver decides what you can do.",
      "A change first lists the fields it writes and who owns them now. It applies when you confirm.",
      "All state lives in Kubernetes objects, with no database. A project is a namespace.",
    ],
    docs: "Zeabur docs",
    alt: "A service that keeps crashing: why, what to do, and the evidence",
  },
  identity: {
    tagline: "Sign in to kubectl with a passkey",
    points: [
      "kubectl opens your browser. You sign in with Touch ID, Windows Hello or a security key and get a token that expires in minutes.",
      "Your everyday token can only look. To change the cluster, confirm with your passkey again for five minutes of admin rights.",
      "One pod of about 20 MB, running inside the cluster it protects, with no database.",
    ],
    docs: "Identity docs",
    signInAlt: "Sign-in page with a passkey button and Continue with GitHub",
    alt: "Admin sign-in: kubectl asks for five minutes of admin rights, passkey only",
  },
  builder: {
    tagline: "Push a commit, get an image digest",
    points: [
      "A Kubernetes operator that builds container images from Git with BuildKit.",
      "Each new commit is built and pushed to your registry. The image goes into status.latestImage for your rollout tool to pick up.",
    ],
    docs: "Builder docs",
    file: "The Build example from README.md",
  },
  catalog: {
    tagline: "Tested components and templates",
    points: [
      "Components are cluster-wide pieces like ingress, certificates, metrics and database operators. Each one says which chart, which version, which values, and why.",
      "Templates are apps like n8n, Dify and WordPress, with pinned images and resource requests and limits already set.",
      "CI installs and tests every one of them. Each release ships one signed bundle.",
    ],
    docs: "About Catalog",
    file: "components/certificates/cert-manager.yaml",
  },
  start: {
    title: "Start with what you have",
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
    shotAlt: "The component step of the Zeabur Installer",
  },
  leave: {
    title: "Remove Zeabur, and your services keep running",
    body: "Zeabur keeps no data of its own. Uninstall the chart and your Deployments, Services, Ingresses and data stay in the cluster, ready for kubectl, Helm, Argo CD or Flux.",
    link: "How to remove Zeabur",
  },
  footer: { license: "Apache-2.0", github: "GitHub", docs: "Docs" },
}

export const landingCopy: Record<SiteLocale, LandingCopy> = { en, "zh-TW": zhTW, "zh-CN": zhCN }
