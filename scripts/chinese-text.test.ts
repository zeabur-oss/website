import { expect, test } from "bun:test"
import { chineseTextSegments } from "../src/components/chinese-text.ts"

test("a file name stays one word in Chinese text", () => {
  const words = chineseTextSegments(
    "Mac 用 .dmg，Windows 用 -setup.exe，Linux 有 .deb、.rpm",
    "zh-TW",
  )
  for (const name of [".dmg，", "-setup.exe，", ".deb、", ".rpm"]) expect(words).toContain(name)
})
