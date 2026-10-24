import { useParams } from "@tanstack/react-router"
import { HomeLayout } from "fumadocs-ui/layouts/home"
import { DefaultNotFound } from "fumadocs-ui/layouts/home/not-found"
import { baseOptions } from "../lib/layout.tsx"

export function NotFound() {
  const { lang } = useParams({ strict: false })
  return (
    <HomeLayout {...baseOptions(lang ?? "en")}>
      <DefaultNotFound />
    </HomeLayout>
  )
}
