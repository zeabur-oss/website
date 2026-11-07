// Reads the built site (bun run build first).
import { expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import lock from "../docs.lock.json"

const dist = join(import.meta.dir, "..", "dist")

test("each product page shows the release tag its docs are locked to", () => {
  for (const repo of lock.repos) {
    const html = readFileSync(join(dist, repo.name, "index.html"), "utf8")
    expect(html.match(/<span class="pill"[^>]*>([^<]+)</)?.[1], repo.name).toBe(repo.tag)
  }
})
