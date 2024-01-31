import { defineStore } from 'pinia'
import type { Thread, ReactionType, Reply } from '@/api'
import type { AsyncResponse } from '#imports'

export type CreateReplyParams = {
  postId: number
  body: string
}

export type UpdateReplyParams = CreateReplyParams & { id: number }

export const useThreadsStore = defineStore('threads', () => {
  const postList = ref<Thread[]>([])

  const getPostList = async (): Promise<void> => {
    const { data } = await useFetch<Thread[]>(
      apiUrl('threads/posts/'),
    )

    postList.value = data.value ?? []
  }

  const getPost = async (id: number): Promise<void> => {
    const { data } = await useFetch<Thread>(apiUrl(`threads/posts/${id}/`))
    if (data.value) postList.value.push(data.value)
  }

  const findPost = (id: number): Thread | null => {
    return postList.value.find(x => x.id === id) || null
  }

  const togglePostReaction = (post: Thread, type: ReactionType) => {
    // TODO
  }

  /// Replies

  /** A map of reply ID's to objects */
  const allReplies = ref<Record<number, Reply>>({})

  /** A map of post ID's to arrays of reply ID's for that post */
  const repliesByPost = ref<Record<number, number[]>>({})

  const saveReply = (postId: number, reply: Reply) => {
    allReplies.value[reply.id] = reply

    if (!(postId in repliesByPost.value)) repliesByPost.value[postId] = []
    const replies = repliesByPost.value[postId]
    if (!replies.includes(reply.id)) replies.push(reply.id)
  }

  const createReply = async (params: CreateReplyParams): Promise<AsyncResponse<Reply>> => {
    const authStore = useAuthStore()

    const response = await useFetch<Reply>(
        apiUrl(`threads/posts/${params.postId}/replies/`),
        {
          method: 'POST',
          body: params,
          ...authOptions(authStore.account),
      },
      )

    const reply = response.data.value
    if (reply !== null) saveReply(params.postId, reply)
      return response
  }

  const updateReply = async (params: UpdateReplyParams): Promise<AsyncResponse<Reply>> => {
    const authStore = useAuthStore()
    const update = { body: params.body }

    return await useFetch(apiUrl(`threads/posts/${params.postId}/replies/${params.id}/`), {
      method: 'PUT',
      body: update,
      ...authOptions(authStore.account),
    })
  }

  const deleteReply = async (reply: Reply): Promise<AsyncResponse<never>> => {
    const authStore = useAuthStore()

    return await useFetch(apiUrl(`threads/posts/${reply.post}/replies/${reply.id}/`), {
      method: 'DELETE',
      ...authOptions(authStore.account),
    })
  }

  const getReplies = async (postId: number): Promise<AsyncResponse<Reply[]>> => {
    const response = await useFetch<Reply[]>(apiUrl(`threads/posts/${postId}/replies`))
    response.data.value?.forEach((reply) => saveReply(postId, reply))
    return response
  }

  const findReply = (id: number) => allReplies.value[id] ?? null

  const findRepliesByPost = (postId: number): Reply[] => {
    const replyIds = repliesByPost.value[postId]
    return (replyIds || []).map(id => allReplies.value[id])
  }

  return {
    postList,
    getPostList,
    findPost,
    getPost,
    togglePostReaction,
    getReplies,
    createReply,
    updateReply,
    deleteReply,
    findReply,
    findRepliesByPost,
  }
})
