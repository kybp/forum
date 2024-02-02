import { defineStore } from 'pinia'
import type { Account, User } from '@/types'

export type CreateUserParams = {
  username: string
  email: string
  password: string
}

export const useUsersStore = defineStore('users', () => {
  const authStore = useAuthStore()

  const users = ref<Record<number, User>>({})

  const createUser = async (
    params: CreateUserParams,
  ): Promise<AsyncResponse<User>> => {
    const response = await useFetch<Account>(apiUrl('users/accounts/'), {
      method: 'POST',
      body: params,
    })

    const account = response.data.value
    authStore.setAccount(account)
    if (account) users.value[account.id] = account

    return response
  }

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
    createUser,
    getUser,
    findUser,
  }
})

export type UsersStore = ReturnType<typeof useUsersStore>
