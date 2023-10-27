import { defineStore } from 'pinia'
import { mande } from 'mande'
import { useAuthStore } from './auth'
import { isMandeError, type Errors } from './utils'

const api = mande(import.meta.env.VITE_API_HOST)

export const reactionTypes = ['like', 'laugh', 'confused'] as const

export type ReactionType = (typeof reactionTypes)[number]

export type Reaction = {
  user: number
  content: number
  type: ReactionType
}

export type Thread = {
  id: number
  author: number
  title: string
  body: string
  date_posted: string
  replies: number[]
  reactions: Reaction[]
  user_reaction_type: ReactionType | null
  tags: string[]
}

export type Reply = {
  id: number
  post: number
  author: number
  body: string
  date_posted: string
}

export type PostParams = {
  title: string
  body: string
  tags: string[]
}

export type ReplyParams = {
  postId: number
  body: string
}

type State = {
  /** A map of post ID's to objects */
  allThreads: Record<number, Thread>
  /** The errors returned from the last submitted post, or `null` if none */
  postErrors: Errors | null
  /** A map of reply ID's to objects */
  allReplies: Record<number, Reply>
  /** A map of post ID's to arrays of reply ID's for that post */
  repliesByPost: Record<number, number[]>
  /** The errors returned from the last submitted reply, or `null` if none */
  replyErrors: Errors | null
  /** A map of post ID's to booleans indicating whether they're loading */
  loading: Record<number, boolean>
  /** Whether the list of threads is being fetched */
  loadingThreadList: boolean
}

export const useThreadStore = defineStore('thread', {
  state: (): State => ({
    allThreads: {},
    allReplies: {},
    repliesByPost: {},
    postErrors: null,
    replyErrors: null,
    loading: {},
    loadingThreadList: false,
  }),
  actions: {
    async post(params: PostParams): Promise<Thread | undefined> {
      const { user } = useAuthStore()
      if (!user) throw new Error('Not signed in')

      try {
        const thread: Thread = await api.post('threads/posts/', params, {
          headers: { Authorization: `Token ${user.token}` },
        })

        this.allThreads[thread.id] = thread

        this.postErrors = null

        return thread
      } catch (error: unknown) {
        if (!isMandeError(error)) throw error

        if (error.response.status === 400) this.postErrors = error.body
      }
    },
    async reply(params: ReplyParams): Promise<void> {
      const { user } = useAuthStore()
      if (!user) throw new Error('Not signed in')

      try {
        const reply: Reply = await api.post(
          `threads/posts/${params.postId}/replies/`,
          {
            body: params.body,
          },
          {
            headers: { Authorization: `Token ${user.token}` },
          },
        )

        this.replyErrors = null
        this.saveReply(params.postId, reply)
      } catch (error: unknown) {
        if (!isMandeError(error)) throw error

        if (error.response.status === 400) this.replyErrors = error.body
      }
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

      this.allThreads[id] = thread
    },
    async fetchReplies(postId: number): Promise<void> {
      const replies: Reply[] = await api.get(`threads/posts/${postId}/replies`)

      replies.forEach((reply) => this.saveReply(postId, reply))
    },
    async fetchThreadList(): Promise<void> {
      this.loadingThreadList = true
      const threads: Thread[] = await api.get('threads/posts/')
      this.loadingThreadList = false

      threads.forEach((thread) => (this.allThreads[thread.id] = thread))
    },
    async toggleThreadReaction(
      { id, user_reaction_type }: Thread,
      type: ReactionType,
    ) {
      const { user } = useAuthStore()
      if (!user) throw new Error('Not signed in')

      const headers = {
        headers: { Authorization: `Token ${user.token}` },
      }

      const thread = this.allThreads[id]

      if (user_reaction_type && user_reaction_type === type) {
        await api.delete(`threads/posts/${id}/reactions/${type}`, headers)
        thread.user_reaction_type = null
        thread.reactions = thread.reactions.filter((r) => r.user !== user.id)
      } else {
        await api.post(`threads/posts/${id}/reactions/`, { type }, headers)
        thread.user_reaction_type = type

        if (user_reaction_type) {
          const reaction = thread.reactions.find((r) => r.user === user.id)
          if (!reaction) throw new Error('Reaction not found')
          reaction.type = type
        } else {
          thread.reactions.push({ user: user.id, content: id, type })
        }
      }
    },
  },
  getters: {
    thread: (state: State) => (id: number) => state.allThreads[id],
    threads: (state: State) => {
      return Object.values(state.allThreads).sort(
        (x, y) => +new Date(y.date_posted) - +new Date(x.date_posted),
      )
    },
    replies: (state: State) => (postId: number) => {
      const ids = state.repliesByPost[postId] || []

      return ids.map((id) => state.allReplies[id])
    },
  },
})
