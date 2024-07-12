import type { RouteLocationNormalized } from 'vue-router'

export const routeLocationFactory = (
  props: Partial<RouteLocationNormalized> = {},
): RouteLocationNormalized => ({
  matched: [],
  fullPath: '',
  query: {},
  hash: '',
  path: '',
  params: {},
  meta: {},
  redirectedFrom: undefined,
  name: '',
  ...props,
})
