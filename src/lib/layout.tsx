import { Logo } from "@zeabur/design-system/components/brand"
import { uiTranslations } from "fumadocs-ui/i18n"
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"
import { i18n } from "./i18n.ts"
import { docsUrl, localePrefix } from "./urls.ts"

export const githubOrg = "https://github.com/zeabur-oss"

export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .add({
    en: { displayName: "English" },
    "zh-TW": {
      displayName: "繁體中文",
      "Search(search trigger)": "搜尋",
      "Search(search dialog)": "搜尋文件",
      "Open Search(search trigger)(aria-label)": "開啟搜尋",
      "Close Search(search dialog)(aria-label)": "關閉搜尋",
      "No results found(search dialog)": "找不到符合的頁面",
      "Search failed(search dialog)": "搜尋失敗",
      "On this page(table of contents)": "本頁內容",
      "No Headings(table of contents)": "沒有標題",
      "Table of Contents(inline table of contents)": "本頁內容",
      "Last updated on(page footer)": "最後更新",
      "Choose a language(language switcher)": "選擇語言",
      "Choose a language(language switcher)(aria-label)": "選擇語言",
      "Language(language switcher)": "語言",
      "Edit on GitHub(edit page)": "在 GitHub 編輯",
      "Next Page(pagination)": "下一頁",
      "Previous Page(pagination)": "上一頁",
      "Toggle Theme(theme switcher)(aria-label)": "切換主題",
      "Light(theme switcher)(aria-label)": "淺色",
      "Dark(theme switcher)(aria-label)": "深色",
      "System(theme switcher)(aria-label)": "跟隨系統",
      "Theme(site menu)": "主題",
      "Open Sidebar(aria-label)": "開啟側欄",
      "Open Sidebar(sidebar)(aria-label)": "開啟側欄",
      "Close Sidebar(aria-label)": "關閉側欄",
      "Close Sidebar(sidebar)(aria-label)": "關閉側欄",
      "Collapse Sidebar(sidebar)(aria-label)": "收合側欄",
      "Show Sidebar(sidebar)": "顯示側欄",
      "Hide Sidebar(sidebar)": "隱藏側欄",
      "Toggle Menu(home layout header)(aria-label)": "選單",
      "Copy Text(code block)(aria-label)": "複製",
      "Copied Text(code block)(aria-label)": "已複製",
      "Copy Anchor Link(heading anchor)(aria-label)": "複製段落連結",
      "Copied Anchor Link(heading anchor)(aria-label)": "已複製段落連結",
      "Page Not Found(404 not found page)": "找不到這一頁",
      "Back to Home(404 not found page)": "回到首頁",
      "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.(404 not found page)":
        "這一頁可能已經移除或改名。",
    },
    "zh-CN": {
      displayName: "简体中文",
      "Search(search trigger)": "搜索",
      "Search(search dialog)": "搜索文档",
      "Open Search(search trigger)(aria-label)": "打开搜索",
      "Close Search(search dialog)(aria-label)": "关闭搜索",
      "No results found(search dialog)": "没有找到匹配的页面",
      "Search failed(search dialog)": "搜索失败",
      "On this page(table of contents)": "本页内容",
      "No Headings(table of contents)": "没有标题",
      "Table of Contents(inline table of contents)": "本页内容",
      "Last updated on(page footer)": "最后更新",
      "Choose a language(language switcher)": "选择语言",
      "Choose a language(language switcher)(aria-label)": "选择语言",
      "Language(language switcher)": "语言",
      "Edit on GitHub(edit page)": "在 GitHub 上编辑",
      "Next Page(pagination)": "下一页",
      "Previous Page(pagination)": "上一页",
      "Toggle Theme(theme switcher)(aria-label)": "切换主题",
      "Light(theme switcher)(aria-label)": "浅色",
      "Dark(theme switcher)(aria-label)": "深色",
      "System(theme switcher)(aria-label)": "跟随系统",
      "Theme(site menu)": "主题",
      "Open Sidebar(aria-label)": "打开侧边栏",
      "Open Sidebar(sidebar)(aria-label)": "打开侧边栏",
      "Close Sidebar(aria-label)": "关闭侧边栏",
      "Close Sidebar(sidebar)(aria-label)": "关闭侧边栏",
      "Collapse Sidebar(sidebar)(aria-label)": "收起侧边栏",
      "Show Sidebar(sidebar)": "显示侧边栏",
      "Hide Sidebar(sidebar)": "隐藏侧边栏",
      "Toggle Menu(home layout header)(aria-label)": "菜单",
      "Copy Text(code block)(aria-label)": "复制",
      "Copied Text(code block)(aria-label)": "已复制",
      "Copy Anchor Link(heading anchor)(aria-label)": "复制段落链接",
      "Copied Anchor Link(heading anchor)(aria-label)": "已复制段落链接",
      "Page Not Found(404 not found page)": "找不到这个页面",
      "Back to Home(404 not found page)": "回到首页",
      "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.(404 not found page)":
        "这个页面可能已被删除或改名。",
    },
  })

const docsLabel: Record<string, string> = { en: "Docs", "zh-TW": "文件", "zh-CN": "文档" }

export function baseOptions(locale: string): BaseLayoutProps {
  return {
    i18n: true,
    nav: {
      title: (
        <span className="inline-flex items-center gap-2">
          <Logo className="h-4" />
          <span className="text-fd-muted-foreground font-medium">OSS</span>
        </span>
      ),
      url: localePrefix(locale) || "/",
    },
    githubUrl: githubOrg,
    links: [
      {
        text: docsLabel[locale] ?? docsLabel.en,
        url: docsUrl(locale, "zeabur"),
        active: "nested-url",
      },
    ],
  }
}
