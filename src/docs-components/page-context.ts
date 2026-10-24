import { createContext, useContext } from "react"

export type DocsPageContext = { repo: string; contentLocale: string }

export const PageContext = createContext<DocsPageContext>({ repo: "zeabur", contentLocale: "en" })

export const usePageContext = () => useContext(PageContext)
