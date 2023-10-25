import { DOMWrapper, VueWrapper, flushPromises } from '@vue/test-utils'
import { beforeEach, expect, it, test } from 'vitest'
import waitForExpect from 'wait-for-expect'

import ReplyForm from '@/components/ReplyForm.vue'
import { useThreadStore } from '@/stores/thread'
import { wrap } from '@/test-utils'

let wrapper: VueWrapper<typeof ReplyForm>
let bodyField: DOMWrapper<HTMLTextAreaElement>

const postId = 10

beforeEach(async () => {
  wrapper = wrap(ReplyForm, { propsData: { postId } }, false)
  useThreadStore()

  bodyField = wrapper.find('textarea')

  await bodyField.setValue('some reply text')
})

it('is valid when data is valid', async () => {
  expect(wrapper.find('span[role="alert"]').exists()).toBe(false)
})

test('body is required', async () => {
  await bodyField.setValue('')
  await bodyField.trigger('change')

  await flushPromises()
  await waitForExpect(() => {
    expect(wrapper.find('span[role="alert"]').exists()).toBe(true)
  })
})
