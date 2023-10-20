import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useThreadStore } from '@/stores/thread'
import { useAuthStore } from './auth'
import { userFactory } from './auth.factories'
import { threadFactory } from './thread.factories'

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
