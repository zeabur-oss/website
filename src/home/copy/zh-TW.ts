import type { HomeCopy } from "./index.ts"

export const zhTW: HomeCopy = {
  hero: {
    team: {
      eyebrow: "團隊共用叢集",
      title: "同一個叢集，各用各的權限",
      sub: "Zeabur 把叢集整理成專案和服務。成員用通行密鑰登入，每次讀寫都以本人的身分送到 Kubernetes，能做什麼由 RBAC 決定。改設定之前，Zeabur 會先列出這次要寫入的內容。",
      primary: "安裝到叢集",
      secondary: "看權限怎麼分",
      soon: "Kubernetes 1.30 以上的叢集，執行 `zeaburctl install` 就能裝好 Zeabur 和 Zeabur Identity。團隊用的 K3s 叢集加上 Zeabur，一台 2 vCPU、2 GiB 記憶體的機器就能裝。",
    },
    machine: {
      eyebrow: "只有一台機器",
      title: "一台機器，2 GiB 記憶體就能架設叢集",
      sub: "在主機商的網頁終端機貼上一行指令，Zeatend 會帶你在這台 Linux 伺服器裝好 K3s、RKE2 或 KubeSolo 叢集，最後交給你一份 kubeconfig。Zeatend 不裝 Zeabur，在自己的電腦用這份 kubeconfig 開啟 Zeabur 就好。",
      primary: "安裝到我的伺服器",
      secondary: "看機器需求",
      next: "之後要給團隊用，在同一個 K3s 或 RKE2 叢集上執行 `zeaburctl install`，裝上 Zeabur 和 Zeabur Identity。",
    },
  },
  proof: [
    {
      title: "Apache-2.0 授權",
      body: "Zeabur 和 Identity、Builder、Catalog 都用這個授權，原始碼在 GitHub。",
    },
    {
      title: "沒有自己的資料庫",
      body: "你在 Zeabur 看到的專案、服務和網域，都直接從 Kubernetes 讀出來。",
    },
    {
      title: "權限由 Kubernetes RBAC 決定",
      body: "Zeabur 自己沒有叢集權限，每個請求都帶著登入者的身分。",
    },
  ],
  walk: {
    title: "worker 一直重新啟動",
    intro: "shop 專案的 worker 卡在反覆重新啟動。從專案頁到日誌，在 Zeabur 裡是這樣找到原因的。",
    steps: [
      {
        title: "找到出問題的服務",
        body: "專案頁把有問題的服務排在最上面：worker 1/2 就緒、重新啟動 14 次，旁邊就是日誌按鈕。不用先下 `kubectl get pods` 一個個找。",
      },
      {
        title: "看懂發生什麼事",
        body: "服務頁寫著：容器已重新啟動 14 次，叢集每次重試前都等得更久。接著指出錯誤在前一次執行的日誌裡。原始的 `CrashLoopBackOff` 和判斷依據收在下面，展開就看得到。",
      },
      {
        title: "看日誌，或把診斷貼給同事",
        body: "按「開啟日誌」，就看到前一次執行最後印出的錯誤。要找人幫忙時，按「複製診斷」貼給同事，對方看到的是同一份說明。",
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
  },
  review: {
    title: "寫入前先檢查變更",
    body: "按「檢查變更」會列出這次要寫進叢集的差異。按下套用之前，叢集不會有任何變化。",
    conflict:
      "檢查完到套用之間，同事如果用 kubectl 改了同一個物件，Zeabur 會拒絕這次套用，讓你重新檢查，你不會把同事剛換上的映像檔改回去。",
    gitops:
      "由 Helm、Argo CD 或 Flux 管理的服務會標示出來，設定欄位在 Zeabur 裡不能修改，要回到原本的 values 或 Git 儲存庫修改。重新啟動只會加上一個 annotation，所以照樣可以重新啟動。",
  },
  local: {
    title: "在本機打開，叢集裡什麼都不用裝",
    body: "在自己的電腦執行 `zeaburctl ui`，就用手上的 kubeconfig 開啟 Zeabur，只監聽 127.0.0.1。能做什麼，看這份 kubeconfig 有哪些權限。按 Ctrl-C 就關閉。",
  },
  lockin: {
    title: "移除 Zeabur，服務照常執行",
    body: "服務本來就是 Kubernetes 物件。移除 Zeabur 之後，Deployment、Service、Ingress、環境變數和磁碟區都留在原本的 Namespace，服務繼續執行。",
    gitops: "用 Helm、Argo CD 或 Flux 部署的服務，打開 Zeabur 就看得到，不用匯入。",
    existing:
      "其他工具建立的 Namespace 也列在專案頁。按「使用這個 Namespace」只會加上一個標籤，裡面的物件都不會改變。",
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
  soon: [
    "Zeatend：在終端機把 Linux 伺服器裝成 K3s、RKE2 或 KubeSolo 叢集，之後的升級和維護也由它負責。",
    "`zeaburctl install`：在 Kubernetes 1.30 以上的叢集裝好 Zeabur 和 Zeabur Identity。Ingress、憑證和指標元件只補裝缺少的。",
    "伺服器連不上 GitHub 時，設好映像檔鏡像站和代理就能安裝。",
    "Zeabur Desktop：Windows 和 macOS 的桌面 App。讀取 kubeconfig，列出可以搜尋的 context，選一個就開啟 Zeabur。",
  ],
  cta: {
    title: "先用手上的 kubeconfig 打開看看",
    body: "`zeaburctl ui` 在你的電腦上執行，叢集裡不用先裝任何東西。",
    primary: "開始使用",
    secondary: "閱讀文件",
  },
}
