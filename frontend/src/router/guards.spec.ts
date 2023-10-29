import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { RouteLocation } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import * as guards from './guards'
import { userFactory } from '@/stores/auth.factories'
import { routeLocationFactory } from './factories'

let authStore: ReturnType<typeof useAuthStore>
let from: RouteLocation
let to: RouteLocation

beforeEach(() => {
  setActivePinia(createTestingPinia({ createSpy: vi.fn }))
  authStore = useAuthStore()
  from = routeLocationFactory()
  to = routeLocationFactory()
})

describe('checkSignedIn', () => {
  it('does nothing when user is signed in', () => {
    authStore.user = userFactory()
    expect(guards.checkSignedIn(from, to, () => {})).toBeUndefined()
  })

  it('redirects to sign-in when the user is signed out', () => {
    authStore.user = null
    expect(guards.checkSignedIn(from, to, () => {})).toEqual({
      name: 'sign in',
    })
  })
})

describe('checkNotSignedIn', () => {
  it('does nothing when user is signed out', () => {
    authStore.user = null
    expect(guards.checkNotSignedIn(from, to, () => {})).toBeUndefined()
  })

  it('redirects to home page when the user is signed in', () => {
    authStore.user = userFactory()
    expect(guards.checkNotSignedIn(from, to, () => {})).toEqual({
      name: 'home',
    })
  })
})
