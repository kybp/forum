import axios, { isAxiosError } from 'axios'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Errors } from './utils'
import { useUserStore } from './user'

const api = axios.create({ baseURL: import.meta.env.VITE_API_HOST })

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
  const userStore = useUserStore()

  /** The currently signed-in user, or `null` if we're signed out. */
  const account = ref<Account | null>(
    JSON.parse(localStorage.getItem('account') ?? 'null'),
  )

  /** The list of available themes */
  const themes = ref<string[]>([])

  const options = computed(() => {
    if (!account.value) return {}

    return {
      headers: { Authorization: `Token ${account.value.token}` },
    }
  })

  const fetchThemes = async () => {
    const response = await api.get('users/themes/')
    themes.value = response.data
  }

  const saveAccount = (newAccount: Account | null) => {
    account.value = newAccount

    if (newAccount) {
      localStorage.setItem('account', JSON.stringify(newAccount))
    } else {
      localStorage.removeItem('account')
    }
  }

  const registerErrors = ref<Errors | null>(null)

  const clearRegisterErrors = () => {
    registerErrors.value = null
  }

  const register = async (props: RegisterProps) => {
    try {
      const response = await api.post('users/accounts/', props)
      saveAccount(response.data)
      clearRegisterErrors()
    } catch (error: unknown) {
      if (!isAxiosError(error)) throw error

      if (error.response?.status === 400) {
        registerErrors.value = error.response.data
      }
    }
  }

  const signInErrors = ref<Errors | null>(null)

  const clearSignInErrors = () => {
    signInErrors.value = null
  }

  const signIn = async (props: SignInProps) => {
    try {
      const response = await api.post('users/token/', props)
      saveAccount(response.data)
      clearSignInErrors()
    } catch (error: unknown) {
      if (!isAxiosError(error)) throw error

      if (error.response?.status === 400) {
        signInErrors.value = error.response.data
      }
    }
  }

  const signOut = async () => {
    saveAccount(null)
  }

  const updateAccount = async (params: Partial<Account>) => {
    if (!account.value) throw new Error('Not signed in')

    try {
      const url = `users/accounts/${account.value.id}/`
      const response = await api.patch(url, params, options.value)
      saveAccount({ ...response.data, token: account.value.token })
    } catch (error) {
      if (!isAxiosError(error)) throw error
    }
  }

  const deleteAccount = async () => {
    if (!account.value) throw new Error('Not signed in')

    await api.delete(`users/accounts/${account.value.id}/`, options.value)
    await userStore.fetchUser(account.value.id)

    saveAccount(null)
  }

  const isSignedIn = computed(() => !!account.value)

  return {
    account,

    // Register
    register,
    registerErrors,
    clearRegisterErrors,

    // Sign in
    signIn,
    signInErrors,
    clearSignInErrors,

    // Themes
    themes,
    fetchThemes,

    // Misc
    signOut,
    updateAccount,
    deleteAccount,
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
