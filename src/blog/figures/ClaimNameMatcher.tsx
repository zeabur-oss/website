import { useId, useState } from "react"
import { Badge } from "@zeabur/design-system/components/badge"
import { Input } from "@zeabur/design-system/components/input"
import { Label } from "@zeabur/design-system/components/label"
import { ToggleGroup, ToggleGroupItem } from "@zeabur/design-system/components/toggle-group"
import type { SiteLocale } from "../../lib/urls.ts"
import { claimSteps } from "./rules.ts"
import { figureCopy } from "./text.ts"

const SET = "db"
const TEMPLATE = "data"
const PRESETS = [
  "data-db-0",
  "data-db-12",
  "data-db-replica-0",
  "data-db-",
  "data-db-0a",
  "cache-db-0",
]

const copy = {
  "zh-TW": {
    setup: `StatefulSet ${SET} 的磁碟範本叫 ${TEMPLATE}`,
    input: "磁碟名稱",
    presets: "範例",
    parts: ["範本名稱", "", "StatefulSet 名稱", "", "序號"],
    yes: `是 ${SET} 的磁碟`,
    no: `不是 ${SET} 的磁碟`,
    expected: (expected: string) => `這裡應該是「${expected}」`,
    ordinal: (rest: string) => `剩下的「${rest}」要全是數字`,
    missing: "少了序號",
    empty: "（空的）",
  },
}

export default function ClaimNameMatcher({ label, locale }: { label: string; locale: SiteLocale }) {
  const t = figureCopy(copy, locale)
  const id = useId()
  const [claim, setClaim] = useState("data-db-replica-0")
  const { steps, matches, failedAt, rest } = claimSteps(claim, TEMPLATE, SET)
  const expected = [TEMPLATE, "-", SET, "-"][failedAt]
  const why =
    failedAt === -1
      ? null
      : expected !== undefined
        ? t.expected(expected)
        : rest === ""
          ? t.missing
          : t.ordinal(rest)

  return (
    <div className="fig fig-claim" role="group" aria-label={label}>
      <p className="fig-note">{t.setup}</p>
      <div className="fig-claim-input">
        <Label htmlFor={id}>{t.input}</Label>
        <Input
          id={id}
          mono
          autoComplete="off"
          value={claim}
          onChange={(event) => setClaim(event.target.value)}
        />
      </div>
      <div className="fig-claim-presets">
        <span className="fig-note">{t.presets}</span>
        <ToggleGroup
          variant="outline"
          size="sm"
          className="flex-wrap"
          aria-label={t.presets}
          value={PRESETS.includes(claim) ? [claim] : []}
          onValueChange={(value) => value[0] !== undefined && setClaim(value[0])}
        >
          {PRESETS.map((preset) => (
            <ToggleGroupItem key={preset} value={preset} className="font-mono">
              {preset}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div aria-live="polite" className="fig-claim-out">
        <ol className="fig-claim-steps">
          {steps.map((step, i) => (
            <li key={i}>
              <span className="fig-kind">{t.parts[i] || " "}</span>
              <span
                className={
                  step.ok ? "fig-card fig-claim-part" : "fig-card fig-claim-part fig-accent"
                }
              >
                {step.part === "" ? <span className="fig-faint">{t.empty}</span> : step.part}
              </span>
            </li>
          ))}
        </ol>
        <p className="fig-claim-result">
          <Badge variant={matches ? "ok" : "fail"} size="lg">
            {matches ? t.yes : t.no}
          </Badge>
          {why && <span className="fig-note">{why}</span>}
        </p>
      </div>
    </div>
  )
}
