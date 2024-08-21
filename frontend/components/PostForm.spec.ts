import { flushPromises, VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, it, test } from 'vitest'
import waitForExpect from 'wait-for-expect'

import PostForm from '~/components/PostForm.vue'
import PostTag from '~/components/PostTag.vue'
import { wrap, type Wrapper } from '~/test-utils'

let wrapper: VueWrapper
let titleField: Wrapper<HTMLInputElement>
let addTagButton: Wrapper<HTMLButtonElement>
let bodyField: Wrapper<HTMLTextAreaElement>

beforeEach(async () => {
  wrapper = await wrap(PostForm)
  titleField = wrapper.get('input')
  addTagButton = wrapper.get('button')
  bodyField = wrapper.get('textarea')
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

it('does not initially render tag inputs', () => {
  expect(wrapper.findComponent(PostTag).exists()).toBe(false)
})

it('allows adding tags', async () => {
  await addTagButton.trigger('click')

  const tagInput = wrapper.findComponent(PostTag)
  expect(tagInput.exists()).toBe(true)
  expect(tagInput.props().editable).toBe(true)
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
