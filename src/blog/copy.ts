import type { SiteLocale } from "../lib/urls.ts"

export type BlogCopy = {
  title: string
  description: string
  rss: string
  back: string
  published: string
  updated: string
  toc: string
  more: string
  empty: string
  draft: string
}

export const blogCopy: Record<SiteLocale, BlogCopy> = {
  "zh-TW": {
    title: "部落格",
    description: "Zeabur 開源專案的發版消息和開發筆記。",
    rss: "用 RSS 訂閱",
    back: "所有文章",
    published: "發佈於",
    updated: "更新於",
    toc: "本文內容",
    more: "其他文章",
    empty: "還沒有文章。第一篇寫好後會出現在這裡，也可以先用 RSS 訂閱。",
    draft: "草稿",
  },
  "zh-CN": {
    title: "博客",
    description: "Zeabur 开源项目的发版消息和开发笔记。",
    rss: "用 RSS 订阅",
    back: "所有文章",
    published: "发布于",
    updated: "更新于",
    toc: "本文内容",
    more: "其他文章",
    empty: "还没有文章。第一篇写好后会出现在这里，也可以先用 RSS 订阅。",
    draft: "草稿",
  },
  en: {
    title: "Blog",
    description: "Release news and development notes from Zeabur's open-source projects.",
    rss: "Subscribe with RSS",
    back: "All posts",
    published: "Published",
    updated: "Updated",
    toc: "On this page",
    more: "More posts",
    empty: "No posts yet. The first one will show up here; you can subscribe with RSS already.",
    draft: "Draft",
  },
}
