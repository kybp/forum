import { createPinia, setActivePinia } from 'pinia'
import type { Mocked } from 'vitest'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { User } from '@/stores/auth'
import { useAuthStore } from '@/stores/auth'
import {
  registerPropsFactory,
  signInPropsFactory,
} from '@/stores/auth.factories'
import { userFactory } from '@/stores/auth.factories'

const localStorage: Mocked<Storage> = {
  length: 0,
  key: vi.fn(),
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
vi.stubGlobal('localStorage', localStorage)

const api = vi.hoisted(() => ({
  post: vi.fn(),
}))

vi.mock('mande', () => ({
  mande: () => api,
}))

describe('auth store', () => {
  let authStore: ReturnType<typeof useAuthStore>

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initially', () => {
    it('loads the user from localStorage when present', () => {
      const user = userFactory()
      localStorage.getItem.mockReturnValueOnce(JSON.stringify(user))

      authStore = useAuthStore()

      expect(localStorage.getItem).toHaveBeenCalledWith('user')
      expect(authStore.user).toEqual(user)
    })

    it('does not load the user from localStorage when not present', () => {
      authStore = useAuthStore()
      expect(authStore.user).toEqual(null)
    })

    it('has no registration errors', () => {
      authStore = useAuthStore()
      expect(authStore.registerErrors).toBe(null)
    })
  })

  describe('isSignedIn', () => {
    beforeEach(() => {
      authStore = useAuthStore()
    })

    it('is true when user is set', () => {
      authStore.user = userFactory()
      expect(authStore.isSignedIn).toBe(true)
    })

    it('is false when user is null', () => {
      authStore.user = null
      expect(authStore.isSignedIn).toBe(false)
    })
  })

  describe('register', () => {
    beforeEach(() => {
      authStore = useAuthStore()
    })

    const params = registerPropsFactory()

    it('posts to the registration endpoint', async () => {
      await authStore.register(params)
      expect(api.post).toHaveBeenCalledWith('users/', params)
    })

    describe('when the request succeeds', () => {
      let user: User

      beforeEach(() => {
        user = userFactory()
        api.post.mockResolvedValueOnce(user)
      })

      it('saves the user in the store', async () => {
        await authStore.register(params)
        expect(authStore.user).toEqual(user)
      })

      it('saves the user in localStorage', async () => {
        await authStore.register(params)
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'user',
          JSON.stringify(user),
        )
      })

      it('clears registration errors', async () => {
        authStore.registerErrors = { username: ['an error'] }

        await authStore.register(params)

        expect(authStore.registerErrors).toBe(null)
      })
    })

    describe('when the request fails', () => {
      let error: any

      beforeEach(() => {
        error = {
          response: { status: 400 },
          body: { username: ['some error'] },
        }

        api.post.mockRejectedValueOnce(error)
      })

      it('saves the returned errors in the store', async () => {
        await authStore.register(params)

        expect(authStore.registerErrors).toEqual(error.body)
      })

      it('does not set user', async () => {
        await authStore.register(params)

        expect(authStore.user).toBe(null)
      })
    })
  })

  describe('signIn', () => {
    beforeEach(() => {
      authStore = useAuthStore()
    })
    const params = signInPropsFactory()

    it('posts to the token endpoint', async () => {
      await authStore.signIn(params)
      expect(api.post).toHaveBeenCalledWith('users/token/', params)
    })

    it('saves the user in the store', async () => {
      const user = userFactory()
      api.post.mockResolvedValueOnce(user)

      await authStore.signIn(params)

      expect(authStore.user).toEqual(user)
    })

    it('saves the user in localStorage', async () => {
      const user = userFactory()
      api.post.mockResolvedValueOnce(user)

      await authStore.signIn(params)

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify(user),
      )
    })
  })

  describe('signOut', () => {
    beforeEach(() => {
      authStore = useAuthStore()
    })

    it('clears the user from the store', async () => {
      authStore.user = userFactory()

      await authStore.signOut()

      expect(authStore.user).toEqual(null)
    })

    it('clears the user from localStorage', async () => {
      await authStore.signOut()
      expect(localStorage.removeItem).toHaveBeenCalledWith('user')
    })
  })
})
