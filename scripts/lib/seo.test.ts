import { expect, test } from "bun:test"

import { jsonLd } from "../../src/lib/seo.ts"

test("JSON-LD text cannot close its script tag", () => {
  const { content } = jsonLd({ description: "Use </script><script>alert(1)</script> here" })
  expect(content).not.toContain("</script")
  expect(JSON.parse(content).description).toBe("Use </script><script>alert(1)</script> here")
})
