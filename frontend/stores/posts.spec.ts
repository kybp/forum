import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { createPinia, setActivePinia } from 'pinia'
import { vi, expect, it, describe, beforeEach } from 'vitest'
import {
  accountFactory,
  createPostParamsFactory,
  threadFactory,
  updatePostParamsFactory,
} from '~/factories'
import { makeId } from '~/test-utils'
import type { AuthStore } from '~/stores/auth'
import type { Account } from '~/types'

const mockFetch = vi.hoisted(() => vi.fn())
mockNuxtImport('useFetch', () => mockFetch)

// xxx: useCookie is an implementation detail of authStore. It's kind
// of bogus that we need to mock it here.
mockNuxtImport('useCookie', () => () => ({ value: null }))

let store: PostsStore
let authStore: AuthStore
let account: Account

beforeEach(() => {
  setActivePinia(createPinia())
  store = usePostsStore()

  authStore = useAuthStore()
  account = accountFactory()
  authStore.account = account

  mockFetch.mockResolvedValue({ data: {} })
})

describe('getPost', () => {
  it('calls the getPost endpoint', async () => {
    const id = makeId()
    await store.getPost(id)
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch.mock.lastCall[0]).toMatch(
      new RegExp(`/threads/posts/${id}/$`),
    )
  })

  it('saves the fetched post in the store', async () => {
    const post = threadFactory()
    mockFetch.mockResolvedValueOnce({ data: { value: post } })

    await store.getPost(post.id)

    expect(store.findPost(post.id)).toEqual(post)
  })
})

describe('getPostList', () => {
  it('calls the getPostList endpoint', async () => {
    await store.getPostList()
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch.mock.lastCall[0]).toMatch(new RegExp('threads/posts/$'))
  })

  it('saves the fetched posts in the store', async () => {
    const posts = [threadFactory(), threadFactory()]
    mockFetch.mockResolvedValueOnce({ data: { value: posts } })

    await store.getPostList()

    posts.forEach((post) => {
      expect(store.findPost(post.id)).toEqual(post)
    })
  })
})

describe('createPost', () => {
  it('calls the createPost endpoint', async () => {
    await store.createPost(createPostParamsFactory())

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch.mock.lastCall[0]).toMatch(new RegExp('/threads/posts/$'))
    expect(mockFetch.mock.lastCall[1].method).toEqual('POST')
  })

  it('saves the returned post in the store', async () => {
    const post = threadFactory()
    mockFetch.mockResolvedValueOnce({ data: { value: post } })

    await store.createPost(createPostParamsFactory())

    expect(store.findPost(post.id)).toEqual(post)
  })

  it('returns the response', async () => {
    const response = { data: { value: threadFactory() }, error: null }
    mockFetch.mockResolvedValueOnce(response)

    expect(await store.createPost(createPostParamsFactory())).toEqual(response)
  })
})

describe('updatePost', () => {
  it('calls the updatePost endpoint', async () => {
    const post = updatePostParamsFactory()
    await store.updatePost(post)

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch.mock.lastCall[0]).toMatch(
      new RegExp(`/threads/posts/${post.id}/$`),
    )
    expect(mockFetch.mock.lastCall[1].method).toEqual('PUT')
  })

  it('saves the returned post in the store', async () => {
    const post = threadFactory()
    // store.postList = [post]

    const newTitle = post.title + ' but different'
    mockFetch.mockResolvedValueOnce({
      data: { value: { ...post, title: newTitle } },
    })

    await store.updatePost(post)

    expect(store.findPost(post.id)!.title).toEqual(newTitle)
  })

  it('returns the response', async () => {
    const response = { data: { value: threadFactory() }, error: null }
    mockFetch.mockResolvedValueOnce(response)

    expect(await store.updatePost(updatePostParamsFactory())).toEqual(response)
  })
})
