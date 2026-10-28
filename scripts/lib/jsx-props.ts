// Component props in docs pages are literals, so the check can validate them without running code.
import type { Expression } from "estree"
import type { MdxJsxAttribute, MdxJsxExpressionAttribute } from "mdast-util-mdx-jsx"

/** Evaluates a JSX attribute written as a literal: strings, numbers, booleans, arrays, objects. */
export function literal(node: Expression): unknown {
  switch (node.type) {
    case "Literal":
      return node.value
    case "TemplateLiteral":
      if (node.expressions.length) throw new Error("template literals with expressions")
      return node.quasis.map((q) => q.value.cooked).join("")
    case "ArrayExpression":
      return node.elements.map((e) => {
        if (!e || e.type === "SpreadElement") throw new Error("spread or empty array items")
        return literal(e)
      })
    case "ObjectExpression":
      return Object.fromEntries(
        node.properties.map((p) => {
          if (p.type !== "Property" || p.computed) throw new Error("computed or spread properties")
          const key =
            p.key.type === "Identifier" ? p.key.name : String((p.key as { value: unknown }).value)
          return [key, literal(p.value as Expression)]
        }),
      )
    case "UnaryExpression":
      if (node.operator === "-") return -(literal(node.argument) as number)
      break
  }
  throw new Error(`${node.type} is not a literal`)
}

export function props(attributes: (MdxJsxAttribute | MdxJsxExpressionAttribute)[]) {
  const out: Record<string, unknown> = {}
  for (const attr of attributes) {
    if (attr.type === "mdxJsxExpressionAttribute") throw new Error("spread props")
    if (attr.value === null || attr.value === undefined) out[attr.name] = true
    else if (typeof attr.value === "string") out[attr.name] = attr.value
    else {
      const statement = attr.value.data?.estree?.body[0]
      if (statement?.type !== "ExpressionStatement")
        throw new Error(`${attr.name}: not an expression`)
      out[attr.name] = literal(statement.expression)
    }
  }
  return out
}
