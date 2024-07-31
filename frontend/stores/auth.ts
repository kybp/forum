import { defineStore } from 'pinia'
import type { Account } from '~/types'
import { authOptions } from '~/utils'
import { useUsersStore } from './users'

export type SignInParams = {
  username: string
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  const usersStore = useUsersStore()

  const cookie = useCookie<Account | null>('account')

  /** The currently signed-in user, or `null` if we're signed out. */
  const account = ref<Account | null>(cookie.value || null)

  /** The list of available themes */
  const themes = ref<string[]>([])

  const fetchThemes = async () => {
    const response = await useFetch<string[]>('/api/users/themes/')
    const responseThemes = response.data.value
    if (responseThemes !== null) themes.value = responseThemes
  }

  const signIn = async ({ username, password }: SignInParams) => {
    const response = await useFetch<Account | null>('/api/users/token/', {
      method: 'POST',
      body: { username, password },
    })

    if (response.data.value) setAccount(response.data.value)

    return response
  }

  const setAccount = (newAccount: Account | null): void => {
    account.value = newAccount
    cookie.value = newAccount
  }

  const signOut = (): void => {
    account.value = null
    cookie.value = null
  }

  const isSignedIn = computed(() => account.value !== null)

  const updateAccount = async (params: Partial<Account>) => {
    if (!account.value) throw new Error('Not signed in')

    const response = await useFetch<Account>(
      `/api/users/accounts/${account.value.id}/`,
      {
        method: 'PATCH',
        body: { params, account: account.value },
      },
    )

    if (response.data.value === null) throw new Error(`${response.error.value}`)

    setAccount({ ...response.data.value, token: account.value.token })
  }

  const deleteAccount = async () => {
    if (!account.value) throw new Error('Not signed in')

    await useFetch(`/api/users/accounts/${account.value.id}/`, {
      method: 'DELETE',
      body: { account: account.value },
    })
    await usersStore.getUser(account.value.id)

    setAccount(null)
  }

  return {
    account,
    themes,
    fetchThemes,
    setAccount,
    isSignedIn,
    signIn,
    signOut,
    updateAccount,
    deleteAccount,
  }
})

export type AuthStore = ReturnType<typeof useAuthStore>
