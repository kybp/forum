import type { Reply } from '~/types'
import { authOptions } from '~/utils'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const replyId = getRouterParam(event, 'replyId')
  const { params, account } = await readBody(event)

  return $fetch<Reply>(apiUrl(`threads/posts/${id}/replies/${replyId}/`), {
    method: 'PUT',
    body: params,
    ...authOptions(account),
  })
})
