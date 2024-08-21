import { VueWrapper, flushPromises } from '@vue/test-utils'
import { beforeEach, expect, it, test } from 'vitest'
import waitForExpect from 'wait-for-expect'

import ReplyForm from '~/components/ReplyForm.vue'
import { usePostsStore } from '~/stores/posts'
import { wrap, type Wrapper } from '~/test-utils'

let wrapper: VueWrapper<typeof ReplyForm>
let bodyField: Wrapper<HTMLTextAreaElement>
let error: () => Wrapper

const postId = 10

beforeEach(async () => {
  wrapper = await wrap(ReplyForm, { props: { postId } })
  error = () => wrapper.find('span[role="alert"]')
  usePostsStore()

  bodyField = wrapper.find('textarea')

  await bodyField.setValue('some reply text')
})

it('is valid when data is valid', async () => {
  expect(error().exists()).toBe(false)
})

test('body is required', async () => {
  await bodyField.setValue('')
  await bodyField.trigger('change')

  await flushPromises()
  await waitForExpect(() => expect(error().exists()).toBe(true))
})
