import { defineStore } from 'pinia'
import { mande } from 'mande'
import { useAuthStore } from './auth'

const api = mande(import.meta.env.VITE_API_HOST)

export type Thread = {
  id: number
  author_id: number
  title: string
  body: string
}

type PostThreadParams = {
  title: string
  body: string
}

type State = {
  threads: Record<number, Thread>
  /** A map of post ID's to booleans indicating whether they're loading */
  loading: Record<number, boolean>
}

export const useThreadStore = defineStore('thread', {
  state: (): State => ({
    threads: {},
    loading: {},
  }),
  actions: {
    async post(params: PostThreadParams): Promise<Thread> {
      const { user } = useAuthStore()
      if (!user) throw new Error('Not signed in')

      const thread: Thread = await api.post('threads/posts/', params, {
        headers: { Authorization: `Token ${user.token}` },
      })

      this.threads[thread.id] = thread

      return thread
    },
    async fetchThread(id: number): Promise<void> {
      if (this.loading[id]) return

      this.loading[id] = true
      const thread: Thread = await api.get(`threads/posts/${id}`)
      this.loading[id] = false

      this.threads[id] = thread
    },
  },
  getters: {
    thread: (state: State) => (id: number) => state.threads[id],
  },
})
