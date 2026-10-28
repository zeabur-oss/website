import { findShot } from "../lib/shots.ts"

// Screenshots on the landing and the product pages, and the widths they are shown at.

/** The site shots of the Zeabur web app, taken by zeabur's scripts/site-images.sh. */
export const siteShot = (locale: string, id: string) => ({
  light: `/docs-assets/zeabur/docs/images/site/${locale}/light/${id}.avif`,
  dark: `/docs-assets/zeabur/docs/images/site/${locale}/dark/${id}.avif`,
})

/**
 * Screenshots from Zeabur's docs, taken by its scripts/docs-shots.sh: the dark one where the
 * release took it, else the light one in both themes. Undefined when the build has no such shot.
 */
export const docsShot = (locale: string, id: string) => {
  const light = findShot("zeabur", locale, "light", id)
  const dark = findShot("zeabur", locale, "dark", id)
  return light && { light: light.src, dark: (dark ?? light).src }
}

/** Zeabur Identity's sign-in pages, from its docs. */
export const identityShot = (name: string) => ({
  light: `/docs-assets/identity/docs/images/${name}-light.avif`,
  dark: `/docs-assets/identity/docs/images/${name}-dark.avif`,
})

// The container is 1240px wide at most, with 16px or 48px gutters.
export const sizes = {
  full: "(min-width: 1336px) 1240px, (min-width: 768px) calc(100vw - 96px), calc(100vw - 32px)",
  wide: "(min-width: 1336px) 819px, (min-width: 1024px) calc(66vw - 64px), (min-width: 768px) calc(100vw - 96px), calc(100vw - 32px)",
  half: "(min-width: 1336px) 608px, (min-width: 768px) calc(50vw - 60px), calc(100vw - 32px)",
}
