# Zeabur OSS website

The landing page and documentation of Zeabur's open-source projects, served at
[oss.zeabur.com](https://oss.zeabur.com). The site is static files only: no server runs after the
build.

Product documentation lives in each project's own repository (`docs/`), next to its code. This
repository has the landing page, the site frame, the script that brings those `docs/` folders in,
and `docs-check`, which each repository runs on its own docs.

Run every command in the development shell (`nix develop`, or `nix develop -c <command>`).

```sh
nix develop -c sh -c 'bun install && bun run build && bun run preview'   # http://localhost:4321
```

## Layout

```
docs.lock.json              the repositories and the commit (later, the tag) of each
scripts/sync-docs.ts        docs/ of each locked repository -> content/ (not committed)
scripts/docs-check.ts       checks a repository's docs/ (see below)
scripts/shots.sh            screenshots for local preview (see below)
scripts/postbuild.ts        redirect pages, /docs, 404.html
scripts/serve.ts            static server for dist/client
scripts/review.ts           full-page screenshots at 390, 1440 and 1960 px, light and dark
src/landing/                the landing page and its copy (zh-TW, zh-CN, en)
src/docs-components/        the components a docs page may use (registry.ts)
src/mdx/                    link and image rewriting for synced pages
src/routes/                 TanStack Start routes
```

## How the docs come in

`bun run sync` (part of `dev` and `build`) reads `docs.lock.json`. For each repository it takes
`docs/` and `README.md` at the locked ref: from the sibling checkout (`../<name>`) with
`git archive`, or from GitHub's tarball when there is no checkout or `DOCS_SOURCE=github` is set
(`GITHUB_TOKEN` is used if present). Snapshots are kept in `.cache/repos/`.

From `docs/nav.yaml` it writes Fumadocs content to `content/docs/<locale>/<repo>/`: the pages,
`meta.json` for the sidebar (one tab per repository) and `site.json` (every page, its source
locale, redirects). Images and other files under `docs/` are copied to
`public/docs-assets/<repo>/`. A repository with no `nav.yaml` gets its README as the home page,
followed by the pages directly in `docs/`, in the order the README links them.

Links between pages become site URLs. A link to any other file in the repository goes to that file
on GitHub at the locked ref.

## Locales

English has no prefix; zh-TW is under `/zh-TW` and zh-CN under `/zh-CN`. A translation is
`docs/<locale>/<same path>`. When a page has no translation for a locale, the site shows the
English page; when there is no English page either (only zh-TW, for example), it shows the one that
exists. A notice at the top says which language the page is in.

A translation names the English file it was made from with `source:` in its frontmatter: the first
12 hex digits of the file's SHA-256. `docs-check` lists translations whose source has changed.

## Components

A docs page may use `Callout`, `Tabs`/`Tab`, `Steps`/`Step` and `Screenshot`, with the props in
`src/docs-components/registry.ts`. Pages do not import anything.

`<Screenshot id="installer-host" alt="…" />`, or the image URL
`https://oss.zeabur.com/shots/<repo>/<locale>/light/<id>.avif`, shows the screenshot for the
page's language, and the English one when that language has none. The ids are the ones in the
repository's `docs/shots.yaml`.

Screenshots are not committed. For a local preview, `scripts/shots.sh` copies each repository at its
locked ref to `.cache/shots-src/`, links the local design system there, and runs that repository's
`scripts/docs-shots.sh` into `.shots/<repo>/`; the build copies them to `/shots/`. Once releases
publish `docs-shots-<tag>.tar`, a `shots` field in `docs.lock.json` makes the sync download it
instead.

## docs-check

```sh
bun run docs-check                                # every locked repository at its ref
bun scripts/docs-check.ts ../zeabur --base main   # a working tree, against a base ref
```

It fails on: pages that `nav.yaml` lists without a file, reserved names (`internal`, `images`,
locale names) in page paths, relative links and images to files that do not exist or pages that
are not published, published pages that are gone without a `redirects.yaml` entry, redirects to
unpublished pages, frontmatter fields other than `title`, `description` (and `source` in
translations), `import`/`export`, unknown components, props that are not literals or do not match
the registry, and screenshot ids missing from `shots.yaml`. It lists stale translations and
pages that are not published.

## Design system

The site uses `@zeabur/design-system`, pinned to a commit in `package.json` like `zeabur/web`. To
build against a local checkout (`../design-system`) instead, for example before a commit is pushed:

```sh
nix develop -c scripts/link-design-system.sh [path]
```

This packs the checkout into `.local/` and points `package.json` and `bun.lock` at it. Do not commit
those two changes; `git checkout package.json bun.lock && bun install` returns to the pin.

## Licence

Apache-2.0. Contributions are accepted under the [Developer Certificate of Origin](DCO); see
[CONTRIBUTING.md](CONTRIBUTING.md).
