import type { Thread } from '~/types'
import { authOptions } from '~/utils'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { params, account } = await readBody(event)

  return $fetch<Thread>(apiUrl(`threads/posts/${id}/`), {
    method: 'PUT',
    body: params,
    ...authOptions(account),
  })
})
