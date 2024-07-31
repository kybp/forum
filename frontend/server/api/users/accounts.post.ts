import type { Account } from "~/types"
import { apiUrl } from "~/utils"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return $fetch<Account>(apiUrl('users/accounts/'), {
    method: 'POST',
    body,
  })
})
