import { mande } from 'mande'
import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useAuthOptions, useAuthStore } from './auth'
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

export type ThreadFilters = {
  authors: number[]
  tags: string[]
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

export const useThreadStore = defineStore('thread', () => {
  /** A map of post ID's to objects */
  const allThreads = ref<Record<number, Thread>>({})

  /** The filters to apply when getting the list of threads */
  const threadFilters = ref<ThreadFilters | null>(null)

  /** A map of reply ID's to objects */
  const allReplies = ref<Record<number, Reply>>({})

  /** A map of post ID's to arrays of reply ID's for that post */
  const repliesByPost = ref<Record<number, number[]>>({})

  /** The errors returned from the last submitted post, or `null` if none */
  const postErrors = ref<Errors | null>(null)

  /** The errors returned from the last submitted reply, or `null` if none */
  const replyErrors = ref<Errors | null>(null)

  /** A map of post ID's to booleans indicating whether they're loading */
  const loading = ref<Record<number, boolean>>({})

  /** Whether the list of threads is being fetched */
  const loadingThreadList = ref(false)

  const authStore = useAuthStore()
  const { user } = storeToRefs(authStore)

  const post = async (params: PostParams): Promise<Thread | undefined> => {
    try {
      const thread: Thread = await api.post(
        'threads/posts/',
        params,
        useAuthOptions(),
      )

      allThreads.value[thread.id] = thread

      postErrors.value = null

      return thread
    } catch (error: unknown) {
      if (!isMandeError(error)) throw error

      if (error.response.status === 400) postErrors.value = error.body
    }
  }

  const reply = async (params: ReplyParams): Promise<void> => {
    try {
      const reply: Reply = await api.post(
        `threads/posts/${params.postId}/replies/`,
        {
          body: params.body,
        },
        useAuthOptions(),
      )

      replyErrors.value = null
      saveReply(params.postId, reply)
    } catch (error: unknown) {
      if (!isMandeError(error)) throw error

      if (error.response.status === 400) replyErrors.value = error.body
    }
  }

  const saveReply = (postId: number, reply: Reply): void => {
    allReplies.value[reply.id] = reply

    if (!repliesByPost.value[postId]) {
      repliesByPost.value[postId] = [reply.id]
    } else {
      repliesByPost.value[postId].push(reply.id)
    }
  }

  const fetchThread = async (id: number): Promise<void> => {
    if (loading.value[id]) return

    loading.value[id] = true
    const thread: Thread = await api.get(`threads/posts/${id}/`)
    loading.value[id] = false

    allThreads.value[id] = thread
  }

  const fetchReplies = async (postId: number): Promise<void> => {
    const replies: Reply[] = await api.get(`threads/posts/${postId}/replies`)

    replies.forEach((reply) => saveReply(postId, reply))
  }

  const fetchThreadList = async (): Promise<void> => {
    if (threadFilters.value === null) await fetchThreadFilters()

    let query: string
    if (!threadFilters.value) {
      query = ''
    } else {
      const queryBindings = [
        ...threadFilters.value.authors.map(
          (a) => `author=${encodeURIComponent(a)}`,
        ),
        ...threadFilters.value.tags.map((t) => `tag=${encodeURIComponent(t)}`),
      ]
      if (queryBindings.length === 0) query = ''
      else query = '?' + queryBindings.join('&')
    }

    loadingThreadList.value = true
    const threads: Thread[] = await api.get(`threads/posts/${query}`)
    loadingThreadList.value = false

    threads.forEach((thread) => (allThreads.value[thread.id] = thread))
  }

  const fetchThreadFilters = async (): Promise<void> => {
    threadFilters.value = await api.get(
      'threads/filters/',
      useAuthOptions({ notSignedInOkay: true }),
    )
  }

  const toggleThreadReaction = async (
    { id, user_reaction_type }: Thread,
    type: ReactionType,
  ) => {
    if (user.value === null) throw new Error('Not signed in')
    const userId = user.value.id

    const options = useAuthOptions()
    const thread = allThreads.value[id]

    if (user_reaction_type && user_reaction_type === type) {
      await api.delete(`threads/posts/${id}/reactions/${type}`, options)
      thread.user_reaction_type = null
      thread.reactions = thread.reactions.filter((r) => r.user !== userId)
    } else {
      await api.post(`threads/posts/${id}/reactions/`, { type }, options)
      thread.user_reaction_type = type

      if (user_reaction_type) {
        const reaction = thread.reactions.find((r) => r.user === userId)
        if (!reaction) throw new Error('Reaction not found')
        reaction.type = type
      } else {
        thread.reactions.push({ user: userId, content: id, type })
      }
    }
  }

  const thread = (id: number): Thread | undefined => allThreads.value[id]

  const threads = computed(() => {
    return Object.values(allThreads.value).sort(
      (x, y) => +new Date(y.date_posted) - +new Date(x.date_posted),
    )
  })

  const replies = (postId: number) => {
    const ids = repliesByPost.value[postId] || []

    return ids.map((id) => allReplies.value[id])
  }

  return {
    allThreads,
    threadFilters,
    allReplies,
    repliesByPost,

    // Getters
    thread,
    threads,
    replies,

    // Fetching
    fetchThread,
    fetchThreadList,
    fetchReplies,
    fetchThreadFilters,
    loading,
    loadingThreadList,

    // Post
    post,
    postErrors,

    // Reply
    reply,
    replyErrors,

    // Toggle Reaction
    toggleThreadReaction,
  }
})
