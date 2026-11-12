import { siteOrigin } from "../lib/urls.ts"

/** schema.org's BreadcrumbList for a page's path, from the home page down. */
export function breadcrumb(crumbs: { name: string; href: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${siteOrigin}${crumb.href}`,
    })),
  }
}
