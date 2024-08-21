import { VueWrapper, flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, test } from 'vitest'
import waitForExpect from 'wait-for-expect'

import SignInForm from '~/components/SignInForm.vue'
import { wrap, type Wrapper } from '~/test-utils'

let wrapper: VueWrapper<typeof SignInForm>
let usernameField: Wrapper<HTMLInputElement>
let passwordField: Wrapper<HTMLInputElement>

beforeEach(async () => {
  wrapper = await wrap(SignInForm)
  ;[usernameField, passwordField] = wrapper.findAll('input')

  await usernameField.setValue('username')
  await passwordField.setValue('password')
})

describe('form', () => {
  it('is valid when data is valid', async () => {
    expect(wrapper.find('span[role="alert"]').exists()).toBe(false)
  })

  test('username is required', async () => {
    await usernameField.setValue('')
    await usernameField.trigger('change')

    await flushPromises()
    await waitForExpect(() => {
      expect(wrapper.find('span[role="alert"]').exists()).toBe(true)
    })
  })

  test('password is required', async () => {
    await passwordField.setValue('')
    await passwordField.trigger('change')

    await flushPromises()
    await waitForExpect(() => {
      expect(wrapper.find('span[role="alert"]').exists()).toBe(true)
    })
  })
})
