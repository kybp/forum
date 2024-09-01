import type { Thread } from '~/types'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')

  return $fetch<Thread>(apiUrl(`threads/posts/${id}/`))
})
