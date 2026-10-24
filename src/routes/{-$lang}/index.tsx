import { createFileRoute, notFound } from "@tanstack/react-router"
import { landingCopy } from "../../landing/copy.ts"
import { Landing } from "../../landing/landing.tsx"
import { isSiteLocale, localePrefix, locales, siteOrigin } from "../../lib/urls.ts"

export const Route = createFileRoute("/{-$lang}/")({
  beforeLoad: ({ params }) => {
    if (!isSiteLocale(params.lang ?? "en")) throw notFound()
  },
  head: ({ params }) => {
    const lang = isSiteLocale(params.lang) ? params.lang : "en"
    const t = landingCopy[lang]
    return {
      meta: [{ title: t.title }, { name: "description", content: t.description }],
      links: [
        { rel: "canonical", href: `${siteOrigin}${localePrefix(lang) || "/"}` },
        ...locales.map((l) => ({
          rel: "alternate",
          hrefLang: l,
          href: `${siteOrigin}${localePrefix(l) || "/"}`,
        })),
      ],
    }
  },
  component: () => <Landing locale={Route.useParams().lang ?? "en"} />,
})
