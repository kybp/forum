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

  describe('post', () => {
    const params = { title: 'a title', body: 'a body' }

    beforeEach(() => {
      api.post.mockResolvedValue(threadFactory())
    })

    it('posts to the new thread endpoint', async () => {
      const thread = useThreadStore()

      await thread.post(params)

      expect(api.post).toHaveBeenCalledWith('threads/posts/', params, {
        headers: { Authorization: `Token ${token}` },
      })
    })

    it('saves the returned thread in the store', async () => {
      const thread = useThreadStore()
      const createdThread = threadFactory()
      api.post.mockResolvedValueOnce(createdThread)

      await thread.post(params)

      const threadInStore = thread.thread(createdThread.id)
      expect(threadInStore.id).toEqual(createdThread.id)
      expect(threadInStore.title).toEqual(createdThread.title)
    })
  })

  describe('fetchThread', () => {
    beforeEach(() => {
      api.post.mockResolvedValue(threadFactory())
    })

    it('makes a GET request to the endpoint', async () => {
      const thread = useThreadStore()
      const id = 12

      await thread.fetchThread(id)

      expect(api.get).toHaveBeenCalledWith(`threads/posts/${id}`)
    })

    it('saves the fetched thread', async () => {
      const thread = useThreadStore()
      const fetchedThread = threadFactory()
      api.get.mockResolvedValueOnce(fetchedThread)

      await thread.fetchThread(fetchedThread.id)

      expect(thread.thread(fetchedThread.id)).toEqual(fetchedThread)
    })
  })
})
