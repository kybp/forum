import { VueWrapper, flushPromises } from '@vue/test-utils'
import { Field } from 'vee-validate'
import { beforeEach, expect, it, test } from 'vitest'
import waitForExpect from 'wait-for-expect'

import PostForm from '@/components/PostForm.vue'
import { wrap } from '@/test-utils'

let wrapper: VueWrapper<typeof PostForm>
let titleField: VueWrapper<any>

beforeEach(async () => {
  wrapper = wrap(PostForm, { propsData: { errors: null } }, false)
  ;[titleField] = wrapper.findAllComponents(Field)
  titleField.setValue('text')
})

it('is valid when data is valid', async () => {
  await flushPromises()
  await waitForExpect(() => {
    expect(wrapper.find('span[role="alert"]').exists()).toBe(false)
  })
})

test('title is required', async () => {
  titleField.setValue('')
  titleField.trigger('change')

  await flushPromises()
  await waitForExpect(() => {
    expect(wrapper.find('span[role="alert"]').exists()).toBe(true)
  })
})
