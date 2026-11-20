// An app's installers in a release, by computer: <name>-<os>-<arch><tail>, such as
// zeabur-desktop-v0.3.0-darwin-arm64.dmg. The build sorts the release's files with this, and the
// page picks the one for the visitor's computer in the browser.

export type Os = "macos" | "windows" | "linux"
export type Arch = "arm64" | "amd64"
export type Platform = { os: Os; arch: Arch }
export type Kind = "dmg" | "setup" | "portable" | "deb" | "rpm" | "appimage"

type Variant = { os: Os; kind: Kind; ext: string; tail: string; arches: Arch[] }

/** Each way to install Desktop, in the order the page lists them. */
const variants: Variant[] = [
  { os: "macos", kind: "dmg", ext: ".dmg", tail: ".dmg", arches: ["arm64"] },
  { os: "windows", kind: "setup", ext: ".exe", tail: "-setup.exe", arches: ["amd64"] },
  { os: "windows", kind: "portable", ext: ".exe", tail: "-portable.exe", arches: ["amd64"] },
  { os: "linux", kind: "deb", ext: ".deb", tail: ".deb", arches: ["amd64", "arm64"] },
  { os: "linux", kind: "rpm", ext: ".rpm", tail: ".rpm", arches: ["amd64", "arm64"] },
  {
    os: "linux",
    kind: "appimage",
    ext: ".AppImage",
    tail: ".AppImage",
    arches: ["amd64", "arm64"],
  },
]

/** The file the main button offers: one that installs and updates itself. */
const primary: Record<Os, Kind> = { macos: "dmg", windows: "setup", linux: "appimage" }

export const oses: Os[] = ["macos", "windows", "linux"]

const goos: Record<Os, string> = { macos: "darwin", windows: "windows", linux: "linux" }

function find<T extends { name: string }>(v: Variant, arch: Arch, files: T[]): T | undefined {
  const suffix = `-${goos[v.os]}-${arch}${v.tail}`
  return files.find((f) => f.name.endsWith(suffix))
}

export type Choice<T> = { file: T; os: Os; arch: Arch; kind: Kind; ext: string }

/** The file the main button offers for a platform, or undefined when it has no build. */
export function fileFor<T extends { name: string }>(
  platform: Platform,
  files: T[],
): Choice<T> | undefined {
  const v = variants.find((v) => v.os === platform.os && v.kind === primary[platform.os])
  const file = v?.arches.includes(platform.arch) ? find(v, platform.arch, files) : undefined
  return v && file ? { file, os: v.os, arch: platform.arch, kind: v.kind, ext: v.ext } : undefined
}

export type Row<T> = { kind: Kind; ext: string; builds: { arch: Arch; file: T }[] }

/** The release's files grouped by system, leaving out ways with no file in the release. */
export function downloadTable<T extends { name: string }>(files: T[]) {
  return oses
    .map((os) => ({
      os,
      rows: variants
        .filter((v) => v.os === os)
        .map((v): Row<T> => ({
          kind: v.kind,
          ext: v.ext,
          builds: v.arches.flatMap((arch) => {
            const file = find(v, arch, files)
            return file ? [{ arch, file }] : []
          }),
        }))
        .filter((r) => r.builds.length > 0),
    }))
    .filter((g) => g.rows.length > 0)
}

/**
 * The platform from the user agent, and from Client Hints where the browser has them: only they
 * tell Arm from x86. Without them a Mac counts as Apple silicon, the only Mac with a build, and
 * other computers as x86 unless the user agent names Arm. Phones and tablets get undefined.
 */
export function detectPlatform(
  userAgent: string,
  hints?: { platform?: string; mobile?: boolean; architecture?: string },
): Platform | undefined {
  if (hints?.mobile || /Android|iPhone|iPad|Mobile/.test(userAgent)) return undefined
  const named = hints?.platform ?? ""
  const os =
    named === "macOS" || /Macintosh|Mac OS X/.test(userAgent)
      ? "macos"
      : named === "Windows" || /Windows/.test(userAgent)
        ? "windows"
        : named === "Linux" || /Linux|X11/.test(userAgent)
          ? "linux"
          : undefined
  if (!os) return undefined
  const arch = hints?.architecture
    ? hints.architecture === "arm"
      ? "arm64"
      : "amd64"
    : os === "macos" || /aarch64|arm64/i.test(userAgent)
      ? "arm64"
      : "amd64"
  return { os, arch }
}
