import { VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, it } from 'vitest'

import PostBody from '@/components/PostBody.vue'
import ReplyDetail from '@/components/ReplyDetail.vue'
import { replyFactory } from '@/stores/thread.factories'
import type { Reply } from '@/stores/thread'
import { wrap } from '@/test-utils'

let wrapper: VueWrapper<typeof ReplyDetail>
let reply: Reply

beforeEach(() => {
  reply = replyFactory()
  wrapper = wrap(ReplyDetail, { propsData: { reply } })
})

it('renders post body', () => {
  const body = wrapper.findComponent(PostBody)

  expect(body.exists()).toBe(true)
  expect(body.vm.$props.value).toEqual(reply.body)
})
