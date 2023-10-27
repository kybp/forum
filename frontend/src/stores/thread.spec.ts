import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useThreadStore } from '@/stores/thread'
import type { PostParams, Reply, ReplyParams, Thread } from '@/stores/thread'
import { useAuthStore } from './auth'
import type { User } from './auth'
import { userFactory } from './auth.factories'
import {
  postParamsFactory,
  reactionFactory,
  replyFactory,
  replyParamsFactory,
  threadFactory,
} from './thread.factories'
import { makeId } from '@/test-utils'

const api = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  delete: vi.fn(),
}))

vi.mock('mande', () => ({
  mande: () => api,
}))

const token = 'x123'

let user: User

describe('thread store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const authStore = useAuthStore()
    user = userFactory({ token })
    authStore.user = user
  })

  describe('initially', () => {
    it('has no threads', () => {
      expect(useThreadStore().allThreads).toEqual({})
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
    let threadStore: ReturnType<typeof useThreadStore>
    let params: PostParams

    beforeEach(() => {
      threadStore = useThreadStore()
      params = postParamsFactory()
    })

    describe('when the request succeeds', () => {
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
        const createdThread = threadFactory()
        api.post.mockResolvedValueOnce(createdThread)

        await threadStore.post(params)

        const threadInStore = threadStore.thread(createdThread.id)
        expect(threadInStore.id).toEqual(createdThread.id)
        expect(threadInStore.title).toEqual(createdThread.title)
      })

      it('clears postErrors', async () => {
        threadStore.postErrors = { title: ['title error'] }
        await threadStore.post(params)
        expect(threadStore.postErrors).toBe(null)
      })
    })

    describe('when the request fails', () => {
      let error: any

      beforeEach(() => {
        error = { response: { status: 400 }, body: { body: ['error'] } }
        api.post.mockRejectedValue(error)
      })

      it('saves the returned errors in the store', async () => {
        await threadStore.post(params)
      })
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

        const path = `threads/posts/${params.postId}/replies/`
        const postParams: any = { ...params }
        delete postParams.postId
        expect(api.post).toHaveBeenCalledWith(path, postParams, {
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

  describe('toggleThreadReaction', () => {
    let threadStore: ReturnType<typeof useThreadStore>
    let thread: Thread

    describe('when the user has reacted this way to the thread before', () => {
      beforeEach(() => {
        threadStore = useThreadStore()
        const threadId = makeId()
        thread = threadFactory({
          id: threadId,
          user_reaction_type: 'like',
          reactions: [reactionFactory({ user: user.id, content: threadId })],
        })
        threadStore.allThreads = { [thread.id]: thread }
      })

      it('calls the delete endpoint', async () => {
        const reactionType = thread.user_reaction_type!

        await threadStore.toggleThreadReaction(thread, reactionType)

        expect(api.delete).toHaveBeenCalledWith(
          `threads/posts/${thread.id}/reactions/${reactionType}`,
          {
            headers: { Authorization: `Token ${token}` },
          },
        )
      })

      it('unsets user_reaction_type for the thread', async () => {
        await threadStore.toggleThreadReaction(
          thread,
          thread.user_reaction_type!,
        )

        expect(threadStore.thread(thread.id).user_reaction_type).toBeNull()
      })

      it('removes the reaction from the thread.reactions', async () => {
        await threadStore.toggleThreadReaction(
          thread,
          thread.user_reaction_type!,
        )

        expect(threadStore.thread(thread.id).reactions).toEqual([])
      })
    })

    describe('when the user has reacted differently to the thread before', () => {
      const reactionType = 'laugh'

      beforeEach(() => {
        threadStore = useThreadStore()
        const threadId = makeId()
        thread = threadFactory({
          id: threadId,
          user_reaction_type: 'like',
          reactions: [reactionFactory({ user: user.id, content: threadId })],
        })
        threadStore.allThreads = { [thread.id]: thread }
      })

      it('calls the create endpoint', async () => {
        await threadStore.toggleThreadReaction(thread, reactionType)

        expect(api.post).toHaveBeenCalledWith(
          `threads/posts/${thread.id}/reactions/`,
          { type: reactionType },
          { headers: { Authorization: `Token ${token}` } },
        )
      })

      it('sets user_reaction_type for the thread', async () => {
        await threadStore.toggleThreadReaction(thread, reactionType)

        expect(threadStore.thread(thread.id).user_reaction_type).toEqual(
          reactionType,
        )
      })

      it('updates the reaction in thread.reactions', async () => {
        await threadStore.toggleThreadReaction(thread, reactionType)

        expect(threadStore.thread(thread.id).reactions).toEqual([
          { user: user.id, type: reactionType, content: thread.id },
        ])
      })
    })

    describe('when the user has not reacted to the thread before', () => {
      beforeEach(() => {
        threadStore = useThreadStore()
        thread = threadFactory({ user_reaction_type: null, reactions: [] })
        threadStore.allThreads = { [thread.id]: thread }
      })

      it('calls the create endpoint', async () => {
        const reactionType = 'like'

        await threadStore.toggleThreadReaction(thread, reactionType)

        expect(api.post).toHaveBeenCalledWith(
          `threads/posts/${thread.id}/reactions/`,
          { type: reactionType },
          { headers: { Authorization: `Token ${token}` } },
        )
      })

      it('sets user_reaction_type for the thread', async () => {
        const reactionType = 'like'

        await threadStore.toggleThreadReaction(thread, reactionType)

        expect(threadStore.thread(thread.id).user_reaction_type).toEqual(
          reactionType,
        )
      })

      it('adds the reaction to thread.reactions', async () => {
        const reactionType = 'like'

        await threadStore.toggleThreadReaction(thread, reactionType)

        expect(threadStore.thread(thread.id).reactions).toEqual([
          { user: user.id, type: reactionType, content: thread.id },
        ])
      })
    })
  })

  describe('threads', () => {
    it('is sorted by date posted, descending', () => {
      const earliest = threadFactory({
        date_posted: new Date('2020-10-01').toISOString(),
      })
      const middle = threadFactory({
        date_posted: new Date('2021-10-01').toISOString(),
      })
      const latest = threadFactory({
        date_posted: new Date('2022-10-01').toISOString(),
      })

      const threadStore = useThreadStore()
      threadStore.allThreads = {
        [middle.id]: middle,
        [earliest.id]: earliest,
        [latest.id]: latest,
      }

      expect(threadStore.threads).toEqual([latest, middle, earliest])
    })
  })
})
