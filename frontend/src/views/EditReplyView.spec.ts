import { VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, it, vi } from 'vitest'

import EditReplyView from '@/views/EditReplyView.vue'
import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue'
import ReplyForm from '@/components/ReplyForm.vue'
import { useThreadStore, type Thread, type ThreadStore } from '@/stores/thread'
import { wrap } from '@/test-utils'
import { replyFactory, threadFactory } from '@/stores/thread.factories'

let wrapper: VueWrapper<typeof EditReplyView>

const router = vi.hoisted(() => ({
  push: vi.fn(),
}))

const postId = vi.hoisted(() => 20)
const replyId = vi.hoisted(() => 10)

let post: Thread
let threadStore: ThreadStore

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { postId, replyId } }),
  useRouter: () => router,
}))

const header = () => wrapper.find('h1')
const loading = () => wrapper.findComponent(LoadingPlaceholder)
const replyForm = () => wrapper.findComponent(ReplyForm)

beforeEach(() => {
  wrapper = wrap(EditReplyView)
  post = threadFactory({ id: postId, replies: [replyId] })

  threadStore = useThreadStore()
  threadStore.thread = () => post
  threadStore.allReplies = { [replyId]: replyFactory() }
})

it('renders a header with the post title', () => {
  expect(header().text()).toMatch(/editing/i)
  expect(header().text()).toMatch(new RegExp(post.title))
})

it('renders a ReplyForm', () => {
  expect(replyForm().exists()).toBe(true)
})

it('is not loading when it has all data', () => {
  expect(loading().exists()).toBe(false)
})

it('is loading when the post is not available', async () => {
  threadStore.thread = () => undefined
  await wrapper.vm.$nextTick()
  expect(header().exists()).toBe(false)
  expect(loading().exists()).toBe(true)
})

it('is loading when the reply is not available', async () => {
  threadStore.allReplies = {}
  await wrapper.vm.$nextTick()
  expect(replyForm().exists()).toBe(false)
  expect(loading().exists()).toBe(true)
})
