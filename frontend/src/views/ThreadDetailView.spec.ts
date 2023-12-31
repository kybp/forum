import { h } from 'vue'
import { VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import ArticleDates from '@/components/ArticleDates.vue'
import CollapsibleMenu from '@/components/CollapsibleMenu.vue'
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue'
import MarkdownBody from '@/components/MarkdownBody.vue'
import PostTag from '@/components/PostTag.vue'
import ReplyForm from '@/components/ReplyForm.vue'
import ThreadDetailView from '@/views/ThreadDetailView.vue'
import { useAuthStore } from '@/stores/auth'
import { accountFactory } from '@/stores/auth.factories'
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

vi.mock('axios', () => ({
  default: {
    create: () => api,
  },
}))

const postId = vi.hoisted(() => 17)

const route = vi.hoisted(() => ({
  params: { id: postId },
}))

vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
  useRoute: () => route,
  RouterLink: () => h('div'),
}))

let thread: Thread
let user: User

const loading = () => wrapper.findComponent(LoadingPlaceholder)
const body = () => wrapper.findComponent(MarkdownBody)
const articleDates = () => wrapper.findComponent(ArticleDates)
const tags = () => wrapper.findAllComponents(PostTag)
const actionsMenu = () => wrapper.findComponent(CollapsibleMenu)
const replyForm = () => wrapper.findComponent(ReplyForm)

beforeEach(async () => {
  wrapper = wrap(ThreadDetailView)

  authStore = useAuthStore()

  user = userFactory()
  userStore = useUserStore()
  userStore.user = () => user

  thread = threadFactory({ id: postId, author: user.id })
  threadStore = useThreadStore()
  threadStore.thread = () => thread
})

const itRendersThread = () => {
  it('renders author username', () => {
    expect(wrapper.text()).toContain(user.username)
  })

  it('renders post title', () => {
    expect(wrapper.text()).toContain(thread.title)
  })

  it('renders post body', () => {
    expect(body().exists()).toBe(true)
    expect(body().props().value).toEqual(thread.body)
  })

  it('renders article dates', () => {
    expect(articleDates().exists()).toBe(true)
    expect(articleDates().props().article).toEqual(thread)
  })

  it('renders tags', () => {
    expect(tags().length).toEqual(thread.tags.length)
    expect(new Set(tags().map((t) => t.props().value))).toEqual(
      new Set(thread.tags),
    )
    tags().forEach((t) => expect(t.props().editable).toBe(false))
  })

  it('is not loading when it has all data', () => {
    expect(loading().exists()).toBe(false)
  })

  it('is loading when it does not have the thread', async () => {
    threadStore.thread = () => undefined
    await wrapper.vm.$nextTick()
    expect(loading().exists()).toBe(true)
  })

  it('is loading when it does not have the user', async () => {
    userStore.user = () => undefined
    await wrapper.vm.$nextTick()
    expect(loading().exists()).toBe(true)
  })
}

describe('when the user is signed in', () => {
  beforeEach(() => {
    authStore.account = accountFactory({ id: thread.author! })
  })

  itRendersThread()

  it('renders a reply form', () => {
    expect(replyForm().exists()).toBe(true)
  })

  it('renders actions menu if user is the author', async () => {
    authStore.account = accountFactory({ id: thread.author! })
    await wrapper.vm.$nextTick()
    expect(actionsMenu().exists()).toBe(true)
  })

  it('does not render actions menu if user is not the author', async () => {
    authStore.account = accountFactory({ id: thread.author! + 1 })
    await wrapper.vm.$nextTick()
    expect(actionsMenu().exists()).toBe(false)
  })
})

describe('when the user is signed out', () => {
  beforeEach(() => {
    authStore.account = null
  })

  itRendersThread()

  it('does not render a reply form', () => {
    expect(replyForm().exists()).toBe(false)
  })

  it('does not render actions menu', () => {
    expect(actionsMenu().exists()).toBe(false)
  })
})
