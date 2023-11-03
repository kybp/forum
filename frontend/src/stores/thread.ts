import axios, { isAxiosError } from 'axios'
import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useAuthOptions, useAuthStore } from './auth'
import { type Errors } from './utils'

const api = axios.create({ baseURL: import.meta.env.VITE_API_HOST })

export const reactionTypes = ['like', 'laugh', 'confused'] as const

export type ReactionType = (typeof reactionTypes)[number]

export type Reaction = {
  user: number
  content: number
  type: ReactionType
}

export type Thread = {
  id: number
  /** The user who created the thread, or null if they have deleted it. */
  author: number | null
  title: string
  body: string
  date_posted: string
  date_edited: string | null
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
  date_edited: string | null
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

export type UpdatePostParams = PostParams & {
  id: number
}

export type ReplyParams = {
  postId: number
  body: string
}

export type UpdateReplyParams = ReplyParams & { id: number }

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
  const { account } = storeToRefs(authStore)

  const post = async (params: PostParams): Promise<Thread | undefined> => {
    try {
      const response = await api.post(
        'threads/posts/',
        params,
        useAuthOptions(),
      )
      const thread: Thread = response.data

      allThreads.value[thread.id] = thread

      postErrors.value = null

      return thread
    } catch (error: unknown) {
      if (!isAxiosError(error)) throw error

      if (error.response?.status === 400) postErrors.value = error.response.data
    }
  }

  const updatePost = async (
    params: UpdatePostParams,
  ): Promise<Thread | undefined> => {
    try {
      const response = await api.put(
        `threads/posts/${params.id}/`,
        params,
        useAuthOptions(),
      )
      const thread: Thread = response.data

      allThreads.value[thread.id] = thread

      postErrors.value = null

      return thread
    } catch (error: unknown) {
      if (!isAxiosError(error)) throw error

      if (error.response?.status === 400) postErrors.value = error.response.data
    }
  }

  const createReply = async (params: ReplyParams): Promise<Reply | void> => {
    try {
      const response = await api.post(
        `threads/posts/${params.postId}/replies/`,
        {
          body: params.body,
        },
        useAuthOptions(),
      )
      const reply: Reply = response.data

      replyErrors.value = null
      saveReply(params.postId, reply)

      return reply
    } catch (error: unknown) {
      if (!isAxiosError(error)) throw error

      if (error.response?.status === 400) {
        replyErrors.value = error.response.data
      }
    }
  }

  const updateReply = async (
    params: UpdateReplyParams,
  ): Promise<Reply | void> => {
    try {
      const response = await api.put(
        `threads/posts/${params.postId}/replies/${params.id}/`,
        {
          body: params.body,
        },
        useAuthOptions(),
      )
      const reply: Reply = response.data

      replyErrors.value = null
      saveReply(params.postId, reply)

      return reply
    } catch (error: unknown) {
      if (!isAxiosError(error)) throw error

      if (error.response?.status === 400) {
        replyErrors.value = error.response.data
      }
    }
  }

  const saveReply = (postId: number, reply: Reply): void => {
    allReplies.value[reply.id] = reply

    if (!repliesByPost.value[postId]) {
      repliesByPost.value[postId] = [reply.id]
    } else if (!repliesByPost.value[postId].find((id) => id === reply.id)) {
      repliesByPost.value[postId].push(reply.id)
    }
  }

  const fetchThread = async (id: number): Promise<void> => {
    if (loading.value[id]) return

    loading.value[id] = true
    const response = await api.get(`threads/posts/${id}/`)
    const thread: Thread = response.data
    loading.value[id] = false

    allThreads.value[id] = thread
  }

  const fetchReplies = async (postId: number): Promise<void> => {
    const response = await api.get(`threads/posts/${postId}/replies`)
    const replies: Reply[] = response.data

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
    const response = await api.get(`threads/posts/${query}`)
    const threads: Thread[] = response.data
    loadingThreadList.value = false

    threads.forEach((thread) => (allThreads.value[thread.id] = thread))
  }

  const fetchThreadFilters = async (): Promise<void> => {
    const response = await api.get(
      'threads/filters/',
      useAuthOptions({ notSignedInOkay: true }),
    )
    threadFilters.value = response.data
  }

  const toggleThreadReaction = async (
    { id, user_reaction_type }: Thread,
    type: ReactionType,
  ) => {
    if (account.value === null) throw new Error('Not signed in')
    const userId = account.value.id

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

  const deletePost = async ({ id }: Thread) => {
    await api.delete(`threads/posts/${id}/`, useAuthOptions())

    const thread = allThreads.value[id]
    thread.author = null
    thread.body = '[deleted]'
  }

  const deleteReply = async (reply: Reply) => {
    await api.delete(
      `threads/posts/${reply.post}/replies/${reply.id}/`,
      useAuthOptions(),
    )
    const threadReplies = repliesByPost.value[reply.post]
    repliesByPost.value[reply.post] = threadReplies.filter(
      (x) => x !== reply.id,
    )
    delete allReplies.value[reply.id]
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
    updatePost,

    // Reply
    createReply,
    updateReply,
    replyErrors,

    // Misc
    deletePost,
    deleteReply,
    toggleThreadReaction,
  }
})

export type ThreadStore = ReturnType<typeof useThreadStore>
