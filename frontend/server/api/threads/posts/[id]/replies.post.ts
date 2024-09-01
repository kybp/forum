import type { Reply } from '~/types'
import { authOptions } from '~/utils'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { params, account } = await readBody(event)

  return $fetch<Reply>(apiUrl(`threads/posts/${id}/replies/`), {
    method: 'POST',
    body: params,
    ...authOptions(account),
  })
})
