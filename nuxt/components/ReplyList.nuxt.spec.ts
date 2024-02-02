import { VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, it, vi } from 'vitest'

import ReplyDetail from '~/components/ReplyDetail.vue'
import ReplyList from '~/components/ReplyList.vue'
import { usePostsStore } from '~/stores/posts'
import { wrap } from '~/test-utils'
import { replyFactory } from '~/factories'

let wrapper: VueWrapper<typeof ReplyList>
let postsStore: ReturnType<typeof usePostsStore>

const postId = 10

beforeEach(async () => {
  wrapper = await wrap(ReplyList, { propsData: { postId } })
  postsStore = usePostsStore()
  postsStore.getReplies = vi.fn()
})

it('renders a ReplyDetail for each post reply', async () => {
  const replies = [replyFactory(), replyFactory()]
  postsStore.findRepliesByPost = () => replies

  await wrapper.vm.$nextTick()

  expect(wrapper.findAllComponents(ReplyDetail).length).toEqual(replies.length)
})
