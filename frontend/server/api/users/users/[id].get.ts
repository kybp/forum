import type { User } from "~/types"
import { apiUrl } from "~/utils"

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')

  return $fetch<User>(apiUrl(`users/users/${id}/`))
})
