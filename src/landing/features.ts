// Every Zeabur feature on /zeabur, grouped by what people do with it. Taken from
// zeabur-notes/research/zeabur-feature-inventory.md: only what is on main, and a `note` says
// what a partly done feature is missing.
import type { SiteLocale } from "../lib/urls.ts"

export type GroupId =
  | "deploy"
  | "network"
  | "data"
  | "diagnose"
  | "team"
  | "cluster"
  | "install"
  | "leave"

type Words = [name: string, line: string, note?: string]
type Feature = { group: GroupId; doc?: string } & Record<SiteLocale, Words>

export const groupNames: Record<SiteLocale, Record<GroupId, string>> = {
  "zh-TW": {
    deploy: "部署與設定",
    network: "網路與網域",
    data: "資料與備份",
    diagnose: "看出哪裡出錯",
    team: "團隊與權限",
    cluster: "叢集與節點",
    install: "安裝",
    leave: "移除 Zeabur",
  },
  "zh-CN": {
    deploy: "部署与配置",
    network: "网络与域名",
    data: "数据与备份",
    diagnose: "看出哪里出错",
    team: "团队与权限",
    cluster: "集群与节点",
    install: "安装",
    leave: "移除 Zeabur",
  },
  en: {
    deploy: "Deploy and configure",
    network: "Network and domains",
    data: "Data and backups",
    diagnose: "Find what is wrong",
    team: "People and permissions",
    cluster: "Cluster and nodes",
    install: "Install",
    leave: "Leave Zeabur",
  },
}

