import type { SiteLocale } from "../../lib/urls.ts"

// Labels of the products' own controls and states, quoted as their catalogues have them:
// zeabur web/src/i18n/{en,zh-TW,zh-CN}.ts and identity crates/zeabur-identity-ui/src/i18n.rs.
// Keep them in step with those files.
type Ui = {
  /** freshness.justNow */
  justNow: string
  /** project.viewMap, project.viewList */
  views: [string, string]
  /** add.button */
  add: string
  /** overview.failingCount */
  failing: (n: number) => string
  /** lane.web, lane.workers, lane.data */
  lanes: [string, string, string]
  /** status.building, status.ready */
  building: string
  ready: string
  /** phase.Running */
  running: string
  /** attention.title */
  attention: string
  /** reason.crashing */
  crashing: string
  /** diagnosis.action.logs, tab.logs */
  openLogs: string
  logs: string
  /** login_passkey (Identity) */
  passkey: string
}

export const ui: Record<SiteLocale, Ui> = {
  "zh-TW": {
    justNow: "剛剛更新",
    views: ["架構圖", "清單"],
    add: "新增",
    failing: (n) => `${n} 個異常`,
    lanes: ["網站", "背景服務", "資料"],
    building: "建置中",
    ready: "就緒",
    running: "執行中",
    attention: "需要處理",
    crashing: "反覆崩潰",
    openLogs: "開啟日誌",
    logs: "日誌",
    passkey: "使用通行密鑰登入",
  },
  "zh-CN": {
    justNow: "刚刚更新",
    views: ["架构图", "列表"],
    add: "新建",
    failing: (n) => `${n} 个异常`,
    lanes: ["网站", "后台服务", "数据"],
    building: "构建中",
    ready: "就绪",
    running: "运行中",
    attention: "需要处理",
    crashing: "反复崩溃",
    openLogs: "打开日志",
    logs: "日志",
    passkey: "使用通行密钥登录",
  },
  en: {
    justNow: "Updated just now",
    views: ["Map", "List"],
    add: "New",
    failing: (n) => `${n} failing`,
    lanes: ["Web", "Background services", "Data"],
    building: "Building",
    ready: "Ready",
    running: "Running",
    attention: "Needs attention",
    crashing: "Keeps crashing",
    openLogs: "Open logs",
    logs: "Logs",
    passkey: "Sign in with a passkey",
  },
}

/** Words on the scenes that are not the products' own labels. */
export const words: Record<SiteLocale, { kept: string; removed: string }> = {
  "zh-TW": { kept: "留在叢集裡", removed: "已移除" },
  "zh-CN": { kept: "留在集群里", removed: "已移除" },
  en: { kept: "Stays in the cluster", removed: "Removed" },
}

/** What each scene shows, for screen readers: the message, then the flow. */
export const alts: Record<SiteLocale, Record<"deploy" | "trace" | "access" | "leave", string>> = {
  "zh-TW": {
    deploy: "Zeabur 的架构图：从 Git 部署 web，状态从建置中转为就绪，连线一起画出来。",
    trace: "worker 反复崩溃，列在「需要处理」。开启日志，就看到错误在哪一行。",
    access:
      "用通行密钥登入后，Zeabur 和 kubectl 都带着你自己的凭证，能做什么由 Kubernetes RBAC 决定。",
    leave: "移除 Zeabur 之后，Deployment、Service、Ingress 和 PVC 都留在丛集里，照常执行。",
  },
  "zh-CN": {
    deploy: "Zeabur 的架构图：从 Git 部署 web，状态从构建中转为就绪，连接一起画出来。",
    trace: "worker 反复崩溃，列在“需要处理”。打开日志，就看到错误在哪一行。",
    access:
      "用通行密钥登录后，Zeabur 和 kubectl 都带着你自己的凭证，能做什么由 Kubernetes RBAC 决定。",
    leave: "移除 Zeabur 之后，Deployment、Service、Ingress 和 PVC 都留在集群里，照常运行。",
  },
  en: {
    deploy:
      "Zeabur's map: web is deployed from Git, goes from Building to Ready, and its connections are drawn in.",
    trace:
      "worker keeps crashing and shows under Needs attention. Open its logs to see the line with the error.",
    access:
      "After you sign in with a passkey, Zeabur and kubectl carry your own credentials and Kubernetes RBAC decides what you can do.",
    leave:
      "After Zeabur is removed, the Deployment, Service, Ingress and PVC stay in the cluster and keep running.",
  },
}

// Labels of Zeabur Desktop's chooser (zeabur desktop/web/src/i18n/*.ts) and of the Zeabur screens
// it opens (zeabur web/src/i18n/*.ts), for the Desktop page's scenes. Keep them in step.
type DesktopUi = {
  /** desktop.title */
  choose: string
  /** desktop.count */
  count: (n: number) => string
  /** desktop.colContext, desktop.colServer, desktop.colUser */
  cols: [string, string, string]
  /** desktop.current */
  current: string
  /** desktop.open */
  open: string
  /** projects.title, projects.other */
  projects: string
  other: string
  /** action.adopt */
  adopt: string
  /** phase.Running */
  running: string
  /** create.review, plan.diff, plan.cancel, plan.apply */
  review: string
  diff: string
  cancel: string
  apply: string
}

export const desktopUi: Record<SiteLocale, DesktopUi> = {
  "zh-TW": {
    choose: "選擇叢集",
    count: (n) => `${n} 個 context`,
    cols: ["Context", "伺服器", "使用者"],
    current: "目前使用中",
    open: "開啟",
    projects: "專案",
    other: "其他 Namespace",
    adopt: "使用這個 Namespace",
    running: "執行中",
    review: "檢查變更",
    diff: "YAML 差異",
    cancel: "取消",
    apply: "套用",
  },
  "zh-CN": {
    choose: "选择集群",
    count: (n) => `${n} 个 context`,
    cols: ["Context", "服务器", "用户"],
    current: "当前使用",
    open: "打开",
    projects: "项目",
    other: "其他 Namespace",
    adopt: "使用这个 Namespace",
    running: "运行中",
    review: "检查变更",
    diff: "YAML 差异",
    cancel: "取消",
    apply: "应用",
  },
  en: {
    choose: "Choose a cluster",
    count: (n) => `${n} contexts`,
    cols: ["Context", "Server", "User"],
    current: "Current",
    open: "Open",
    projects: "Projects",
    other: "Other namespaces",
    adopt: "Use this namespace",
    running: "Running",
    review: "Review changes",
    diff: "YAML diff",
    cancel: "Cancel",
    apply: "Apply",
  },
}
