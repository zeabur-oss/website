import { buttonVariants } from "@zeabur/design-system/components/button"
import { PageColumn } from "@zeabur/design-system/components/page-column"
import { HomeLayout } from "fumadocs-ui/layouts/home"
import type { ReactNode } from "react"
import ArrowRight from "~icons/ph/arrow-right"
import GithubLogo from "~icons/ph/github-logo"
import { findShot } from "../lib/shots.ts"
import { baseOptions, githubOrg } from "../lib/layout.tsx"
import { docsUrl, isSiteLocale } from "../lib/urls.ts"
import { landingCopy } from "./copy.ts"
import { builderExample, catalogExample, lockedRefs } from "./examples.ts"

const asset = (repo: string, name: string) => `/docs-assets/${repo}/docs/images/${name}`

function Themed({
  light,
  dark,
  alt,
  width,
  height,
  eager,
}: {
  light: string
  dark?: string
  alt: string
  width: number
  height: number
  eager?: boolean
}) {
  const props = {
    alt,
    width,
    height,
    loading: eager ? undefined : ("lazy" as const),
    decoding: "async" as const,
  }
  const frame = "block h-auto w-full rounded-lg border border-border bg-card"
  if (!dark) return <img src={light} className={frame} {...props} />
  return (
    <>
      <img src={light} className={`${frame} dark:hidden`} {...props} />
      <img src={dark} className={`${frame} hidden dark:block`} {...props} />
    </>
  )
}

function FileExcerpt({ path, href, code }: { path: string; href: string; code: string }) {
  return (
    <figure className="min-w-0 overflow-hidden rounded-lg border border-border bg-card">
      <figcaption className="border-b border-border px-4 py-2.5">
        <a href={href} className="font-mono text-xs text-muted-foreground hover:text-foreground">
          {path}
        </a>
      </figcaption>
      <pre className="overflow-x-auto px-4 py-3 font-mono text-[0.8125rem] leading-6">
        <code>{code}</code>
      </pre>
    </figure>
  )
}

function Product({
  name,
  tagline,
  points,
  link,
  linkText,
  media,
}: {
  name: string
  tagline: string
  points: string[]
  link: string
  linkText: string
  media: ReactNode
}) {
  return (
    <article className="grid gap-6 border-t border-border pt-10 lg:grid-cols-12 lg:gap-10">
      <div className="flex flex-col gap-4 lg:col-span-5">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">{name}</h3>
          <p className="mt-1 text-base text-muted-foreground">{tagline}</p>
        </div>
        <ul className="flex flex-col gap-3 text-[0.9375rem] leading-7">
          {points.map((p) => (
            <li key={p} className="border-l-2 border-border pl-4">
              {p}
            </li>
          ))}
        </ul>
        <a
          href={link}
          className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-brand hover:underline"
        >
          {linkText}
          <ArrowRight className="size-4" />
        </a>
      </div>
      <div className="min-w-0 lg:col-span-7">{media}</div>
    </article>
  )
}