export const features: Feature[] = [
  // Deploy and configure
  {
    group: "deploy",
    doc: "zeabur/deploy/image",
    "zh-TW": ["部署容器映像檔", "填上映像檔就能跑，會讀出連接埠，也能用私有 registry。"],
    "zh-CN": ["部署容器镜像", "填上镜像就能运行，会读出端口，也能用私有 registry。"],
    en: [
      "Deploy an image",
      "Name an image and it runs. Reads its ports and works with private registries.",
    ],
  },
  {
    group: "deploy",
    doc: "zeabur/deploy/compose",
    "zh-TW": [
      "匯入 Docker Compose",
      "貼上 compose.yaml，逐項列出會改變或略過的設定，資料庫可換成 operator 管的版本。",
      "只有 build: 的服務、UDP 和主機路徑會略過",
    ],
    "zh-CN": [
      "导入 Docker Compose",
      "粘贴 compose.yaml，逐项列出会改变或跳过的配置，数据库可换成 operator 管理的版本。",
      "只有 build: 的服务、UDP 和主机路径会跳过",
    ],
    en: [
      "Import Docker Compose",
      "Paste compose.yaml and see each setting it changes or skips. Databases can move to an operator.",
      "Skips build-only services, UDP and host paths",
    ],
  },
  {
    group: "deploy",
    doc: "zeabur/deploy/git",
    "zh-TW": [
      "從 Git 建置",
      "用 Railpack 或 Dockerfile 建置，可指定子資料夾，建置變數不會留在映像檔裡。",
      "要裝 Zeabur Builder",
    ],
    "zh-CN": [
      "从 Git 构建",
      "用 Railpack 或 Dockerfile 构建，可指定子目录，构建变量不会留在镜像里。",
      "需要安装 Zeabur Builder",
    ],
    en: [
      "Build from Git",
      "Railpack or a Dockerfile, from any folder. Build variables stay out of the image.",
      "Needs Zeabur Builder",
    ],
  },
  {
    group: "deploy",
    doc: "zeabur/deploy/upload",
    "zh-TW": [
      "上傳資料夾",
      "不用 Git 儲存庫，把資料夾或 .zip 拖進網頁，或用 zeaburctl up 上傳，再建置。",
      "要裝 Zeabur Builder",
    ],
    "zh-CN": [
      "上传文件夹",
      "不用 Git 仓库，把文件夹或 .zip 拖进网页，或用 zeaburctl up 上传，再构建。",
      "需要安装 Zeabur Builder",
    ],
    en: [
      "Upload a folder",
      "No Git repository needed. Drop a folder or .zip into the page, or use zeaburctl up, then build.",
      "Needs Zeabur Builder",
    ],
  },
  {
    group: "deploy",
    doc: "zeabur/cluster/github-app",
    "zh-TW": [
      "用 GitHub App 部署私有儲存庫",
      "替叢集建立 GitHub App，成員直接挑儲存庫部署，不用另外設定部署金鑰。",
      "要裝 Zeabur Builder",
    ],
    "zh-CN": [
      "用 GitHub App 部署私有仓库",
      "给集群创建 GitHub App，成员直接挑仓库部署，不用另外配置部署密钥。",
      "需要安装 Zeabur Builder",
    ],
    en: [
      "Private repos with a GitHub App",
      "Create a GitHub App for the cluster and members pick a repository. No deploy keys.",
      "Needs Zeabur Builder",
    ],
  },
  {
    group: "deploy",
    doc: "zeabur/deploy/git",
    "zh-TW": [
      "新提交自動部署",
      "每分鐘看一次分支，有新提交就建置並換上新映像檔。",
      "要另外裝 Keel",
    ],
    "zh-CN": [
      "新提交自动部署",
      "每分钟看一次分支，有新提交就构建并换上新镜像。",
      "需要另外安装 Keel",
    ],
    en: [
      "Deploy new commits",
      "Checks the branch every minute, builds new commits and rolls them out.",
      "Needs Keel",
    ],
  },
  {
    group: "deploy",
    doc: "zeabur/deploy/cron-jobs",
    "zh-TW": ["排程工作", "照 cron 和時區執行指令，可以立即執行、暫停，也能決定保留幾筆紀錄。"],
    "zh-CN": ["定时任务", "按 cron 和时区执行命令，可以立即执行、暂停，也能决定保留几条记录。"],
    en: [
      "Cron jobs",
      "Run a command on a schedule in your time zone. Run now, pause, keep some history.",
    ],
  },
  {
    group: "deploy",
    doc: "zeabur/configure/objects-yaml",
    "zh-TW": [
      "用 YAML 建立和編輯物件",
      "表單沒有的設定直接寫 YAML，建立或編輯任何類型，包含自訂資源。",
    ],
    "zh-CN": [
      "用 YAML 创建和编辑对象",
      "表单没有的配置直接写 YAML，创建或编辑任何类型，包括自定义资源。",
    ],
    en: [
      "Create and edit objects with YAML",
      "Write YAML for any kind the cluster provides, custom resources included.",
    ],
  },
  {
    group: "deploy",
    doc: "zeabur/configure/restart-rollback",
    "zh-TW": ["回滾到之前的版本", "部署紀錄列出每個版本，可以比較差異，再回到其中一版。"],
    "zh-CN": ["回滚到之前的版本", "部署记录列出每个版本，可以比较差异，再回到其中一版。"],
    en: [
      "Roll back to a previous version",
      "The history lists each version. Compare two, then go back to one.",
    ],
  },
  {
    group: "deploy",
    doc: "zeabur/get-started/how-it-works",
    "zh-TW": ["先檢查變更再套用", "列出要寫進叢集的差異再套用。有人先改過就拒絕，請你重新檢查。"],
    "zh-CN": ["先检查变更再应用", "列出要写进集群的差异再应用。有人先改过就拒绝，请你重新检查。"],
    en: [
      "Review before applying",
      "Shows the difference before it is written. If someone changed it first, it refuses and asks you to review again.",
    ],
  },
  {
    group: "deploy",
    doc: "zeabur/configure/service-settings",
    "zh-TW": ["副本、資源與健康檢查", "調整副本、CPU 和記憶體，設定就緒、存活和啟動檢查。"],
    "zh-CN": ["副本、资源与健康检查", "调整副本、CPU 和内存，配置就绪、存活和启动检查。"],
    en: [
      "Replicas, resources and health checks",
      "Set replicas, CPU and memory, and readiness, liveness and startup checks.",
    ],
  },
  {
    group: "deploy",
    doc: "zeabur/configure/restart-rollback",
    "zh-TW": ["暫停或重新啟動整個專案", "一次停掉專案所有服務再恢復，或分批重新啟動。"],
    "zh-CN": ["暂停或重启整个项目", "一次停掉项目所有服务再恢复，或分批重启。"],
    en: [
      "Pause or restart a project",
      "Stop every service in a project and bring it back, or restart them in turns.",
    ],
  },
  {
    group: "deploy",
    doc: "zeabur/configure/variables",
    "zh-TW": ["環境變數", "逐列或用 .env 格式編輯，值預設放在 Secret。"],
    "zh-CN": ["环境变量", "逐行或用 .env 格式编辑，值默认放在 Secret。"],
    en: ["Environment variables", "Edit row by row or as .env. Values go into a Secret."],
  },
  {
    group: "deploy",
    doc: "zeabur/configure/variables",
    "zh-TW": ["共用變數", "一組變數給多個服務讀，看得到誰在讀。"],
    "zh-CN": ["共享变量", "一组变量给多个服务读，看得到谁在读。"],
    en: [
      "Shared variables",
      "One set of variables for several services, and a list of who reads them.",
    ],
  },
  {
    group: "deploy",
    doc: "zeabur/configure/variables",
    "zh-TW": [
      "設定改了自動重新啟動",
      "共用設定或機密一改，讀它的服務自動重新啟動。",
      "要叢集有 Reloader",
    ],
    "zh-CN": [
      "配置改了自动重启",
      "共享配置或密钥一改，读它的服务自动重启。",
      "需要集群装有 Reloader",
    ],
    en: [
      "Restart on config change",
      "When shared config or a secret changes, the services reading it restart.",
      "Needs Reloader",
    ],
  },
  {
    group: "deploy",
    doc: "zeabur/configure/service-settings",
    "zh-TW": [
      "嚴格或相容的安全設定",
      "服務選嚴格時，以非 root 執行、不能提升權限、移除所有 capabilities。",
    ],
    "zh-CN": [
      "严格或兼容的安全配置",
      "服务选严格时，以非 root 运行、不能提升权限、移除所有 capabilities。",
    ],
    en: [
      "Strict or compatible security",
      "A strict service runs as non-root, cannot escalate and drops all capabilities.",
    ],
  },
  {
    group: "deploy",
    doc: "zeabur/configure/projects",
    "zh-TW": [
      "把既有的 Namespace 加進 Zeabur",
      "叢集裡的 Namespace 按一下就變成專案。Helm、Argo CD、Flux 管的服務不讓你改錯。",
    ],
    "zh-CN": [
      "把已有的 Namespace 加进 Zeabur",
      "集群里的 Namespace 点一下就变成项目。Helm、Argo CD、Flux 管理的服务不让你改错。",
    ],
    en: [
      "Add an existing namespace",
      "Any namespace becomes a project in one click. Services that Helm, Argo CD or Flux manage stay theirs.",
    ],
  },
  {
    group: "deploy",
    doc: "zeabur/deploy/templates",
    "zh-TW": ["應用程式範本", "從 Zeabur Catalog 挑一個應用程式，填好網域和欄位，檢查後部署。"],
    "zh-CN": ["应用程序模板", "从 Zeabur Catalog 挑一个应用程序，填好域名和字段，检查后部署。"],
    en: [
      "App templates",
      "Pick an app from Zeabur Catalog, fill in the domain and fields, review, then deploy.",
    ],
  },

  // Network and domains
  {
    group: "network",
    doc: "zeabur/configure/domains",
    "zh-TW": ["公開網域與 HTTPS", "列出要加的 DNS 紀錄，憑證自動簽發與續期。"],
    "zh-CN": ["公开域名与 HTTPS", "列出要加的 DNS 记录，证书自动签发与续期。"],
    en: [
      "Public domains with HTTPS",
      "Shows the DNS records to add. Certificates are issued and renewed for you.",
    ],
  },
  {
    group: "network",
    doc: "zeabur/configure/domains",
    "zh-TW": [
      "萬用字元憑證",
      "用 DNS-01 簽發，支援 Cloudflare、Route 53、Google Cloud DNS、DigitalOcean、Azure DNS。",
    ],
    "zh-CN": [
      "通配符证书",
      "用 DNS-01 签发，支持 Cloudflare、Route 53、Google Cloud DNS、DigitalOcean、Azure DNS。",
    ],
    en: [
      "Wildcard certificates",
      "DNS-01 with Cloudflare, Route 53, Google Cloud DNS, DigitalOcean or Azure DNS.",
    ],
  },
  {
    group: "network",
    doc: "zeabur/configure/domains",
    "zh-TW": ["上傳自己的憑證", "貼上 PEM，先核對日期、網域和金鑰是否配對。"],
    "zh-CN": ["上传自己的证书", "粘贴 PEM，先核对日期、域名和密钥是否匹配。"],
    en: ["Bring your own certificate", "Paste a PEM. Dates, names and the key are checked first."],
  },
  {
    group: "network",
    doc: "zeabur/configure/domains",
    "zh-TW": ["網域轉址", "用 301 或 302 轉到另一個網域，路徑保留。", "只在 Traefik 上"],
    "zh-CN": ["域名重定向", "用 301 或 302 转到另一个域名，路径保留。", "只在 Traefik 上"],
    en: ["Redirects", "301 or 302 to another domain, keeping the path.", "Traefik only"],
  },
  {
    group: "network",
    doc: "zeabur/configure/domains",
    "zh-TW": ["訪客密碼", "替網域加帳號密碼，登入後才看得到。", "只在 Traefik 上"],
    "zh-CN": ["访客密码", "给域名加账号密码，登录后才看得到。", "只在 Traefik 上"],
    en: [
      "Password protection",
      "Put a user name and password in front of a domain.",
      "Traefik only",
    ],
  },
  {
    group: "network",
    doc: "zeabur/configure/maintenance",
    "zh-TW": ["維護模式", "網域暫時顯示維護頁，服務照跑，關掉後流量自動回來。"],
    "zh-CN": ["维护模式", "域名暂时显示维护页，服务照常运行，关掉后流量自动回来。"],
    en: ["Maintenance mode", "A domain shows a maintenance page while the service keeps running."],
  },
  {
    group: "network",
    doc: "zeabur/configure/maintenance",
    "zh-TW": ["自訂錯誤頁", "服務回 502、503、504 時，顯示專案自己的 HTML。", "只在 Traefik 上"],
    "zh-CN": [
      "自定义错误页",
      "服务返回 502、503、504 时，显示项目自己的 HTML。",
      "只在 Traefik 上",
    ],
    en: [
      "Custom error pages",
      "Your own HTML when a service answers 502, 503 or 504.",
      "Traefik only",
    ],
  },
  {
    group: "network",
    doc: "zeabur/configure/domains",
    "zh-TW": ["Gateway API", "網域可以用 HTTPRoute 提供。"],
    "zh-CN": ["Gateway API", "域名可以用 HTTPRoute 提供。"],
    en: ["Gateway API", "Domains can be served by an HTTPRoute."],
  },
  {
    group: "network",
    doc: "zeabur/configure/networking",
    "zh-TW": ["開放連接埠到網際網路", "不經網域，直接開一個 TCP 連接埠，例如讓資料庫對外。"],
    "zh-CN": ["开放端口到互联网", "不经过域名，直接开放一个 TCP 端口，例如让数据库对外。"],
    en: [
      "Open a port to the internet",
      "Open a TCP port without a domain, for a database for example.",
    ],
  },
  {
    group: "network",
    doc: "zeabur/configure/networking",
    "zh-TW": ["連線規則", "隔離服務，或只讓特定服務連進來，連入和連出分開列出。"],
    "zh-CN": ["连接规则", "隔离服务，或只让特定服务连进来，连入和连出分开列出。"],
    en: [
      "Connection rules",
      "Isolate a service or allow only some callers. Inbound and outbound are listed apart.",
    ],
  },
  {
    group: "network",
    doc: "zeabur/cluster/diagnosis",
    "zh-TW": ["連線檢查", "網址打不開時，從叢集內和你的瀏覽器兩邊查，指出卡在哪一段。"],
    "zh-CN": ["连接检查", "网址打不开时，从集群内和你的浏览器两边查，指出卡在哪一段。"],
    en: [
      "Connection check",
      "When a URL fails, checks from inside the cluster and your browser and names the broken step.",
    ],
  },
  {
    group: "network",
    doc: "zeabur/configure/ip-limits",
    "zh-TW": [
      "限制能連入和連出的 IP",
      "只讓指定的 IP 開啟網域，也限制服務能連到哪些 IP。",
      "網域限制只在 Traefik 上",
    ],
    "zh-CN": [
      "限制能连入和连出的 IP",
      "只让指定的 IP 打开域名，也限制服务能连到哪些 IP。",
      "域名限制只在 Traefik 上",
    ],
    en: [
      "Limit inbound and outbound IPs",
      "Only listed IPs open a domain, and a service reaches only listed IPs.",
      "Domain limits are Traefik only",
    ],
  },

  // Data and backups
  {
    group: "data",
    doc: "zeabur/deploy/databases",
    "zh-TW": ["資料庫", "PostgreSQL、MongoDB、MySQL、MariaDB、Dragonfly，各由自己的 operator 管。"],
    "zh-CN": [
      "数据库",
      "PostgreSQL、MongoDB、MySQL、MariaDB、Dragonfly，各由自己的 operator 管理。",
    ],
    en: [
      "Databases",
      "PostgreSQL, MongoDB, MySQL, MariaDB and Dragonfly, each run by its operator.",
    ],
  },
  {
    group: "data",
    doc: "zeabur/deploy/databases",
    "zh-TW": ["多執行個體資料庫", "MongoDB、MySQL 可以跑 1、3 或 5 個執行個體。"],
    "zh-CN": ["多实例数据库", "MongoDB、MySQL 可以运行 1、3 或 5 个实例。"],
    en: ["Replicated databases", "MongoDB and MySQL with 1, 3 or 5 instances."],
  },
  {
    group: "data",
    doc: "zeabur/deploy/databases",
    "zh-TW": ["把資料庫接到服務", "勾選服務就加上 DATABASE_URL 這類變數，密碼留在 Secret。"],
    "zh-CN": ["把数据库连到服务", "勾选服务就加上 DATABASE_URL 这类变量，密码留在 Secret。"],
    en: [
      "Connect a database",
      "Tick a service and it gets DATABASE_URL and friends. The password stays in a Secret.",
    ],
  },
  {
    group: "data",
    doc: "zeabur/deploy/databases",
    "zh-TW": [
      "資料庫排程備份",
      "每天或每週備份到 S3，看得到每次的結果。",
      "MySQL、Dragonfly 不能立即備份",
    ],
    "zh-CN": [
      "数据库定时备份",
      "每天或每周备份到 S3，看得到每次的结果。",
      "MySQL、Dragonfly 不能立即备份",
    ],
    en: [
      "Scheduled backups",
      "Daily or weekly to S3, with each run's result.",
      "No backup-now for MySQL and Dragonfly",
    ],
  },
  {
    group: "data",
    doc: "zeabur/deploy/databases",
    "zh-TW": ["還原成新資料庫", "從備份還原出新的資料庫，確認沒問題再把服務指過去。"],
    "zh-CN": ["恢复成新数据库", "从备份恢复出新的数据库，确认没问题再把服务指过去。"],
    en: [
      "Restore to a new database",
      "Restore a backup next to the old one, then point services at it.",
    ],
  },
  {
    group: "data",
    doc: "zeabur/deploy/databases",
    "zh-TW": ["PostgreSQL WAL 封存", "持續把 WAL 存到 S3。", "還原只能選某一份備份，不能選時間點"],
    "zh-CN": ["PostgreSQL WAL 归档", "持续把 WAL 存到 S3。", "恢复只能选某一份备份，不能选时间点"],
    en: [
      "PostgreSQL WAL archive",
      "WAL goes to S3 continuously.",
      "Restores pick a backup, not a point in time",
    ],
  },
  {
    group: "data",
    doc: "zeabur/deploy/databases",
    "zh-TW": ["下載資料庫傾印檔", "在瀏覽器下載 pg_dump、mongodump、mysqldump 的結果。"],
    "zh-CN": ["下载数据库转储文件", "在浏览器下载 pg_dump、mongodump、mysqldump 的结果。"],
    en: ["Download a dump", "Get a pg_dump, mongodump or mysqldump file in the browser."],
  },
  {
    group: "data",
    doc: "zeabur/deploy/object-storage",
    "zh-TW": [
      "S3 物件儲存",
      "建立 SeaweedFS 和儲存貯體，一鍵把端點和金鑰加到服務。",
      "Beta，只有一份資料",
    ],
    "zh-CN": [
      "S3 对象存储",
      "创建 SeaweedFS 和存储桶，一键把端点和密钥加到服务。",
      "Beta，只有一份数据",
    ],
    en: [
      "S3 object storage",
      "SeaweedFS and buckets, with the endpoint and keys added to a service.",
      "Beta, one copy of the data",
    ],
  },
  {
    group: "data",
    doc: "zeabur/configure/volumes",
    "zh-TW": ["磁碟區", "掛載、選本機或複寫儲存、擴充容量、設唯讀。"],
    "zh-CN": ["存储卷", "挂载、选本地或复制存储、扩容、设为只读。"],
    en: ["Volumes", "Mount, pick local or replicated storage, grow, make read-only."],
  },
  {
    group: "data",
    doc: "zeabur/configure/volumes",
    "zh-TW": ["磁碟區備份", "用 K8up 定期備份到 S3，可調保留規則。", "還原要管理員自己做"],
    "zh-CN": ["存储卷备份", "用 K8up 定期备份到 S3，可调保留规则。", "恢复需要管理员自己做"],
    en: [
      "Volume backups",
      "K8up to S3 on a schedule, with retention.",
      "An admin restores by hand",
    ],
  },
  {
    group: "data",
    doc: "zeabur/cluster/backups",
    "zh-TW": [
      "叢集備份與還原",
      "用 Velero 備份整個叢集或選定的專案，從介面還原 Namespace。",
      "只有管理員能還原",
    ],
    "zh-CN": [
      "集群备份与恢复",
      "用 Velero 备份整个集群或选定的项目，从界面恢复 Namespace。",
      "只有管理员能恢复",
    ],
    en: [
      "Cluster backups",
      "Velero for the whole cluster or chosen projects. Restore a namespace from the UI.",
      "Admins only",
    ],
  },
  {
    group: "data",
    doc: "zeabur/cluster/s3-destinations",
    "zh-TW": ["共用 S3 目的地", "登錄一次，三種備份都能選。換金鑰時一起更新。"],
    "zh-CN": ["共享 S3 目的地", "登记一次，三种备份都能选。换密钥时一起更新。"],
    en: [
      "Shared S3 destinations",
      "Add a bucket once for all three kinds of backup. Rotating the key updates every copy.",
    ],
  },
  {
    group: "data",
    doc: "zeabur/configure/logs-terminal",
    "zh-TW": ["瀏覽檔案", "在瀏覽器看容器和磁碟區的檔案，上傳、下載、預覽、改名、刪除。"],
    "zh-CN": ["浏览文件", "在浏览器看容器和存储卷的文件，上传、下载、预览、改名、删除。"],
    en: [
      "Browse files",
      "Browse a container or volume. Upload, download, preview, rename, delete.",
    ],
  },

  // Find what is wrong
  {
    group: "diagnose",
    doc: "zeabur/cluster/diagnosis",
    "zh-TW": ["出了什麼問題", "服務有問題時，一句話說原因和怎麼處理，附上依據，按鈕直接帶你去改。"],
    "zh-CN": ["出了什么问题", "服务有问题时，一句话说原因和怎么处理，附上依据，按钮直接带你去改。"],
    en: [
      "What went wrong",
      "One line on the cause and one on what to do, with the evidence and buttons that take you to the fix.",
    ],
  },
  {
    group: "diagnose",
    doc: "zeabur/cluster/diagnosis",
    "zh-TW": ["需要處理", "首頁列出停擺的服務，叢集概覽列出 Kubernetes 版本、節點和元件的問題。"],
    "zh-CN": ["需要处理", "首页列出停摆的服务，集群概览列出 Kubernetes 版本、节点和组件的问题。"],
    en: [
      "Needs attention",
      "The home page lists stopped services. Cluster overview lists Kubernetes version, node and component problems.",
    ],
  },
  {
    group: "diagnose",
    doc: "zeabur/cluster/diagnosis",
    "zh-TW": ["缺少的設定", "指出沒有就緒檢查、沒有記憶體上限、沒有備份的設定，附上修正按鈕。"],
    "zh-CN": ["缺少的配置", "指出没有就绪检查、没有内存上限、没有备份的配置，附上修正按钮。"],
    en: [
      "Missing settings",
      "Points out missing readiness checks, memory limits and backups, with a button to fix each.",
    ],
  },
  {
    group: "diagnose",
    doc: "zeabur/configure/logs-terminal",
    "zh-TW": ["日誌", "可以篩選、排除、看前一次執行、下載。"],
    "zh-CN": ["日志", "可以筛选、排除、看上一次运行、下载。"],
    en: ["Logs", "Filter, exclude, see the previous run, download."],
  },
  {
    group: "diagnose",
    doc: "zeabur/configure/logs-terminal",
    "zh-TW": [
      "日誌的歷史紀錄",
      "看所有副本寫過的日誌，包含已被取代的。",
      "要開啟 Zeabur Proxy 並裝日誌儲存服務",
    ],
    "zh-CN": [
      "日志的历史记录",
      "看所有副本写过的日志，包括已被替换的。",
      "需要开启 Zeabur Proxy 并安装日志存储服务",
    ],
    en: [
      "Log history",
      "Logs from every replica, replaced ones too.",
      "Needs Zeabur Proxy and a log store",
    ],
  },
  {
    group: "diagnose",
    doc: "zeabur/configure/logs-terminal",
    "zh-TW": ["終端機", "在瀏覽器開 shell，容器沒有 shell 時自動加一個除錯容器。"],
    "zh-CN": ["终端", "在浏览器打开 shell，容器没有 shell 时自动加一个调试容器。"],
    en: ["Terminal", "A shell in the browser. Adds a debug container when the image has none."],
  },
  {
    group: "diagnose",
    doc: "zeabur/configure/logs-terminal",
    "zh-TW": ["kubectl 終端機", "內建 kubectl 和 helm 的短暫終端機，用你自己的權限。"],
    "zh-CN": ["kubectl 终端", "内置 kubectl 和 helm 的临时终端，用你自己的权限。"],
    en: ["kubectl terminal", "A short-lived terminal with kubectl and helm, as you."],
  },
  {
    group: "diagnose",
    doc: "zeabur/configure/logs-terminal",
    "zh-TW": [
      "用量",
      "每個副本目前的 CPU 和記憶體，對照上限，歷史圖標出記憶體不足和重新啟動。",
      "要裝 metrics-server，歷史要有指標儲存服務",
    ],
    "zh-CN": [
      "用量",
      "每个副本当前的 CPU 和内存，对照上限，历史图标出内存不足和重启。",
      "需要安装 metrics-server，历史需要指标存储服务",
    ],
    en: [
      "Usage",
      "CPU and memory per replica against limits. History marks out-of-memory kills and restarts.",
      "Needs metrics-server, and a metrics store for history",
    ],
  },
  {
    group: "diagnose",
    doc: "zeabur/configure/logs-terminal",
    "zh-TW": [
      "事件",
      "副本排到哪個節點、健康檢查失敗、記憶體超過上限，這類 Kubernetes 事件最新的在前。",
      "Kubernetes 只保留大約一小時",
    ],
    "zh-CN": [
      "事件",
      "副本调度到哪个节点、健康检查失败、内存超过上限，这类 Kubernetes 事件最新的在前。",
      "Kubernetes 只保留大约一小时",
    ],
    en: [
      "Events",
      "Kubernetes events such as scheduling, failed probes and out-of-memory kills, newest first.",
      "Kubernetes keeps about an hour",
    ],
  },
  {
    group: "diagnose",
    doc: "zeabur/cluster/notifications",
    "zh-TW": [
      "通知管道",
      "Slack、Discord、Telegram、Email、Webhook、ntfy、Gotify，叢集和專案分開設定。",
    ],
    "zh-CN": [
      "通知渠道",
      "Slack、Discord、Telegram、Email、Webhook、ntfy、Gotify，集群和项目分开配置。",
    ],
    en: [
      "Notifications",
      "Slack, Discord, Telegram, email, webhooks, ntfy and Gotify, per cluster or project.",
    ],
  },
  {
    group: "diagnose",
    doc: "zeabur/cluster/notifications",
    "zh-TW": ["異常警示", "部署失敗、反覆當機、記憶體不足、備份失敗、憑證快到期都會通知。"],
    "zh-CN": ["异常告警", "部署失败、反复崩溃、内存不足、备份失败、证书快到期都会通知。"],
    en: [
      "Alerts",
      "Failed deploys, crash loops, out of memory, failed backups, expiring certificates.",
    ],
  },
  {
    group: "diagnose",
    doc: "zeabur/cluster/diagnosis",
    "zh-TW": ["執行期警示（Falco）", "裝了 Falco 時，在介面看警示，也能送到通知管道。"],
    "zh-CN": ["运行时告警（Falco）", "装了 Falco 时，在界面看告警，也能发到通知渠道。"],
    en: ["Runtime alerts (Falco)", "With Falco installed, see its alerts and send them on."],
  },
  {
    group: "diagnose",
    doc: "zeabur/reference/zeaburctl",
    "zh-TW": ["zeaburctl doctor", "從自己的電腦檢查叢集版本、元件和登入設定。"],
    "zh-CN": ["zeaburctl doctor", "从自己的电脑检查集群版本、组件和登录配置。"],
    en: [
      "zeaburctl doctor",
      "Checks the cluster's versions, components and sign-in from your laptop.",
    ],
  },

  // People and permissions
  {
    group: "team",
    doc: "identity",
    "zh-TW": ["通行密鑰登入", "用 Touch ID、Windows Hello 或安全金鑰，沒有密碼。"],
    "zh-CN": ["通行密钥登录", "用 Touch ID、Windows Hello 或安全密钥，没有密码。"],
    en: ["Passkey sign-in", "Touch ID, Windows Hello or a security key. No passwords."],
  },
  {
    group: "team",
    doc: "identity",
    "zh-TW": ["連結 GitHub 或 Google", "成員可以再連一個帳號，日常登入用。"],
    "zh-CN": ["关联 GitHub 或 Google", "成员可以再关联一个账号，日常登录用。"],
    en: ["GitHub or Google", "Members can link an account for everyday sign-in."],
  },
  {
    group: "team",
    doc: "zeabur/cluster/members",
    "zh-TW": [
      "邀請、重設與移除成員",
      "一次性的設定連結，7 天有效。移除時一起清掉通行密鑰和工作階段。",
    ],
    "zh-CN": ["邀请、重置与移除成员", "一次性的设置链接，7 天有效。移除时一起清掉通行密钥和会话。"],
    en: [
      "Invite and remove",
      "One-time setup links for 7 days. Removing someone clears their passkeys and sessions.",
    ],
  },
  {
    group: "team",
    doc: "zeabur/reference/permissions",
    "zh-TW": ["專案角色", "每個專案分別給開發者或檢視者，檢視者看不到日誌和 Secret。"],
    "zh-CN": ["项目角色", "每个项目分别给开发者或查看者，查看者看不到日志和 Secret。"],
    en: ["Project roles", "Developer or viewer per project. Viewers see no logs or Secrets."],
  },
  {
    group: "team",
    doc: "zeabur/reference/permissions",
    "zh-TW": ["管理員專用帳號", "日常工作用一般帳號，要改叢集時才登入管理員帳號。"],
    "zh-CN": ["管理员专用账号", "日常工作用普通账号，要改集群时才登录管理员账号。"],
    en: [
      "Separate admin accounts",
      "Use a regular account day to day, and sign in to the admin account to change the cluster.",
    ],
  },
  {
    group: "team",
    doc: "zeabur/get-started/how-it-works",
    "zh-TW": ["用你自己的權限", "Zeabur 本身沒有叢集權限，每個請求都由 Kubernetes RBAC 決定。"],
    "zh-CN": ["用你自己的权限", "Zeabur 本身没有集群权限，每个请求都由 Kubernetes RBAC 决定。"],
    en: [
      "Your own permissions",
      "Zeabur has no cluster rights. Kubernetes RBAC decides each request.",
    ],
  },
  {
    group: "team",
    doc: "zeabur/reference/permissions",
    "zh-TW": ["被拒絕時說清楚", "分清楚是權限不夠、元件沒裝、政策擋下還是超過配額。"],
    "zh-CN": ["被拒绝时说清楚", "分清楚是权限不够、组件没装、策略拦下还是超过配额。"],
    en: [
      "Clear refusals",
      "Tells a missing permission from a missing component, a policy or a quota.",
    ],
  },
  {
    group: "team",
    doc: "identity",
    "zh-TW": ["kubectl 也用通行密鑰", "kubectl 開瀏覽器登入，權杖幾分鐘就過期。"],
    "zh-CN": ["kubectl 也用通行密钥", "kubectl 打开浏览器登录，令牌几分钟就过期。"],
    en: ["Passkeys for kubectl", "kubectl signs in through the browser. Tokens last minutes."],
  },

  // Cluster and nodes
  {
    group: "cluster",
    doc: "zeabur/cluster/components",
    "zh-TW": [
      "叢集元件",
      "檢查叢集裝了哪些元件，由 Zeabur 安裝，或產生 Helm、HelmChart、Flux、Argo CD 格式自己裝。",
    ],
    "zh-CN": [
      "集群组件",
      "检查集群装了哪些组件，由 Zeabur 安装，或生成 Helm、HelmChart、Flux、Argo CD 格式自己装。",
    ],
    en: [
      "Cluster components",
      "See what is installed. Install from Zeabur, or get Helm, HelmChart, Flux or Argo CD output.",
    ],
  },
  {
    group: "cluster",
    doc: "zeabur/cluster/settings",
    "zh-TW": ["叢集名稱、網域與用量歷史", "改叢集名稱，選用量歷史的來源，設定新服務用的網域。"],
    "zh-CN": ["集群名称、域名与用量历史", "改集群名称，选用量历史的来源，设置新服务用的域名。"],
    en: [
      "Cluster name, domain and usage history",
      "Rename the cluster, choose where usage history comes from, and set the domain for new services.",
    ],
  },
  {
    group: "cluster",
    doc: "zeabur/cluster/external-secrets",
    "zh-TW": [
      "從外部機密庫同步機密",
      "連接 OpenBao、Vault、1Password 或 AWS Secrets Manager，把機密同步成叢集裡的 Secret。",
    ],
    "zh-CN": [
      "从外部密钥库同步密钥",
      "连接 OpenBao、Vault、1Password 或 AWS Secrets Manager，把密钥同步成集群里的 Secret。",
    ],
    en: [
      "Sync secrets from a vault",
      "Connect OpenBao, Vault, 1Password or AWS Secrets Manager and sync into Secrets.",
    ],
  },
  {
    group: "cluster",
    doc: "zeabur/cluster/nodes",
    "zh-TW": [
      "加入節點",
      "產生有時效的權杖和指令，在新機器執行就加入。",
      "只限 Zeabur Installer 裝的叢集",
    ],
    "zh-CN": [
      "加入节点",
      "生成有时效的令牌和命令，在新机器执行就加入。",
      "只限 Zeabur Installer 装的集群",
    ],
    en: [
      "Add nodes",
      "A short-lived token and one command on the new machine.",
      "Installer clusters only",
    ],
  },
  {
    group: "cluster",
    doc: "zeabur/cluster/nodes",
    "zh-TW": ["節點維護模式", "停機前把副本移走，遵守 PodDisruptionBudget，列出移不走的。"],
    "zh-CN": ["节点维护模式", "停机前把副本移走，遵守 PodDisruptionBudget，列出移不走的。"],
    en: [
      "Node maintenance",
      "Moves replicas off first, honours PodDisruptionBudgets, lists what cannot move.",
    ],
  },
  {
    group: "cluster",
    doc: "zeabur/cluster/nodes",
    "zh-TW": ["移除節點", "移走副本、刪掉 Node，再給你在那台機器要跑的清除指令。"],
    "zh-CN": ["移除节点", "移走副本、删掉 Node，再给你在那台机器要运行的清理命令。"],
    en: [
      "Remove nodes",
      "Drains, deletes the Node and gives you the cleanup command for the machine.",
    ],
  },
  {
    group: "cluster",
    doc: "zeabur/cluster/nodes",
    "zh-TW": ["節點終端機", "管理員在瀏覽器拿到主機 shell，每次開啟都留紀錄。"],
    "zh-CN": ["节点终端", "管理员在浏览器拿到主机 shell，每次打开都留记录。"],
    en: ["Node shell", "A host shell for admins in the browser, logged on the node each time."],
  },
  {
    group: "cluster",
    doc: "zeabur/cluster/nodes",
    "zh-TW": ["多台控制平面", "三台以上的伺服器，少一台照常運作。", "要在主機上用指令加"],
    "zh-CN": ["多台控制平面", "三台以上的服务器，少一台照常运行。", "需要在主机上用命令加"],
    en: [
      "Several control planes",
      "Three or more servers keep going with one down.",
      "Added from the host",
    ],
  },

  // Install and upgrade
  {
    group: "install",
    doc: "zeabur/get-started/quickstart",
    "zh-TW": [
      "網頁安裝精靈",
      "五個步驟裝好 RKE2、Zeabur Identity 和 Zeabur，最後註冊管理員的通行密鑰。",
    ],
    "zh-CN": [
      "网页安装向导",
      "五个步骤装好 RKE2、Zeabur Identity 和 Zeabur，最后注册管理员的通行密钥。",
    ],
    en: [
      "Install in the browser",
      "Five steps to RKE2, Zeabur Identity and Zeabur, ending with the admin's passkey.",
    ],
  },
  {
    group: "install",
    doc: "zeabur/get-started/quickstart",
    "zh-TW": [
      "主機檢查",
      "安裝前檢查 root、時鐘、Swap、連接埠、磁碟空間和磁碟加密。",
      "磁碟沒加密預設只警告",
    ],
    "zh-CN": [
      "主机检查",
      "安装前检查 root、时钟、Swap、端口、磁盘空间和磁盘加密。",
      "磁盘没加密默认只警告",
    ],
    en: [
      "Host checks",
      "Root, clock, swap, ports, disk space and disk encryption before installing.",
      "Unencrypted disks only warn by default",
    ],
  },
  {
    group: "install",
    doc: "zeabur/get-started/quickstart",
    "zh-TW": ["記憶體估算", "選精簡、標準或強化組合，記憶體不夠就不讓你裝。"],
    "zh-CN": ["内存估算", "选精简、标准或强化组合，内存不够就不让你装。"],
    en: [
      "Memory estimate",
      "Pick lean, standard or hardened. Too little memory and Install stays off.",
    ],
  },
  {
    group: "install",
    doc: "zeabur/get-started/advanced-install",
    "zh-TW": ["設定檔安裝", "plan 先看會做什麼，apply 安裝，中斷後從斷掉的地方繼續。"],
    "zh-CN": ["配置文件安装", "plan 先看会做什么，apply 安装，中断后从断掉的地方继续。"],
    en: ["Install from a file", "plan shows what happens, apply does it, and a rerun resumes."],
  },
  {
    group: "install",
    doc: "zeabur/get-started/quickstart",
    "zh-TW": ["測試機模式", "不用設 DNS，用 sslip.io 網域先試裝。"],
    "zh-CN": ["测试机模式", "不用配置 DNS，用 sslip.io 域名先试装。"],
    en: ["Try without DNS", "Uses sslip.io names and a local CA."],
  },
  {
    group: "install",
    doc: "zeabur/reference/installer",
    "zh-TW": ["加固的預設值", "CIS profile、etcd 加密、稽核政策和基準網路政策。"],
    "zh-CN": ["加固的默认值", "CIS profile、etcd 加密、审计策略和基准网络策略。"],
    en: [
      "Hardened defaults",
      "CIS profile, encrypted etcd, an audit policy and baseline network policies.",
    ],
  },
  {
    group: "install",
    doc: "zeabur/get-started/install",
    "zh-TW": ["裝進既有 Kubernetes", "已經有叢集時，用 Helm chart 安裝。"],
    "zh-CN": ["装进已有 Kubernetes", "已经有集群时，用 Helm chart 安装。"],
    en: ["Into your cluster", "Already have one? Install the Helm chart."],
  },
  {
    group: "install",
    doc: "zeabur/reference/zeaburctl",
    "zh-TW": ["在自己的電腦開", "zeaburctl ui 用你的 kubeconfig，叢集裡什麼都不用裝。"],
    "zh-CN": ["在自己的电脑打开", "zeaburctl ui 用你的 kubeconfig，集群里什么都不用装。"],
    en: [
      "Run it on your laptop",
      "zeaburctl ui with your kubeconfig. Nothing goes into the cluster.",
    ],
  },
  {
    group: "install",
    doc: "zeabur/reference/releases",
    "zh-TW": ["簽章與來源驗證", "每個發行檔、映像檔和 chart 都有 Sigstore 簽章和建置來源。"],
    "zh-CN": ["签名与来源验证", "每个发行文件、镜像和 chart 都有 Sigstore 签名和构建来源。"],
    en: [
      "Signed releases",
      "Every binary, image and chart has a Sigstore signature and provenance.",
    ],
  },
  {
    group: "install",
    doc: "zeabur/reference/installer",
    "zh-TW": ["安裝後健康檢查", "zeabur-installer doctor 檢查 RKE2、元件、儲存和登入設定。"],
    "zh-CN": ["安装后健康检查", "zeabur-installer doctor 检查 RKE2、组件、存储和登录配置。"],
    en: [
      "zeabur-installer doctor",
      "Checks RKE2, components, storage and sign-in after installing.",
    ],
  },
  {
    group: "install",
    doc: "zeabur/reference/installer-configuration",
    "zh-TW": ["自備映像檔與 chart", "改用自己準備的 Catalog、映像檔封存檔和 chart。"],
    "zh-CN": ["自备镜像与 chart", "改用自己准备的 Catalog、镜像归档和 chart。"],
    en: [
      "Your own artifacts",
      "Point the installer at your own catalog, image archives and charts.",
    ],
  },
  {
    group: "install",
    doc: "zeabur/get-started/install",
    "zh-TW": ["用 GitOps 管 Zeabur", "用 Argo CD 或 Flux 部署 Zeabur 的 chart。"],
    "zh-CN": ["用 GitOps 管理 Zeabur", "用 Argo CD 或 Flux 部署 Zeabur 的 chart。"],
    en: ["Zeabur by GitOps", "Deploy Zeabur's chart with Argo CD or Flux."],
  },

  // Leave Zeabur
  {
    group: "leave",
    doc: "zeabur/leave/uninstall",
    "zh-TW": ["移除後服務照跑", "專案和網域都是一般 Kubernetes 物件，移除 Zeabur 後網站照常回應。"],
    "zh-CN": [
      "移除后服务照常运行",
      "项目和域名都是普通 Kubernetes 对象，移除 Zeabur 后网站照常响应。",
    ],
    en: [
      "Services keep running",
      "Projects and domains are plain Kubernetes objects. Remove Zeabur and sites still answer.",
    ],
  },
  {
    group: "leave",
    doc: "zeabur/leave/uninstall",
    "zh-TW": ["選擇移除多少", "只移除 Zeabur、連 Zeabur Identity 一起，或整台機器清掉。"],
    "zh-CN": ["选择移除多少", "只移除 Zeabur、连 Zeabur Identity 一起，或整台机器清掉。"],
    en: ["Choose how much goes", "Zeabur alone, with Zeabur Identity, or the whole machine."],
  },
  {
    group: "leave",
    doc: "zeabur/leave/uninstall",
    "zh-TW": ["權限交接", "寫清楚移除後哪些角色會消失，怎麼用自己的 RBAC 接手。"],
    "zh-CN": ["权限交接", "写清楚移除后哪些角色会消失，怎么用自己的 RBAC 接手。"],
    en: ["Hand over permissions", "Which roles go away and how to take over with your own RBAC."],
  },
  {
    group: "leave",
    doc: "zeabur/leave/uninstall",
    "zh-TW": ["移除後備份照跑", "備份由 operator、K8up、Velero 自己執行，不靠 Zeabur。"],
    "zh-CN": ["移除后备份照常运行", "备份由 operator、K8up、Velero 自己执行，不靠 Zeabur。"],
    en: ["Backups keep running", "Operators, K8up and Velero run them without Zeabur."],
  },
]

