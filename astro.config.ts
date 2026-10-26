import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import sitemap from "@astrojs/sitemap"
import { unified } from "@astrojs/markdown-remark"
import starlight from "@astrojs/starlight"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import type { SiteData } from "./scripts/sync-docs.ts"
import { starlightIcons } from "./src/lib/icons.ts"
import { githubOrg } from "./src/lib/site.ts"
import { docsUrl, localePrefix, locales, siteOrigin } from "./src/lib/urls.ts"
import { rehypeDocsHtml } from "./src/mdx/rehype-docs-html.ts"
import { remarkDocs } from "./src/mdx/remark-docs.ts"

// content/ comes from scripts/sync-docs.ts, which `bun run build` runs first.
const site: SiteData = JSON.parse(readFileSync("content/site.json", "utf8"))

const redirects = Object.fromEntries([
  ...site.redirects.map(({ from, to }) => [from, to]),
  ...locales.map((locale) => [`${localePrefix(locale)}/docs`, docsUrl(locale, "zeabur")]),
])

// Docs pages copied into a language they are not written in (scripts/sync-docs.ts) point their
// canonical link at the original, so the sitemap leaves them out.
const copies = new Set(
  readdirSync("src/content/docs", { recursive: true, encoding: "utf8" })
    .filter((file) => /\.mdx?$/.test(file))
    .flatMap((file) => {
      const written = /^contentLocale: (\S+)$/m.exec(
        readFileSync(join("src/content/docs", file), "utf8"),
      )
      const [first] = file.split("/")
      const locale = locales.find((l) => l === first) ?? "en"
      if (!written || written[1] === locale) return []
      const path = file.replace(/\.mdx?$/, "").replace(/(^|\/)index$/, "")
      return [`${siteOrigin}/${path}`.replace(/\/$/, "")]
    }),
)

export default defineConfig({
  site: siteOrigin,
  trailingSlash: "never",
  build: { format: "directory" },
  redirects,
  markdown: {
    processor: unified({
      remarkPlugins: [remarkDocs],
      rehypePlugins: [rehypeDocsHtml],
      smartypants: false,
    }),
  },
  integrations: [
    sitemap({ filter: (page) => !copies.has(page.replace(/\/$/, "")) }),
    starlight({
      title: "Zeabur OSS",
      defaultLocale: "root",
      locales: {
        root: { label: "English", lang: "en" },
        "zh-TW": { label: "繁體中文", lang: "zh-TW" },
        "zh-CN": { label: "简体中文", lang: "zh-CN" },
      },
      favicon: "/favicon.svg",
      social: [{ icon: "github", label: "GitHub", href: githubOrg }],
      customCss: ["./src/styles/docs.css"],
      routeMiddleware: "./src/route-data.ts",
      components: {
        Head: "./src/components/docs/Head.astro",
        Header: "./src/components/docs/Header.astro",
        Sidebar: "./src/components/docs/Sidebar.astro",
        PageTitle: "./src/components/docs/PageTitle.astro",
        MarkdownContent: "./src/components/docs/MarkdownContent.astro",
        Pagination: "./src/components/docs/Pagination.astro",
        ThemeSelect: "./src/components/docs/ThemeSelect.astro",
      },
      expressiveCode: {
        defaultProps: { frame: "none" },
        styleOverrides: { borderRadius: "0.5rem", codeFontSize: "0.8125rem" },
      },
      lastUpdated: false,
      credits: false,
    }),
  ],
  vite: { plugins: [tailwindcss(), phosphorForStarlight()] },
})

/** Starlight's built-in icons (header, asides, pagination, sidebar carets) drawn with Phosphor. */
function phosphorForStarlight() {
  const overrides = JSON.stringify(starlightIcons())
  return {
    name: "phosphor-for-starlight",
    enforce: "pre" as const,
    transform(code: string, id: string) {
      if (!id.includes("@astrojs/starlight/dist/components-internals/Icons.js")) return
      return code.replace("...BuiltInIcons,", `...BuiltInIcons, ...${overrides},`)
    },
  }
}
