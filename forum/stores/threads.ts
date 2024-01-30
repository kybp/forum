import { defineStore } from 'pinia'
import type { Thread, Reply } from '@/api'

export const useThreadsStore = defineStore('threads', () => {
  const postList = ref<Thread[]>([])

  const getPostList = async (): Promise<void> => {
    const { data } = await useFetch<Thread[]>(
      'http://localhost:8000/api/threads/posts/',
    )

    postList.value = data.value ?? []
  }

  const getPost = async (id: number): Promise<void> => {
    const { data } = await useFetch<Thread>(`http://localhost:8000/api/threads/posts/${id}/`)
    if (data.value) postList.value.push(data.value)
  }

  const findPost = (id: number): Thread | null => {
    return postList.value.find(x => x.id === id) || null
  }

  /// Replies

  /** A map of reply ID's to objects */
  const allReplies = ref<Record<number, Reply>>({})

  /** A map of post ID's to arrays of reply ID's for that post */
  const repliesByPost = ref<Record<number, number[]>>({})

  const saveReply = (postId: number, reply: Reply) => {
    allReplies.value[reply.id] = reply

    const replies = repliesByPost.value[postId]
    if (!replies.includes(reply.id)) replies.push(reply.id)
  }

  const createReply = async (params: any): Promise<Reply | void> => {
      const response = await useFetch<Reply>(
        `http://localhost:8000/api/threads/posts/${params.postId}/replies/`,
        {
          body: params.body,
        },
      )
    const reply = response.data.value

    if (reply === null) return

    saveReply(params.postId, reply)

      return reply
  }

  return {
    postList,
    getPostList,
    findPost,
    getPost,
    createReply
  }
})
