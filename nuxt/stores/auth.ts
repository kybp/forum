import { defineStore } from 'pinia'
import type { Account } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  const cookie = useCookie<Account | null>('account')

  /** The currently signed-in user, or `null` if we're signed out. */
  const account = ref<Account | null>(cookie.value || null)

  const setAccount = (newAccount: Account | null): void => {
    account.value = newAccount
    cookie.value = newAccount
  }

  const signOut = (): void => {
    account.value = null
    cookie.value = null
  }

  const isSignedIn = computed(() => account.value !== null)

  return {
    account,
    setAccount,
    isSignedIn,
    signOut,
  }
})

export type AuthStore = ReturnType<typeof useAuthStore>
