import { createTestingPinia } from '@pinia/testing'
import { RouterLinkStub, VueWrapper } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { vi } from 'vitest'

export const wrap = async <T>(
  component: T,
  options = {},
): Promise<VueWrapper<T>> => {
  const result = await mountSuspended<T>(component, {
    ...options,
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn })],
      stubs: {
        NuxtLink: RouterLinkStub,
      },
    },
  })

  return result as any
}

/** A type for an element found in a VueWrapper. */
export type Wrapper<T extends Node = any> =
  | ReturnType<VueWrapper<T>['find']>
  | ReturnType<VueWrapper<T>['findComponent']>

export const mockResponse = <T>(data: T): AsyncResponse<T | null> => {
  return {
    data: ref(data),
    error: ref(null),
  } as any
}

export const makeId = (): number => Math.floor(Math.random() * 100000)
