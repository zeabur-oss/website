declare module "*.astro" {
  const component: (props: Record<string, unknown>) => unknown
  export default component
}

interface ImportMetaEnv {
  readonly PUBLIC_POSTHOG_KEY?: string
}
