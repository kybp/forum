import { defineStore } from 'pinia'

export type Account = {
  id: number
  username: string
  email: string
  avatar: string
  theme: string
  token: string
}

export type SignInProps = {
  username: string
  password: string
}

export type RegisterProps = {
  username: string
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  const cookie = useCookie<Account | null>('account')

  /** The currently signed-in user, or `null` if we're signed out. */
  const account = ref<Account | null>(cookie.value || null)

  const setAccount = (newAccount: Account | null): void => {
    account.value = newAccount
    cookie.value = newAccount
  }

  const isSignedIn = computed(() => account.value !== null)



  return {
    account,
    setAccount,
    isSignedIn,
  }
})

export type AuthStore = ReturnType<typeof useAuthStore>
