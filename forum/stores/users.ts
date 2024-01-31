import { defineStore } from 'pinia'
import type { User } from '@/api'

export const useUsersStore = defineStore('users', () => {
  const users = ref<Record<number, User>>({})

  const getUser = async (id: number): Promise<AsyncResponse<User>> => {
    const response = await useFetch<User>(apiUrl(`users/users/${id}/`))
    if (response.data.value !== null) users.value[id] = response.data.value
    return response
  }

  const findUser = (id: number | null): User | null => {
    if (id === null) {
      return { id: null, username: '[deleted]' }
    }

    return users.value[id]
  }

  return {
    getUser,
    findUser,
  }
})
