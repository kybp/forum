import { createTestingPinia } from '@pinia/testing'
import { VueWrapper, shallowMount } from '@vue/test-utils'
import { vi } from 'vitest'

export const wrap = <T>(component: T, options = {}): VueWrapper<T> =>
  (shallowMount as any)(component, {
    ...options,
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn })],
    },
  })
