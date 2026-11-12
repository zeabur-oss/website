// The home page's words, one object per language. Text between backticks is shown as code.
import type { SiteLocale } from "../../lib/urls.ts"
import { en } from "./en.ts"
import { zhCN } from "./zh-CN.ts"
import { zhTW } from "./zh-TW.ts"

type Claim = { title: string; body: string }
type Side = {
  eyebrow: string
  title: string
  sub: string
  primary: string
  secondary: string
}

export type HomeCopy = {
  hero: {
    /** `soon` is what the next release adds for teams. */
    team: Side & { soon: string }
    /** All of this side is in the next release. `next` is the step after it. */
    machine: Side & { next: string }
  }
  proof: Claim[]
  walk: { title: string; intro: string; steps: Claim[] }
  perm: {
    title: string
    body: string
    erin: string
    alice: string
    invite: string
    scope: string
  }
  review: { title: string; body: string; conflict: string; gitops: string }
  local: Claim
  lockin: {
    title: string
    body: string
    gitops: string
    existing: string
    uninstall: { title: string; after: string; link: string }
  }
  license: Claim
  safety: { title: string; hardening: string; hardeningLink: string; gitops: string }
  /** What the next release brings, one sentence each. */
  soon: string[]
  cta: { title: string; body: string; primary: string; secondary: string }
  /** What the screenshots show, in the words of Zeabur's docs. */
  alt: { invite: string; namespaces: string }
}

export const homeCopy: Record<SiteLocale, HomeCopy> = { en, "zh-TW": zhTW, "zh-CN": zhCN }
