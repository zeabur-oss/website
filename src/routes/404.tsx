import { createFileRoute } from "@tanstack/react-router"
import { NotFound } from "../components/not-found.tsx"

// Prerendered, then copied to 404.html for static hosts.
export const Route = createFileRoute("/404")({
  head: () => ({
    meta: [{ title: "Page not found | Zeabur OSS" }, { name: "robots", content: "noindex" }],
  }),
  component: NotFound,
})
