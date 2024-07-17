import { Thread } from "~/types"
import { apiUrl, authOptions } from "~/utils"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const replyId = getRouterParam(event, 'replyId')
  const { account } = await readBody(event)

  return $fetch<Thread>(apiUrl(`threads/posts/${id}/replies/${replyId}/`), {
    method: 'DELETE',
    ...authOptions(account),
  })
})
