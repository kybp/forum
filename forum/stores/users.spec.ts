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
import type { UsersStore } from './users'
import { createUserParamsFactory } from './users.factories'

const mockFetch = vi.hoisted(() => vi.fn())
mockNuxtImport('useFetch', () => mockFetch)

// xxx: useCookie is an implementation detail of authStore. It's kind
// of bogus that we need to mock it here.
mockNuxtImport('useCookie', () => () => ({ value: null }))

let store: UsersStore
let authStore: AuthStore

beforeEach(() => {
  setActivePinia(createPinia())
  store = useUsersStore()

  authStore = useAuthStore()

  mockFetch.mockResolvedValue({ data: {} })
})

describe('createUser', () => {
  it('calls the createUser endpoint', async () => {
    await store.createUser(createUserParamsFactory())

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch.mock.lastCall[0]).toMatch(new RegExp('/users/accounts/$'))
    expect(mockFetch.mock.lastCall[1].method).toEqual('POST')
  })

  it('passes the passed-in params to the endpoint', async () => {
    const params = createUserParamsFactory()

    await store.createUser(params)

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch.mock.lastCall[1].body).toEqual(params)
  })

  it('saves the returned user in the store when non-null', async () => {
    const user = accountFactory()
    mockFetch.mockResolvedValueOnce({ data: { value: user } })

    await store.createUser(createUserParamsFactory(user))

    expect(store.findUser(user.id)).toEqual(user)
  })

  it('sets the returned user as the current auth account', async () => {
    const user = accountFactory()
    mockFetch.mockResolvedValueOnce({ data: { value: user } })

    await store.createUser(createUserParamsFactory(user))

    expect(authStore.account).toEqual(user)
  })

  it('returns the response', async () => {
    const response = { data: { value: accountFactory() }, error: null }
    mockFetch.mockResolvedValueOnce(response)

    expect(await store.createUser(createUserParamsFactory())).toEqual(response)
  })
})
