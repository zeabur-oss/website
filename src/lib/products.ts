// The projects whose docs the site carries, in the order the site lists them.
export const productIds = ["zeabur", "identity", "builder", "catalog", "zeatend"] as const
export type ProductId = (typeof productIds)[number]

/** One Phosphor icon per product, the same in the header, the docs and the product pages. */
export const productIcon: Record<ProductId, string> = {
  zeabur: "squares-four",
  identity: "fingerprint",
  builder: "stack",
  catalog: "check-square-offset",
  zeatend: "terminal-window",
}

/** Names are not translated. */
export const productName: Record<ProductId, string> = {
  zeabur: "Zeabur OSS",
  identity: "Zeabur Identity",
  builder: "Zeabur Builder",
  catalog: "Zeabur Catalog",
  zeatend: "Zeatend",
}
