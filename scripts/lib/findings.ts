// What docs-check reports, and the callback the checks report through.
export type Finding = {
  /** `error` fails the check; `stale` and `warning` are reported only. */
  level: "error" | "warning" | "stale"
  code: FindingCode
  file: string
  line?: number
  message: string
}

/** What a finding is about. The message can change; the code does not. */
export type FindingCode =
  | "nav-missing"
  | "nav-invalid"
  | "nav-page-missing"
  | "nav-group-unknown"
  | "nav-page-unknown"
  | "reserved-name"
  | "redirect-target-unpublished"
  | "redirect-hides-page"
  | "redirect-needed"
  | "unpublished-file"
  | "markdown-page"
  | "frontmatter-title"
  | "frontmatter-field"
  | "translation-no-source"
  | "translation-stale"
  | "parse-error"
  | "shots-missing"
  | "shot-unknown"
  | "shot-locale"
  | "shot-theme"
  | "link-github-docs"
  | "link-github-docs-other"
  | "link-outside-docs"
  | "link-missing"
  | "link-unpublished"
  | "import-export"
  | "component-unknown"
  | "component-props-literal"
  | "component-props-invalid"

export type Add = (
  level: Finding["level"],
  code: FindingCode,
  file: string,
  message: string,
  line?: number,
) => void
