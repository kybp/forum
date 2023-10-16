import { createPinia, setActivePinia } from 'pinia'
import type { Mocked } from 'vitest'
import { beforeEach, describe, expect, it, vi } from 'vitest'

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
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initially', () => {
    it('loads the user from localStorage when present', () => {
      const user = userFactory()
      localStorage.getItem.mockReturnValueOnce(JSON.stringify(user))

      const auth = useAuthStore()

      expect(localStorage.getItem).toHaveBeenCalledWith('user')
      expect(auth.user).toEqual(user)
    })

    it('does not load the user from localStorage when not present', () => {
      const auth = useAuthStore()

      expect(auth.user).toEqual(null)
    })
  })

  describe('register', () => {
    const params = registerPropsFactory()

    it('posts to the registration endpoint', async () => {
      const auth = useAuthStore()

      await auth.register(params)

      expect(api.post).toHaveBeenCalledWith('users/', params)
    })

    it('saves the user in the store', async () => {
      const auth = useAuthStore()
      const user = userFactory()
      api.post.mockResolvedValueOnce(user)

      await auth.register(params)

      expect(auth.user).toEqual(user)
    })

    it('saves the user in localStorage', async () => {
      const auth = useAuthStore()
      const user = userFactory()
      api.post.mockResolvedValueOnce(user)

      await auth.register(params)

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify(user),
      )
    })
  })

  describe('signIn', () => {
    const params = signInPropsFactory()

    it('posts to the token endpoint', async () => {
      const auth = useAuthStore()

      await auth.signIn(params)

      expect(api.post).toHaveBeenCalledWith('users/token/', params)
    })

    it('saves the user in the store', async () => {
      const auth = useAuthStore()
      const user = userFactory()
      api.post.mockResolvedValueOnce(user)

      await auth.signIn(params)

      expect(auth.user).toEqual(user)
    })

    it('saves the user in localStorage', async () => {
      const auth = useAuthStore()
      const user = userFactory()
      api.post.mockResolvedValueOnce(user)

      await auth.signIn(params)

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify(user),
      )
    })
  })

  describe('signOut', () => {
    it('clears the user from the store', async () => {
      const auth = useAuthStore()
      auth.user = userFactory()

      await auth.signOut()

      expect(auth.user).toEqual(null)
    })

    it('clears the user from localStorage', async () => {
      const auth = useAuthStore()

      await auth.signOut()

      expect(localStorage.removeItem).toHaveBeenCalledWith('user')
    })
  })
})
