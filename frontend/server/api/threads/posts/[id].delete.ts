import { authOptions } from '~/utils'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { account } = await readBody(event)

  return $fetch<never>(apiUrl(`threads/posts/${id}/`), {
    method: 'DELETE',
    ...authOptions(account),
  })
})
