import { defineStore } from 'pinia'
import type { Thread, ReactionType, Reply } from '@/api'

export type CreateReplyParams = {
  postId: number
  body: string
}

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

    let response: any
    try {
      response = await useFetch<Reply>(
        `http://localhost:8000/api/threads/posts/${params.postId}/replies/`,
        {
          method: 'POST',
          body: params,
          ...authOptions(authStore.account),
      },
      )
    } catch (error) {
      console.log('saving ' + error)
      ;(window as any).err = error
    }
    console.log('still here')
    const reply = response.data.value

    console.log('saving res')
    ;(window as any).res = response

    console.log('maybe saving reply')
    if (reply !== null) saveReply(params.postId, reply)

    console.log('returning response')
      return response
  }

  return {
    postList,
    getPostList,
    findPost,
    getPost,
    togglePostReaction,
    createReply
  }
})
