import type { Thread } from "~/types"
import { apiUrl } from "~/utils"

export default defineEventHandler(() => {
  return $fetch<Thread[]>(apiUrl('threads/posts/'))
})
