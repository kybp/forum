import { createPinia, setActivePinia } from 'pinia'
import type { Mocked } from 'vitest'
import { beforeEach, describe, expect, it, test, vi } from 'vitest'
import type { AxiosResponse } from 'axios'

import type { SignInProps, Account } from '@/stores/auth'
import { useAuthStore } from '@/stores/auth'
import {
  registerPropsFactory,
  signInPropsFactory,
} from '@/stores/auth.factories'
import { accountFactory } from '@/stores/auth.factories'
import { useUserStore } from '@/stores/user'

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
  delete: vi.fn(),
}))

vi.mock('axios', () => ({
  default: {
    create: () => api,
  },
  isAxiosError: () => true,
}))

describe('auth store', () => {
  let authStore: ReturnType<typeof useAuthStore>
  let userStore: ReturnType<typeof useUserStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    userStore = useUserStore()
    vi.spyOn(userStore, 'fetchUser').mockResolvedValue()
  })

  describe('initially', () => {
    it('loads the account from localStorage when present', () => {
      const account = accountFactory()
      localStorage.getItem.mockReturnValueOnce(JSON.stringify(account))

      authStore = useAuthStore()

      expect(localStorage.getItem).toHaveBeenCalledWith('account')
      expect(authStore.account).toEqual(account)
    })

    it('does not load the account from localStorage when not present', () => {
      authStore = useAuthStore()
      expect(authStore.account).toEqual(null)
    })

    it('has no registration errors', () => {
      authStore = useAuthStore()
      expect(authStore.registerErrors).toBe(null)
    })

    it('has no sign-in errors', () => {
      authStore = useAuthStore()
      expect(authStore.signInErrors).toBe(null)
    })
  })

  describe('isSignedIn', () => {
    beforeEach(() => {
      authStore = useAuthStore()
    })

    it('is true when account is set', () => {
      authStore.account = accountFactory()
      expect(authStore.isSignedIn).toBe(true)
    })

    it('is false when account is null', () => {
      authStore.account = null
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
      expect(api.post).toHaveBeenCalledWith('users/accounts/', params)
    })

    describe('when the request succeeds', () => {
      let account: Account

      beforeEach(() => {
        account = accountFactory()
        api.post.mockResolvedValueOnce({ data: account })
      })

      it('saves the account in the store', async () => {
        await authStore.register(params)
        expect(authStore.account).toEqual(account)
      })

      it('saves the account in localStorage', async () => {
        await authStore.register(params)
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'account',
          JSON.stringify(account),
        )
      })

      it('clears registration errors', async () => {
        authStore.registerErrors = { username: ['an error'] }

        await authStore.register(params)

        expect(authStore.registerErrors).toBe(null)
      })
    })

    describe('when the request fails', () => {
      let error: { response: Partial<AxiosResponse> }

      beforeEach(() => {
        error = {
          response: { status: 400, data: { username: ['some error'] } },
        }

        api.post.mockRejectedValueOnce(error)
      })

      it('saves the returned errors in the store', async () => {
        await authStore.register(params)

        expect(authStore.registerErrors).toEqual(error.response.data)
      })

      it('does not set account', async () => {
        await authStore.register(params)

        expect(authStore.account).toBe(null)
      })
    })
  })

  test('clearRegisterErrors clears registerErrors', async () => {
    authStore.registerErrors = { username: ['some error'] }

    authStore.clearRegisterErrors()

    expect(authStore.registerErrors).toBe(null)
  })

  describe('signIn', () => {
    let params: SignInProps

    beforeEach(() => {
      authStore = useAuthStore()
      params = signInPropsFactory()
    })

    describe('when the request succeeds', () => {
      let account: Account

      beforeEach(() => {
        account = accountFactory()
        api.post.mockResolvedValueOnce({ data: account })
      })

      it('posts to the token endpoint', async () => {
        await authStore.signIn(params)
        expect(api.post).toHaveBeenCalledWith('users/token/', params)
      })

      it('saves the account in the store', async () => {
        await authStore.signIn(params)
        expect(authStore.account).toEqual(account)
      })

      it('saves the account in localStorage', async () => {
        await authStore.signIn(params)
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'account',
          JSON.stringify(account),
        )
      })

      it('clears sign-in errors', async () => {
        authStore.signInErrors = { username: ['error error'] }
        await authStore.signIn(params)
        expect(authStore.signInErrors).toBe(null)
      })
    })

    describe('when the request fails', () => {
      let error: { response: Partial<AxiosResponse> }

      beforeEach(() => {
        error = {
          response: {
            status: 400,
            data: { username: ['a very serious error'] },
          },
        }

        api.post.mockRejectedValueOnce(error)
      })

      it('saves the returned errors in the store', async () => {
        await authStore.signIn(params)

        expect(authStore.signInErrors).toEqual(error.response.data)
      })

      it('does not set account', async () => {
        await authStore.signIn(params)

        expect(authStore.account).toBe(null)
      })
    })
  })

  test('clearSignInErrors clears signInErrors', async () => {
    authStore.signInErrors = { username: ['some error'] }

    authStore.clearSignInErrors()

    expect(authStore.signInErrors).toBe(null)
  })

  describe('signOut', () => {
    beforeEach(() => {
      authStore = useAuthStore()
    })

    it('clears the account from the store', async () => {
      authStore.account = accountFactory()
      await authStore.signOut()
      expect(authStore.account).toEqual(null)
    })

    it('clears the account from localStorage', async () => {
      await authStore.signOut()
      expect(localStorage.removeItem).toHaveBeenCalledWith('account')
    })
  })

  describe('deleteAccount', () => {
    beforeEach(() => {
      authStore.account = accountFactory()
    })

    it('sends a delete request to the endpoint', async () => {
      const { id, token } = authStore.account!
      await authStore.deleteAccount()
      expect(api.delete).toHaveBeenCalledWith(`users/accounts/${id}/`, {
        headers: { Authorization: `Token ${token}` },
      })
    })

    it('clears the account from the store', async () => {
      await authStore.deleteAccount()
      expect(authStore.account).toBeNull()
    })

    it('clears the account from localStorage', async () => {
      await authStore.deleteAccount()
      expect(localStorage.removeItem).toHaveBeenCalledWith('account')
    })

    it('throws an error if not signed in', async () => {
      authStore.account = null
      await expect(authStore.deleteAccount()).rejects.toThrowError()
    })
  })
})
