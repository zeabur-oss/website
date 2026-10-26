// Social images, after engawa's landing (src/lib/og.ts, Apache-2.0): satori lays the
// card out with the text turned into outlines, resvg makes the PNG. The card follows the repository
// covers in public/og: a dark frame on a hatched ground, the logo, then the words.
import { Resvg } from "@resvg/resvg-js"
import { readFile } from "node:fs/promises"
import { createRequire } from "node:module"
import { dirname, join } from "node:path"
import satori from "satori"
import { OG_HEIGHT, OG_WIDTH } from "./seo.ts"

export interface OgCard {
  kicker: string
  title: string
  sub?: string
  han: "tc" | "sc"
}

const require = createRequire(import.meta.url)
const ground = "#0f0f11"
const line = "#2c2c2e"

type Weight = 400 | 500 | 600
const geist = (weight: Weight) =>
  readFile(require.resolve(`@fontsource/geist-sans/files/geist-sans-latin-${weight}-normal.woff`))

type Slice = { name: string; file: string; ranges: [number, number][] }
const sliceCache = new Map<string, Promise<Slice[]>>()

/** The unicode-range slices of a fontsource package at one weight. */
function slices(pkg: string, weight: Weight): Promise<Slice[]> {
  const key = `${pkg}:${weight}`
  if (!sliceCache.has(key)) {
    const css = require.resolve(`${pkg}/${weight}.css`)
    sliceCache.set(
      key,
      readFile(css, "utf8").then((text) =>
        [
          ...text.matchAll(
            /url\(\.\/(files\/[^)]+\.woff)\) format\('woff'\);\s*unicode-range: ([^;]+);/g,
          ),
        ].map((m) => ({
          name: m[1]!.replace("files/", "").replace(/-\d+-normal\.woff$/, ""),
          file: join(dirname(css), m[1]!),
          ranges: m[2]!.split(",").map((r) => {
            const [a, b] = r.trim().replace("U+", "").split("-")
            return [parseInt(a!, 16), parseInt(b ?? a!, 16)] as [number, number]
          }),
        })),
      ),
    )
  }
  return sliceCache.get(key)!
}

/** Only the Noto slices the Chinese characters in `text` need; Geist covers the rest. */
async function noto(text: string, han: "tc" | "sc", weight: Weight) {
  const codes = [...new Set([...text].map((c) => c.codePointAt(0)!).filter((c) => c > 0x2e7f))]
  if (codes.length === 0) return []
  const pkg = han === "tc" ? "@fontsource/noto-sans-tc" : "@fontsource/noto-sans-sc"
  const needed = (await slices(pkg, weight)).filter((s) =>
    codes.some((c) => s.ranges.some(([a, b]) => c >= a && c <= b)),
  )
  // satori picks one face per family and weight, so every slice is its own family.
  return Promise.all(
    needed.map(async (s) => ({
      name: s.name,
      data: await readFile(s.file),
      weight,
      style: "normal" as const,
    })),
  )
}

const svgUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`

const logo = readFile(
  require.resolve("@zeabur/design-system/vendor/zeabur/logo-with-text.svg"),
  "utf8",
).then(svgUri)

const hatch = svgUri(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="${OG_HEIGHT}">` +
    `<defs><pattern id="h" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">` +
    `<line x1="0" y1="0" x2="0" y2="12" stroke="#ffffff" stroke-opacity="0.07" stroke-width="2"/></pattern></defs>` +
    `<rect width="100%" height="100%" fill="url(#h)"/></svg>`,
)

type Node = { type: string; props: Record<string, unknown> }
const h = (
  type: string,
  style: Record<string, unknown>,
  children?: unknown,
  extra: Record<string, unknown> = {},
): Node => ({
  type,
  props: { style, children, ...extra },
})

/**
 * Geist has narrow glyphs for some full-width punctuation, so Chinese runs name the Noto families
 * first. satori ignores lineClamp once a block has spans, so the height is capped instead.
 */
function runs(text: string, han: string[]) {
  return text
    .split(/([\u2e80-\uffff]+)/u)
    .filter(Boolean)
    .map((part) =>
      /[\u2e80-\uffff]/u.test(part) ? h("span", { fontFamily: han.join(", ") }, part) : part,
    )
}

export async function renderOg(card: OgCard): Promise<Buffer> {
  const [regular, medium, semibold, subHan, titleHan] = await Promise.all([
    geist(400),
    geist(500),
    geist(600),
    noto(card.sub ?? "", card.han, 400),
    noto(`${card.kicker}${card.title}`, card.han, 600),
  ])
  const fonts = [
    { name: "Geist", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Geist", data: medium, weight: 500 as const, style: "normal" as const },
    { name: "Geist", data: semibold, weight: 600 as const, style: "normal" as const },
    ...subHan,
    ...titleHan,
  ]
  const han = [...new Set([...subHan, ...titleHan].map((f) => f.name))]
  const family = ["Geist", ...han].join(", ")

  // Long titles step down so they stay within three lines.
  const length = [...card.title].reduce((n, c) => n + (c.codePointAt(0)! > 0x2e7f ? 2 : 1), 0)
  const hasHan = /\p{Script=Han}/u.test(card.title)
  const titleSize = length > 60 ? 50 : length > 36 ? 58 : 66

  const inset = 44
  const pad = 46
  const tree = h(
    "div",
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      display: "flex",
      position: "relative",
      background: ground,
      fontFamily: family,
    },
    [
      h("img", { position: "absolute", left: 0, top: 0 }, undefined, {
        src: hatch,
        width: OG_WIDTH,
        height: OG_HEIGHT,
      }),
      h("div", {
        position: "absolute",
        left: inset,
        top: inset,
        width: OG_WIDTH - inset * 2,
        height: OG_HEIGHT - inset * 2,
        background: ground,
        border: `1px solid ${line}`,
      }),
      // satori sizes a box without its padding, so the column is placed and sized directly.
      h(
        "div",
        {
          position: "absolute",
          left: inset + pad,
          top: inset + pad,
          width: OG_WIDTH - (inset + pad) * 2,
          height: OG_HEIGHT - (inset + pad) * 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
        [
          h("img", {}, undefined, { src: await logo, width: 116, height: 22 }),
          h("div", { display: "flex", flexDirection: "column", gap: 20, maxWidth: 960 }, [
            h(
              "div",
              { display: "block", fontSize: 22, fontWeight: 500, color: "#a78bfa" },
              runs(card.kicker, han),
            ),
            h(
              "div",
              {
                display: "block",
                maxHeight: titleSize * (hasHan ? 1.2 : 1.1) * 3,
                overflow: "hidden",
                fontSize: titleSize,
                fontWeight: 600,
                lineHeight: hasHan ? 1.2 : 1.1,
                letterSpacing: hasHan ? 0 : -1.4,
                color: "#fafafa",
              },
              runs(card.title, han),
            ),
            ...(card.sub
              ? [
                  h(
                    "div",
                    {
                      display: "block",
                      maxHeight: 24 * 1.45 * 2,
                      overflow: "hidden",
                      fontSize: 24,
                      lineHeight: 1.45,
                      color: "#a1a1aa",
                    },
                    runs(card.sub, han),
                  ),
                ]
              : []),
          ]),
        ],
      ),
    ],
  )
  const svg = await satori(tree as Parameters<typeof satori>[0], {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts,
  })
  return new Resvg(svg, { fitTo: { mode: "width", value: OG_WIDTH } }).render().asPng()
}
