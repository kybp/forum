import { Thread } from "~/types"
import { apiUrl } from "~/utils"

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')

  return $fetch<Thread>(apiUrl(`threads/posts/${id}/replies/`))
})
