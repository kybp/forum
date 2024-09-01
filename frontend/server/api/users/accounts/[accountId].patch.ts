import type { Account } from '~/types'
import { authOptions } from '~/utils'

export default defineEventHandler(async (event) => {
  const { params, account } = await readBody(event)

  return $fetch<Account>(apiUrl(`users/accounts/${account.id}/`), {
    method: 'PATCH',
    body: params,
    ...authOptions(account),
  })
})
