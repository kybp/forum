import { VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, it, vi } from 'vitest'

import ThreadDetailView from '@/views/ThreadDetailView.vue'
import type { Thread } from '@/stores/thread'
import { useThreadStore } from '@/stores/thread'
import { wrap } from '@/test-utils'
import { userFactory } from '@/stores/auth.factories'
import { threadFactory } from '@/stores/thread.factories'
import type { User } from '@/stores/user'
import { useUserStore } from '@/stores/user'

let wrapper: VueWrapper<typeof ThreadDetailView>
let threadStore: ReturnType<typeof useThreadStore>
let userStore: ReturnType<typeof useUserStore>

const api = vi.hoisted(() => ({
  post: vi.fn(),
}))

vi.mock('mande', () => ({
  mande: () => api,
}))

const threadId = vi.hoisted(() => 17)

const route = vi.hoisted(() => ({
  params: { id: threadId },
}))

vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
  useRoute: () => route,
}))

let thread: Thread
let user: User

beforeEach(async () => {
  wrapper = wrap(ThreadDetailView)

  user = userFactory()
  userStore = useUserStore()
  userStore.users = { [user.id]: user }

  thread = threadFactory({ id: threadId, author_id: user.id })
  threadStore = useThreadStore()
  threadStore.threads = { [threadId]: thread }
})

it('renders author username', () => {
  expect(wrapper.text()).toContain(user.username)
})

it('renders post title', () => {
  expect(wrapper.text()).toContain(thread.title)
})

it('renders post body', () => {
  expect(wrapper.text()).toContain(thread.body)
})

it('is not loading when it has all data', () => {
  expect(wrapper.text()).not.toContain('Loading...')
})

it('is loading when it does not have the thread', async () => {
  threadStore.threads = {}
  await wrapper.vm.$nextTick()
  expect(wrapper.text()).toContain('Loading...')
})

it('is loading when it does not have the user', async () => {
  userStore.users = {}
  await wrapper.vm.$nextTick()
  expect(wrapper.text()).toContain('Loading...')
})
