import { mande } from 'mande'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { isMandeError, type Errors } from './utils'
import { useUserStore } from './user'

const api = mande(import.meta.env.VITE_API_HOST)

export type User = {
  id: number
  username: string
  email: string
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

  const user = ref<User | null>(
    JSON.parse(localStorage.getItem('user') ?? 'null'),
  )

  const options = computed(() => {
    if (!user.value) return {}

    return {
      headers: { Authorization: `Token ${user.value.token}` },
    }
  })

  const updateUser = (newUser: User | null) => {
    user.value = newUser

    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser))
    } else {
      localStorage.removeItem('user')
    }
  }

  const registerErrors = ref<Errors | null>(null)

  const clearRegisterErrors = () => {
    registerErrors.value = null
  }

  const register = async (props: RegisterProps) => {
    try {
      updateUser(await api.post('users/accounts/', props))
      clearRegisterErrors()
    } catch (error: unknown) {
      if (!isMandeError(error)) throw error

      if (error.response.status === 400) {
        registerErrors.value = error.body
      }
    }
  }

  const signInErrors = ref<Errors | null>(null)

  const clearSignInErrors = () => {
    signInErrors.value = null
  }

  const signIn = async (props: SignInProps) => {
    try {
      updateUser(await api.post('users/token/', props))
      clearSignInErrors()
    } catch (error: unknown) {
      if (!isMandeError(error)) throw error

      if (error.response.status === 400) {
        signInErrors.value = error.body
      }
    }
  }

  const signOut = () => {
    updateUser(null)
  }

  const deleteAccount = async () => {
    if (!user.value) throw new Error('Not signed in')

    await api.delete(`users/accounts/${user.value.id}/`, options.value)
    await userStore.fetchUser(user.value.id)

    updateUser(null)
  }

  const isSignedIn = computed(() => !!user.value)

  return {
    user,
    // Register
    register,
    registerErrors,
    clearRegisterErrors,
    // Sign in
    signIn,
    signInErrors,
    clearSignInErrors,
    // Misc
    signOut,
    deleteAccount,
    isSignedIn,
  }
})

export const useAuthOptions = (options = { notSignedInOkay: false }) => {
  const { user } = useAuthStore()

  if (!user) {
    if (options.notSignedInOkay) return {}
    throw new Error('Not signed in')
  }

  return {
    headers: { Authorization: `Token ${user.token}` },
  } as const
}