export function Landing({ locale }: { locale: string }) {
  const lang = isSiteLocale(locale) ? locale : "en"
  const t = landingCopy[lang]
  const installer = findShot("zeabur", lang, "light", "installer-components")
  const zeaburDocs = (slug?: string) => docsUrl(lang, "zeabur", slug)

  return (
    <HomeLayout {...baseOptions(lang)}>
      <main className="flex flex-col gap-24 pt-12 pb-24 md:pt-20">
        <PageColumn gap="xl">
          <div className="flex max-w-3xl flex-col gap-6">
            <h1 className="text-[2rem] leading-tight font-semibold tracking-tight text-balance md:text-5xl md:leading-[1.1]">
              {t.hero.title}
            </h1>
            <p className="text-lg leading-8 text-muted-foreground">{t.hero.lead}</p>
            <div className="flex flex-wrap gap-3">
              <a
                href={zeaburDocs("get-started/quickstart")}
                className={buttonVariants({ size: "lg" })}
              >
                {t.hero.start}
                <ArrowRight />
              </a>
              <a
                href={`${githubOrg}/zeabur`}
                className={buttonVariants({ size: "lg", variant: "outline" })}
              >
                <GithubLogo />
                {t.hero.source}
              </a>
            </div>
            <p className="text-sm text-muted-foreground">{t.hero.status}</p>
          </div>
          <Themed
            light={asset("zeabur", "readme-project-light.avif")}
            dark={asset("zeabur", "readme-project-dark.avif")}
            alt={t.heroAlt}
            width={1216}
            height={900}
            eager
          />
        </PageColumn>

        <PageColumn gap="xl">
          <header className="flex max-w-3xl flex-col gap-2">
            <h2 className="text-3xl font-semibold tracking-tight">{t.products.title}</h2>
            <p className="text-lg text-muted-foreground">{t.products.lead}</p>
          </header>
          <Product
            name="Zeabur"
            {...t.zeabur}
            link={zeaburDocs()}
            linkText={t.zeabur.docs}
            media={
              <Themed
                light={asset("zeabur", "readme-diagnosis-light.avif")}
                dark={asset("zeabur", "readme-diagnosis-dark.avif")}
                alt={t.zeabur.alt}
                width={1216}
                height={900}
              />
            }
          />
          <Product
            name="Zeabur Identity"
            {...t.identity}
            link={docsUrl(lang, "identity")}
            linkText={t.identity.docs}
            media={
              <div className="grid grid-cols-2 items-start gap-4">
                <Themed
                  light={asset("identity", "sign-in-light.avif")}
                  dark={asset("identity", "sign-in-dark.avif")}
                  alt={t.identity.signInAlt}
                  width={1040}
                  height={1072}
                />
                <Themed
                  light={asset("identity", "sign-in-elevated-light.avif")}
                  dark={asset("identity", "sign-in-elevated-dark.avif")}
                  alt={t.identity.alt}
                  width={1040}
                  height={1152}
                />
              </div>
            }
          />
          <Product
            name="Zeabur Builder"
            {...t.builder}
            link={docsUrl(lang, "builder")}
            linkText={t.builder.docs}
            media={
              <FileExcerpt
                path={t.builder.file}
                href={`${githubOrg}/builder/blob/${lockedRefs.builder}/README.md`}
                code={builderExample}
              />
            }
          />
          <Product
            name="Zeabur Catalog"
            {...t.catalog}
            link={docsUrl(lang, "catalog")}
            linkText={t.catalog.docs}
            media={
              <FileExcerpt
                path={t.catalog.file}
                href={`${githubOrg}/catalog/blob/${lockedRefs.catalog}/${t.catalog.file}`}
                code={catalogExample}
              />
            }
          />
        </PageColumn>

        <PageColumn gap="xl">
          <h2 className="text-3xl font-semibold tracking-tight">{t.start.title}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {(
              [
                [t.start.server, "get-started/quickstart"],
                [t.start.cluster, "get-started/install"],
                [t.start.laptop, "reference/zeaburctl"],
              ] as const
            ).map(([item, slug]) => (
              <a
                key={slug}
                href={zeaburDocs(slug)}
                className="group flex flex-col gap-2 rounded-lg border border-border bg-card p-5 transition-colors hover:bg-accent"
              >
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="flex-1 text-[0.9375rem] leading-7 text-muted-foreground">
                  {item.body}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand">
                  {item.link}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </a>
            ))}
          </div>
          <Themed
            light={installer.src}
            alt={t.start.shotAlt}
            width={installer.width ?? 2880}
            height={installer.height ?? 1800}
          />
        </PageColumn>

        <PageColumn>
          <section className="grid gap-4 border-t border-border pt-10 lg:grid-cols-12 lg:gap-10">
            <h2 className="text-3xl font-semibold tracking-tight lg:col-span-5">{t.leave.title}</h2>
            <div className="flex flex-col gap-4 lg:col-span-7">
              <p className="text-lg leading-8 text-muted-foreground">{t.leave.body}</p>
              <a
                href={zeaburDocs("leave/uninstall")}
                className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-brand hover:underline"
              >
                {t.leave.link}
                <ArrowRight className="size-4" />
              </a>
            </div>
          </section>
        </PageColumn>
      </main>
      <footer className="border-t border-border py-8">
        <PageColumn>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span>© Zeabur · {t.footer.license}</span>
            <a href={zeaburDocs()} className="hover:text-foreground">
              {t.footer.docs}
            </a>
            <a href={githubOrg} className="hover:text-foreground">
              {t.footer.github}
            </a>
          </div>
        </PageColumn>
      </footer>
    </HomeLayout>
  )
}
