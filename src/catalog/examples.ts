import { isMap, isScalar, isSeq, parseDocument, type YAMLMap } from "yaml"

/** Component files the catalog and landing pages show, copied from its latest release. */
export const exampleFiles = [
  "components/traefik/component.yaml",
  "components/cert-manager/component.yaml",
] as const

export type ExampleFile = (typeof exampleFiles)[number]

type Excerpt = {
  /** Top-level keys to keep, in the file's order. */
  keys: string[]
  /** Keys of `metadata` to leave out. */
  omitMetadata?: string[]
  /** The one release to keep, with these keys. */
  release?: { name: string; keys: string[] }
  /** Leave out the comment at the top of the file. */
  noHeader?: boolean
}

const keyOf = (pair: { key: unknown }) => (isScalar(pair.key) ? String(pair.key.value) : "")

function keep(map: YAMLMap, keys: string[], file: string) {
  for (const key of keys) {
    if (!map.items.some((p) => keyOf(p) === key)) throw new Error(`${file} has no "${key}"`)
  }
  map.items = map.items.filter((p) => keys.includes(keyOf(p)))
}

/** Part of a component file with its comments, so a page shows the file as it is released. */
export function excerpt(
  file: string,
  text: string,
  { keys, omitMetadata = [], release, noHeader }: Excerpt,
) {
  const doc = parseDocument(text)
  if (!isMap(doc.contents)) throw new Error(`${file} is not a mapping`)
  keep(doc.contents, keys, file)
  const first = doc.contents.items[0]?.key
  if (noHeader && isScalar(first)) first.commentBefore = null
  for (const key of omitMetadata) doc.deleteIn(["metadata", key])
  if (release) {
    const releases = doc.get("releases")
    const one = isSeq(releases)
      ? releases.items.find((r) => isMap(r) && r.get("name") === release.name)
      : undefined
    if (!isSeq(releases) || !isMap(one)) throw new Error(`${file} has no release ${release.name}`)
    keep(one, release.keys, file)
    one.spaceBefore = false
    releases.items = [one]
  }
  return doc.toString({ lineWidth: 0, flowCollectionPadding: false }).trimEnd()
}
