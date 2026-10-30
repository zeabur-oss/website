# Zeabur OSS website

The landing page, product pages, documentation and blog of Zeabur's open-source projects, served at
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
scripts/serve.ts            static server for dist/
scripts/review.ts           full-page screenshots at 390, 1440 and 1960 px, light and dark
astro.config.ts             Astro and Starlight: locales, redirects, Markdown plugins
src/pages/                  the landing, product, blog and social-image routes in each locale
src/layouts/Site.astro      the frame of every page outside the docs: header, footer, transitions
src/landing/                the landing and product pages and their copy (zh-TW, zh-CN, en)
src/blog/                   the blog: list, post layout, RSS and social images
src/content/blog/<locale>/  blog posts, one Markdown file each
src/components/             header, footer, theme toggle and the product illustrations
src/components/docs/        the parts of Starlight the site replaces (header, sidebar, start cards…)
src/route-data.ts           per-repository sidebar, edit links and social images for docs pages
src/docs-components/        the components a docs page may use (registry.ts)
src/mdx/                    link and image rewriting for synced pages
src/styles/                 site.css (shared), landing.css, imagery.css and docs.css (Starlight)
```

## How the docs come in

`bun run sync` (part of `dev` and `build`) reads `docs.lock.json`. For each repository it takes
`docs/` and `README.md` at the locked ref from GitHub's tarball (`GITHUB_TOKEN` is used if
present). Snapshots are kept in `.cache/repos/`. Renovate moves the refs.

From `docs/nav.yaml` it writes the pages to `src/content/docs/[<locale>/]docs/<repo>/`, where
Starlight reads them, plus `content/nav.json` for the sidebar (one per repository) and
`content/site.json` (every page, its source locale, redirects). Images and other files under `docs/` are copied to
`public/docs-assets/<repo>/`. A repository with no `nav.yaml` gets its README as the home page,
followed by the pages directly in `docs/`, in the order the README links them.

Links between pages become site URLs, and so do GitHub URLs of published docs pages. Files under
`docs/` are served from `/docs-assets/`. Only a link to a file outside `docs/` still goes to GitHub,
at the locked ref, and `docs-check` fails on it: write a link to a docs page, or the full GitHub
URL when the reader needs the source. The edit link of each page is the one link to GitHub the
site adds itself.

## Locales

English has no prefix; zh-TW is under `/zh-TW` and zh-CN under `/zh-CN`. A translation is
`docs/<locale>/<same path>`. When a page has no translation for a locale, the site shows the
English page; when there is no English page either (only zh-TW, for example), it shows the one that
exists. A notice at the top says which language the page is in.

A translation names the English file it was made from with `source:` in its frontmatter: the first
12 hex digits of the file's SHA-256. `docs-check` lists translations whose source has changed.

## Components

A docs page may use `Callout`, `Tabs`/`Tab` and `Steps`/`Step`, with the props in
`src/docs-components/registry.ts`. Pages do not import anything.

## Images

A page shows an image with a relative Markdown image, `![…](../images/shots/<id>.avif)`, as on
GitHub. The sync copies the files under `docs/` to `public/docs-assets/<repo>/`, and the site
points each image at its copy, served as it is. An AVIF is a screenshot taken at twice the pixel
density and shows at half its size.

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
the registry, GitHub URLs of docs pages, and relative
links to files outside `docs/`. It lists stale translations and
pages that are not published.

## Design system

The site uses `@zeabur/design-system`, pinned to a commit in `package.json` like `zeabur/web`.

## License

Apache-2.0. Contributions are accepted under the [Developer Certificate of Origin](DCO); see
[CONTRIBUTING.md](CONTRIBUTING.md).
