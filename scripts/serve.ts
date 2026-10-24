// Serves the built site the way a static host does: files, `<dir>/index.html`, then 404.html.
//   bun scripts/serve.ts [port]
import { existsSync, statSync } from "node:fs"
import { join, normalize } from "node:path"
import { root } from "./lib/repos.ts"

const dir = join(root, "dist/client")
const port = Number(process.argv[2] ?? process.env.PORT ?? 4321)

function resolve(pathname: string) {
  const path = normalize(join(dir, decodeURIComponent(pathname)))
  if (!path.startsWith(dir)) return undefined
  for (const candidate of [path, join(path, "index.html"), path + ".html"]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate
  }
  return undefined
}

Bun.serve({
  port,
  fetch(request) {
    const { pathname } = new URL(request.url)
    const file = resolve(pathname)
    if (file) return new Response(Bun.file(file))
    const missing = join(dir, "404.html")
    return new Response(existsSync(missing) ? Bun.file(missing) : "Not found", { status: 404 })
  },
})
console.log(`http://localhost:${port}`)
