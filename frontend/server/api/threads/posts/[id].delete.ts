import { apiUrl, authOptions } from '~/utils'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { account } = await readBody(event)

  return $fetch(apiUrl(`threads/posts/${id}/`), {
    method: 'DELETE',
    ...authOptions(account),
  })
})
