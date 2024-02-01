import { VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, it, vi } from 'vitest'

import ReplyDetail from '@/components/ReplyDetail.vue'
import ReplyList from '@/components/ReplyList.vue'
import { useThreadsStore } from '@/stores/threads'
import { wrap } from '@/test-utils'
import { replyFactory } from '@/factories'

let wrapper: VueWrapper<typeof ReplyList>
let threadStore: ReturnType<typeof useThreadsStore>

const postId = 10

beforeEach(async () => {
  wrapper = await wrap(ReplyList, { propsData: { postId } })
  threadStore = useThreadsStore()
  threadStore.getReplies = vi.fn()
})

it('renders a ReplyDetail for each thread reply', async () => {
  const replies = [replyFactory(), replyFactory()]
  threadStore.findRepliesByPost = () => replies

  await wrapper.vm.$nextTick()

  expect(wrapper.findAllComponents(ReplyDetail).length).toEqual(replies.length)
})
