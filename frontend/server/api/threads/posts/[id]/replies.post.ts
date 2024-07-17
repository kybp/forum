import { Thread } from "~/types"
import { apiUrl, authOptions } from "~/utils"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { params, account } = await readBody(event)

  return $fetch<Thread>(apiUrl(`threads/posts/${id}/replies/`), {
    method: 'POST',
    body: params,
    ...authOptions(account),
  })
})
