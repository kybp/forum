import type { Account } from "~/types"
import { apiUrl } from "~/utils"

export default defineEventHandler(async (event) => {
  return $fetch<Account | null>(apiUrl(`users/token/`), {
    method: 'POST',
    body: await readBody(event),
  })
})
