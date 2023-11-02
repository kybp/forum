import { VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, it, vi } from 'vitest'

import PostForm from '@/components/PostForm.vue'
import EditPostView from '@/views/EditPostView.vue'
import { useThreadStore } from '@/stores/thread'
import { wrap } from '@/test-utils'
import { useAuthStore } from '@/stores/auth'
import { userFactory } from '@/stores/auth.factories'

let wrapper: VueWrapper<typeof EditPostView>

const router = vi.hoisted(() => ({
  push: vi.fn(),
}))

const postId = vi.hoisted(() => 10)

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { id: postId } }),
  useRouter: () => router,
}))

beforeEach(() => {
  wrapper = wrap(EditPostView, {}, false)
  useThreadStore()

  const authStore = useAuthStore()
  authStore.user = userFactory()
})

it('renders a PostForm', () => {
  expect(wrapper.findComponent(PostForm).exists()).toBe(true)
})
