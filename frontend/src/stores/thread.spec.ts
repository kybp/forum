import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useThreadStore } from '@/stores/thread'
import type { Reply, ReplyParams } from '@/stores/thread'
import { useAuthStore } from './auth'
import { userFactory } from './auth.factories'
import {
  replyFactory,
  replyParamsFactory,
  threadFactory,
} from './thread.factories'

const api = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}))

vi.mock('mande', () => ({
  mande: () => api,
}))

const token = 'x123'

describe('thread store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const authStore = useAuthStore()
    authStore.user = userFactory({ token })
  })

  describe('initially', () => {
    it('has no threads', () => {
      expect(useThreadStore().threads).toEqual({})
    })

    it('is not loading any individual threads', () => {
      expect(useThreadStore().loading).toEqual({})
    })

    it('is not loading the list of threads', () => {
      expect(useThreadStore().loadingThreadList).toBe(false)
    })

    it('has no reply errors', () => {
      expect(useThreadStore().replyErrors).toBe(null)
    })
  })

  describe('post', () => {
    const params = { title: 'a title', body: 'a body' }

    beforeEach(() => {
      api.post.mockResolvedValue(threadFactory())
    })

    it('posts to the new thread endpoint', async () => {
      const threadStore = useThreadStore()

      await threadStore.post(params)

      expect(api.post).toHaveBeenCalledWith('threads/posts/', params, {
        headers: { Authorization: `Token ${token}` },
      })
    })

    it('saves the returned thread in the store', async () => {
      const threadStore = useThreadStore()
      const createdThread = threadFactory()
      api.post.mockResolvedValueOnce(createdThread)

      await threadStore.post(params)

      const threadInStore = threadStore.thread(createdThread.id)
      expect(threadInStore.id).toEqual(createdThread.id)
      expect(threadInStore.title).toEqual(createdThread.title)
    })
  })

  describe('reply', () => {
    let threadStore: ReturnType<typeof useThreadStore>
    let params: ReplyParams

    beforeEach(() => {
      threadStore = useThreadStore()
      params = replyParamsFactory()
    })

    describe('when the request succeeds', () => {
      let reply: Reply

      beforeEach(() => {
        reply = replyFactory({ post: params.postId })
        api.post.mockResolvedValue(reply)
      })

      it('posts to the new reply endpoint', async () => {
        await threadStore.reply(params)

        const postParams: any = { ...params, post: params.postId }
        delete postParams.postId
        expect(api.post).toHaveBeenCalledWith('threads/replies/', postParams, {
          headers: { Authorization: `Token ${token}` },
        })
      })

      it('saves the reply in the store', async () => {
        await threadStore.reply(params)

        expect(threadStore.allReplies).toEqual({ [reply.id]: reply })
        expect(threadStore.repliesByPost).toEqual({ [reply.post]: [reply.id] })
        expect(threadStore.replies(reply.post)).toEqual([reply])
      })

      it('clears replyErrors', async () => {
        threadStore.replyErrors = { body: ['an error'] }
        await threadStore.reply(params)
        expect(threadStore.replyErrors).toBe(null)
      })
    })

    describe('when the request fails', () => {
      let error: any

      beforeEach(() => {
        error = {
          response: { status: 400 },
          body: { username: ['some error'] },
        }

        api.post.mockRejectedValue(error)
      })

      it('saves the returned errors in the store', async () => {
        await threadStore.reply(params)
        expect(threadStore.replyErrors).toEqual(error.body)
      })

      it('does not save a reply in the store', async () => {
        await threadStore.reply(params)
        expect(threadStore.allReplies).toEqual({})
      })
    })
  })

  describe('fetchThread', () => {
    it('makes a GET request to the endpoint', async () => {
      const threadStore = useThreadStore()
      const id = 12

      await threadStore.fetchThread(id)

      expect(api.get).toHaveBeenCalledWith(`threads/posts/${id}/`)
    })

    it('saves the fetched thread', async () => {
      const threadStore = useThreadStore()
      const fetchedThread = threadFactory()
      api.get.mockResolvedValueOnce(fetchedThread)

      await threadStore.fetchThread(fetchedThread.id)

      expect(threadStore.thread(fetchedThread.id)).toEqual(fetchedThread)
    })
  })

  describe('fetchThreadList', () => {
    beforeEach(() => {
      api.get.mockResolvedValue([])
    })

    it('makes a GET request to the endpoint', async () => {
      const threadStore = useThreadStore()

      await threadStore.fetchThreadList()

      expect(api.get).toHaveBeenCalledWith('threads/posts/')
    })

    it('saves all the returned threads', async () => {
      const threadStore = useThreadStore()
      const threads = [threadFactory(), threadFactory()]
      api.get.mockResolvedValueOnce(threads)

      await threadStore.fetchThreadList()

      threads.forEach((t) => expect(threadStore.thread(t.id)).toEqual(t))
    })
  })
})
