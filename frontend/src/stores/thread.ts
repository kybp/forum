import { defineStore } from 'pinia'
import { mande } from 'mande'
import { useAuthStore } from './auth'

const api = mande(import.meta.env.VITE_API_HOST)

export type Thread = {
  id: number
  author_id: number
  title: string
  body: string
  date_posted: string
  replies: number[]
}

export type Reply = {
  id: number
  post: number
  author: number
  body: string
  date_posted: string
}

type PostThreadParams = {
  title: string
  body: string
}

type ReplyParams = {
  postId: number
  body: string
}

type State = {
  /** A map of post ID's to objects */
  threads: Record<number, Thread>
  /** A map of reply ID's to objects */
  allReplies: Record<number, Reply>
  /** A map of post ID's to arrays of reply ID's for that post */
  repliesByPost: Record<number, number[]>
  /** A map of post ID's to booleans indicating whether they're loading */
  loading: Record<number, boolean>
  /** Whether the list of threads is being fetched */
  loadingThreadList: boolean
}

export const useThreadStore = defineStore('thread', {
  state: (): State => ({
    threads: {},
    allReplies: {},
    repliesByPost: {},
    loading: {},
    loadingThreadList: false,
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
    async reply(params: ReplyParams): Promise<void> {
      const { user } = useAuthStore()
      if (!user) throw new Error('Not signed in')

      const reply: Reply = await api.post(
        'threads/replies/',
        {
          post: params.postId,
          body: params.body,
        },
        {
          headers: { Authorization: `Token ${user.token}` },
        },
      )

      this.saveReply(params.postId, reply)
    },
    saveReply(postId: number, reply: Reply): void {
      this.allReplies[reply.id] = reply

      if (!this.repliesByPost[postId]) {
        this.repliesByPost[postId] = [reply.id]
      } else {
        this.repliesByPost[postId].push(reply.id)
      }
    },
    async fetchThread(id: number): Promise<void> {
      if (this.loading[id]) return

      this.loading[id] = true
      const thread: Thread = await api.get(`threads/posts/${id}/`)
      this.loading[id] = false

      this.threads[id] = thread
    },
    async fetchReplies(postId: number): Promise<void> {
      const replies: Reply[] = await api.get(`threads/posts/${postId}/replies`)

      replies.forEach((reply) => this.saveReply(postId, reply))
    },
    async fetchThreadList(): Promise<void> {
      this.loadingThreadList = true
      const threads: Thread[] = await api.get('threads/posts/')
      this.loadingThreadList = false

      threads.forEach((thread) => (this.threads[thread.id] = thread))
    },
  },
  getters: {
    thread: (state: State) => (id: number) => state.threads[id],
    replies: (state: State) => (postId: number) => {
      const ids = state.repliesByPost[postId] || []

      return ids.map((id) => state.allReplies[id])
    },
  },
})
