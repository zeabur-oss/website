// The product pages (/zeabur, /identity, /builder, /catalog) in each locale. zh-TW is written
// first, then zh-CN and English; all three say the same things.
import type { ProductId } from "../lib/products.ts"
import type { SiteLocale } from "../lib/urls.ts"

type Item = { tag: string; title: string; body: string }
type Step = { title: string; body: string }

export type ProductCopy = {
  meta: { title: string; description: string }
  titleDim: string
  title: string
  sub: string
  docs: string
  source: string
  highlights: { titleDim: string; title: string; items: Item[] }
  how: { titleDim: string; title: string; steps: Step[] }
  shots?: { title: string; captions: Record<string, string> }
  details: { title: string; cols: string[]; rows: string[][] }
  start: { title: string; sub: string; cta: string }
}

const zhTW: Record<ProductId, ProductCopy> = {
  zeabur: {
    meta: {
      title: "Zeabur：在自己的 Kubernetes 上部署和管理服務",
      description:
        "Zeabur 把 Namespace 整理成專案和服務，用登入者自己的權限讀寫叢集。改設定前先列出會寫入的欄位，確認後才套用。",
    },
    titleDim: "在自己的叢集上，",
    title: "用專案和服務管理 Kubernetes",
    sub: "Zeabur 直接讀取 Kubernetes 物件，把 Namespace 整理成專案和服務，說明哪裡出了問題。改設定前，先列出這次會寫入哪些欄位，確認後才套用。",
    docs: "閱讀 Zeabur 文件",
    source: "GitHub 上的原始碼",
    highlights: {
      titleDim: "沒有自己的資料庫，",
      title: "也沒有自己的權限",
      items: [
        {
          tag: "RBAC",
          title: "用你自己的權限",
          body: "每次讀寫叢集都帶著登入者的權杖，能做什麼由 Kubernetes RBAC 決定。Chart 建立的 ServiceAccount 沒有綁定任何 Role。",
        },
        {
          tag: "plan",
          title: "先檢查變更，再套用",
          body: "按下檢查變更，畫面列出要建立、修改或刪除的物件。這份變更 10 分鐘內有效，期間有人改過同一個物件，就要重新檢查。",
        },
        {
          tag: "Helm",
          title: "其他工具管的服務不亂改",
          body: "Helm、Argo CD、Flux 管理的物件只能重新啟動。其他修改會被擋下，並告訴你該去改 Helm values 還是 Git 儲存庫。",
        },
      ],
    },
    how: {
      titleDim: "從叢集讀取，",
      title: "確認後才寫回去",
      steps: [
        {
          title: "讀取",
          body: "依 selector、Service、HTTPRoute 和 volume 的關係，把 Deployment、PVC、Secret 這些物件組成服務。",
        },
        {
          title: "呈現",
          body: "專案就是加了標籤的 Namespace。需要處理的服務排在最前面，旁邊就是記錄和事件。",
        },
        {
          title: "寫入",
          body: "每一筆寫入先送 kube-apiserver dry run，全部通過才真正寫入。物件被別人改過，就不會寫入。",
        },
      ],
    },
    details: {
      title: "能做什麼，需要準備什麼",
      cols: ["功能", "範圍", "叢集裡需要"],
      rows: [
        ["從 Git 部署", "推送後自動建置並部署", "Zeabur Builder"],
        ["映像檔與 Compose", "部署容器映像檔，匯入 Docker Compose 服務", "不用另外安裝"],
        ["資料庫", "建立、備份與還原", "對應的資料庫 operator，例如 CloudNativePG"],
        ["物件儲存", "建立 S3 物件儲存與儲存貯體", "SeaweedFS operator"],
        [
          "公開網域",
          "加上網域與 HTTPS，顯示維護與錯誤頁面",
          "ingress controller 或 Gateway，以及 cert-manager",
        ],
        ["管理叢集", "成員權限、節點、警示通知、叢集備份、元件", "管理員權限"],
      ],
    },
    start: {
      title: "從手邊的環境開始",
      sub: "三種裝法開啟的是同一套介面，差別在 Zeabur 跑在哪裡、用誰的憑證。",
      cta: "在一台伺服器安裝",
    },
  },
  identity: {
    meta: {
      title: "Zeabur Identity：用通行密鑰登入 Kubernetes",
      description:
        "kubectl 透過瀏覽器用通行密鑰登入，拿到幾分鐘就到期的權杖。管理員有專用帳號，只能用通行密鑰登入。",
    },
    titleDim: "刪掉 admin.conf，",
    title: "用通行密鑰登入叢集",
    sub: "kubectl 會打開瀏覽器，你用 Touch ID、Windows Hello 或安全金鑰登入，拿到幾分鐘就到期的權杖。權杖由 Kubernetes 自己驗證，Zeabur Identity 不在請求路徑上。",
    docs: "閱讀入門指南",
    source: "GitHub 上的原始碼",
    highlights: {
      titleDim: "成員用自己的權限，",
      title: "管理員用專用帳號",
      items: [
        {
          tag: "passkey",
          title: "通行密鑰，不用密碼",
          body: "用 Touch ID、Windows Hello 或安全金鑰登入。成員也可以連結 GitHub 或 Google 帳號，日常登入時使用。",
        },
        {
          tag: "5 min",
          title: "管理員有專用帳號",
          body: "管理員帳號只能用通行密鑰登入，權杖 5 分鐘到期，工作時會自動換新。日常工作用一般帳號，要改叢集時再登入管理員帳號。",
        },
        {
          tag: "~20 MB",
          title: "跑在它保護的叢集裡",
          body: "一個約 20 MB 的 Pod，不需要資料庫，也不用另外準備伺服器。Argo CD、Grafana 這類 OpenID Connect 應用程式也能用同一個 issuer。",
        },
      ],
    },
    how: {
      titleDim: "在瀏覽器登入，",
      title: "回到 kubectl 繼續做事",
      steps: [
        {
          title: "執行 kubectl",
          body: "例如 kubectl get pods。瀏覽器會打開 Zeabur Identity 的登入頁。",
        },
        {
          title: "用通行密鑰登入",
          body: "kubectl 拿到 10 分鐘的權杖，你工作時它會在背景續期。",
        },
        {
          title: "Kubernetes 自己驗證",
          body: "kube-apiserver 透過 OpenID Connect 驗證權杖。撤銷某人的工作階段後，他手上的權杖最多十分鐘就失效。",
        },
      ],
    },
    shots: {
      title: "登入時看到的頁面",
      captions: {
        "sign-in": "日常登入：通行密鑰按鈕和「使用 GitHub 繼續」",
        setup: "加入：用一次性連結建立通行密鑰",
      },
    },
    details: {
      title: "支援範圍",
      cols: ["項目", "範圍", "條件"],
      rows: [
        ["Kubernetes 發行版", "CI 在 k3s 上測試", "k0s 和 kubeadm 有設定可用，安裝還沒驗證"],
        [
          "登入方式",
          "通行密鑰，或連結的 GitHub、Google 帳號",
          "GitHub、Google 要另外設定 OAuth 應用程式",
        ],
        ["管理員帳號", "只能用通行密鑰，權杖 5 分鐘", "用 zeabur-identityctl 設定帳號類型"],
        [
          "其他應用程式",
          "用 zeabur-identityctl client create 登錄 Grafana、Argo CD",
          "應用程式支援 OpenID Connect",
        ],
        [
          "成員",
          "群組、管理員帳號、遺失通行密鑰、移除成員，也能從目錄同步",
          "同步要自己寫一小段腳本",
        ],
        ["你的電腦", "macOS、Linux 或 Windows 上的 kubectl", "依入門指南設定 kubeconfig"],
      ],
    },
    start: {
      title: "從一台 Ubuntu 伺服器開始",
      sub: "入門指南會在 Ubuntu 伺服器裝好 k3s，下載並驗證 Zeabur Identity，再從你的電腦用通行密鑰登入。既有叢集用叢集管理員的 kubeconfig 執行下面幾行。",
      cta: "閱讀入門指南",
    },
  },
  builder: {
    meta: {
      title: "Zeabur Builder：推送 commit，拿到映像檔 digest",
      description:
        "用 BuildKit 從 Git 建置映像檔的 Kubernetes operator。每個新 commit 建置一次，推到 registry，再把映像檔寫進 status.latestImage。",
    },
    titleDim: "推送 commit，",
    title: "拿到映像檔 digest",
    sub: "Zeabur Builder 是用 BuildKit 從 Git 建置映像檔的 Kubernetes operator。每個新 commit 建置一次，推到 registry，再把映像檔寫進 status.latestImage，交給你的部署工具。",
    docs: "閱讀 Builder 文件",
    source: "GitHub 上的原始碼",
    highlights: {
      titleDim: "只負責建置，",
      title: "部署交給你原本的工具",
      items: [
        {
          tag: "dockerfile · railpack",
          title: "兩種建置方式",
          body: "dockerfile 用你的 Dockerfile。沒有 Dockerfile 的儲存庫改用 Railpack 規劃建置，映像檔以 uid 1000 執行，能在 Pod Security restricted 下啟動。",
        },
        {
          tag: "buildkitd",
          title: "每個 Namespace 一個 buildkitd",
          body: "各自有快取、憑證授權和 registry 路徑。快取在建置之間保留，閒置 10 分鐘後縮到零。",
        },
        {
          tag: "tags",
          title: "排得出先後的標籤",
          body: "例如 main-1761058800-3e1a9c2：分支、Unix 時間和 commit。Flux、Argo CD Image Updater 和 Keel 都能依此更新部署。",
        },
      ],
    },
    how: {
      titleDim: "從 ref 到 digest，",
      title: "每一步都是 Kubernetes 物件",
      steps: [
        {
          title: "解析 ref",
          body: "controller 透過 Git 的 smart HTTP 或 SSH，把 Build 的 ref 解析成 commit。",
        },
        {
          title: "建置",
          body: "新的 commit 會建立一個 BuildRun 和一個 Job。Job 對同一個 Namespace 的 buildkitd 執行 buildctl，不需要特權。",
        },
        { title: "推送", body: "映像檔推上 registry，digest 和標籤寫進 BuildRun 和 Build。" },
      ],
    },
    details: {
      title: "什麼時候會建置",
      cols: ["觸發方式", "怎麼運作", "需要設定"],
      rows: [
        [
          "輪詢",
          "controller 每分鐘向 Git 伺服器查詢一次 ref",
          "不用設定，spec.triggers.pollInterval 可調整",
        ],
        [
          "Push webhook",
          "GitHub、GitLab、Gitea、Forgejo、Bitbucket 和 Standard Webhooks",
          "在 chart 啟用 webhooks，每個 Build 一個 secret",
        ],
        [
          "GitHub App",
          "私有儲存庫用短效的 installation token，每個 commit 都有 commit status",
          "叢集管理員建立一次 App",
        ],
        [
          "手動",
          "改 builder.zeabur.com/rebuild annotation 重新建置目前的 commit",
          "spec.suspend 可停止自動建置",
        ],
      ],
    },
    start: {
      title: "一個 Build，對應一個儲存庫",
      sub: "Build 寫出 Git 儲存庫和建置方式。沒寫 ref 時跟著預設分支，status.resolvedRef 會寫出是哪一個分支。",
      cta: "閱讀 Builder 文件",
    },
  },
  catalog: {
    meta: {
      title: "Zeabur Catalog：CI 測試過的叢集元件和範本",
      description:
        "叢集元件和應用程式範本的目錄。每一項寫明用哪個 chart、哪個版本、哪些 values 和原因，由 CI 安裝並測試。",
    },
    titleDim: "叢集該裝什麼，",
    title: "先在 CI 裡裝過一次",
    sub: "Zeabur Catalog 是叢集元件和應用程式範本的目錄。每一項寫明用哪個 chart、哪個版本、哪些 values，以及為什麼這樣選。CI 會安裝並測試每一項。",
    docs: "閱讀 Catalog 說明",
    source: "GitHub 上的原始碼",
    highlights: {
      titleDim: "元件和範本，",
      title: "都是可以讀的資料",
      items: [
        {
          tag: "components",
          title: "元件",
          body: "ingress、憑證、監控、資料庫 operator 這類每個叢集裝一次的東西，分別寫出單節點和多節點的建議。",
        },
        {
          tag: "templates",
          title: "範本",
          body: "n8n、Dify、WordPress 這類裝進一個 Namespace 的應用程式。固定映像檔版本，設好資源需求和上限，也寫出怎麼擴充、怎麼備份資料。",
        },
        {
          tag: "bundle",
          title: "一份有簽章的 bundle",
          body: "每次發版產生一份。任何工具都能讀它，產生 helm install 指令、Flux 或 Argo CD manifests，或 k3s 的 HelmChart。",
        },
      ],
    },
    how: {
      titleDim: "寫下選擇，",
      title: "測過才發版",
      steps: [
        {
          title: "寫下選擇",
          body: "一個能力和 upstream 一個檔案，例如 components/ingress/traefik.yaml，寫明 chart、版本、values 和原因。",
        },
        { title: "CI 測試", body: "CI 安裝並測試每個元件和範本，也記錄閒置時的記憶體和 CPU。" },
        {
          title: "發版",
          body: "產生一份有簽章的 bundle。Zeabur 讀它來建議叢集缺什麼，自己不會安裝任何東西。",
        },
      ],
    },
    details: {
      title: "部分元件",
      cols: ["能力", "Upstream", "單節點", "多節點"],
      rows: [
        ["ingress", "Traefik", "建議", "建議"],
        ["certificates", "cert-manager", "建議", "建議"],
        ["metrics", "VictoriaMetrics、metrics-server", "建議", "建議"],
        ["logs", "VictoriaLogs", "建議", "建議"],
        ["volume-backup", "K8up、Velero", "選用", "選用"],
        ["event-autoscaling", "KEDA", "選用", "建議"],
        ["replicated-storage", "Longhorn", "選用", "建議"],
        ["databases", "CloudNativePG、MariaDB Operator、MOCO", "選用", "選用"],
      ],
    },
    start: {
      title: "讀一個元件檔",
      sub: "每個元件都長這樣：說明為什麼推薦、授權、依賴哪些能力，以及要裝的 chart 和版本。",
      cta: "閱讀 Catalog 說明",
    },
  },
}

