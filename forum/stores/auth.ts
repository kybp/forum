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
  /** The currently signed-in user, or `null` if we're signed out. */
  const account: Ref<Account | null> = ref(null)

  const setAccount = (newAccount: Account | null): void => {
    account.value = newAccount
  }

  const isSignedIn = computed(() => true ) // xxx: account !== null)

  // const account = ref<Account | null>(
  //   JSON.parse(localStorage.getItem('account') ?? 'null'),
  // )

  return {
    account,
    setAccount,
    isSignedIn,
  }
})

export const useAuthOptions = (options = { notSignedInOkay: false }) => {
  const { account } = useAuthStore()

  if (!account) {
    if (options.notSignedInOkay) return {}
    throw new Error('Not signed in')
  }

  return {
    headers: { Authorization: `Token ${account.token}` },
  } as const
}

export type AuthStore = ReturnType<typeof useAuthStore>
