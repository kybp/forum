import { VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, it, vi } from 'vitest'

import PostForm from '@/components/PostForm.vue'
import NewThreadView from '@/views/NewThreadView.vue'
import { useThreadStore } from '@/stores/thread'
import { wrap } from '@/test-utils'
import { useAuthStore } from '@/stores/auth'
import { userFactory } from '@/stores/auth.factories'

let wrapper: VueWrapper<typeof NewThreadView>

const api = vi.hoisted(() => ({
  post: vi.fn(),
}))

vi.mock('mande', () => ({
  mande: () => api,
}))

const router = vi.hoisted(() => ({
  push: vi.fn(),
}))

vi.mock('vue-router', () => ({
  useRouter: () => router,
}))

beforeEach(() => {
  wrapper = wrap(NewThreadView, {}, false)
  useThreadStore()

  const authStore = useAuthStore()
  authStore.user = userFactory()
})

it('renders a PostForm', () => {
  expect(wrapper.findComponent(PostForm).exists()).toBe(true)
})
