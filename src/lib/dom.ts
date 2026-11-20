/** The element `selector` finds under `root`. A page's script and its markup go together, so a miss is a bug. */
export function required<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector)
  if (!element) throw new Error(`no element matches ${selector}`)
  return element
}

/** The `data-<name>` attribute of `element`, named in the error when it is missing. */
export function dataOf(element: HTMLElement, name: string): string {
  const value = element.dataset[name]
  if (value === undefined) throw new Error(`${element.tagName.toLowerCase()} has no data-${name}`)
  return value
}
