// Builds the site twice: with DOCS_CHANNEL=main into .cache/main-dist/, then each repository's
// latest release into dist/, and copies the docs of main and the bundles they load into dist/.
//   bun scripts/build.ts
import { cpSync, rmSync, statSync } from "node:fs"
import { join, relative } from "node:path"
import { $ } from "bun"
import { root } from "./lib/repos.ts"

const main = join(root, ".cache/main-dist")
// Pages, Markdown copies, images and social images under docs/<repo>/main, and the content-hashed
// bundles in _astro/ they load.
const ofMain = /^_astro\/|(^|\/)docs(-assets)?\/[^/]+\/main(\/|\.[a-z]+$)/

rmSync(main, { recursive: true, force: true })
await $`bun scripts/sync-docs.ts && bunx astro build`.env({ ...process.env, DOCS_CHANNEL: "main" })
await $`bun scripts/sync-docs.ts && bunx astro build`.env({ ...process.env, DOCS_CHANNEL: "" })
cpSync(main, join(root, "dist"), {
  recursive: true,
  filter: (path) => statSync(path).isDirectory() || ofMain.test(relative(main, path)),
})
