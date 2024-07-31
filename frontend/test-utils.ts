import { createTestingPinia } from '@pinia/testing'
import { DOMWrapper, VueWrapper } from '@vue/test-utils'
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
    },
  })

  return result as any
}

/** A type for an element returned by `get` or `findAll`. */
export type Wrapper<T extends Node = any> = Omit<DOMWrapper<T>, "exists">

export const mockResponse = <T>(data: T): AsyncResponse<T | null> => {
  return {
    data: ref(data),
    error: ref(null),
  } as any
}

export const makeId = (): number => Math.floor(Math.random() * 100000)
