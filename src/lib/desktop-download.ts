// Which Zeabur Desktop file fits the visitor's computer. The page runs this in the browser; the
// build only lists the files.

export type Platform = { os: "macos" | "windows" | "linux"; arch: "arm64" | "amd64" }

/** The suffix of the file each platform installs; one with no build is missing. */
const suffixes: Record<`${Platform["os"]}-${Platform["arch"]}`, string | undefined> = {
  "macos-arm64": "-darwin-arm64.dmg",
  "macos-amd64": undefined,
  "windows-amd64": "-windows-amd64-setup.exe",
  "windows-arm64": undefined,
  "linux-amd64": "-linux-amd64.AppImage",
  "linux-arm64": "-linux-arm64.AppImage",
}

export function fileFor<T extends { name: string }>(platform: Platform, files: T[]): T | undefined {
  const suffix = suffixes[`${platform.os}-${platform.arch}`]
  return suffix === undefined ? undefined : files.find((f) => f.name.endsWith(suffix))
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
