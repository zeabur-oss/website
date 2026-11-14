import type { HomeCopy } from "./index.ts"

export const zhTW: HomeCopy = {
  home: {
    hero: {
      title: "開源的 Kubernetes 部署介面，服務都留在你的叢集",
      sub: "Zeabur 是開源的部署介面。從 Git、映像檔或 Docker Compose 部署，改設定前先檢查這次的變更。服務本來就是 Kubernetes 物件，哪天不用 Zeabur 也照常執行。",
      primary: "開始使用",
      secondary: "到 GitHub 看原始碼",
      note: "需要一個 Kubernetes 叢集，或一台 Linux 伺服器。",
    },
    more: {
      team: "產品團隊怎麼用",
      provider: "代管服務商怎麼用",
      homelab: "Homelab 怎麼用",
    },
    permTitle: "每個人能做什麼，交給 Kubernetes RBAC",
    openTitle: "用手上的 kubeconfig 就能打開",
    cta: {
      title: "從手上有的開始",
      body: "已經有叢集，可以用 Helm 裝進去，或在本機執行 `zeaburctl ui` 打開。文件從安裝寫到第一個服務上線。",
    },
  },
  hero: {
    switch: {
      label: "適合誰",
      developer: "開發者",
      team: "產品團隊",
      provider: "代管服務商",
      homelab: "Homelab",
    },
    developer: {
      title: "把自己寫的程式部署到 Kubernetes，從一台小機器開始",
      sub: "從 Git、映像檔或 Docker Compose 部署，網域、HTTPS、環境變數和資料庫都在同一個地方設定。一台 2 核心、2 GiB 記憶體的機器就能開始，程式變多、流量變大時，仍然是同一個叢集、同一個 Zeabur GUI。",
      primary: "開始使用",
      secondary: "在本機打開",
      note: "需要一個 Kubernetes 叢集，或一台 Linux 伺服器。想先看看，在自己的電腦上執行 `zeaburctl ui` 就能打開。",
      alt: "shop 專案頁，列出 web、worker 和資料庫的狀態，worker 排在「需要處理」的第一項。",
      meta: "開發者：把自己的程式部署到 Kubernetes｜Zeabur",
    },
    team: {
      title: "在現有的 Kubernetes 上，像用 PaaS 一樣部署",
      sub: "從 Git、映像檔或 Docker Compose 部署，網域、HTTPS、環境變數和資料庫都在同一個地方設定。Zeabur 直接讀寫你現有的叢集，用 Helm、Argo CD 或 Flux 部署的服務打開就看得到。服務出問題時，畫面會寫出原因和下一步，開發者自己就能查。",
      primary: "安裝到叢集",
      secondary: "看部署怎麼做",
      note: "安裝需要叢集管理員權限。想先看看，在自己的電腦上執行 `zeaburctl ui` 就能打開。",
      alt: "shop 專案頁，列出 web、worker 和資料庫的狀態，worker 排在「需要處理」的第一項。",
      soon: "Kubernetes 1.30 以上的叢集，執行 `zeaburctl install` 就能裝好 Zeabur 和 Zeabur Identity。叢集已經有的 Ingress、憑證和指標元件會直接沿用。",
      meta: "產品團隊：在現有的 Kubernetes 上部署｜Zeabur",
    },
    provider: {
      title: "叢集你來架，部署讓客戶自己來",
      sub: "用 Zeatend 在客戶的伺服器裝好 K3s 或 RKE2，之後的升級也交給它。再裝上 Zeabur，邀請客戶的成員，按專案給開發者或檢視者權限。拿到開發者權限的人，部署、看日誌、重新啟動都能在 Zeabur GUI 自己來。",
      primary: "看 Zeatend 怎麼架叢集",
      secondary: "看權限怎麼分",
      note: "K3s 叢集加上 Zeabur，一台 2 vCPU、2 GiB 記憶體的機器就能裝。",
      alt: "Zeatend 的終端機介面，正在把一台 Linux 伺服器裝成 K3s 叢集。",
      meta: "代管服務商：替客戶架叢集，部署交給客戶｜Zeabur",
    },
    homelab: {
      title: "免費開源，跟你原本的 Helm、Argo CD 一起用",
      sub: "Zeabur 採 Apache-2.0 授權。用 Helm、Argo CD 或 Flux 部署的服務會直接列出來並標示，欄位在 Zeabur 裡改不了，設定照樣用原本的工具管理。想先看看，在自己的電腦上執行 `zeaburctl ui`，叢集裡什麼都不用裝。",
      primary: "在本機打開",
      secondary: "到 GitHub 看原始碼",
      note: "用 KubeSolo 的個人安裝沒有成員和角色，也不能用 Zeabur Identity 登入。",
      alt: "專案頁的其他 Namespace，Helm 或 Argo CD 管理的服務有標示。",
      meta: "Homelab：免費開源，跟 Helm、Argo CD 一起用｜Zeabur",
    },
  },
  proof: {
    license: {
      title: "Apache-2.0 授權",
      body: "Zeabur 和 Identity、Builder、Catalog 都用這個授權，原始碼在 GitHub。",
    },
    state: {
      title: "沒有自己的資料庫",
      body: "你在 Zeabur 看到的專案、服務和網域，都直接從 Kubernetes 讀出來。",
    },
    rbac: {
      title: "權限由 Kubernetes RBAC 決定",
      body: "Zeabur 自己沒有叢集權限，每個請求都帶著登入者的身分。",
    },
    review: {
      title: "寫入前先檢查變更",
      body: "按「檢查變更」會先列出要寫進叢集的差異。",
    },
    roles: {
      title: "按專案分權限",
      body: "成員在每個專案的角色是開發者或檢視者，存成 Kubernetes 的 RoleBinding。",
    },
    lockin: {
      title: "移除後服務照常執行",
      body: "移除 Zeabur 後，服務的 Kubernetes 物件都留在原本的 Namespace。",
    },
    gitops: {
      title: "GitOps 的設定留在 Git",
      body: "Helm、Argo CD 和 Flux 管理的服務會標示出來，欄位在 Zeabur 裡改不了。",
    },
    local: {
      title: "在本機打開",
      body: "`zeaburctl ui` 只在你的電腦執行，只監聽 127.0.0.1。",
    },
  },
  walk: {
    title: "worker 一直重新啟動",
    intro: "shop 專案的 worker 卡在反覆重新啟動。從專案頁到日誌，在 Zeabur 裡是這樣找到原因的。",
    steps: [
      {
        title: "找到出問題的服務",
        body: "專案頁把有問題的服務排在最上面：worker 1/2 就緒、重新啟動 14 次，旁邊就是日誌按鈕。不用先下 `kubectl get pods` 一個個找。",
        alt: "shop 專案頁。worker 反覆崩潰，排在「需要處理」的第一項。",
      },
      {
        title: "看懂發生什麼事",
        body: "服務頁寫著：容器已重新啟動 14 次，叢集每次重試前都等得更久。接著指出錯誤在前一次執行的日誌裡。原始的 `CrashLoopBackOff` 和判斷依據收在下面，展開就看得到。",
        alt: "worker 的服務頁：容器已重新啟動 14 次，附上處理方式和「開啟日誌」按鈕。",
      },
      {
        title: "看日誌，或把診斷貼給同事",
        body: "按「開啟日誌」，就看到前一次執行最後印出的錯誤。要找人幫忙時，按「複製診斷」貼給同事，對方看到的是同一份說明。",
        alt: "worker 前一次執行的日誌，最後一行是錯誤訊息。",
      },
    ],
  },
  perm: {
    title: "在 shop，erin 能部署，alice 只能看",
    body: "邀請成員時，每個專案選開發者或檢視者。Zeabur 會寫入 Kubernetes 的 RoleBinding，用 kubectl 也查得到。",
    erin: "erin 是 shop 的開發者，可以部署、改環境變數、重新啟動、看日誌，也能開終端機。",
    alice: "alice 是 shop 的檢視者，看得到狀態和事件；打開日誌會顯示權限不足，也不能修改。",
    invite: "成員用 Zeabur Identity 的通行密鑰登入。邀請連結 7 天內有效，只能用一次。",
    scope: "成員和角色只在團隊安裝裡有。",
    deniedAlt: "alice 打開 worker 的日誌，畫面顯示權限不足。",
  },
  review: {
    title: "寫入前先檢查變更",
    body: "按「檢查變更」會列出這次要寫進叢集的差異。按下套用之前，叢集不會有任何變化。",
    conflict:
      "檢查完到套用之間，同事如果用 kubectl 改了同一個物件，Zeabur 會拒絕這次套用，讓你重新檢查，你不會把同事剛換上的映像檔改回去。",
    gitops:
      "由 Helm、Argo CD 或 Flux 管理的服務會標示出來，設定欄位在 Zeabur 裡不能修改，要回到原本的 values 或 Git 儲存庫修改。重新啟動只會加上一個 annotation，所以照樣可以重新啟動。",
    alt: "web 的檢查變更畫面。YAML 差異：NODE_ENV 從 production 改成 staging。",
  },
  local: {
    title: "在本機打開，叢集裡什麼都不用裝",
    body: "在自己的電腦上執行 `zeaburctl ui`，就用手上的 kubeconfig 開啟 Zeabur GUI，只監聽 127.0.0.1。能做什麼，看這份 kubeconfig 的身分有哪些權限。按 Ctrl-C 就關閉。",
    chip: "Zeabur GUI",
    alt: "示意圖：筆電上的 Zeabur GUI 用 kubeconfig 連到叢集的 Kubernetes API，叢集裡沒有裝任何東西。",
  },
  lockin: {
    title: "移除 Zeabur，服務照常執行",
    body: "服務本來就是 Kubernetes 物件。移除 Zeabur 之後，Deployment、Service、Ingress、環境變數和磁碟區都留在原本的 Namespace，服務繼續執行。",
    gitops: "用 Helm、Argo CD 或 Flux 部署的服務，打開 Zeabur 就看得到，不用匯入。",
    existing:
      "其他工具建立的 Namespace 也列在專案頁。按「使用這個 Namespace」只會加上一個標籤，裡面的物件都不會改變。",
    alt: "示意圖：移除 Zeabur 之後，Deployment、Service、Ingress 和磁碟區留在原本的 Namespace，服務照常執行。",
    uninstall: {
      title: "移除步驟",
      after: "Kubernetes、叢集元件和專案的 Namespace 都會留下。",
      link: "移除 Zeabur 的步驟",
    },
  },
  license: {
    title: "Apache-2.0 授權",
    body: "Zeabur、Zeabur Identity、Zeabur Builder 和 Zeabur Catalog 都採 Apache-2.0 授權，原始碼都在 GitHub。",
  },
  safety: {
    title: "安全",
    hardening:
      "安裝程式建立的 K3s 叢集，依照 K3s 強化指南設定。哪些項目要由管理員自己處理，指南裡也列出來了。",
    hardeningLink: "K3s 強化指南",
    gitops: "Helm、Argo CD 和 Flux 管理的服務會標示出來，設定欄位不能在 Zeabur 修改。",
  },
  zeatend: {
    title: "從一行指令開始，把伺服器裝成叢集",
    body: "在主機商的網頁終端機貼上一行指令，Zeatend 的終端機介面會帶你把 Linux 伺服器裝成 K3s、RKE2 或 KubeSolo 叢集，順便強化主機設定，最後交給你一份 kubeconfig。之後的叢集升級也由 Zeatend 處理。Zeatend 不裝 Zeabur，拿這份 kubeconfig 在自己的電腦打開 Zeabur GUI 就好。",
    path: [
      "在網頁終端機貼上一行",
      "Zeatend 終端機介面",
      "K3s、RKE2 或 KubeSolo",
      "kubeconfig",
      "打開 Zeabur GUI",
    ],
    mirror: "伺服器連不上 GitHub 時，設定鏡像站和代理，照著指南就能安裝。",
    alt: "五站路線：在網頁終端機貼上一行、Zeatend 終端機介面、K3s／RKE2／KubeSolo 叢集、kubeconfig、打開 Zeabur GUI。",
  },
  soon: [
    "`zeaburctl install`：在 Kubernetes 1.30 以上的叢集裝好 Zeabur 和 Zeabur Identity。Ingress、憑證和指標元件只補裝缺少的。",
    "Zeabur Desktop：Windows 和 macOS 的桌面 App。讀取 kubeconfig，列出可以搜尋的 context，選一個就開啟 Zeabur。",
  ],
  grow: {
    title: "從小機器開始，長大不用搬家",
    intro:
      "先從一台小機器開始。程式和流量變多以後，還是同一個叢集、同一個 Zeabur GUI，不用搬到別的平台。",
    points: [
      {
        title: "長大還是同一個叢集",
        body: "小專案變成正式服務時，不用重建環境。最早部署的服務還在原處。",
      },
      {
        title: "小機器更省記憶體",
        body: "在 2 核心、2 GiB 記憶體的機器上，記憶體用量從 1.8 GiB 降到 1.1 GiB，少了約 38%。",
      },
      {
        title: "留給自己程式的空間更多",
        body: "跑著一個應用程式和一個資料庫時，剩餘記憶體從 52 MiB 增加到 448 MiB。",
      },
    ],
  },
  secure: {
    title: "用 Kubernetes 把程式隔開，也把門顧好",
    intro: "Kubernetes 的隔離、高可用、備份和協作，都放在你部署時用的同一套畫面裡。",
    points: [
      {
        title: "由 Kubernetes 隔離",
        body: "每個專案各跑在自己的 Kubernetes Namespace，彼此分開。",
      },
      {
        title: "高可用、備份和協作，在 GUI 裡設定",
        body: "高可用和備份在 Zeabur GUI 設定，多人一起用也在這裡，不必自己寫 Kubernetes 物件。",
      },
      {
        title: "Zero-Trust",
        body: "登入後拿到的是短效權杖，每個請求能做什麼，由 Kubernetes RBAC 決定。",
      },
    ],
  },
  cta: {
    primary: "開始使用",
    secondary: "閱讀文件",
    providerPrimary: "追蹤 Zeatend",
    developer: {
      title: "部署你的第一個程式",
      body: "用 Helm 裝進叢集，或在本機執行 `zeaburctl ui`。文件從安裝寫到第一個服務上線。",
    },
    team: {
      title: "先用手上的 kubeconfig 打開看看",
      body: "`zeaburctl ui` 在你的電腦上執行，叢集裡不用先裝任何東西。",
    },
    provider: {
      title: "在 GitHub 追蹤 Zeatend",
      body: "Zeatend 還在開發初期。想知道什麼時候能用，到儲存庫看進度。",
    },
    homelab: {
      title: "原始碼都在 GitHub",
      body: "Zeabur、Zeabur Identity、Zeabur Builder 和 Zeabur Catalog 都採 Apache-2.0 授權，歡迎開 issue 和 PR。",
    },
  },
}
