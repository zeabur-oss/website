import { expect, test } from "bun:test"
import { toMarkdown } from "./markdown.ts"

const body = `Read [the steps](../install/steps.mdx#before) and [above](#top).

<Callout type="warn" title="Back up first">
Keep a copy.
</Callout>

## Install

<Steps>
<Step>

### Get the chart

<Tabs items={["Helm", "Argo CD"]}>
<Tab value="Helm">

\`\`\`sh
helm install zeabur <Chart>
\`\`\`

</Tab>
<Tab>

Use an Application.

</Tab>
</Tabs>

</Step>
</Steps>

<Figure label="How a sign-in goes">
<FigFlow>
<FigCard title="Member" note="has a passkey" />
<FigArrow label="signs in" />
<FigGroup label="Cluster">
<FigCard accent title="Projects" tag="2" />
</FigGroup>
</FigFlow>
</Figure>

![The form](../images/form.avif)

Press <kbd>Enter</kbd>.<br />Done.
`

const markdown = toMarkdown({
  title: "Install",
  description: "Install it.",
  body,
  mdx: true,
  url: (href, image) =>
    href.startsWith("#")
      ? `https://oss.zeabur.com/docs/demo/page${href}`
      : `https://oss.zeabur.com/${image ? "docs-assets" : "docs"}/${href.replace(/^\.\.\/|\.mdx/g, "")}`,
})

test("a page with components becomes Markdown without JSX", () => {
  const prose = markdown.replace(/```[\s\S]*?```/g, "")
  expect(prose).not.toMatch(/<\/?[A-Za-z]/)
  expect(markdown).toContain("helm install zeabur <Chart>")
})

test("every link and image is an absolute URL", () => {
  const targets = [...markdown.matchAll(/\]\(([^)\s]+)/g)].map((m) => m[1])
  expect(targets).toEqual([
    "https://oss.zeabur.com/docs/install/steps#before",
    "https://oss.zeabur.com/docs/demo/page#top",
    "https://oss.zeabur.com/docs-assets/images/form.avif",
  ])
})

test("components keep their words", () => {
  expect(markdown).toStartWith("# Install\n\n> Install it.\n")
  expect(markdown).toContain("> **Back up first**\n>\n> Keep a copy.")
  expect(markdown).toContain("### Get the chart\n\n#### Helm\n")
  expect(markdown).toContain("#### Argo CD\n\nUse an Application.")
  expect(markdown).toContain(
    "- **Member**: has a passkey\n- → signs in\n- **Cluster**\n  - **Projects** (2)",
  )
})