const zhCN: Record<ProductId, ProductCopy> = {
  zeabur: {
    meta: {
      title: "Zeabur：在自己的 Kubernetes 上部署和管理服务",
      description:
        "Zeabur 把 Namespace 整理成项目和服务，用登录者自己的权限读写集群。改配置前先列出会写入的字段，确认后才应用。",
    },
    titleDim: "在自己的集群上，",
    title: "用项目和服务管理 Kubernetes",
    sub: "Zeabur 直接读取 Kubernetes 对象，把 Namespace 整理成项目和服务，说明哪里出了问题。改配置前，先列出这次会写入哪些字段，确认后才应用。",
    docs: "阅读 Zeabur 文档",
    source: "GitHub 上的源代码",
    highlights: {
      titleDim: "没有自己的数据库，",
      title: "也没有自己的权限",
      items: [
        {
          tag: "RBAC",
          title: "用你自己的权限",
          body: "每次读写集群都带着登录者的令牌，能做什么由 Kubernetes RBAC 决定。Chart 创建的 ServiceAccount 没有绑定任何 Role。",
        },
        {
          tag: "plan",
          title: "先检查变更，再应用",
          body: "点击检查变更，页面列出要创建、修改或删除的对象。这份变更 10 分钟内有效，期间有人改过同一个对象，就要重新检查。",
        },
        {
          tag: "Helm",
          title: "其他工具管的服务不乱改",
          body: "Helm、Argo CD、Flux 管理的对象只能重启。其他修改会被拦下，并告诉你该去改 Helm values 还是 Git 仓库。",
        },
      ],
    },
    how: {
      titleDim: "从集群读取，",
      title: "确认后才写回去",
      steps: [
        {
          title: "读取",
          body: "按 selector、Service、HTTPRoute 和 volume 的关系，把 Deployment、PVC、Secret 这些对象组成服务。",
        },
        {
          title: "呈现",
          body: "项目就是加了标签的 Namespace。需要处理的服务排在最前面，旁边就是日志和事件。",
        },
        {
          title: "写入",
          body: "每一次写入先发给 kube-apiserver dry run，全部通过才真正写入。对象被别人改过，就不会写入。",
        },
      ],
    },
    details: {
      title: "能做什么，需要准备什么",
      cols: ["功能", "范围", "集群里需要"],
      rows: [
        ["从 Git 部署", "推送后自动构建并部署", "Zeabur Builder"],
        ["镜像与 Compose", "部署容器镜像，导入 Docker Compose 服务", "不用另外安装"],
        ["数据库", "创建、备份与恢复", "对应的数据库 Operator，例如 CloudNativePG"],
        ["对象存储", "创建 S3 对象存储与存储桶", "SeaweedFS Operator"],
        [
          "公开域名",
          "添加域名与 HTTPS，显示维护和错误页面",
          "Ingress Controller 或 Gateway，以及 cert-manager",
        ],
        ["管理集群", "成员权限、节点、告警通知、集群备份、组件", "管理员权限"],
      ],
    },
    start: {
      title: "从手头的环境开始",
      sub: "三种安装方式打开的是同一套界面，区别在于 Zeabur 运行在哪里、用谁的凭据。",
      cta: "在一台服务器上安装",
    },
  },
  identity: {
    meta: {
      title: "Zeabur Identity：用通行密钥登录 Kubernetes",
      description:
        "kubectl 通过浏览器用通行密钥登录，拿到几分钟就过期的令牌。管理员有专用账号，只能用通行密钥登录。",
    },
    titleDim: "删掉 admin.conf，",
    title: "用通行密钥登录集群",
    sub: "kubectl 会打开浏览器，你用 Touch ID、Windows Hello 或安全密钥登录，拿到几分钟就过期的令牌。令牌由 Kubernetes 自己验证，Zeabur Identity 不在请求路径上。",
    docs: "阅读入门指南",
    source: "GitHub 上的源代码",
    highlights: {
      titleDim: "成员用自己的权限，",
      title: "管理员用专用账号",
      items: [
        {
          tag: "passkey",
          title: "通行密钥，不用密码",
          body: "用 Touch ID、Windows Hello 或安全密钥登录。成员也可以关联 GitHub 或 Google 账号，日常登录时使用。",
        },
        {
          tag: "5 min",
          title: "管理员有专用账号",
          body: "管理员账号只能用通行密钥登录，令牌 5 分钟过期，工作时会自动换新。日常工作用普通账号，要改集群时再登录管理员账号。",
        },
        {
          tag: "~20 MB",
          title: "运行在它保护的集群里",
          body: "一个约 20 MB 的 Pod，不需要数据库，也不用另外准备服务器。Argo CD、Grafana 这类 OpenID Connect 应用也能用同一个 issuer。",
        },
      ],
    },
    how: {
      titleDim: "在浏览器登录，",
      title: "回到 kubectl 继续工作",
      steps: [
        {
          title: "运行 kubectl",
          body: "例如 kubectl get pods。浏览器会打开 Zeabur Identity 的登录页。",
        },
        { title: "用通行密钥登录", body: "kubectl 拿到 10 分钟的令牌，你工作时它会在后台续期。" },
        {
          title: "Kubernetes 自己验证",
          body: "kube-apiserver 通过 OpenID Connect 验证令牌。撤销某人的会话后，他手上的令牌最多十分钟就失效。",
        },
      ],
    },
    shots: {
      title: "登录时看到的页面",
      captions: {
        "sign-in": "日常登录：通行密钥按钮和“使用 GitHub 继续”",
        setup: "加入：用一次性链接创建通行密钥",
      },
    },
    details: {
      title: "支持范围",
      cols: ["项目", "范围", "条件"],
      rows: [
        ["Kubernetes 发行版", "CI 在 k3s 上测试", "k0s 和 kubeadm 有配置可用，安装尚未验证"],
        [
          "登录方式",
          "通行密钥，或关联的 GitHub、Google 账号",
          "GitHub、Google 需要另外配置 OAuth 应用",
        ],
        ["管理员账号", "只能用通行密钥，令牌 5 分钟", "用 zeabur-identityctl 设置账号类型"],
        [
          "其他应用",
          "用 zeabur-identityctl client create 注册 Grafana、Argo CD",
          "应用支持 OpenID Connect",
        ],
        [
          "成员",
          "用户组、管理员账号、丢失通行密钥、移除成员，也能从目录同步",
          "同步需要自己写一小段脚本",
        ],
        ["你的电脑", "macOS、Linux 或 Windows 上的 kubectl", "按入门指南配置 kubeconfig"],
      ],
    },
    start: {
      title: "从一台 Ubuntu 服务器开始",
      sub: "入门指南会在 Ubuntu 服务器上装好 k3s，下载并验证 Zeabur Identity，再从你的电脑用通行密钥登录。现有集群用集群管理员的 kubeconfig 运行下面几行。",
      cta: "阅读入门指南",
    },
  },
  builder: {
    meta: {
      title: "Zeabur Builder：推送 commit，拿到镜像 digest",
      description:
        "用 BuildKit 从 Git 构建镜像的 Kubernetes Operator。每个新 commit 构建一次，推送到镜像仓库，再把镜像写进 status.latestImage。",
    },
    titleDim: "推送 commit，",
    title: "拿到镜像 digest",
    sub: "Zeabur Builder 是用 BuildKit 从 Git 构建镜像的 Kubernetes Operator。每个新 commit 构建一次，推送到镜像仓库，再把镜像写进 status.latestImage，交给你的部署工具。",
    docs: "阅读 Builder 文档",
    source: "GitHub 上的源代码",
    highlights: {
      titleDim: "只负责构建，",
      title: "部署交给你原来的工具",
      items: [
        {
          tag: "dockerfile · railpack",
          title: "两种构建方式",
          body: "dockerfile 用你的 Dockerfile。没有 Dockerfile 的仓库改用 Railpack 规划构建，镜像以 uid 1000 运行，能在 Pod Security restricted 下启动。",
        },
        {
          tag: "buildkitd",
          title: "每个 Namespace 一个 buildkitd",
          body: "各自有缓存、证书颁发机构和镜像仓库路径。缓存在构建之间保留，空闲 10 分钟后缩容到零。",
        },
        {
          tag: "tags",
          title: "排得出先后的标签",
          body: "例如 main-1761058800-3e1a9c2：分支、Unix 时间和 commit。Flux、Argo CD Image Updater 和 Keel 都能据此更新部署。",
        },
      ],
    },
    how: {
      titleDim: "从 ref 到 digest，",
      title: "每一步都是 Kubernetes 对象",
      steps: [
        {
          title: "解析 ref",
          body: "controller 通过 Git 的 smart HTTP 或 SSH，把 Build 的 ref 解析成 commit。",
        },
        {
          title: "构建",
          body: "新的 commit 会创建一个 BuildRun 和一个 Job。Job 对同一个 Namespace 的 buildkitd 运行 buildctl，不需要特权。",
        },
        { title: "推送", body: "镜像推送到镜像仓库，digest 和标签写进 BuildRun 和 Build。" },
      ],
    },
    details: {
      title: "什么时候会构建",
      cols: ["触发方式", "怎么运作", "需要配置"],
      rows: [
        [
          "轮询",
          "controller 每分钟向 Git 服务器查询一次 ref",
          "不用配置，spec.triggers.pollInterval 可调整",
        ],
        [
          "Push webhook",
          "GitHub、GitLab、Gitea、Forgejo、Bitbucket 和 Standard Webhooks",
          "在 chart 中启用 webhooks，每个 Build 一个 secret",
        ],
        [
          "GitHub App",
          "私有仓库用短期的 installation token，每个 commit 都有 commit status",
          "集群管理员创建一次 App",
        ],
        [
          "手动",
          "修改 builder.zeabur.com/rebuild 注解，重新构建当前 commit",
          "spec.suspend 可停止自动构建",
        ],
      ],
    },
    start: {
      title: "一个 Build，对应一个仓库",
      sub: "Build 写明 Git 仓库和构建方式。没写 ref 时跟随默认分支，status.resolvedRef 会写出是哪个分支。",
      cta: "阅读 Builder 文档",
    },
  },
  catalog: {
    meta: {
      title: "Zeabur Catalog：经过 CI 测试的集群组件和模板",
      description:
        "集群组件和应用模板的目录。每一项写明用哪个 chart、哪个版本、哪些 values 和原因，由 CI 安装并测试。",
    },
    titleDim: "集群该装什么，",
    title: "先在 CI 里装过一次",
    sub: "Zeabur Catalog 是集群组件和应用模板的目录。每一项写明用哪个 chart、哪个版本、哪些 values，以及为什么这样选。CI 会安装并测试每一项。",
    docs: "阅读 Catalog 说明",
    source: "GitHub 上的源代码",
    highlights: {
      titleDim: "组件和模板，",
      title: "都是可以读的数据",
      items: [
        {
          tag: "components",
          title: "组件",
          body: "Ingress、证书、监控、数据库 Operator 这类每个集群装一次的东西，分别写出单节点和多节点的建议。",
        },
        {
          tag: "templates",
          title: "模板",
          body: "n8n、Dify、WordPress 这类装进一个 Namespace 的应用。固定镜像版本，设好资源请求和上限，也写出怎么扩容、怎么备份数据。",
        },
        {
          tag: "bundle",
          title: "一份带签名的 bundle",
          body: "每次发版生成一份。任何工具都能读取它，生成 helm install 命令、Flux 或 Argo CD manifests，或 k3s 的 HelmChart。",
        },
      ],
    },
    how: {
      titleDim: "写下选择，",
      title: "测过才发版",
      steps: [
        {
          title: "写下选择",
          body: "一个能力和 upstream 一个文件，例如 components/ingress/traefik.yaml，写明 chart、版本、values 和原因。",
        },
        { title: "CI 测试", body: "CI 安装并测试每个组件和模板，也记录空闲时的内存和 CPU。" },
        {
          title: "发版",
          body: "生成一份带签名的 bundle。Zeabur 读取它来建议集群缺什么，自己不会安装任何东西。",
        },
      ],
    },
    details: {
      title: "部分组件",
      cols: ["能力", "Upstream", "单节点", "多节点"],
      rows: [
        ["ingress", "Traefik", "推荐", "推荐"],
        ["certificates", "cert-manager", "推荐", "推荐"],
        ["metrics", "VictoriaMetrics、metrics-server", "推荐", "推荐"],
        ["logs", "VictoriaLogs", "推荐", "推荐"],
        ["volume-backup", "K8up、Velero", "可选", "可选"],
        ["event-autoscaling", "KEDA", "可选", "推荐"],
        ["replicated-storage", "Longhorn", "可选", "推荐"],
        ["databases", "CloudNativePG、MariaDB Operator、MOCO", "可选", "可选"],
      ],
    },
    start: {
      title: "读一个组件文件",
      sub: "每个组件都是这样：说明为什么推荐、许可证、依赖哪些能力，以及要装的 chart 和版本。",
      cta: "阅读 Catalog 说明",
    },
  },
}

