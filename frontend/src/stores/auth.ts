import { defineStore } from 'pinia'
import { mande } from 'mande'

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
}

export const useAuthStore = defineStore({
  id: 'auth',
  state: (): State => ({
    user: JSON.parse(localStorage.getItem('user') ?? 'null'),
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
      this.updateUser(await api.post('users/', props))
    },

    async signIn(props: SignInProps) {
      this.updateUser(await api.post('users/token/', props))
    },

    async signOut() {
      this.updateUser(null)
    },
  },
})
