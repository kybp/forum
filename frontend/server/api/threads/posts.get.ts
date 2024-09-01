import type { Thread } from '~/types'

export default defineEventHandler(() => {
  return $fetch<Thread[]>(apiUrl('threads/posts/'))
})
