import { authOptions } from '~/utils'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const replyId = getRouterParam(event, 'replyId')
  const { account } = await readBody(event)

  return $fetch<never>(apiUrl(`threads/posts/${id}/replies/${replyId}/`), {
    method: 'DELETE',
    ...authOptions(account),
  })
})
