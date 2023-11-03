import { VueWrapper } from '@vue/test-utils'
import { RouterLink } from 'vue-router'
import { beforeEach, describe, expect, it } from 'vitest'

import ArticleDates from '@/components/ArticleDates.vue'
import MarkdownBody from '@/components/MarkdownBody.vue'
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

const body = () => wrapper.findComponent(MarkdownBody)
const articleDates = () => wrapper.findComponent(ArticleDates)
const editLink = () => wrapper.findComponent(RouterLink)
const deleteButton = () => wrapper.find('button')

beforeEach(() => {
  reply = replyFactory()
  wrapper = wrap(ReplyDetail, { propsData: { reply } })
  authStore = useAuthStore()
  authStore.account = accountFactory({ id: reply.author })
  threadStore = useThreadStore()
})

const itRendersReply = () => {
  it('renders post body', () => {
    expect(body().exists()).toBe(true)
    expect(body().vm.$props.value).toEqual(reply.body)
  })

  it('renders article dates', () => {
    expect(articleDates().exists()).toBe(true)
    expect(articleDates().props().article).toEqual(reply)
  })
}

describe('when the user is the author', () => {
  beforeEach(async () => {
    authStore.account = accountFactory({ id: reply.author })
    await wrapper.vm.$nextTick()
  })

  itRendersReply()

  it('renders edit link', async () => {
    expect(editLink().exists()).toBe(true)
    expect(editLink().props().to).toEqual({
      name: 'edit reply',
      params: {
        postId: reply.post,
        replyId: reply.id,
      },
    })
  })

  it('renders delete button', async () => {
    expect(deleteButton().exists()).toBe(true)
  })

  it('calls threadStore.deleteReply when delete button is clicked', async () => {
    await deleteButton().trigger('click')
    expect(threadStore.deleteReply).toHaveBeenCalledWith(reply)
  })
})

describe('when the user is not the author', () => {
  beforeEach(async () => {
    authStore.account = accountFactory({ id: reply.author + 1 })
    await wrapper.vm.$nextTick()
  })

  itRendersReply()

  it('does not render edit link', async () => {
    expect(editLink().exists()).toBe(false)
  })

  it('does not render delete button', async () => {
    expect(deleteButton().exists()).toBe(false)
  })
})
