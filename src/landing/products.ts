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
      title: "Zeabur：在自己的主機上，用熟悉的方式部署服務",
      description:
        "Zeabur 是開源軟體。專案、服務、網域、環境變數和應用程式範本，都和 zeabur.com 的用法一樣。主機向哪家租、選哪個方案，由你決定。",
    },
    titleDim: "在自己的主機上，",
    title: "照 zeabur.com 的方式部署",
    sub: "專案、服務、網域、環境變數和應用程式範本，都是你在 zeabur.com 熟悉的用法。服務在你自己的主機上執行，費用依你選的雲端服務或機房計算。",
    docs: "閱讀 Zeabur 文件",
    source: "GitHub 上的原始碼",
    highlights: {
      titleDim: "用過 zeabur.com？",
      title: "大部分都一樣",
      items: [
        {
          tag: "deploy",
          title: "部署方式一樣",
          body: "從 Git、Docker Compose、Docker 映像檔或應用程式範本部署，也能直接上傳資料夾。",
        },
        {
          tag: "domains",
          title: "網域、變數和日誌",
          body: "幫服務加上網域，在服務頁改環境變數、看日誌。新版本有問題時，回到上一個版本。",
        },
        {
          tag: "server",
          title: "主機是你的，由你維護",
          body: "費用依你選的主機計算。升級 Zeabur、備份資料和維護主機，由你或你的團隊負責。",
        },
      ],
    },
    how: {
      titleDim: "你改設定之前，",
      title: "先讓你看過",
      steps: [
        {
          title: "整理成專案",
          body: "Zeabur 直接讀取叢集，把服務的程式、資料庫、網域和儲存空間放在一起。它沒有自己的資料庫要備份，每次讀寫都用你自己的權限。",
        },
        {
          title: "用白話說明問題",
          body: "需要處理的服務排在最前面，告訴你原因、該怎麼做，旁邊就是日誌。",
        },
        {
          title: "確認後才套用",
          body: "改設定前，先列出會建立、修改或刪除哪些東西，你確認後才寫入。有人剛改過同一個服務，就要重新檢查。",
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
      title: "Zeabur Identity：每個人用自己的帳號登入",
      description:
        "Zeabur 的登入頁。每個人用通行密鑰、GitHub、Google 或密碼登入自己的帳號，管理員要雙重驗證。單獨使用時，也能讓 kubectl 用同樣的方式登入。",
    },
    titleDim: "不共用管理員密碼，",
    title: "每個人有自己的帳號",
    sub: "Zeabur 的登入頁就是 Zeabur Identity，裝好 Zeabur 就有了。在成員頁邀請成員、選擇他們能用的專案。有人離開時，移除他並結束他的工作階段，10 分鐘內他就無法再存取。",
    docs: "閱讀入門指南",
    source: "GitHub 上的原始碼",
    highlights: {
      titleDim: "成員用自己的帳號，",
      title: "管理員多一道驗證",
      items: [
        {
          tag: "passkey",
          title: "用習慣的方式登入",
          body: "通行密鑰（Touch ID、Windows Hello 或安全金鑰）、GitHub、Google、公司的登入系統，或密碼。",
        },
        {
          tag: "5 min",
          title: "管理員要雙重驗證",
          body: "管理員帳號預設用通行密鑰，或密碼加驗證器 App 的驗證碼登入，權杖 5 分鐘到期，工作時會自動換新。日常工作用一般帳號，要改叢集時再登入管理員帳號。",
        },
        {
          tag: "~20 MB",
          title: "在你的伺服器上執行",
          body: "叢集裡只多一個約 20 MB 的程式，不需要資料庫，也不依賴外部服務，帳號就存在叢集裡。",
        },
      ],
    },
    how: {
      titleDim: "單獨使用時，",
      title: "kubectl 也這樣登入",
      steps: [
        {
          title: "執行 kubectl",
          body: "例如 kubectl get pods。瀏覽器會打開 Zeabur Identity 的登入頁。",
        },
        {
          title: "在瀏覽器登入",
          body: "kubectl 拿到 10 分鐘的權杖，你工作時它會在背景更新。",
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
        "sign-in": "日常登入：帳號密碼、通行密鑰和「使用 GitHub 繼續」",
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
          "通行密鑰、密碼，或連結的 GitHub、Google、公司登入系統帳號",
          "GitHub、Google 和公司登入系統要另外設定",
        ],
        [
          "管理員帳號",
          "預設用通行密鑰，或密碼加驗證碼；權杖 5 分鐘",
          "用 zeabur-identityctl 設定帳號類型",
        ],
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
      sub: "用 Zeabur 的話不用另外安裝。單獨使用時，入門指南會在 Ubuntu 伺服器裝好 k3s，下載並驗證 Zeabur Identity，再從你的電腦用通行密鑰登入。既有叢集用叢集管理員的 kubeconfig 執行下面幾行。",
      cta: "閱讀入門指南",
    },
  },
  builder: {
    meta: {
      title: "Zeabur Builder：程式碼推上 GitHub，就自動部署",
      description:
        "Zeabur 裡負責把 Git 儲存庫變成映像檔的部分。自動判斷程式碼用的語言，分支一更新就重新建置，建置變數以 BuildKit secret 傳遞。",
    },
    titleDim: "程式碼推上 GitHub，",
    title: "Zeabur 就會部署",
    sub: "跟在 zeabur.com 一樣：在專案選擇「新增」→「從 Git 部署」。Zeabur Builder 會判斷程式碼用的語言、建置映像檔，之後分支一有更新就重新建置。",
    docs: "閱讀 Builder 文件",
    source: "GitHub 上的原始碼",
    highlights: {
      titleDim: "不用寫 Dockerfile，",
      title: "推送後就換上新版本",
      items: [
        {
          tag: "railpack",
          title: "自動判斷語言",
          body: "用 Railpack 建置 Node.js、Python、Go、PHP、Ruby、Java、Rust 等應用程式和靜態網站，不需要 Dockerfile。儲存庫裡有 Dockerfile 時，就照它建置。",
        },
        {
          tag: "push",
          title: "分支更新就重新建置",
          body: "Zeabur Builder 每分鐘檢查一次分支。推送後就建置新版本，服務接著換成新版本。",
        },
        {
          tag: "secrets",
          title: "機密變數不會留在映像檔裡",
          body: "建置變數，例如下載私有套件用的權杖，以 BuildKit secret 傳遞。除非建置過程自己把值複製進去，否則不會存進映像檔。",
        },
      ],
    },
    how: {
      titleDim: "單獨使用時，",
      title: "從 commit 到映像檔 digest",
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
      sub: "單獨使用時，一個 Build 寫出 Git 儲存庫和建置方式。沒寫 ref 時跟著預設分支，status.resolvedRef 會寫出是哪一個分支。",
      cta: "閱讀 Builder 文件",
    },
  },
  catalog: {
    meta: {
      title: "Zeabur Catalog：一鍵部署的應用程式範本，上架前先測過",
      description:
        "在自己的伺服器上一鍵部署 n8n、WordPress、Dify、OpenClaw 等應用程式。每個範本上架前都先裝過、測過，版本固定，密碼自動產生。",
    },
    titleDim: "一鍵部署的範本，",
    title: "上架前先測過",
    sub: "在自己的伺服器上一鍵部署 n8n、WordPress、Dify、OpenClaw 等應用程式。Zeabur 已經內建這份目錄：在專案選擇「新增」→「應用程式範本」，挑一個就能部署。",
    docs: "閱讀 Catalog 說明",
    source: "GitHub 上的原始碼",
    highlights: {
      titleDim: "同一個範本，",
      title: "每次裝出同一個版本",
      items: [
        {
          tag: "CI",
          title: "上架前先測過",
          body: "範本的每次修改合併前，CI 都會把範本裝到 Kubernetes 叢集上，確認應用程式有回應。",
        },
        {
          tag: "version",
          title: "版本固定",
          body: "每個範本都固定映像檔版本，同一個範本每次裝出來都是同一個應用程式版本。新版範本會隨 Zeabur 升級提供。",
        },
        {
          tag: "secrets",
          title: "密碼自動產生",
          body: "部署時自動產生密碼和金鑰，存成 Kubernetes Secret，不會寫在範本裡。每個範本也寫明需要多少 CPU 和記憶體。",
        },
      ],
    },
    how: {
      titleDim: "單獨使用時，",
      title: "元件和範本都是可以讀的資料",
      steps: [
        {
          title: "寫下選擇",
          body: "每個 upstream 一個檔案，例如 components/traefik.yaml，寫明 chart、版本、values 和原因。",
        },
        { title: "CI 測試", body: "CI 安裝並測試每個元件和範本，也記錄閒置時的記憶體和 CPU。" },
        {
          title: "發版",
          body: "產生一份有簽章的 bundle。Zeabur 讀它來建議叢集缺什麼，自己不會安裝任何東西。",
        },
      ],
    },
    details: {
      title: "部分叢集元件",
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
      sub: "單獨使用時，叢集管理員會先裝好元件。每個元件都長這樣：說明為什麼推薦、授權、依賴哪些能力，以及要裝的 chart 和版本。",
      cta: "閱讀 Catalog 說明",
    },
  },
}

const zhCN: Record<ProductId, ProductCopy> = {
  zeabur: {
    meta: {
      title: "Zeabur：在自己的主机上，用熟悉的方式部署服务",
      description:
        "Zeabur 是开源软件。项目、服务、域名、环境变量和应用模板，都和 zeabur.com 的用法一样。主机找哪家租、选哪个套餐，由你决定。",
    },
    titleDim: "在自己的主机上，",
    title: "照 zeabur.com 的方式部署",
    sub: "项目、服务、域名、环境变量和应用模板，都是你在 zeabur.com 熟悉的用法。服务运行在你自己的主机上，费用按你选的云服务或机房计算。",
    docs: "阅读 Zeabur 文档",
    source: "GitHub 上的源代码",
    highlights: {
      titleDim: "用过 zeabur.com？",
      title: "大部分都一样",
      items: [
        {
          tag: "deploy",
          title: "部署方式一样",
          body: "从 Git、Docker Compose、Docker 镜像或应用模板部署，也能直接上传文件夹。",
        },
        {
          tag: "domains",
          title: "域名、变量和日志",
          body: "给服务绑定域名，在服务页修改环境变量、查看日志。新版本有问题时，回滚到上一个版本。",
        },
        {
          tag: "server",
          title: "主机是你的，由你维护",
          body: "费用按你选的主机计算。升级 Zeabur、备份数据和维护主机，由你或你的团队负责。",
        },
      ],
    },
    how: {
      titleDim: "你改配置之前，",
      title: "先让你看过",
      steps: [
        {
          title: "整理成项目",
          body: "Zeabur 直接读取集群，把服务的程序、数据库、域名和存储放在一起。它没有自己的数据库要备份，每次读写都用你自己的权限。",
        },
        {
          title: "用大白话说明问题",
          body: "需要处理的服务排在最前面，告诉你原因、该怎么做，旁边就是日志。",
        },
        {
          title: "确认后才应用",
          body: "改配置前，先列出会创建、修改或删除哪些东西，你确认后才写入。有人刚改过同一个服务，就要重新检查。",
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
      title: "Zeabur Identity：每个人用自己的账号登录",
      description:
        "Zeabur 的登录页。每个人用通行密钥、GitHub、Google 或密码登录自己的账号，管理员要双重验证。单独使用时，也能让 kubectl 用同样的方式登录。",
    },
    titleDim: "不共用管理员密码，",
    title: "每个人有自己的账号",
    sub: "Zeabur 的登录页就是 Zeabur Identity，装好 Zeabur 就有了。在成员页邀请成员、选择他们能用的项目。有人离开时，移除他并结束他的会话，10 分钟内他就无法再访问。",
    docs: "阅读入门指南",
    source: "GitHub 上的源代码",
    highlights: {
      titleDim: "成员用自己的账号，",
      title: "管理员多一道验证",
      items: [
        {
          tag: "passkey",
          title: "用习惯的方式登录",
          body: "通行密钥（Touch ID、Windows Hello 或安全密钥）、GitHub、Google、公司的登录系统，或密码。",
        },
        {
          tag: "5 min",
          title: "管理员要双重验证",
          body: "管理员账号默认用通行密钥，或密码加身份验证器 App 的验证码登录，令牌 5 分钟过期，工作时会自动换新。日常工作用普通账号，要改集群时再登录管理员账号。",
        },
        {
          tag: "~20 MB",
          title: "运行在你的服务器上",
          body: "集群里只多一个约 20 MB 的程序，不需要数据库，也不依赖外部服务，账号就存在集群里。",
        },
      ],
    },
    how: {
      titleDim: "单独使用时，",
      title: "kubectl 也这样登录",
      steps: [
        {
          title: "运行 kubectl",
          body: "例如 kubectl get pods。浏览器会打开 Zeabur Identity 的登录页。",
        },
        { title: "在浏览器登录", body: "kubectl 拿到 10 分钟的令牌，你工作时它会在后台更新。" },
        {
          title: "Kubernetes 自己验证",
          body: "kube-apiserver 通过 OpenID Connect 验证令牌。撤销某人的会话后，他手上的令牌最多十分钟就失效。",
        },
      ],
    },
    shots: {
      title: "登录时看到的页面",
      captions: {
        "sign-in": "日常登录：账号密码、通行密钥和“使用 GitHub 继续”",
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
          "通行密钥、密码，或关联的 GitHub、Google、公司登录系统账号",
          "GitHub、Google 和公司登录系统需要另外配置",
        ],
        [
          "管理员账号",
          "默认用通行密钥，或密码加验证码；令牌 5 分钟",
          "用 zeabur-identityctl 设置账号类型",
        ],
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
      sub: "用 Zeabur 的话不用另外安装。单独使用时，入门指南会在 Ubuntu 服务器上装好 k3s，下载并验证 Zeabur Identity，再从你的电脑用通行密钥登录。现有集群用集群管理员的 kubeconfig 运行下面几行。",
      cta: "阅读入门指南",
    },
  },
  builder: {
    meta: {
      title: "Zeabur Builder：代码推到 GitHub，就自动部署",
      description:
        "Zeabur 里负责把 Git 仓库变成镜像的部分。自动识别代码用的语言，分支一更新就重新构建，构建变量以 BuildKit secret 传递。",
    },
    titleDim: "代码推到 GitHub，",
    title: "Zeabur 就会部署",
    sub: "跟在 zeabur.com 上一样：在项目里选择“新建”→“从 Git 部署”。Zeabur Builder 会识别代码用的语言、构建镜像，之后分支一有更新就重新构建。",
    docs: "阅读 Builder 文档",
    source: "GitHub 上的源代码",
    highlights: {
      titleDim: "不用写 Dockerfile，",
      title: "推送后就换上新版本",
      items: [
        {
          tag: "railpack",
          title: "自动识别语言",
          body: "用 Railpack 构建 Node.js、Python、Go、PHP、Ruby、Java、Rust 等应用和静态网站，不需要 Dockerfile。仓库里有 Dockerfile 时，就按它构建。",
        },
        {
          tag: "push",
          title: "分支更新就重新构建",
          body: "Zeabur Builder 每分钟检查一次分支。推送后就构建新版本，服务接着换成新版本。",
        },
        {
          tag: "secrets",
          title: "机密变量不会留在镜像里",
          body: "构建变量，例如下载私有依赖用的令牌，以 BuildKit secret 传递。除非构建过程自己把值复制进去，否则不会存进镜像。",
        },
      ],
    },
    how: {
      titleDim: "单独使用时，",
      title: "从 commit 到镜像 digest",
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
      sub: "单独使用时，一个 Build 写明 Git 仓库和构建方式。没写 ref 时跟随默认分支，status.resolvedRef 会写出是哪个分支。",
      cta: "阅读 Builder 文档",
    },
  },
  catalog: {
    meta: {
      title: "Zeabur Catalog：一键部署的应用模板，上架前先测过",
      description:
        "在自己的服务器上一键部署 n8n、WordPress、Dify、OpenClaw 等应用。每个模板上架前都先装过、测过，版本固定，密码自动生成。",
    },
    titleDim: "一键部署的模板，",
    title: "上架前先测过",
    sub: "在自己的服务器上一键部署 n8n、WordPress、Dify、OpenClaw 等应用。Zeabur 已经内置这份目录：在项目里选择“新建”→“应用模板”，挑一个就能部署。",
    docs: "阅读 Catalog 说明",
    source: "GitHub 上的源代码",
    highlights: {
      titleDim: "同一个模板，",
      title: "每次装出同一个版本",
      items: [
        {
          tag: "CI",
          title: "上架前先测过",
          body: "模板的每次修改合并前，CI 都会把模板装到 Kubernetes 集群上，确认应用有响应。",
        },
        {
          tag: "version",
          title: "版本固定",
          body: "每个模板都固定镜像版本，同一个模板每次装出来都是同一个应用版本。新版模板随 Zeabur 升级提供。",
        },
        {
          tag: "secrets",
          title: "密码自动生成",
          body: "部署时自动生成密码和密钥，存成 Kubernetes Secret，不会写在模板里。每个模板也写明需要多少 CPU 和内存。",
        },
      ],
    },
    how: {
      titleDim: "单独使用时，",
      title: "组件和模板都是可以读的数据",
      steps: [
        {
          title: "写下选择",
          body: "每个 upstream 一个文件，例如 components/traefik.yaml，写明 chart、版本、values 和原因。",
        },
        { title: "CI 测试", body: "CI 安装并测试每个组件和模板，也记录空闲时的内存和 CPU。" },
        {
          title: "发版",
          body: "生成一份带签名的 bundle。Zeabur 读取它来建议集群缺什么，自己不会安装任何东西。",
        },
      ],
    },
    details: {
      title: "部分集群组件",
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
      sub: "单独使用时，集群管理员会先装好组件。每个组件都是这样：说明为什么推荐、许可证、依赖哪些能力，以及要装的 chart 和版本。",
      cta: "阅读 Catalog 说明",
    },
  },
}

const en: Record<ProductId, ProductCopy> = {
  zeabur: {
    meta: {
      title: "Zeabur: deploy on your own server, the way you do on zeabur.com",
      description:
        "Zeabur is open source. Projects, services, domains, variables and templates work as they do on zeabur.com. You choose the hosting provider and the plan.",
    },
    titleDim: "On your own server,",
    title: "deploy the way you do on zeabur.com.",
    sub: "Projects, services, domains, variables and templates work the way you know from zeabur.com. Your services run on your own server, and you pay the cloud or data center you chose.",
    docs: "Read the Zeabur docs",
    source: "Source on GitHub",
    highlights: {
      titleDim: "Used zeabur.com?",
      title: "Most of it is the same.",
      items: [
        {
          tag: "deploy",
          title: "The same ways to deploy",
          body: "Deploy from Git, Docker Compose, a Docker image or a template, or upload a folder.",
        },
        {
          tag: "domains",
          title: "Domains, variables and logs",
          body: "Add a domain to a service, change its variables and read its logs on the service page. If a new version has a problem, roll back.",
        },
        {
          tag: "server",
          title: "Your server, your upkeep",
          body: "You pay for the server you chose. You or your team upgrade Zeabur, back up data and look after the server.",
        },
      ],
    },
    how: {
      titleDim: "Before your change applies,",
      title: "you see it first.",
      steps: [
        {
          title: "Grouped into projects",
          body: "Zeabur reads the cluster directly and puts each service's app, database, domains and storage together. It has no database of its own to back up, and every read and write uses your own rights.",
        },
        {
          title: "Problems in plain words",
          body: "Services that need attention come first, with the cause, what to do next and the logs beside them.",
        },
        {
          title: "Applied when you confirm",
          body: "A change first lists what it will create, change or delete, and writes only when you confirm. If someone just changed the same service, you review again.",
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
      title: "Zeabur Identity: an account for each person",
      description:
        "Zeabur's sign-in page. Each person signs in to their own account with a passkey, GitHub, Google or a password, and admins use two factors. On its own, it signs kubectl in the same way.",
    },
    titleDim: "No shared admin password.",
    title: "An account for each person.",
    sub: "Zeabur's sign-in page is Zeabur Identity, so it comes with Zeabur. Invite people and choose their projects on the Members page. When someone leaves, remove them and end their sessions, and they lose access within 10 minutes.",
    docs: "Read the getting-started guide",
    source: "Source on GitHub",
    highlights: {
      titleDim: "Members use their own accounts,",
      title: "admins add a second factor.",
      items: [
        {
          tag: "passkey",
          title: "Sign in the way you already do",
          body: "A passkey (Touch ID, Windows Hello or a security key), GitHub, Google, your company's sign-in, or a password.",
        },
        {
          tag: "5 min",
          title: "Two factors for admins",
          body: "By default, an admin account signs in with a passkey, or a password and a code from an authenticator app. Its token lasts 5 minutes and renews while you work. Use a regular account day to day, and the admin account when you change the cluster.",
        },
        {
          tag: "~20 MB",
          title: "Runs on your server",
          body: "One small program of about 20 MB in your cluster. No database and no outside service; the accounts live in the cluster.",
        },
      ],
    },
    how: {
      titleDim: "On its own,",
      title: "kubectl signs in the same way.",
      steps: [
        {
          title: "Run kubectl",
          body: "kubectl get pods, for example. Your browser opens Zeabur Identity's sign-in page.",
        },
        {
          title: "Sign in in the browser",
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
        "sign-in": "Everyday sign-in: username and password, a passkey and Continue with GitHub",
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
          "Passkeys, passwords, or a linked GitHub, Google or company account",
          "GitHub, Google and company sign-in need setting up first",
        ],
        [
          "Admin accounts",
          "A passkey, or a password and code, by default; 5-minute tokens",
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
      sub: "With Zeabur there is nothing to install. For standalone use, the guide installs k3s on an Ubuntu server, downloads and verifies Zeabur Identity, and signs you in with a passkey from your computer. On a cluster you already have, run these lines with your cluster-admin kubeconfig.",
      cta: "Read the getting-started guide",
    },
  },
  builder: {
    meta: {
      title: "Zeabur Builder: push your code to GitHub, and Zeabur deploys it",
      description:
        "The part of Zeabur that turns a Git repository into an image. It finds your language, rebuilds when the branch changes, and passes build variables as BuildKit secrets.",
    },
    titleDim: "Push your code to GitHub,",
    title: "and Zeabur deploys it.",
    sub: "Just as on zeabur.com: in a project, choose Add → Deploy from Git. Zeabur Builder finds the language your code uses, builds an image, and builds again whenever the branch changes.",
    docs: "Read the Builder docs",
    source: "Source on GitHub",
    highlights: {
      titleDim: "No Dockerfile needed,",
      title: "and a push brings the new version.",
      items: [
        {
          tag: "railpack",
          title: "Finds your language",
          body: "Railpack builds Node.js, Python, Go, PHP, Ruby, Java, Rust and other apps, and static sites, with no Dockerfile. If the repository has a Dockerfile, it builds that.",
        },
        {
          tag: "push",
          title: "Rebuilds when the branch changes",
          body: "Zeabur Builder checks the branch every minute. After a push it builds the new version, and the service switches to it.",
        },
        {
          tag: "secrets",
          title: "Build secrets stay out of the image",
          body: "Build variables, such as a token for private packages, reach the build as BuildKit secrets. They are not stored in the image unless the build itself copies the value in.",
        },
      ],
    },
    how: {
      titleDim: "On its own,",
      title: "from a commit to an image digest.",
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
      sub: "Without Zeabur, a Build names a Git repository and a builder. Leave out ref to follow the default branch; status.resolvedRef says which branch that was.",
      cta: "Read the Builder docs",
    },
  },
  catalog: {
    meta: {
      title: "Zeabur Catalog: one-click templates, tested before they ship",
      description:
        "Deploy n8n, WordPress, Dify, OpenClaw and more on your own server in one click. Every template is installed and tested before it ships, with pinned versions and generated passwords.",
    },
    titleDim: "One-click templates,",
    title: "tested before they ship.",
    sub: "Deploy n8n, WordPress, Dify, OpenClaw and more on your own server in one click. The catalog comes with Zeabur: in a project, choose Add → App template and pick an app.",
    docs: "About Catalog",
    source: "Source on GitHub",
    highlights: {
      titleDim: "The same template",
      title: "installs the same version every time.",
      items: [
        {
          tag: "CI",
          title: "Tested before it ships",
          body: "Before any change to a template merges, CI installs it on a Kubernetes cluster and checks that the app responds.",
        },
        {
          tag: "version",
          title: "Pinned versions",
          body: "Every template pins its image, so it installs the same app version every time. New template versions come with Zeabur upgrades.",
        },
        {
          tag: "secrets",
          title: "Passwords generated for you",
          body: "Passwords and keys are generated at deploy time and stored as Kubernetes Secrets, never in the template. Each template also states the CPU and memory it needs.",
        },
      ],
    },
    how: {
      titleDim: "On its own,",
      title: "components and templates are data you can read.",
      steps: [
        {
          title: "Write it down",
          body: "One file per upstream, such as components/traefik.yaml, with the chart, version, values and the reason.",
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
      title: "Some of the cluster components",
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
      sub: "Without Zeabur, a cluster admin installs the components first. Every component looks like this: why it is recommended, its licence, the capabilities it needs, and the chart and version to install.",
      cta: "About Catalog",
    },
  },
}

export const productCopy: Record<SiteLocale, Record<ProductId, ProductCopy>> = {
  en,
  "zh-TW": zhTW,
  "zh-CN": zhCN,
}

/** The labels of the product pages' sections. */
export const sectionLabels: Record<
  SiteLocale,
  {
    how: string
    highlights: string
    screens: string
    features: string
    details: string
    start: string
  }
> = {
  "zh-TW": {
    how: "運作方式",
    highlights: "重點",
    screens: "畫面",
    features: "功能",
    details: "範圍",
    start: "開始",
  },
  "zh-CN": {
    how: "运作方式",
    highlights: "要点",
    screens: "画面",
    features: "功能",
    details: "范围",
    start: "开始",
  },
  en: {
    how: "How it works",
    highlights: "Highlights",
    screens: "Screens",
    features: "Features",
    details: "Scope",
    start: "Get started",
  },
}
