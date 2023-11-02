import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useUserStore, type User, type UserStore } from '@/stores/user'
import { userFactory } from '@/stores/user.factories'
import { makeId } from '@/test-utils'

const api = vi.hoisted(() => ({
  get: vi.fn(),
}))

vi.mock('axios', () => ({
  default: {
    create: () => api,
  },
}))

describe('user store', () => {
  let userStore: UserStore

  beforeEach(() => {
    setActivePinia(createPinia())
    userStore = useUserStore()
  })

  describe('initially', () => {
    it('has no users', () => {
      expect(userStore.users).toEqual({})
    })
  })

  describe('fetchUser', () => {
    let user: User

    beforeEach(() => {
      user = userFactory()
      api.get.mockResolvedValue({ data: user })
    })

    it('makes a GET request to the endpoint', async () => {
      const id = makeId()
      await userStore.fetchUser(id)
      expect(api.get).toHaveBeenCalledWith(`users/accounts/${id}/`)
    })

    it('saves the user in the store', async () => {
      expect(userStore.user(user.id)).toBeUndefined()
      await userStore.fetchUser(user.id!)
      expect(userStore.user(user.id)).toEqual(user)
    })
  })

  describe('user', () => {
    it('is the user when they are defined', () => {
      const user = userFactory()
      userStore.users[user.id!] = user
      expect(userStore.user(user.id)).toEqual(user)
    })

    it('is a deleted user when id is null', () => {
      expect(userStore.user(null)?.username).toBe('[deleted]')
    })
  })
})
