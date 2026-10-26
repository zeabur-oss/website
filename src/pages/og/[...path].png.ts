import type { APIRoute, GetStaticPaths } from "astro"
import { getCollection } from "astro:content"
import { dateFormat, postSlug, postsFor } from "../../blog/blog.ts"
import { blogCopy } from "../../blog/copy.ts"
import { landingCopy } from "../../landing/copy.ts"
import { chrome, productIds, type ProductId } from "../../lib/chrome.ts"
import { renderOg, type OgCard } from "../../lib/og.ts"
import { summary } from "../../lib/seo.ts"
import { locales, type SiteLocale } from "../../lib/urls.ts"

const han = (locale: string) => (locale === "zh-CN" ? "sc" : "tc")

const notFound: Record<SiteLocale, { title: string; sub: string }> = {
  en: {
    title: "Page not found",
    sub: "The page may have moved. The docs and the blog are a click away.",
  },
  "zh-TW": { title: "找不到這個頁面", sub: "頁面可能搬家了，可以從文件或部落格找找看。" },
  "zh-CN": { title: "找不到这个页面", sub: "页面可能搬走了，可以从文档或博客找找看。" },
}

// /og/home/<locale>.png, /og/blog/<locale>/index.png, /og/blog/<locale>/<slug>.png,
// /og/<docs page path>.png for each page in the language it is written in, /og/404/<locale>.png.
// The product pages use their README covers, which scripts/sync-docs.ts copies to /og/<id>.png.
export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { path: string }; props: { card: OgCard } }[] = []
  const add = (path: string, card: OgCard) => paths.push({ params: { path }, props: { card } })
  for (const locale of locales) {
    const t = blogCopy[locale]
    const home = landingCopy[locale]
    const date = dateFormat(locale, "long")
    add(`home/${locale}`, {
      kicker: "Zeabur OSS",
      title: home.hero.title,
      sub: home.description,
      han: han(locale),
    })
    add(`404/${locale}`, { kicker: "404", ...notFound[locale], han: han(locale) })
    add(`blog/${locale}/index`, {
      kicker: "Zeabur OSS",
      title: t.title,
      sub: t.description,
      han: han(locale),
    })
    for (const post of await postsFor(locale)) {
      add(`blog/${locale}/${postSlug(post.id)}`, {
        kicker: `${t.title} · ${date.format(post.data.pubDate)}`,
        title: post.data.title,
        sub: post.data.description,
        han: han(locale),
      })
    }
  }
  for (const entry of await getCollection("docs")) {
    const data = entry.data as {
      title: string
      description?: string
      repo?: string
      contentLocale?: string
    }
    const lang =
      locales.find((l) => l !== "en" && entry.id.toLowerCase().startsWith(`${l.toLowerCase()}/`)) ??
      "en"
    if (!data.repo || (data.contentLocale ?? lang) !== lang) continue
    const words = chrome[lang]
    const product = (productIds as readonly string[]).includes(data.repo)
      ? words.products[data.repo as ProductId].name
      : data.repo
    add(entry.id.toLowerCase(), {
      kicker: `${product} · ${words.nav.docs}`,
      title: data.title,
      sub: data.description ?? summary(entry.body ?? ""),
      han: han(lang),
    })
  }
  return paths
}

export const GET: APIRoute = async ({ props }) =>
  new Response(new Uint8Array(await renderOg((props as { card: OgCard }).card)), {
    headers: { "Content-Type": "image/png" },
  })
