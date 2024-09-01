import { authOptions } from '~/utils'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const type = getRouterParam(event, 'reactionType')
  const { account } = await readBody(event)

  return $fetch<never>(apiUrl(`threads/posts/${id}/reactions/${type}`), {
    method: 'DELETE',
    ...authOptions(account),
  })
})
