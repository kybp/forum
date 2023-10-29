import { VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, it, vi } from 'vitest'

import ReplyDetail from '@/components/ReplyDetail.vue'
import ReplyList from '@/components/ReplyList.vue'
import { useThreadStore } from '@/stores/thread'
import { wrap } from '@/test-utils'
import { replyFactory } from '@/stores/thread.factories'

let wrapper: VueWrapper<typeof ReplyList>
let threadStore: ReturnType<typeof useThreadStore>

const postId = 10

beforeEach(async () => {
  wrapper = wrap(ReplyList, { propsData: { postId } })
  threadStore = useThreadStore()
  threadStore.fetchReplies = vi.fn()
})

it('renders a ReplyDetail for each thread reply', async () => {
  const replies = [replyFactory(), replyFactory()]
  threadStore.replies = () => replies

  await wrapper.vm.$nextTick()

  expect(wrapper.findAllComponents(ReplyDetail).length).toEqual(replies.length)
})
