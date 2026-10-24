import { createFileRoute } from "@tanstack/react-router"
import { createFromSource } from "fumadocs-core/search/server"
import { source } from "../../lib/source.ts"

// One index per locale, prerendered into a file; the browser searches it (useStaticSearch).
function server(lang: string) {
  return createFromSource({ ...source, _i18n: undefined, getPages: () => source.getPages(lang) })
}

export const Route = createFileRoute("/{-$lang}/search.json")({
  server: { handlers: { GET: ({ params }) => server(params.lang ?? "en").staticGET() } },
})
