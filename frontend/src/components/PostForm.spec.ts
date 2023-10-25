import { DOMWrapper, VueWrapper, flushPromises } from '@vue/test-utils'
import { beforeEach, expect, it, test } from 'vitest'
import waitForExpect from 'wait-for-expect'

import PostForm from '@/components/PostForm.vue'
import { wrap } from '@/test-utils'

let wrapper: VueWrapper<typeof PostForm>
let titleField: DOMWrapper<HTMLInputElement>
let bodyField: DOMWrapper<HTMLTextAreaElement>

beforeEach(async () => {
  wrapper = wrap(PostForm, { propsData: { errors: null } }, false)
  titleField = wrapper.find('input')
  bodyField = wrapper.find('textarea')
  await titleField.setValue('text')
})

it('is valid when data is valid', async () => {
  await flushPromises()
  await waitForExpect(() => {
    expect(wrapper.find('span[role="alert"]').exists()).toBe(false)
  })
})

test('title is required', async () => {
  await titleField.setValue('')

  await flushPromises()
  await waitForExpect(() => {
    expect(wrapper.find('span[role="alert"]').exists()).toBe(true)
  })
})

it('renders a preview', async () => {
  const title = 'title'
  const body = 'body'

  await titleField.setValue(title)
  await bodyField.setValue(`## ${body}`)

  const preview = wrapper.find('.preview')

  expect(preview.find('h1').text()).toEqual(title)
  expect(preview.find('h2').text()).toEqual(body)
})
