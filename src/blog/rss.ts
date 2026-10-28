import rss from "@astrojs/rss"
import { siteOrigin, type SiteLocale } from "../lib/urls.ts"
import { postsFor, postUrl } from "./blog.ts"
import { blogCopy } from "./copy.ts"

/** The RSS feed for one locale's posts. */
export async function feed(locale: SiteLocale) {
  const t = blogCopy[locale]
  const posts = await postsFor(locale)
  return rss({
    title: `Zeabur Open Source · ${t.title}`,
    description: t.description,
    site: siteOrigin,
    trailingSlash: false,
    customData: `<language>${locale}</language>`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: postUrl(post),
    })),
  })
}
