// The home page's words, one object per language. Text between backticks is shown as code.
import type { SiteLocale } from "../../lib/urls.ts"
import { en } from "./en.ts"
import { zhCN } from "./zh-CN.ts"
import { zhTW } from "./zh-TW.ts"

/** The readers who have a page of their own, in the order the site lists them. */
export const audiences = ["developer", "team", "provider", "homelab"] as const
export type Audience = (typeof audiences)[number]
/** Each reader's page, under /for/. */
export const audienceSlug: Record<Audience, string> = {
  developer: "developers",
  team: "teams",
  provider: "providers",
  homelab: "homelab",
}

/** The parts a reader's page can be made of. */
export type PartId =
  | "walk"
  | "review"
  | "perm"
  | "lockin"
  | "zeatend"
  | "local"
  | "license"
  | "grow"
  | "secure"
export type ProofId =
  | "license"
  | "state"
  | "rbac"
  | "review"
  | "roles"
  | "lockin"
  | "gitops"
  | "local"

type Claim = { title: string; body: string }
type Side = {
  title: string
  sub: string
  primary: string
  secondary: string
  /** The limit or the first step that goes with the buttons. */
  note: string
  /** What the picture under this side shows. */
  alt: string
  /** What the next release adds for this reader. */
  soon?: string
  /** The browser title of this reader's page. */
  meta: string
}

export type HomeCopy = {
  /** The home page's own words: its first screen, the links onward, and its closing block. */
  home: {
    hero: { title: string; sub: string; primary: string; secondary: string; note: string }
    more: Record<Exclude<Audience, "developer">, string>
    permTitle: string
    openTitle: string
    cta: Claim
  }
  hero: Record<Audience, Side> & { switch: Record<Audience | "label", string> }
  proof: Record<ProofId, Claim>
  walk: { title: string; intro: string; steps: (Claim & { alt: string })[] }
  perm: {
    title: string
    body: string
    erin: string
    alice: string
    invite: string
    scope: string
    deniedAlt: string
  }
  review: { title: string; body: string; conflict: string; gitops: string; alt: string }
  local: Claim & { chip: string; alt: string }
  lockin: {
    title: string
    body: string
    gitops: string
    existing: string
    /** What the drawing of this part shows. */
    alt: string
    uninstall: { title: string; after: string; link: string }
  }
  license: Claim
  safety: { title: string; hardening: string; hardeningLink: string; gitops: string }
  zeatend: Claim & { path: string[]; mirror: string; alt: string }
  /** For a developer who deploys their own programs: starting small, and what keeps it safe. */
  grow: { title: string; intro: string; points: Claim[] }
  secure: { title: string; intro: string; points: Claim[] }
  /** What else the next release brings, one sentence each. */
  soon: string[]
  cta: Record<Audience, Claim> & { primary: string; secondary: string; providerPrimary: string }
}

export const homeCopy: Record<SiteLocale, HomeCopy> = { en, "zh-TW": zhTW, "zh-CN": zhCN }
