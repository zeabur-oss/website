import { createRootRoute, HeadContent, Outlet, Scripts, useParams } from "@tanstack/react-router"
import { i18nProvider } from "fumadocs-ui/i18n"
import { RootProvider } from "fumadocs-ui/provider/tanstack"
import SearchDialog from "../components/search.tsx"
import { translations } from "../lib/layout.tsx"
import appCss from "../styles/app.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    ],
  }),
  component: Root,
})

function Root() {
  const { lang } = useParams({ strict: false })
  const locale = lang ?? "en"
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-screen flex-col">
        <RootProvider i18n={i18nProvider(translations, locale)} search={{ SearchDialog }}>
          <Outlet />
        </RootProvider>
        <Scripts />
      </body>
    </html>
  )
}
