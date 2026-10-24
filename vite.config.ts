import { readFileSync } from "node:fs"
import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import react from "@vitejs/plugin-react"
import { fumadocsMdx } from "fumadocs-mdx/vite"
import Icons from "unplugin-icons/vite"
import { defineConfig } from "vite"
import type { SiteData } from "./scripts/sync-docs.ts"
import { docsUrl, locales, localePrefix } from "./src/lib/urls.ts"

// content/ comes from scripts/sync-docs.ts, which `bun run build` runs first.
const site: SiteData = JSON.parse(readFileSync("content/site.json", "utf8"))

const paths = [
  ...locales.map((locale) => localePrefix(locale) || "/"),
  ...Object.values(site.pages).map((page) => docsUrl(page.locale, page.repo, page.slug)),
  ...locales.map((locale) => `${localePrefix(locale)}/search.json`),
  "/404",
]

export default defineConfig({
  plugins: [
    fumadocsMdx(),
    tailwindcss(),
    Icons({ scale: 1, compiler: "jsx", jsx: "react" }),
    tanstackStart({
      prerender: { enabled: true, crawlLinks: false, failOnError: true },
      pages: paths.map((path) => ({ path })),
    }),
    react(),
  ],
  build: {
    assetsInlineLimit: 0,
    sourcemap: false,
  },
  // Not pre-bundled: the pre-bundler runs no plugins, so it cannot resolve `~icons/…`.
  optimizeDeps: { exclude: ["@zeabur/design-system"] },
})
