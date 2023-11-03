import { VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, it } from 'vitest'

import PostBody from '@/components/PostBody.vue'
import ReplyDetail from '@/components/ReplyDetail.vue'
import { replyFactory } from '@/stores/thread.factories'
import type { Reply } from '@/stores/thread'
import { wrap } from '@/test-utils'
import { useAuthStore, type AuthStore } from '@/stores/auth'
import { useThreadStore, type ThreadStore } from '@/stores/thread'
import { accountFactory } from '@/stores/auth.factories'

let wrapper: VueWrapper<typeof ReplyDetail>
let reply: Reply
let authStore: AuthStore
let threadStore: ThreadStore

const deleteButton = () => wrapper.find('button')

beforeEach(() => {
  reply = replyFactory()
  wrapper = wrap(ReplyDetail, { propsData: { reply } })
  authStore = useAuthStore()
  authStore.account = accountFactory({ id: reply.author })
  threadStore = useThreadStore()
})

it('renders post body', () => {
  const body = wrapper.findComponent(PostBody)

  expect(body.exists()).toBe(true)
  expect(body.vm.$props.value).toEqual(reply.body)
})

it('renders delete button when the user is the author', async () => {
  authStore.account = accountFactory({ id: reply.author })
  await wrapper.vm.$nextTick()
  expect(deleteButton().exists()).toBe(true)
})

it('does not render delete button when the user is not the author', async () => {
  authStore.account = accountFactory({ id: reply.author + 1 })
  await wrapper.vm.$nextTick()
  expect(deleteButton().exists()).toBe(false)
})

it('calls threadStore.deleteReply when delete button is clicked', async () => {
  await deleteButton().trigger('click')
  expect(threadStore.deleteReply).toHaveBeenCalledWith(reply)
})
