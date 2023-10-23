import { defineStore } from 'pinia'
import { mande } from 'mande'
import { isMandeError, type Errors } from './utils'

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

type State = {
  user: User | null
  registerErrors: Errors | null
}

export const useAuthStore = defineStore({
  id: 'auth',
  state: (): State => ({
    user: JSON.parse(localStorage.getItem('user') ?? 'null'),
    registerErrors: null,
  }),
  actions: {
    updateUser(user: User | null) {
      this.user = user

      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        localStorage.removeItem('user')
      }
    },

    async register(props: RegisterProps) {
      try {
        this.updateUser(await api.post('users/', props))
        this.registerErrors = null
      } catch (error: unknown) {
        if (!isMandeError(error)) throw error

        if (error.response.status === 400) {
          this.registerErrors = error.body
        }
      }
    },

    clearRegisterErrors() {
      this.registerErrors = null
    },

    async signIn(props: SignInProps) {
      this.updateUser(await api.post('users/token/', props))
    },

    async signOut() {
      this.updateUser(null)
    },
  },
  getters: {
    isSignedIn: (state: State) => !!state.user,
  },
})
