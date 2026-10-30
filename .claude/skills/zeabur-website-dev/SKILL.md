---
name: zeabur-website-dev
description: Work on oss.zeabur.com (zeabur-oss/website) — the landing and product pages, the blog, and the product documentation it pulls from each repository through docs.lock.json. Use before changing landing copy, a screenshot, a blog post, docs.lock.json, the docs scripts or any Astro, TypeScript or Nix file in this repository.
---

# Zeabur website

Follow the shared skills (installed under `.claude/skills/`, pinned in `skills-lock.json`):
`zeabur-oss-workflow` (branches, commits, pull requests), `zeabur-oss-standards`,
`zeabur-oss-dependencies` (Bun packages), `zeabur-writing` (all text; landing and product pages
also by its `landing-copy.md`), `story-writing` (blog posts; technical articles also by its
`technical-articles.md`) and `no-ai-flavour` (comments and visuals). This skill adds what is the
website's own. `CONTRIBUTING.md` has the full checks and the toolchain.

## Checks

Inside `nix develop`:

```sh
bun ci
bun run build                     # syncs the docs, writes content/ and the route types
bun run fmt:check && bun run lint && bun run typecheck
bun run fallow dead-code && bun run fallow dupes
bun run test                      # reads dist/, so it runs after the build
nixfmt --check flake.nix && shellcheck scripts/*.sh
```

Look at a page change in a browser: `bun run preview &`, then
`bun scripts/review.ts http://localhost:4321 <dir>` (390, 1440 and 1960 px, light and dark).
Open every screenshot it saves.

## Product documentation

The docs pages are not written here. Each repository keeps its own `docs/`, and
`docs.lock.json` pins the commit the site builds from.

1. Fix the page in its own repository.
2. Run `bun scripts/docs-check.ts <checkout>` and fix every error before that repository's pull
   request. It also lists stale translations; each repository's CI adds `--base <rev>`.
3. After it merges, move the repository's `ref` in `docs.lock.json` here.

`bun scripts/docs-check.ts` with no argument checks every repository at its locked ref.

## Landing and product pages

- The copy is in `src/landing/copy.ts`, in en, zh-TW and zh-CN.
- The screenshots are the zeabur repository's docs screenshots (`docs/images/shots/`, from its
  `docs/shots.yaml`), taken at twice the pixel density. Show every product image at half its
  width or less, and give it `sizes`.

## Blog

- Posts are `src/content/blog/<locale>/<slug>.mdx`, one file per locale with the same slug.
- `draft: true` shows a post in `bun run dev` only. `BLOG_DRAFTS=1 bun run build` keeps drafts
  in a build for review.
- Synced docs and blog posts are not formatted by oxfmt: their text belongs to their authors.
