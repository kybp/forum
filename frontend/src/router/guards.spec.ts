import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import * as guards from './guards'
import { accountFactory } from '@/stores/auth.factories'
import { routeLocationFactory } from './factories'

let authStore: ReturnType<typeof useAuthStore>
let from: RouteLocationNormalized
let to: RouteLocationNormalized

beforeEach(() => {
  setActivePinia(createTestingPinia({ createSpy: vi.fn }))
  authStore = useAuthStore()
  from = routeLocationFactory()
  to = routeLocationFactory()
})

describe('checkSignedIn', () => {
  it('does nothing when user is signed in', () => {
    authStore.account = accountFactory()
    expect(guards.checkSignedIn(from, to, () => {})).toBeUndefined()
  })

  it('redirects to sign-in when the user is signed out', () => {
    authStore.account = null
    expect(guards.checkSignedIn(from, to, () => {})).toEqual({
      name: 'sign in',
    })
  })
})

describe('checkNotSignedIn', () => {
  it('does nothing when user is signed out', () => {
    authStore.account = null
    expect(guards.checkNotSignedIn(from, to, () => {})).toBeUndefined()
  })

  it('redirects to home page when the user is signed in', () => {
    authStore.account = accountFactory()
    expect(guards.checkNotSignedIn(from, to, () => {})).toEqual({
      name: 'home',
    })
  })
})
