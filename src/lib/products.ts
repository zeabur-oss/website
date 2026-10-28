// The four projects, in the order the site lists them.
export const productIds = ["zeabur", "identity", "builder", "catalog"] as const
export type ProductId = (typeof productIds)[number]

/** One Phosphor icon per product, the same in the header, the docs and the product pages. */
export const productIcon: Record<ProductId, string> = {
  zeabur: "squares-four",
  identity: "fingerprint",
  builder: "stack",
  catalog: "check-square-offset",
}

/** Names are not translated. */
export const productName: Record<ProductId, string> = {
  zeabur: "Zeabur",
  identity: "Zeabur Identity",
  builder: "Zeabur Builder",
  catalog: "Zeabur Catalog",
}

/** The version, or API version, each product page shows beside its name. */
export const productVersion: Record<ProductId, string> = {
  zeabur: "v0.1.0",
  identity: "v0.1.0",
  builder: "v1alpha1",
  catalog: "v1",
}
