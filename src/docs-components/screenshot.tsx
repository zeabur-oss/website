import type { z } from "zod"
import { findShot } from "../lib/shots.ts"
import { usePageContext } from "./page-context.ts"
import type { registry } from "./registry.ts"

export function Screenshot(props: z.infer<(typeof registry)["Screenshot"]>) {
  const page = usePageContext()
  const repo = props.repo ?? page.repo
  const locale = props.locale ?? page.contentLocale
  const light = findShot(repo, locale, props.theme ?? "light", props.id)
  const dark = props.dark ? findShot(repo, locale, "dark", props.id) : undefined
  const img = (shot: typeof light, className?: string) => (
    <img
      src={shot.src}
      alt={props.alt}
      width={shot.width}
      height={shot.height}
      loading="lazy"
      decoding="async"
      className={`rounded-lg border border-border ${className ?? ""}`}
    />
  )
  return (
    <figure className="docs-screenshot">
      {dark ? (
        <>
          {img(light, "dark:hidden")}
          {img(dark, "hidden dark:block")}
        </>
      ) : (
        img(light)
      )}
    </figure>
  )
}
