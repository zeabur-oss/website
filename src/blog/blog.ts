// The first folder of a post's id is its locale, the rest is its slug.
import { getCollection, type CollectionEntry } from "astro:content"
import { blogUrl, isSiteLocale, type SiteLocale } from "../lib/urls.ts"

export type Post = CollectionEntry<"blog">

const showDrafts = import.meta.env.DEV || process.env.BLOG_DRAFTS === "1"

export function postLocale(id: string): SiteLocale {
  const locale = id.split("/")[0]
  if (!isSiteLocale(locale)) throw new Error(`blog post ${id}: the first folder must be a locale`)
  return locale
}

export const postSlug = (id: string) => id.split("/").slice(1).join("/")

export const postUrl = (post: Post) => `${blogUrl(postLocale(post.id))}/${postSlug(post.id)}`

/** A locale's posts, newest first. */
export async function postsFor(locale: SiteLocale): Promise<Post[]> {
  const posts = await getCollection(
    "blog",
    (post) => postLocale(post.id) === locale && (showDrafts || !post.data.draft),
  )
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
}

export const dateFormat = (locale: SiteLocale, style: "medium" | "long") =>
  new Intl.DateTimeFormat(locale, { dateStyle: style, timeZone: "Asia/Taipei" })
