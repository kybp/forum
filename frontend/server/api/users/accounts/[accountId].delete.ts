import { apiUrl, authOptions } from "~/utils"

export default defineEventHandler(async (event) => {
  const { account } = await readBody(event)

  return $fetch(apiUrl(`users/accounts/${account.id}/`), {
    method: 'DELETE',
    ...authOptions(account),
  })
})
