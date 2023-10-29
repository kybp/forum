import { mande } from 'mande'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const api = mande(import.meta.env.VITE_API_HOST)

export type User = {
  id: number
  username: string
}

export const useUserStore = defineStore('user', () => {
  /** A map of user ID's to `User` objects */
  const users = ref<Record<number, User>>({})
  /** A map of user ID's to booleans indicating whether they're loading */
  const loading = ref<Record<number, boolean>>({})

  const fetchUser = async (id: number): Promise<void> => {
    if (loading.value[id]) return

    loading.value[id] = true
    const user: User = await api.get(`users/accounts/${id}`)
    loading.value[id] = false

    users.value[user.id] = user
  }

  const user = (id: number): User | undefined => users.value[id]

  const isLoading = (id: number) => loading.value[id]

  return {
    // User access
    user,
    fetchUser,
    isLoading,

    // Internal
    loading,
  }
})
