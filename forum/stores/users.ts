import { defineStore } from 'pinia'
import type { User } from '@/api'

export const useUsersStore = defineStore('users', () => {
  const users = ref<Record<number, User>>({})

  const findUser = (id: number | null): User | null => {
    if (id === null) {
      return { id: null, username: '[deleted]' }
    }

    // return users.value[id]

    return {
      id: 1,
      username: 'foo',
    }
  }

  return {
    findUser,
  }
})
