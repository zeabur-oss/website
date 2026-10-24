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

## Setup and checks

The development shell (`flake.nix`) has Bun, Node.js and Chromium; run every command in it
(`nix develop`, or `nix develop -c <command>`). Packages are managed with Bun: exact versions, a
committed `bun.lock` and a `minimumReleaseAge` of seven days (`bunfig.toml`).

```sh
bun install
bun run build    # also writes content/ and the route tree that typecheck reads
bun run fmt:check && bun run typecheck && bun run test
```

`bun run dev` serves the site with hot reload. To look at the built site in a real browser:

```sh
bun run preview &                                  # http://localhost:4321
bun scripts/review.ts http://localhost:4321 /tmp/review
```

`review.ts` saves full-page screenshots of the landing and a few docs pages at 390, 1440 and
1960 px wide, in light and dark, and reports pages that scroll sideways or log errors.

## Product documentation

Fix a docs page in its own repository, then move that repository's ref in `docs.lock.json`. Run
`bun scripts/docs-check.ts <checkout>` there before you open the pull request.

## Copy

The landing copy is in `src/landing/copy.ts`. Write zh-TW first, then zh-CN (mainland usage), then
English, and keep the three saying the same things. Say what the product does for the reader in
concrete terms. No marketing words, no "not X but Y", no hedging paragraphs.
