import { defineStore } from 'pinia'
import { mande } from 'mande'
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

type State = {
  user: User | null
  registerErrors: Errors | null
  signInErrors: Errors | null
}

export const useAuthStore = defineStore({
  id: 'auth',
  state: (): State => ({
    user: JSON.parse(localStorage.getItem('user') ?? 'null'),
    registerErrors: null,
    signInErrors: null,
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
        this.updateUser(await api.post('users/accounts/', props))
        this.clearRegisterErrors()
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
      try {
        this.updateUser(await api.post('users/token/', props))
        this.clearSignInErrors()
      } catch (error: unknown) {
        if (!isMandeError(error)) throw error

        if (error.response.status === 400) {
          this.signInErrors = error.body
        }
      }
    },

    clearSignInErrors() {
      this.signInErrors = null
    },

    async signOut() {
      this.updateUser(null)
    },

    async deleteAccount() {
      const userStore = useUserStore()
      if (!this.user) throw new Error('Not signed in')

      const options = {
        headers: { Authorization: `Token ${this.user.token}` },
      }

      await api.delete(`users/accounts/${this.user.id}/`, options)
      await userStore.fetchUser(this.user.id)

      this.updateUser(null)
    },
  },
  getters: {
    isSignedIn: (state: State) => !!state.user,
  },
})
