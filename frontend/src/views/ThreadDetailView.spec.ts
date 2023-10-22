import { VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue'
import ReplyForm from '@/components/ReplyForm.vue'
import ThreadDetailView from '@/views/ThreadDetailView.vue'
import { useAuthStore } from '@/stores/auth'
import { userFactory as authUserFactory } from '@/stores/auth.factories'
import type { Thread } from '@/stores/thread'
import { useThreadStore } from '@/stores/thread'
import { threadFactory } from '@/stores/thread.factories'
import type { User } from '@/stores/user'
import { userFactory } from '@/stores/user.factories'
import { useUserStore } from '@/stores/user'
import { wrap } from '@/test-utils'

let wrapper: VueWrapper<typeof ThreadDetailView>
let authStore: ReturnType<typeof useAuthStore>
let threadStore: ReturnType<typeof useThreadStore>
let userStore: ReturnType<typeof useUserStore>

const api = vi.hoisted(() => ({
  post: vi.fn(),
}))

vi.mock('mande', () => ({
  mande: () => api,
}))

const postId = vi.hoisted(() => 17)

const route = vi.hoisted(() => ({
  params: { id: postId },
}))

vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
  useRoute: () => route,
}))

let thread: Thread
let user: User

beforeEach(async () => {
  wrapper = wrap(ThreadDetailView)

  authStore = useAuthStore()

  user = userFactory()
  userStore = useUserStore()
  userStore.users = { [user.id]: user }

  thread = threadFactory({ id: postId, author_id: user.id })
  threadStore = useThreadStore()
  threadStore.threads = { [postId]: thread }
})

const itRendersThread = () => {
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
    expect(wrapper.findComponent(LoadingPlaceholder).exists()).toBe(false)
  })

  it('is loading when it does not have the thread', async () => {
    threadStore.threads = {}
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(LoadingPlaceholder).exists()).toBe(true)
  })

  it('is loading when it does not have the user', async () => {
    userStore.users = {}
    await wrapper.vm.$nextTick()
    expect(wrapper.findComponent(LoadingPlaceholder).exists()).toBe(true)
  })
}

describe('when the user is signed in', () => {
  beforeEach(() => {
    authStore.user = authUserFactory()
  })

  itRendersThread()

  it('renders a reply form', () => {
    expect(wrapper.findComponent(ReplyForm).exists()).toBe(true)
  })
})

describe('when the user is signed out', () => {
  beforeEach(() => {
    authStore.user = null
  })

  itRendersThread()

  it('does not render a reply form', () => {
    expect(wrapper.findComponent(ReplyForm).exists()).toBe(false)
  })
})
