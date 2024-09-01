import type { User } from '~/types'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')

  return $fetch<User>(apiUrl(`users/users/${id}/`))
})
