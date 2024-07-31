import type { Thread } from '~/types'
import { apiUrl, authOptions } from '~/utils'

export default defineEventHandler(async (event) => {
  const { params, account } = await readBody(event)

  return $fetch<Thread>(apiUrl('threads/posts/'), {
    method: 'POST',
    body: params,
    ...authOptions(account),
  })
})
