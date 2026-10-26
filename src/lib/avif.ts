import { readFileSync } from "node:fs"

/** Width and height from an AVIF's `ispe` box. */
export function avifSize(bytes: Uint8Array): [number, number] | undefined {
  for (let i = 0; i + 16 < bytes.length; i++) {
    if (
      bytes[i] === 0x69 &&
      bytes[i + 1] === 0x73 &&
      bytes[i + 2] === 0x70 &&
      bytes[i + 3] === 0x65
    ) {
      const view = new DataView(bytes.buffer, bytes.byteOffset + i + 8, 8)
      return [view.getUint32(0), view.getUint32(4)]
    }
  }
  return undefined
}

export function avifFileSize(path: string): [number, number] {
  const size = avifSize(readFileSync(path))
  if (!size) throw new Error(`${path}: no size in the AVIF`)
  return size
}
