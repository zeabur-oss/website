import { createRouter } from "@tanstack/react-router"
import { NotFound } from "./components/not-found.tsx"
import { routeTree } from "./routeTree.gen.ts"

export function getRouter() {
  return createRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
    defaultNotFoundComponent: NotFound,
  })
}
