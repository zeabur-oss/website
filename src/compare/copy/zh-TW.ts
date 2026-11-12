import type { CompareCopy } from "./index.ts"

export const zhTW: CompareCopy = {
  criteria: {
    runsOn: "跑在哪裡",
    machine: "機器需求",
    license: "授權與費用",
    deploy: "怎麼部署",
    members: "成員與權限",
    servers: "多台機器",
    databases: "資料庫與備份",
    existing: "既有工作負載",
    interface: "介面",
    remove: "移除之後",
  },
  criterion: "項目",
  checked: "檢查日",
  lastChecked: "最後檢查",
  notDocumented: "「文件沒寫」表示官方文件沒提到，不代表沒有這個功能。",
  before: {
    title: "選定前再確認",
    body: "升級和回復的方式、備份怎麼還原、路由和 HTTPS 憑證由誰管理、儲存壞掉怎麼復原、監控和求助管道。上表有兩邊官方文件的連結，沒寫清楚的再到各自的社群問。",
  },
  soon: {
    title: "Zeabur 還沒發布的功能（Coming soon）",
    intro: "還沒發布，表格不算進去：",
  },
  corrections: {
    title: "資料有錯",
    body: "兩邊的功能都會變。發現哪一格過時或寫錯，到 GitHub 回報，附上官方文件的連結。確認後會更新表格和最後檢查日。",
    link: "回報比較頁錯誤",
  },
  hub: {
    title: "Zeabur 和其他自架工具比較",
    description:
      "Zeabur 開源版和 Dokploy 等自架部署工具的比較。每頁同樣十個項目，每一列附官方來源和檢查日期，也寫出對方比較適合的情況。",
    heading: "Zeabur 和其他自架工具比較",
    intro:
      "Zeabur 開源版是跑在 Kubernetes 上的開源部署介面，適合已經有叢集、或打算用 Kubernetes 的團隊。只有 Docker 主機、或只想看叢集的話，別的工具可能更合適，下表照用途列出。",
    disclosure: "這些頁面由 Zeabur 開源版的維護者撰寫，Zeabur 是比較的其中一方。",
    uses: {
      title: "照用途找工具",
      need: "你的情況",
      tools: "可以先看",
      rows: [
        {
          need: "只有 Docker 主機，不想管理 Kubernetes",
          tools: "Dokploy, Coolify, CapRover, Dokku",
        },
        {
          need: "已經有 Kubernetes，想讓開發者自己部署",
          tools: "Zeabur, Kubero",
        },
        {
          need: "只想看和改叢集裡的物件",
          tools: "Headlamp, k9s, Freelens",
        },
        {
          need: "要從一個地方管很多叢集",
          tools: "Rancher",
        },
      ],
    },
    pages: "一對一比較",
    method: {
      title: "怎麼查的",
      body: "每一格只寫官方文件、價格頁、授權檔或 GitHub releases 寫明的事，附上那一句所在的頁面和檢查日期。不放跑分、記憶體實測或使用者人數。",
    },
  },
  pages: {
    dokploy: {
      title: "Zeabur 和 Dokploy 比較：多台主機用 Docker Swarm 還是 Kubernetes",
      description:
        "Dokploy 用 Docker 和 Traefik 部署，文件寫至少 2 GB 記憶體；Zeabur 開源版跑在 Kubernetes 上，權限交給 RBAC。用十個項目比較，每一列附官方來源和檢查日期。",
      heading: "Zeabur 和 Dokploy 比較",
      line: "Dokploy 用 Docker 加 Traefik，可以管遠端主機或 Swarm 叢集；Zeabur 用 Kubernetes。",
      link: "Zeabur 和 Dokploy 比較",
      checked: "2026-11-12",
      versions: "Zeabur v0.2.0、Dokploy v0.31.1",
      summary:
        "兩個都是可以自己架的開源部署平台。主要差別在底下跑什麼：Dokploy 用 Docker 和 Traefik，可以用 SSH 管遠端主機，或組成 Docker Swarm；Zeabur 開源版管理 Kubernetes 叢集，叢集裡本來就有的東西它也看得到。",
      disclosure:
        "這頁由 Zeabur 開源版的維護者撰寫，Zeabur 是比較的其中一方。表格每一列都附上官方來源和檢查日期，看到錯誤可以回報。",
      shortAnswer: "先看結論",
      chooseThem: {
        title: "這些情況選 Dokploy",
        points: [
          "手上有一台或幾台 Linux 主機，想用 Docker 部署，不想管理 Kubernetes。",
          "主機只有 2 GB 記憶體，而且需要多人使用。Dokploy 文件寫至少 2 GB 記憶體、30 GB 磁碟。Zeabur 的團隊安裝目前要 4 GiB；個人安裝 1.5 GiB 就能裝，但沒有成員和權限。",
          "想直接套用現成的應用。Dokploy 的 README 寫有 600 多個範本，Zeabur 目錄有 33 個。先確認目錄裡有沒有你要的應用。",
          "Docker Compose 檔裡用 `build:` 從原始碼建置，或要用 Swarm 的 Stack。Dokploy 可以直接部署 Compose 和 Stack；Zeabur 匯入 Compose 時只建立有 `image:` 的服務。",
          "想挑建置方式：Dokploy 有 Nixpacks、Railpack、Dockerfile、Heroku buildpacks、Paketo 和靜態網站，也能把建置放到另一台主機。Zeabur 用 Railpack 或 Dockerfile 建置。",
          "需要 SAML 或 OIDC 單一登入、SCIM 或稽核紀錄，而且願意付費。Dokploy 把這些放在付費版本。",
        ],
      },
      chooseZeabur: {
        title: "這些情況選 Zeabur",
        points: [
          "團隊已經在用 Kubernetes，或想在一台機器上就用標準的 Kubernetes 物件。之後不用 Zeabur，這些物件也還在。",
          "有服務是用 Helm、Argo CD 或 Flux 部署的。Zeabur 會列出這些服務並標示出來，只允許重新啟動，設定要回到原本的 values 或 Git 儲存庫改。",
          "希望專案權限由 Kubernetes RBAC 管。成員在每個專案是開發者或檢視者，Zeabur 以登入者的身分存取叢集。",
          "要跨多台機器，讓 Kubernetes 決定服務排到哪一台。RKE2 支援三台控制平面節點，可以容忍其中一台故障；應用能不能持續服務，還要看副本數和儲存。",
          "希望每個元件都用 OSI 認可的授權。Zeabur、Identity、Builder 和 Catalog 都是 Apache-2.0。",
          "已經有叢集，想先看看再決定：在自己的電腦上執行 `zeaburctl ui`，用手上的 kubeconfig 開啟，叢集裡不用裝任何東西。",
        ],
      },
      table: "逐項比較",
      rows: {
        runsOn: {
          zeabur: {
            text: "Kubernetes：安裝程式裝 K3s 或 RKE2，單機可以用 KubeSolo（單節點 Kubernetes）；或裝進現有叢集（Kubernetes 1.30 以上）。",
            links: [
              {
                text: "安裝",
                url: "https://oss.zeabur.com/zh-TW/docs/zeabur/get-started/quickstart/",
              },
            ],
          },
          them: {
            text: "Docker 加 Traefik。可以用 SSH 管遠端主機，或用 Docker Swarm 組成叢集。Kubernetes：文件沒寫。",
            links: [
              {
                text: "README",
                url: "https://github.com/Dokploy/dokploy/blob/canary/README.md",
              },
            ],
          },
        },
        machine: {
          zeabur: {
            text: "團隊安裝至少 4 GiB 記憶體；個人安裝至少 1.5 GiB；裝在伺服器上時，80、443、6443、10250 埠要空著；用 `zeaburctl ui` 在自己電腦開啟時，叢集裡不用裝東西。",
            links: [
              {
                text: "個人安裝",
                url: "https://oss.zeabur.com/zh-TW/docs/zeabur/install/personal/",
              },
            ],
          },
          them: {
            text: "「at least 2GB of RAM and 30GB of disk space」，80、443、3000 埠要空著。",
            links: [
              {
                text: "安裝",
                url: "https://docs.dokploy.com/docs/core/installation",
              },
            ],
          },
        },
        license: {
          zeabur: {
            text: "Apache-2.0，沒有付費版。",
            links: [
              {
                text: "GitHub",
                url: "https://github.com/zeabur-oss/zeabur",
              },
            ],
          },
          them: {
            text: "Apache-2.0，但 `/proprietary` 目錄用 Dokploy Source Available License（不是 OSI 授權），正式環境使用要另外簽商業合約。單一登入、SCIM、自訂角色和稽核紀錄要付費；付費版本每台主機每月 4.50 美元起。",
            links: [
              {
                text: "授權檔",
                url: "https://raw.githubusercontent.com/Dokploy/dokploy/canary/LICENSE.MD",
              },
              {
                text: "價格",
                url: "https://dokploy.com/pricing",
              },
            ],
          },
        },
        deploy: {
          zeabur: {
            text: "Git（GitHub App 或任何 Git 網址，用 Railpack 或 Dockerfile 建置）、上傳資料夾、容器映像檔、Docker Compose（只建立有 `image:` 的服務）、目錄範本、排程工作。",
            links: [
              {
                text: "從 Git 部署",
                url: "https://oss.zeabur.com/zh-TW/docs/zeabur/deploy/git/",
              },
            ],
          },
          them: {
            text: "Git（GitHub、GitLab、Bitbucket、Gitea），push 後由 webhook 自動部署；Docker Hub 映像檔；Docker Compose 和 Stack。建置可選 Nixpacks（預設）、Railpack、Dockerfile、Heroku buildpacks、Paketo、靜態網站；README 寫「+600 Templates」。",
            links: [
              {
                text: "建置方式",
                url: "https://docs.dokploy.com/docs/core/applications/build-type",
              },
            ],
          },
        },
        members: {
          zeabur: {
            text: "團隊安裝：成員用通行密鑰登入，每個專案選開發者或檢視者，寫成 Kubernetes RoleBinding。個人安裝沒有成員，拿到 kubeconfig 就能控制整個叢集。",
            links: [
              {
                text: "權限",
                url: "https://oss.zeabur.com/zh-TW/docs/zeabur/reference/permissions/",
              },
            ],
          },
          them: {
            text: "預設角色有 Owner、Admin、Member。自訂角色、單一登入（OIDC、SAML）、SCIM 和稽核紀錄要付費；價格頁列出兩步驟驗證從每月 15 美元的版本起提供。",
            links: [
              {
                text: "價格",
                url: "https://dokploy.com/pricing",
              },
              {
                text: "付費功能",
                url: "https://docs.dokploy.com/docs/core/enterprise",
              },
            ],
          },
        },
        servers: {
          zeabur: {
            text: "由 Kubernetes 排程。安裝程式建立的 K3s 只能加工作節點；RKE2 可以加工作節點和控制平面節點。個人安裝只有這一台。",
            links: [
              {
                text: "節點",
                url: "https://oss.zeabur.com/zh-TW/docs/zeabur/cluster/nodes/",
              },
            ],
          },
          them: {
            text: "可以用 SSH 加遠端主機，分成部署用和建置用，只跑部署的主機約占 250 MB 記憶體。也能用「Add Node」組成 Docker Swarm 叢集，叢集需要一個映像檔倉庫。",
            links: [
              {
                text: "遠端主機",
                url: "https://docs.dokploy.com/docs/core/remote-servers",
              },
              {
                text: "叢集",
                url: "https://docs.dokploy.com/docs/core/cluster",
              },
            ],
          },
        },
        databases: {
          zeabur: {
            text: "PostgreSQL、MongoDB、MySQL、MariaDB、Dragonfly，由各自的 operator 管理，資料庫備份到 S3。磁碟區用 K8up，整個專案用 Velero。",
            links: [
              {
                text: "資料庫",
                url: "https://oss.zeabur.com/zh-TW/docs/zeabur/deploy/databases/",
              },
            ],
          },
          them: {
            text: "Postgres、MySQL、MariaDB、MongoDB、Redis，可以自動備份到 S3。Dokploy 自己的 Postgres 和 `/etc/dokploy` 也能備份到 S3。",
            links: [
              {
                text: "備份",
                url: "https://docs.dokploy.com/docs/core/databases/backups",
              },
            ],
          },
        },
        existing: {
          zeabur: {
            text: "其他工具建立的 Namespace 會直接出現在專案頁，不用匯入。Helm、Argo CD、Flux 管理的服務只能重新啟動。",
            links: [
              {
                text: "運作方式",
                url: "https://oss.zeabur.com/zh-TW/docs/zeabur/get-started/how-it-works/",
              },
            ],
          },
          them: {
            text: "Dokploy 管的是 Docker 主機，沒有 Kubernetes 物件要接。既有的 Docker Compose 檔和映像檔可以直接部署。",
            links: [
              {
                text: "Docker Compose",
                url: "https://docs.dokploy.com/docs/core/docker-compose",
              },
            ],
          },
        },
        interface: {
          zeabur: {
            text: "網頁介面（裝在叢集裡，或用 `zeaburctl ui` 在本機開啟）；命令列 `zeaburctl`，有 Linux 和 Apple 晶片 Mac 版，Windows 要用 WSL。",
            links: [
              {
                text: "zeaburctl",
                url: "https://oss.zeabur.com/zh-TW/docs/zeabur/reference/zeaburctl/",
              },
            ],
          },
          them: {
            text: "網頁介面和 REST API（`/swagger` 有 Swagger UI，API 金鑰放在 `x-api-key` 標頭）。命令列工具：文件沒寫。",
            links: [
              {
                text: "API",
                url: "https://docs.dokploy.com/docs/api",
              },
            ],
          },
        },
        remove: {
          zeabur: {
            text: "Deployment、Service、Ingress、環境變數和磁碟區都留在原本的 Namespace，服務繼續執行；Ingress 控制器和 cert-manager 這些元件也留著。",
            links: [
              {
                text: "移除 Zeabur",
                url: "https://oss.zeabur.com/zh-TW/docs/zeabur/leave/uninstall/",
              },
            ],
          },
          them: {
            text: "移除 dokploy、dokploy-traefik、dokploy-postgres、dokploy-redis 這幾個 Swarm 服務和它們的磁碟區、網路，以及 `/etc/dokploy`。已部署的應用會怎樣：文件沒寫。",
            links: [
              {
                text: "移除",
                url: "https://docs.dokploy.com/docs/core/uninstall",
              },
            ],
          },
        },
      },
      releases:
        "版本（2026-11-12）：Zeabur v0.2.0 在 2026-11-08 發布，還在 1.0 之前。Dokploy v0.31.1 在 2026-11-12 發布，前一版 v0.31.0 在 2026-11-05，也還在 1.0 之前。兩邊升級前都先看變更紀錄。",
      differ: {
        title: "差在哪裡",
        points: [
          "**Docker Swarm 還是 Kubernetes。** 其他差異大多從這裡來。Dokploy 把容器直接跑在 Docker 上，一台小機器就夠，Compose 檔和 Stack 也能照用；要多台時，可以用 SSH 加遠端主機，或用 Swarm 把主機串起來。Zeabur 用的是 Kubernetes 物件，所以能和 Helm、Argo CD、kubectl 一起用；代價是記憶體，團隊安裝目前要 4 GiB。",
          "**權限放在哪裡。** Dokploy 的角色存在 Dokploy 裡，自訂角色和單一登入要付費。Zeabur 沒有自己的權限資料，角色寫成 Kubernetes 的 RoleBinding，用 kubectl 也查得到。",
          "**移除之後。** Dokploy 的移除步驟會一併刪掉 dokploy-traefik 服務，網域轉送和 HTTPS 憑證要另外接手；文件沒寫應用的容器會不會留下。Zeabur 移除後，服務、Ingress 控制器和 cert-manager 都還在，但成員角色會跟著移除。動手前先確認路由、憑證續期和備份由誰接手。",
        ],
      },
      soon: [
        "小機器：團隊安裝可以在 2 vCPU、2 GiB 記憶體的機器上執行。",
        "Zeatend：在主機商的網頁終端機貼上一行指令，用終端機介面把 Linux 伺服器裝成 K3s、RKE2 或 KubeSolo 叢集。",
        "`zeaburctl install`：一行指令把 Zeabur 裝進現有叢集，已經有的元件不會再裝一次。",
      ],
      moving: {
        title: "從 Dokploy 換過來",
        body: "Zeabur 可以匯入 Docker Compose 檔，但只建立有 `image:` 的服務，只有 `build:` 的服務要改用「從 Git 部署」。匯入時可以把資料庫換成 operator 管理的服務，其他服務裡認得出來的連線字串會一起改掉。匯入不會搬資料：資料庫和磁碟區會建成新的、空的，上線前要先把資料搬過去。兩邊的安裝都要求 80 和 443 埠空著，搬的期間把 Zeabur 裝在另一台主機，搬完再切換 DNS。",
        link: {
          text: "匯入 Docker Compose 服務",
          url: "https://oss.zeabur.com/zh-TW/docs/zeabur/deploy/compose/",
        },
        back: "反過來，不用 Zeabur 時，服務本來就是 Kubernetes 物件，會留在叢集裡繼續執行；要搬回 Docker 主機，設定和資料得自己搬。",
      },
      method:
        "表格的內容來自兩邊的官方文件、價格頁、GitHub 儲存庫和授權檔，2026-11-12 讀取。表格只引用這些來源，沒有自行量測效能或記憶體。",
      trademark:
        "Dokploy 是其擁有者的商標。這頁只用名稱指稱該產品，和 Dokploy 沒有合作或背書關係。",
    },
  },
}
