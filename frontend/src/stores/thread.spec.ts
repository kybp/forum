import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { AxiosResponse } from 'axios'
import { useThreadStore } from '@/stores/thread'
import type {
  PostParams,
  Reply,
  ReplyParams,
  Thread,
  ThreadFilters,
  ThreadStore,
  UpdatePostParams,
  UpdateReplyParams,
} from '@/stores/thread'
import { useAuthStore } from './auth'
import type { User } from './auth'
import { userFactory } from './auth.factories'
import {
  postParamsFactory,
  reactionFactory,
  replyFactory,
  replyParamsFactory,
  threadFactory,
  threadFiltersFactory,
  updatePostParamsFactory,
  updateReplyParamsFactory,
} from './thread.factories'
import { makeId } from '@/test-utils'

const api = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}))

vi.mock('axios', () => ({
  default: {
    create: () => api,
  },
  isAxiosError: () => true,
}))

const token = 'x123'

let authStore: ReturnType<typeof useAuthStore>
let authHeaders: any
let user: User

describe('thread store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    authStore = useAuthStore()
    authHeaders = {
      headers: { Authorization: `Token ${token}` },
    }
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
    let threadStore: ThreadStore
    let params: PostParams

    beforeEach(() => {
      threadStore = useThreadStore()
      params = postParamsFactory()
    })

    describe('when the request succeeds', () => {
      beforeEach(() => {
        api.post.mockResolvedValue({ data: threadFactory() })
      })

      it('posts to the new thread endpoint', async () => {
        const threadStore = useThreadStore()

        await threadStore.post(params)

        expect(api.post).toHaveBeenCalledWith(
          'threads/posts/',
          params,
          authHeaders,
        )
      })

      it('saves the returned thread in the store', async () => {
        const createdThread = threadFactory()
        api.post.mockResolvedValueOnce({ data: createdThread })

        await threadStore.post(params)

        const threadInStore = threadStore.thread(createdThread.id)!
        expect(threadInStore.id).toEqual(createdThread.id)
        expect(threadInStore.title).toEqual(createdThread.title)
      })

      it('returns the returned thread', async () => {
        const thread = threadFactory()
        api.post.mockResolvedValueOnce({ data: thread })
        expect(await threadStore.post(params)).toEqual(thread)
      })

      it('clears postErrors', async () => {
        threadStore.postErrors = { title: ['title error'] }
        await threadStore.post(params)
        expect(threadStore.postErrors).toBe(null)
      })
    })

    describe('when the request fails', () => {
      let error: { response: Partial<AxiosResponse> }

      beforeEach(() => {
        error = { response: { status: 400, data: { body: ['error'] } } }
        api.post.mockRejectedValue(error)
      })

      it('saves the returned errors in the store', async () => {
        await threadStore.post(params)
        expect(threadStore.postErrors).toEqual(error.response.data)
      })

      it('returns undefined', async () => {
        expect(await threadStore.post(params)).toBeUndefined()
      })
    })
  })

  describe('updatePost', () => {
    let threadStore: ThreadStore
    let params: UpdatePostParams

    beforeEach(() => {
      threadStore = useThreadStore()
      params = updatePostParamsFactory()
    })

    describe('when the request succeeds', () => {
      beforeEach(() => {
        api.put.mockResolvedValue({ data: threadFactory() })
      })

      it('sends a PUT request to the endpoint', async () => {
        await threadStore.updatePost(params)

        expect(api.put).toHaveBeenCalledWith(
          `threads/posts/${params.id}/`,
          params,
          authHeaders,
        )
      })

      it('saves the returned thread in the store', async () => {
        const thread = threadFactory()
        threadStore.allThreads = { [thread.id]: thread }

        const newTitle = thread.title + ' but different'
        api.put.mockResolvedValueOnce({ data: { ...thread, title: newTitle } })

        await threadStore.updatePost(params)

        const threadInStore = threadStore.thread(thread.id)!
        expect(threadInStore.title).toEqual(newTitle)
      })

      it('returns the returned thread', async () => {
        const thread = threadFactory()
        api.put.mockResolvedValueOnce({ data: thread })

        expect(await threadStore.updatePost(updatePostParamsFactory())).toEqual(
          thread,
        )
      })

      it('clears postErrors', async () => {
        threadStore.postErrors = { title: ['title error'] }
        await threadStore.updatePost(params)
        expect(threadStore.postErrors).toBe(null)
      })
    })

    describe('when the request fails', () => {
      let error: { response: Partial<AxiosResponse> }

      beforeEach(() => {
        error = { response: { status: 400, data: { body: ['error'] } } }
        api.put.mockRejectedValue(error)
      })

      it('saves the returned errors in the store', async () => {
        await threadStore.updatePost(params)
        expect(threadStore.postErrors).toEqual(error.response.data)
      })

      it('returns undefined', async () => {
        expect(
          await threadStore.updatePost(updatePostParamsFactory()),
        ).toBeUndefined()
      })
    })
  })

  describe('createReply', () => {
    let threadStore: ThreadStore
    let params: ReplyParams

    beforeEach(() => {
      threadStore = useThreadStore()
      params = replyParamsFactory()
    })

    describe('when the request succeeds', () => {
      let reply: Reply

      beforeEach(() => {
        reply = replyFactory({ post: params.postId })
        api.post.mockResolvedValue({ data: reply })
      })

      it('posts to the new reply endpoint', async () => {
        await threadStore.createReply(params)

        const path = `threads/posts/${params.postId}/replies/`
        const postParams: any = { ...params }
        delete postParams.postId
        expect(api.post).toHaveBeenCalledWith(path, postParams, authHeaders)
      })

      it('saves the reply in the store', async () => {
        await threadStore.createReply(params)

        expect(threadStore.allReplies).toEqual({ [reply.id]: reply })
        expect(threadStore.repliesByPost).toEqual({ [reply.post]: [reply.id] })
        expect(threadStore.replies(reply.post)).toEqual([reply])
      })

      it('clears replyErrors', async () => {
        threadStore.replyErrors = { body: ['an error'] }
        await threadStore.createReply(params)
        expect(threadStore.replyErrors).toBe(null)
      })

      it('returns the reply', async () => {
        expect(await threadStore.createReply(params)).toEqual(reply)
      })
    })

    describe('when the request fails', () => {
      let error: { response: Partial<AxiosResponse> }

      beforeEach(() => {
        error = {
          response: { status: 400, data: { username: ['some error'] } },
        }

        api.post.mockRejectedValue(error)
      })

      it('saves the returned errors in the store', async () => {
        await threadStore.createReply(params)
        expect(threadStore.replyErrors).toEqual(error.response.data)
      })

      it('does not save a reply in the store', async () => {
        await threadStore.createReply(params)
        expect(threadStore.allReplies).toEqual({})
      })

      it('returns undefined', async () => {
        expect(await threadStore.createReply(params)).toBeUndefined()
      })
    })
  })

  describe('updateReply', () => {
    let threadStore: ThreadStore
    let params: UpdateReplyParams

    beforeEach(() => {
      threadStore = useThreadStore()
      params = updateReplyParamsFactory()
    })

    describe('when the request succeeds', () => {
      beforeEach(() => {
        api.put.mockResolvedValue({ data: replyFactory() })
      })

      it('sends a PUT request to the endpoint', async () => {
        await threadStore.updateReply(params)

        expect(api.put).toHaveBeenCalledWith(
          `threads/posts/${params.postId}/replies/${params.id}/`,
          { body: params.body },
          authHeaders,
        )
      })

      it('saves the returned reply in the store', async () => {
        const reply = replyFactory()
        threadStore.allReplies = { [reply.id]: reply }

        const newBody = reply.body + ' but different'
        api.put.mockResolvedValueOnce({ data: { ...reply, body: newBody } })

        await threadStore.updateReply(params)

        const replyInStore = threadStore.allReplies[reply.id]
        expect(replyInStore.body).toEqual(newBody)
      })

      it('does not change thread replies in the store', async () => {
        const replies = [12, 31, params.id]
        const thread = threadFactory({
          id: params.postId,
          replies: [...replies],
        })
        threadStore.allThreads = { [thread.id]: thread }

        await threadStore.createReply(params)

        expect(threadStore.thread(thread.id)!.replies).toEqual(replies)
      })

      it('returns the returned reply', async () => {
        const reply = replyFactory()
        api.put.mockResolvedValueOnce({ data: reply })

        expect(
          await threadStore.updateReply(updateReplyParamsFactory()),
        ).toEqual(reply)
      })

      it('clears replyErrors', async () => {
        threadStore.replyErrors = { body: ['body error'] }
        await threadStore.updateReply(params)
        expect(threadStore.replyErrors).toBe(null)
      })
    })

    describe('when the request fails', () => {
      let error: { response: Partial<AxiosResponse> }

      beforeEach(() => {
        error = { response: { status: 400, data: { body: ['error'] } } }
        api.put.mockRejectedValue(error)
      })

      it('saves the returned errors in the store', async () => {
        await threadStore.updateReply(params)

        expect(threadStore.replyErrors).toEqual(error.response.data)
      })

      it('returns undefined', async () => {
        expect(
          await threadStore.updateReply(updateReplyParamsFactory()),
        ).toBeUndefined()
      })
    })
  })

  describe('fetchThread', () => {
    beforeEach(() => {
      api.get.mockResolvedValue({ data: threadFactory() })
    })

    it('makes a GET request to the endpoint', async () => {
      const threadStore = useThreadStore()
      const id = 12

      await threadStore.fetchThread(id)

      expect(api.get).toHaveBeenCalledWith(`threads/posts/${id}/`)
    })

    it('saves the fetched thread', async () => {
      const threadStore = useThreadStore()
      const fetchedThread = threadFactory()
      api.get.mockResolvedValueOnce({ data: fetchedThread })

      await threadStore.fetchThread(fetchedThread.id)

      expect(threadStore.thread(fetchedThread.id)).toEqual(fetchedThread)
    })
  })

  describe('fetchThreadList', () => {
    beforeEach(() => {
      api.get.mockResolvedValue({ data: [] })
    })

    it('fetches filters when they are null', async () => {
      const threadStore = useThreadStore()
      threadStore.threadFilters = null
      api.get.mockResolvedValueOnce({ data: threadFiltersFactory() })

      await threadStore.fetchThreadList()

      expect(api.get).toHaveBeenCalledWith('threads/filters/', authHeaders)
    })

    it('makes a GET request to the endpoint', async () => {
      const threadStore = useThreadStore()
      threadStore.threadFilters = threadFiltersFactory()

      await threadStore.fetchThreadList()

      expect(api.get).toHaveBeenCalledWith('threads/posts/')
    })

    it('sends filters as query params present', async () => {
      const threadStore = useThreadStore()
      threadStore.threadFilters = {
        authors: [9, 3],
        tags: ['eleven', 'ten twenty'],
      }

      await threadStore.fetchThreadList()

      const query = '?author=9&author=3&tag=eleven&tag=ten%20twenty'
      expect(api.get).toHaveBeenCalledWith(`threads/posts/${query}`)
    })

    it('saves all the returned threads', async () => {
      const threadStore = useThreadStore()
      threadStore.threadFilters = threadFiltersFactory()
      const threads = [threadFactory(), threadFactory()]
      api.get.mockResolvedValueOnce({ data: threads })

      await threadStore.fetchThreadList()

      threads.forEach((t) => expect(threadStore.thread(t.id)).toEqual(t))
    })
  })

  describe('deletePost', () => {
    let threadStore: ThreadStore
    let thread: Thread

    beforeEach(() => {
      threadStore = useThreadStore()
      thread = threadFactory()
      threadStore.allThreads = { [thread.id]: thread }
    })

    it('calls the delete endpoint', async () => {
      await threadStore.deletePost(thread)

      expect(api.delete).toHaveBeenCalledWith(
        `threads/posts/${thread.id}/`,
        authHeaders,
      )
    })

    it('sets the post content to [deleted] in the store', async () => {
      expect(threadStore.thread(thread.id)).toEqual(thread)

      await threadStore.deletePost(thread)

      const valueInStore = threadStore.thread(thread.id)
      expect(valueInStore?.author).toBe(null)
      expect(valueInStore?.title).toEqual(thread.title)
      expect(valueInStore?.body).toEqual('[deleted]')
    })
  })

  describe('deleteReply', () => {
    let threadStore: ThreadStore
    let reply: Reply

    beforeEach(() => {
      threadStore = useThreadStore()
      reply = replyFactory()
      threadStore.allReplies = { [reply.id]: reply }
      threadStore.repliesByPost = { [reply.post]: [reply.id] }
    })

    it('calls the delete endpoint', async () => {
      await threadStore.deleteReply(reply)

      expect(api.delete).toHaveBeenCalledWith(
        `threads/posts/${reply.post}/replies/${reply.id}/`,
        authHeaders,
      )
    })

    it('removes the reply from the store', async () => {
      expect(threadStore.replies(reply.post)).toContainEqual(reply)
      await threadStore.deleteReply(reply)
      expect(threadStore.replies(reply.post)).not.toContainEqual(reply)
    })
  })

  describe('toggleThreadReaction', () => {
    let threadStore: ThreadStore
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
          authHeaders,
        )
      })

      it('unsets user_reaction_type for the thread', async () => {
        await threadStore.toggleThreadReaction(
          thread,
          thread.user_reaction_type!,
        )

        expect(threadStore.thread(thread.id)!.user_reaction_type).toBeNull()
      })

      it('removes the reaction from the thread.reactions', async () => {
        await threadStore.toggleThreadReaction(
          thread,
          thread.user_reaction_type!,
        )

        expect(threadStore.thread(thread.id)!.reactions).toEqual([])
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
          authHeaders,
        )
      })

      it('sets user_reaction_type for the thread', async () => {
        await threadStore.toggleThreadReaction(thread, reactionType)

        expect(threadStore.thread(thread.id)!.user_reaction_type).toEqual(
          reactionType,
        )
      })

      it('updates the reaction in thread.reactions', async () => {
        await threadStore.toggleThreadReaction(thread, reactionType)

        expect(threadStore.thread(thread.id)!.reactions).toEqual([
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
          authHeaders,
        )
      })

      it('sets user_reaction_type for the thread', async () => {
        const reactionType = 'like'

        await threadStore.toggleThreadReaction(thread, reactionType)

        expect(threadStore.thread(thread.id)!.user_reaction_type).toEqual(
          reactionType,
        )
      })

      it('adds the reaction to thread.reactions', async () => {
        const reactionType = 'like'

        await threadStore.toggleThreadReaction(thread, reactionType)

        expect(threadStore.thread(thread.id)!.reactions).toEqual([
          { user: user.id, type: reactionType, content: thread.id },
        ])
      })
    })
  })

  describe('fetchFilters', () => {
    let threadStore: ThreadStore
    let filters: ThreadFilters

    beforeEach(() => {
      threadStore = useThreadStore()
      filters = threadFiltersFactory()
      api.get.mockResolvedValue({ data: filters })
    })

    it('makes a GET request to the endpoint', async () => {
      authStore.user = null
      await threadStore.fetchThreadFilters()
      expect(api.get).toHaveBeenCalledWith('threads/filters/', {})
    })

    it('includes auth headers when signed in', async () => {
      await threadStore.fetchThreadFilters()
      expect(api.get).toHaveBeenCalledWith('threads/filters/', authHeaders)
    })

    it('saves the returned filters', async () => {
      await threadStore.fetchThreadFilters()
      expect(threadStore.threadFilters).toEqual(filters)
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
