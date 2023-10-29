import type { RouteLocation } from 'vue-router'

export const routeLocationFactory = (
  props: Partial<RouteLocation> = {},
): RouteLocation => ({
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
