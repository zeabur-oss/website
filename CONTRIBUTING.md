# Contributing

## Developer Certificate of Origin

This project uses the [Developer Certificate of Origin 1.1](DCO), not a CLA. Sign off every
commit to certify that you wrote it or otherwise have the right to submit it under the
[Apache License 2.0](LICENSE):

```sh
git commit -s
```

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/), for example
`feat: add the zh-CN landing copy`. Use your own name and email. When squashing, preserve other
contributors' attribution; do not add a sign-off on someone else's behalf. Check your branch
against its base with:

```sh
./scripts/check-dco.sh <base-rev> HEAD
```

## Before you open a pull request

Run every check inside `nix develop`:

```sh
bun ci
bun run build                     # also writes content/ and the route types that typecheck reads
bun run fmt:check && bun run lint && bun run typecheck
bun run fallow dead-code && bun run fallow dupes
bun run test                      # reads dist/, so it runs after the build
nixfmt --check flake.nix && shellcheck scripts/*.sh
```

`bun run fallow` runs [fallow](https://github.com/fallow-rs/fallow) at the version pinned in
`package.json`. `fallow dead-code` finds unused files, exports and dependencies; `.fallowrc.json`
names the entry points Astro loads by path and the packages read with `require.resolve`.
`fallow dupes` finds repeated blocks. `bun run test` runs the unit tests of the docs scripts and
checks the built pages: a link between docs pages must stay on the site, not point to GitHub.

To look at the built site in a real browser:

```sh
bun run preview &                                  # http://localhost:4321
bun scripts/review.ts http://localhost:4321 /tmp/review
```

`review.ts` saves full-page screenshots of the landing, product, blog and a few docs pages at 390,
1440 and 1960 px wide, in light and dark, and reports pages that scroll sideways or log errors.
`REVIEW_THEMES=light` takes one theme and `REVIEW_SCALE=2` takes them at twice the pixel density.
Look at every screenshot: text inside its box, items of one list styled the same, panels as tall
as their content, and no gaps inside Chinese text.

A comment says what the code cannot: a quirk and its cause, a workaround, or the source behind
behaviour that must not change. Usually one line; no design rationale, history, measurements or
restatements of the code. Never cite something you have not read; write "not verified" instead.

## Toolchain

`flake.nix` has Bun, Node.js, Chromium for `review.ts`, nixfmt and shellcheck. Run every command
in it (`nix develop`, or `nix develop -c <command>`). `playwright-core` in `package.json` must match
the `playwright-driver` version of the flake's Nixpkgs.

## Lints and formatting

The settings are the ones `web/` in the zeabur repository uses.

- `oxfmt` formats TypeScript, CSS, JSON, Markdown and `.astro` files (`.oxfmtrc.json`: no
  semicolons, 100 columns). `.astro` files go through oxfmt's bundled `prettier-plugin-astro`,
  which needs `@astrojs/compiler-rs` (it comes with `astro`). Synced docs and blog posts are not
  formatted: their text belongs to their authors.
- `oxlint --deny-warnings` (`.oxlintrc.json`) lints TypeScript and the frontmatter and `<script>`
  blocks of `.astro` files, not their markup. It adds `zeabur/no-unguarded-motion` from
  `@zeabur/design-system/lint`, and refuses the component and motion libraries that `web/` also
  refuses. The `@shadcn/lint` rules of `web/` are left out: they check the class names on React
  components from `@zeabur/design-system`, and the site has none.
- `tsc` and `astro check` use the same strict settings as `web/` (`tsconfig.json`), plus
  `noUncheckedIndexedAccess`.

## Dependencies

Packages are managed with Bun: `package.json` pins exact versions, `bun.lock` is committed, and
`bun ci` fails if the two disagree. `bunfig.toml` sets `minimumReleaseAge` to seven days, the same
delay as the other zeabur-oss repositories. No package is listed in `trustedDependencies`, so no
install script runs. Licences must be OSI-approved.

`@zeabur/design-system` is a Git dependency pinned to a commit.

## Product documentation

Fix a docs page in its own repository, then move that repository's ref in `docs.lock.json`. Run
`bun scripts/docs-check.ts <checkout>` there before you open the pull request.

## Copy

The landing copy is in `src/landing/copy.ts`. Its screenshots are the docs screenshots of the
zeabur repository (`docs/images/shots/`, from its `docs/shots.yaml`), taken at twice the pixel
density: show every product image at half its width or less, with `sizes`. Write zh-TW first,
then zh-CN (mainland usage), then English, and keep the three saying the same things. Say what the
product does for the reader in concrete terms. No marketing words, no "not X but Y", no hedging
paragraphs.

Drafts (`draft: true`) show in `bun run dev` only. `BLOG_DRAFTS=1 bun run build` keeps them in a
build for review.
