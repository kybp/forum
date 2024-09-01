import type { Reply } from '~/types'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')

  return $fetch<Reply[]>(apiUrl(`threads/posts/${id}/replies/`))
})
