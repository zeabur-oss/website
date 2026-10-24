import { createFileRoute, notFound } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions"
import { useFumadocsLoader } from "fumadocs-core/source/client"
import { DocsLayout } from "fumadocs-ui/layouts/docs"
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  EditOnGitHub,
} from "fumadocs-ui/layouts/docs/page"
import { Suspense, use, type ReactNode } from "react"
import site from "../../../../content/site.json"
import type { SiteData } from "../../../../scripts/sync-docs.ts"
import { FallbackNotice } from "../../../components/fallback-notice.tsx"
import { mdxComponents } from "../../../docs-components/components.tsx"
import { PageContext } from "../../../docs-components/page-context.ts"
import { baseOptions } from "../../../lib/layout.tsx"
import { docs, source } from "../../../lib/source.ts"
import { isSiteLocale, siteOrigin } from "../../../lib/urls.ts"

const pages = (site as SiteData).pages
const repos = (site as SiteData).repos

const loadPage = createServerFn({ method: "GET" })
  .validator((data: { slugs: string[]; lang: string }) => data)
  .middleware([staticFunctionMiddleware])
  .handler(async ({ data: { slugs, lang } }) => {
    const page = source.getPage(slugs, lang)
    const [repo = "", ...rest] = slugs
    const entry = pages[`${lang}/${repo}/${rest.join("/") || "index"}`]
    if (!page || !entry) throw notFound()
    const github = repos.find((r) => r.name === repo)!.github
    return {
      path: page.path,
      url: page.url,
      title: page.data.title ?? entry.title,
      description: page.data.description,
      repo,
      contentLocale: entry.contentLocale,
      editUrl: `https://github.com/${github}/blob/main/${entry.source}`,
      tree: await source.serializePageTree(source.getPageTree(lang)),
    }
  })

export const Route = createFileRoute("/{-$lang}/docs/$")({
  loader: async ({ params }) => {
    const lang = params.lang ?? "en"
    if (!isSiteLocale(lang)) throw notFound()
    const slugs = (params._splat ?? "").split("/").filter(Boolean)
    const data = await loadPage({ data: { slugs, lang } })
    await docs.getPage(data.path)?.preload()
    return data
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.title} | Zeabur OSS` },
            ...(loaderData.description
              ? [{ name: "description", content: loaderData.description }]
              : []),
          ],
          links: [{ rel: "canonical", href: siteOrigin + loaderData.url }],
        }
      : {},
  component: Page,
})

function Content({ path, editUrl, notice }: { path: string; editUrl: string; notice: ReactNode }) {
  const page = docs.getPage(path)
  if (!page) throw new Error(`unknown page: ${path}`)
  const { toc } = use(page.load())
  const MDX = page.body
  return (
    <DocsPage toc={toc}>
      <DocsTitle>{page.title}</DocsTitle>
      <DocsDescription>{page.description}</DocsDescription>
      {notice}
      <DocsBody>
        <MDX components={mdxComponents} />
      </DocsBody>
      <EditOnGitHub href={editUrl} />
    </DocsPage>
  )
}

function Page() {
  const data = useFumadocsLoader(Route.useLoaderData())
  const { lang = "en" } = Route.useParams()
  return (
    <DocsLayout {...baseOptions(lang)} links={[]} tree={data.tree}>
      <PageContext value={{ repo: data.repo, contentLocale: data.contentLocale }}>
        <Suspense>
          <Content
            path={data.path}
            editUrl={data.editUrl}
            notice={<FallbackNotice locale={lang} contentLocale={data.contentLocale} />}
          />
        </Suspense>
      </PageContext>
    </DocsLayout>
  )
}