const en: Record<ProductId, ProductCopy> = {
  zeabur: {
    meta: {
      title: "Zeabur: deploy and run services on your own Kubernetes",
      description:
        "Zeabur shows namespaces as projects and services and works with the signed-in person's own rights. A change lists the fields it writes and applies when you confirm.",
    },
    titleDim: "On your own cluster,",
    title: "run Kubernetes as projects and services.",
    sub: "Zeabur reads Kubernetes objects directly, shows each namespace as a project with its services, and tells you what is wrong. A change first lists the fields it will write, and applies when you confirm.",
    docs: "Read the Zeabur docs",
    source: "Source on GitHub",
    highlights: {
      titleDim: "No database of its own,",
      title: "and no rights of its own.",
      items: [
        {
          tag: "RBAC",
          title: "Your own rights",
          body: "Every read and write carries the signed-in person's token, and Kubernetes RBAC decides. The chart's ServiceAccount is bound to no Role.",
        },
        {
          tag: "plan",
          title: "Review, then apply",
          body: "Review changes lists the objects to create, change or delete. The review is valid for 10 minutes, and if someone changes the same object meanwhile, you review again.",
        },
        {
          tag: "Helm",
          title: "Hands off other tools' services",
          body: "Objects managed by Helm, Argo CD or Flux can only be restarted. Other edits are refused with a pointer to the Helm values or the Git repository.",
        },
      ],
    },
    how: {
      titleDim: "Read from the cluster,",
      title: "write back only when you confirm.",
      steps: [
        {
          title: "Read",
          body: "Selectors, Services, HTTPRoutes and volumes tie Deployments, PVCs and Secrets together into services.",
        },
        {
          title: "Show",
          body: "A project is a labelled namespace. Services that need attention come first, with their logs and events beside them.",
        },
        {
          title: "Write",
          body: "Every write goes through a kube-apiserver dry run first, and only when all pass are they applied. An object someone else changed is not written.",
        },
      ],
    },
    details: {
      title: "What it does, and what it needs",
      cols: ["Feature", "Scope", "Needs in the cluster"],
      rows: [
        ["Deploy from Git", "Build and deploy on every push", "Zeabur Builder"],
        [
          "Images and Compose",
          "Deploy container images, import Docker Compose services",
          "Nothing extra",
        ],
        [
          "Databases",
          "Create, back up and restore",
          "The database's operator, such as CloudNativePG",
        ],
        ["Object storage", "Create S3 object storage and buckets", "SeaweedFS operator"],
        [
          "Public domains",
          "Domains with HTTPS, maintenance and error pages",
          "An ingress controller or Gateway, and cert-manager",
        ],
        [
          "Cluster",
          "Member rights, nodes, alert notifications, cluster backups, components",
          "Admin rights",
        ],
      ],
    },
    start: {
      title: "Start with what you have",
      sub: "All three open the same interface. They differ in where Zeabur runs and whose credential it uses.",
      cta: "Install on one server",
    },
  },
  identity: {
    meta: {
      title: "Zeabur Identity: sign in to Kubernetes with a passkey",
      description:
        "kubectl signs in through your browser with a passkey and gets a token that expires in minutes. Admins have their own accounts, passkey only.",
    },
    titleDim: "Delete admin.conf.",
    title: "Sign in to your cluster with a passkey.",
    sub: "kubectl opens your browser, you sign in with Touch ID, Windows Hello or a security key, and get a token that expires in minutes. Kubernetes checks the token itself; Zeabur Identity is never in the path of your requests.",
    docs: "Read the getting-started guide",
    source: "Source on GitHub",
    highlights: {
      titleDim: "Members use their own rights,",
      title: "admins use their own accounts.",
      items: [
        {
          tag: "passkey",
          title: "Passkeys, not passwords",
          body: "Touch ID, Windows Hello or a security key. Teammates can also link a GitHub or Google account for everyday sign-in.",
        },
        {
          tag: "5 min",
          title: "Admins have their own accounts",
          body: "An admin account signs in with a passkey only, and its token lasts 5 minutes and renews while you work. Use a regular account day to day, and the admin account when you change the cluster.",
        },
        {
          tag: "~20 MB",
          title: "Runs inside the cluster it protects",
          body: "One pod of about 20 MB, no database, no extra servers. OpenID Connect apps such as Argo CD or Grafana can use the same issuer.",
        },
      ],
    },
    how: {
      titleDim: "Sign in in the browser,",
      title: "carry on in kubectl.",
      steps: [
        {
          title: "Run kubectl",
          body: "kubectl get pods, for example. Your browser opens Zeabur Identity's sign-in page.",
        },
        {
          title: "Use your passkey",
          body: "kubectl gets a token valid for ten minutes and renews it quietly while you work.",
        },
        {
          title: "Kubernetes checks it",
          body: "kube-apiserver verifies the token through OpenID Connect. Revoke someone's sessions and their token in hand stops working within ten minutes.",
        },
      ],
    },
    shots: {
      title: "The pages you sign in on",
      captions: {
        "sign-in": "Everyday sign-in: a passkey button and Continue with GitHub",
        setup: "Joining: create a passkey from a one-time link",
      },
    },
    details: {
      title: "What it supports",
      cols: ["Item", "Scope", "Conditions"],
      rows: [
        [
          "Kubernetes distributions",
          "Tested in CI on k3s",
          "k0s and kubeadm configuration is available; installation is unverified",
        ],
        [
          "Sign-in",
          "Passkeys, or a linked GitHub or Google account",
          "GitHub and Google need an OAuth app of your own",
        ],
        [
          "Admin accounts",
          "Passkey only, 5-minute tokens",
          "Set the account type with zeabur-identityctl",
        ],
        [
          "Other apps",
          "Register Grafana or Argo CD with zeabur-identityctl client create",
          "The app speaks OpenID Connect",
        ],
        [
          "People",
          "Groups, admin accounts, lost passkeys, removal, sync from a directory",
          "Sync needs a small script of your own",
        ],
        [
          "Your computer",
          "kubectl on macOS, Linux or Windows",
          "A kubeconfig set up as in the guide",
        ],
      ],
    },
    start: {
      title: "Start from one Ubuntu server",
      sub: "The guide installs k3s on an Ubuntu server, downloads and verifies Zeabur Identity, and signs you in with a passkey from your computer. On a cluster you already have, run these lines with your cluster-admin kubeconfig.",
      cta: "Read the getting-started guide",
    },
  },
  builder: {
    meta: {
      title: "Zeabur Builder: push a commit, get an image digest",
      description:
        "A Kubernetes operator that builds container images from Git with BuildKit. Each new commit is built once, pushed, and written to status.latestImage.",
    },
    titleDim: "Push a commit,",
    title: "get an image digest.",
    sub: "Zeabur Builder is a Kubernetes operator that builds container images from Git with BuildKit. Each new commit is built once and pushed to your registry, and the image goes into status.latestImage for your rollout tool.",
    docs: "Read the Builder docs",
    source: "Source on GitHub",
    highlights: {
      titleDim: "It builds images,",
      title: "your rollout tool deploys them.",
      items: [
        {
          tag: "dockerfile · railpack",
          title: "Two builders",
          body: "dockerfile builds your Dockerfile. Repositories without one are planned with Railpack, and those images run as uid 1000, so they start under Pod Security restricted.",
        },
        {
          tag: "buildkitd",
          title: "One buildkitd per namespace",
          body: "Each has its own cache, certificate authority and registry path. The cache stays between builds, and an idle buildkitd scales to zero after 10 minutes.",
        },
        {
          tag: "tags",
          title: "Tags that sort",
          body: "main-1761058800-3e1a9c2: branch, Unix time and commit. Flux, Argo CD Image Updater and Keel can roll out from them.",
        },
      ],
    },
    how: {
      titleDim: "From ref to digest,",
      title: "every step is a Kubernetes object.",
      steps: [
        {
          title: "Resolve the ref",
          body: "The controller resolves the Build's ref to a commit over Git's smart HTTP or SSH protocol.",
        },
        {
          title: "Build",
          body: "A new commit gets a BuildRun and a Job. The Job runs buildctl against its namespace's buildkitd and needs no privileges.",
        },
        {
          title: "Push",
          body: "The image is pushed, and its digest and tags land in the BuildRun and the Build.",
        },
      ],
    },
    details: {
      title: "When it builds",
      cols: ["Trigger", "How it works", "Setup"],
      rows: [
        [
          "Polling",
          "The controller asks the Git server for the ref every minute",
          "None; spec.triggers.pollInterval changes it",
        ],
        [
          "Push webhooks",
          "GitHub, GitLab, Gitea, Forgejo, Bitbucket and Standard Webhooks",
          "Enable webhooks in the chart, one secret per Build",
        ],
        [
          "GitHub App",
          "Private repositories with a short-lived installation token, and a commit status per commit",
          "A cluster admin creates the App once",
        ],
        [
          "By hand",
          "A new value in the builder.zeabur.com/rebuild annotation rebuilds the current commit",
          "spec.suspend stops automatic builds",
        ],
      ],
    },
    start: {
      title: "One Build per repository",
      sub: "A Build names a Git repository and a builder. Leave out ref to follow the default branch; status.resolvedRef says which branch that was.",
      cta: "Read the Builder docs",
    },
  },
  catalog: {
    meta: {
      title: "Zeabur Catalog: cluster components and templates, tested in CI",
      description:
        "A catalog of cluster components and app templates. Each says which chart, which version, which values and why, and CI installs and tests it.",
    },
    titleDim: "What a cluster needs,",
    title: "installed once in CI first.",
    sub: "Zeabur Catalog lists cluster components and app templates. Each entry says which chart, which version, which values, and why. CI installs and tests every one of them.",
    docs: "About Catalog",
    source: "Source on GitHub",
    highlights: {
      titleDim: "Components and templates,",
      title: "as data any tool can read.",
      items: [
        {
          tag: "components",
          title: "Components",
          body: "Ingress, certificates, metrics, database operators: what a cluster gets once, with separate advice for one node and for several.",
        },
        {
          tag: "templates",
          title: "Templates",
          body: "Apps such as n8n, Dify and WordPress, installed into one namespace. Images are pinned, requests and limits set, and each says how it scales and how its data is backed up.",
        },
        {
          tag: "bundle",
          title: "One signed bundle",
          body: "Each release publishes one. Any tool can read it to generate helm install commands, Flux or Argo CD manifests, or k3s HelmChart objects.",
        },
      ],
    },
    how: {
      titleDim: "Write the choice down,",
      title: "release it once it passes.",
      steps: [
        {
          title: "Write it down",
          body: "One file per capability and upstream, such as components/ingress/traefik.yaml, with the chart, version, values and the reason.",
        },
        {
          title: "Test in CI",
          body: "CI installs and tests every component and template, and records idle memory and CPU.",
        },
        {
          title: "Release",
          body: "One signed bundle. Zeabur reads it to suggest what a cluster is missing, and never installs anything itself.",
        },
      ],
    },
    details: {
      title: "Some of the components",
      cols: ["Capability", "Upstream", "Single node", "Multi-node"],
      rows: [
        ["ingress", "Traefik", "Recommended", "Recommended"],
        ["certificates", "cert-manager", "Recommended", "Recommended"],
        ["metrics", "VictoriaMetrics, metrics-server", "Recommended", "Recommended"],
        ["logs", "VictoriaLogs", "Recommended", "Recommended"],
        ["volume-backup", "K8up, Velero", "Optional", "Optional"],
        ["event-autoscaling", "KEDA", "Optional", "Recommended"],
        ["replicated-storage", "Longhorn", "Optional", "Recommended"],
        ["databases", "CloudNativePG, MariaDB Operator, MOCO", "Optional", "Optional"],
      ],
    },
    start: {
      title: "Read one component file",
      sub: "Every component looks like this: why it is recommended, its licence, the capabilities it needs, and the chart and version to install.",
      cta: "About Catalog",
    },
  },
}

export const productCopy: Record<SiteLocale, Record<ProductId, ProductCopy>> = {
  en,
  "zh-TW": zhTW,
  "zh-CN": zhCN,
}