type Chapter = {
  group: GroupId
  shot: { from: "docs" | "identity"; id: string }
  words: Record<SiteLocale, { title: string; body: string; alt: string }>
}

/** The jobs /zeabur walks through, each with one screen. The rest is in the list below them. */
export const chapters: Chapter[] = [
  {
    group: "deploy",
    shot: { from: "docs", id: "change-review" },
    words: {
      "zh-TW": {
        title: "改之前，先看會發生什麼",
        body: "映像檔、Compose、Git 或 YAML 都能部署。每次修改先列出會寫入的欄位、哪些服務會重新啟動、會不會掉資料，確認後才套用。",
        alt: "儲存 web 的變更前先檢查：2 個副本會逐一替換，服務不會中斷，資源也夠",
      },
      "zh-CN": {
        title: "改之前，先看会发生什么",
        body: "镜像、Compose、Git 或 YAML 都能部署。每次修改先列出会写入的字段、哪些服务会重启、会不会丢数据，确认后才应用。",
        alt: "保存 web 的变更前先检查：2 个副本会逐一替换，服务不会中断，资源也够",
      },
      en: {
        title: "See what a change does first",
        body: "Deploy an image, a Compose file, a Git repository or plain YAML. Every change lists the fields it writes, the services that restart and any data at risk before it applies.",
        alt: "Checking a change to web before saving: its 2 replicas are replaced one at a time with no downtime, and there is room for it",
      },
    },
  },
  {
    group: "network",
    shot: { from: "docs", id: "service-networking" },
    words: {
      "zh-TW": {
        title: "網域、憑證和連線規則",
        body: "加網域時列出要設的 DNS 紀錄，憑證自動續期。網址打不開時，連線檢查會指出卡在 DNS、入口還是服務。",
        alt: "web 服務的網路分頁：3 個網域，其中一個找不到 DNS 紀錄，畫面直接寫出要新增哪一筆",
      },
      "zh-CN": {
        title: "域名、证书和连接规则",
        body: "加域名时列出要配置的 DNS 记录，证书自动续期。网址打不开时，连接检查会指出卡在 DNS、入口还是服务。",
        alt: "web 服务的网络页：3 个域名，其中一个找不到 DNS 记录，页面直接写出要新增哪一条",
      },
      en: {
        title: "Domains, certificates, who connects",
        body: "Adding a domain shows the DNS records to set, and certificates renew on their own. When a URL fails, the connection check says whether DNS, the ingress or the service is at fault.",
        alt: "The web service's networking tab: 3 domains, one without its DNS record, and the record to add",
      },
    },
  },
  {
    group: "data",
    shot: { from: "docs", id: "database" },
    words: {
      "zh-TW": {
        title: "資料庫和備份放在一起",
        body: "選一種資料庫，由它自己的 operator 管。排程備份到 S3，需要時還原成新的資料庫，確認沒問題再把服務指過去。",
        alt: "資料庫頁面，顯示連線資訊和備份紀錄",
      },
      "zh-CN": {
        title: "数据库和备份放在一起",
        body: "选一种数据库，由它自己的 operator 管理。定时备份到 S3，需要时恢复成新的数据库，确认没问题再把服务指过去。",
        alt: "数据库页面，显示连接信息和备份记录",
      },
      en: {
        title: "Databases with their backups",
        body: "Pick a database and its operator runs it. Back up to S3 on a schedule, restore into a new database and point services at it once it looks right.",
        alt: "A database page with its connection details and backups",
      },
    },
  },
  {
    group: "diagnose",
    shot: { from: "docs", id: "diagnosis" },
    words: {
      "zh-TW": {
        title: "用一般話說哪裡壞了",
        body: "服務不健康時，畫面說明原因，附上依據和下一步，不靠 AI。同一個原因拖垮好幾個服務時，只算一件事。",
        alt: "服務的診斷，說明它為什麼一直重新啟動",
      },
      "zh-CN": {
        title: "用平常的话说哪里坏了",
        body: "服务不健康时，页面说明原因，附上依据和下一步，不靠 AI。同一个原因拖垮好几个服务时，只算一件事。",
        alt: "服务的诊断，说明它为什么一直重启",
      },
      en: {
        title: "What broke, in plain words",
        body: "When a service is unhealthy, the page says why, shows the evidence and the next step, without AI. One cause behind several broken services is one item.",
        alt: "A service's diagnosis, saying why it keeps restarting",
      },
    },
  },
  {
    group: "team",
    shot: { from: "identity", id: "sign-in" },
    words: {
      "zh-TW": {
        title: "通行密鑰，加上你自己的權限",
        body: "成員用通行密鑰登入，每個請求都帶著自己的權杖，能做什麼由 Kubernetes RBAC 決定。管理員另有專用帳號，只能用通行密鑰，權杖 5 分鐘就到期。",
        alt: "Zeabur Identity 的登入頁，用通行密鑰登入",
      },
      "zh-CN": {
        title: "通行密钥，加上你自己的权限",
        body: "成员用通行密钥登录，每个请求都带着自己的令牌，能做什么由 Kubernetes RBAC 决定。管理员另有专用账号，只能用通行密钥，令牌 5 分钟就到期。",
        alt: "Zeabur Identity 的登录页，用通行密钥登录",
      },
      en: {
        title: "Passkeys and your own permissions",
        body: "Members sign in with a passkey, and every request carries their own token for Kubernetes RBAC to judge. Admins have their own accounts, passkey only, with tokens that last 5 minutes.",
        alt: "The Zeabur Identity sign-in page with a passkey button",
      },
    },
  },
  {
    group: "cluster",
    shot: { from: "docs", id: "cluster" },
    words: {
      "zh-TW": {
        title: "叢集本身也看得到",
        body: "Kubernetes 支援到什麼時候、版本差多少、哪些元件落後，都在總覽上。加節點、維護、移除都有步驟，維護時會遵守 PodDisruptionBudget。",
        alt: "叢集總覽，顯示節點、Kubernetes 版本和元件狀態",
      },
      "zh-CN": {
        title: "集群本身也看得到",
        body: "Kubernetes 支持到什么时候、版本差多少、哪些组件落后，都在总览上。加节点、维护、移除都有步骤，维护时会遵守 PodDisruptionBudget。",
        alt: "集群总览，显示节点、Kubernetes 版本和组件状态",
      },
      en: {
        title: "The cluster itself, in view",
        body: "Support dates, version skew and outdated components sit on the overview. Adding, draining and removing nodes each have their steps, and draining honours PodDisruptionBudgets.",
        alt: "The cluster overview with nodes, the Kubernetes version and components",
      },
    },
  },
]

export const featureCopy: Record<
  SiteLocale,
  {
    chapters: string
    all: (n: number) => string
    group: (n: number) => string
    index: { title: string; lead: string }
    partial: string
  }
> = {
  "zh-TW": {
    chapters: "從部署到出問題",
    all: (n) => `看全部 ${n} 項功能`,
    group: (n) => `這組的 ${n} 項功能`,
    index: {
      title: "全部功能",
      lead: "Zeabur main 上現在有的功能，每項一行。還沒做完的，後面寫著缺什麼。",
    },
    partial: "還沒做完",
  },
  "zh-CN": {
    chapters: "从部署到出问题",
    all: (n) => `看全部 ${n} 项功能`,
    group: (n) => `这组的 ${n} 项功能`,
    index: {
      title: "全部功能",
      lead: "Zeabur main 上现在有的功能，每项一行。还没做完的，后面写着缺什么。",
    },
    partial: "还没做完",
  },
  en: {
    chapters: "From deploying to fixing",
    all: (n) => `All ${n} features`,
    group: (n) => `${n} features in this group`,
    index: {
      title: "Every feature",
      lead: "What Zeabur's main branch has today, one line each. Unfinished ones say what is missing.",
    },
    partial: "Not finished",
  },
}
