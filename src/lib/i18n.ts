import { defineI18n } from "fumadocs-core/i18n"
import { locales } from "./urls.ts"

// scripts/sync-docs.ts writes every page in every locale, with its own fallbacks.
export const i18n = defineI18n({
  defaultLanguage: "en",
  languages: [...locales],
  hideLocale: "default-locale",
  parser: "dir",
})
