import { apiUrl } from "~/utils"

export default defineEventHandler(() => {
  return $fetch<string[]>(apiUrl(`users/themes/`))
})
