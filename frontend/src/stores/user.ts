import { defineStore } from 'pinia'
import { mande } from 'mande'

const api = mande(import.meta.env.VITE_API_HOST)

export type User = {
  id: number
  username: string
}

type State = {
  users: Record<number, User>
  /** A map of user ID's to booleans indicating whether they're loading */
  loading: Record<number, boolean>
}

export const useUserStore = defineStore('user', {
  state: (): State => ({
    users: {},
    loading: {},
  }),
  actions: {
    async fetchUser(id: number): Promise<void> {
      if (this.loading[id]) return

      this.loading[id] = true
      const user: User = await api.get(`users/accounts/${id}`)
      this.loading[id] = false

      this.users[user.id] = user
    },
  },
  getters: {
    user: (state: State) => (id: number) => state.users[id],
    isLoading: (state: State) => (id: number) => state.loading[id],
  },
})
