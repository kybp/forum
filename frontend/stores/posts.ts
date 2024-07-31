import { defineStore } from 'pinia'
import type { Thread, ReactionType, Reply } from '~/types'

export type CreatePostParams = {
  title: string
  body: string
  tags: string[]
}

export type UpdatePostParams = CreatePostParams & { id: number }

export type CreateReplyParams = {
  postId: number
  body: string
}

export type UpdateReplyParams = CreateReplyParams & { id: number }

export const usePostsStore = defineStore('posts', () => {
  const allPosts = ref<Thread[]>([])

  const postList = computed(() => {
    return Object.values(allPosts.value)
      .filter((x) => !x.is_deleted)
      .sort((x, y) => +new Date(y.date_posted) - +new Date(x.date_posted))
  })

  /**
   * Get a list of all posts from the backend and save it in the
   * store.
   */
  const getPostList = async (): Promise<void> => {
    const { data } = await useFetch<Thread[]>('/api/threads/posts/')
    allPosts.value = data.value ?? []
  }

  /**
   * Get a single post from the backend by ID and save it in the
   * store.
   */
  const getPost = async (id: number): Promise<void> => {
    const { data } = await useFetch<Thread>(`/api/threads/posts/${id}/`)
    if (data.value) allPosts.value.push(data.value)
  }

  /**
   * Look up and return a previously-fetched thread by ID.
   */
  const findPost = (id: number): Thread | null => {
    return allPosts.value.find((x) => x.id === id) || null
  }

  const createPost = async (
    params: CreatePostParams,
  ): Promise<AsyncResponse<Thread>> => {
    const authStore = useAuthStore()

    const response = await useFetch<Thread>('/api/threads/posts/', {
      method: 'POST',
      body: { params, account: authStore.account },
    })

    const post = response.data.value
    if (post !== null) allPosts.value.unshift(post)
    return response
  }

  const updatePost = async (
    params: UpdatePostParams,
  ): Promise<AsyncResponse<Thread>> => {
    const authStore = useAuthStore()

    const response = await useFetch<Thread>(
      `/api/threads/posts/${params.id}/`,
      {
        method: 'PUT',
        body: { params, account: authStore.account },
      },
    )

    const post = response.data.value
    if (post !== null) {
      for (const storePost of allPosts.value) {
        if (storePost.id === post.id) {
          Object.assign(storePost, post)
        }
      }
    }

    return response
  }

  const togglePostReaction = async (
    { id, user_reaction_type }: Thread,
    type: ReactionType,
  ) => {
    const { account } = useAuthStore()

    if (account === null) throw new Error('Not signed in')
    const userId = account.id

    const post = allPosts.value.find(x => x.id === id)

    if (post === undefined) {
      throw new Error('Toggling reaction on invalid post')
    }

    if (user_reaction_type && user_reaction_type === type) {
      await useFetch(`/api/threads/posts/${id}/reactions/${type}`, {
        method: 'DELETE',
        body: { account },
      })
      post.user_reaction_type = null
      post.reactions = post.reactions.filter((r) => r.user !== userId)
    } else {
      await useFetch<null>(`/api/threads/posts/${id}/reactions/`, {
        method: 'POST',
        body: { params: { type }, account },
      })
      post.user_reaction_type = type

      if (user_reaction_type) {
        const reaction = post.reactions.find((r) => r.user === userId)
        if (!reaction) throw new Error('Reaction not found')
        reaction.type = type
      } else {
        post.reactions.push({ user: userId, content: id, type })
      }
    }
  }

  /// Replies

  /** A map of reply ID's to objects */
  const allReplies = ref<Record<number, Reply>>({})

  /** A map of post ID's to arrays of reply ID's for that post */
  const repliesByPost = ref<Record<number, number[]>>({})

  const saveReply = (reply: Reply) => {
    allReplies.value[reply.id] = reply

    const postId = reply.post
    if (!(postId in repliesByPost.value)) repliesByPost.value[postId] = []
    const replies = repliesByPost.value[postId]
    if (!replies.includes(reply.id)) replies.push(reply.id)
  }

  const createReply = async (
    params: CreateReplyParams,
  ): Promise<AsyncResponse<Reply>> => {
    const authStore = useAuthStore()

    const response = await useFetch<Reply>(
      `/api/threads/posts/${params.postId}/replies/`,
      {
        method: 'POST',
        body: { params, account: authStore.account },
      },
    )

    const reply = response.data.value
    if (reply !== null) saveReply(reply)
    return response
  }

  const updateReply = async (
    params: UpdateReplyParams,
  ): Promise<AsyncResponse<Reply>> => {
    const authStore = useAuthStore()
    const update = { body: params.body }

    const response = await useFetch<Reply>(
      `/api/threads/posts/${params.postId}/replies/${params.id}/`,
      {
        method: 'PUT',
        body: { params: update, account: authStore.account },
        ...authOptions(authStore.account),
      },
    )

    const reply = response.data.value
    if (reply) {
      allReplies.value[params.id] = reply
      saveReply(reply)
    }

    return response
  }

  const deleteReply = async (reply: Reply): Promise<AsyncResponse<void>> => {
    const authStore = useAuthStore()

    const response = await useFetch(
      `/api/threads/posts/${reply.post}/replies/${reply.id}/`,
      {
        method: 'DELETE',
        body: { account: authStore.account },
      },
    )

    delete allReplies.value[reply.id]
    repliesByPost.value[reply.post] = repliesByPost.value[reply.post].filter(
      (x) => x !== reply.id,
    )

    return response
  }

  const getReplies = async (
    postId: number,
  ): Promise<AsyncResponse<Reply[]>> => {
    const response = await useFetch<Reply[]>(
      `/api/threads/posts/${postId}/replies`,
    )
    response.data.value?.forEach((reply) => saveReply(reply))
    return response
  }

  const findReply = (id: number) => allReplies.value[id] ?? null

  const findRepliesByPost = (postId: number): Reply[] => {
    const replyIds = repliesByPost.value[postId]
    return (replyIds || []).map((id) => allReplies.value[id])
  }

  return {
    // Posts
    allPosts,
    postList,
    getPostList,
    findPost,
    getPost,
    createPost,
    updatePost,
    togglePostReaction,

    // Replies
    getReplies,
    createReply,
    updateReply,
    deleteReply,
    findReply,
    findRepliesByPost,
  }
})

export type PostsStore = ReturnType<typeof usePostsStore>
