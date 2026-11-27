import { expect, test } from "bun:test"
import { latestRelease } from "./repos.ts"

const release = (tag_name: string, more: { draft?: boolean; prerelease?: boolean } = {}) => ({
  tag_name,
  draft: false,
  prerelease: false,
  ...more,
})

test("the latest release is the highest full release", () => {
  expect(
    latestRelease([
      release("v0.4.0", { draft: true }),
      release("v0.4.0-beta.1", { prerelease: true }),
      release("v0.3.10"),
      release("v0.3.9"),
      release("v0.3.2"),
    ]),
  ).toBe("v0.3.10")
})

test("a repository with only pre-releases has no latest release", () => {
  expect(latestRelease([release("v0.1.0-beta.1", { prerelease: true })])).toBeUndefined()
})
