import { DOMWrapper, VueWrapper, flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, test, vi } from 'vitest'
import waitForExpect from 'wait-for-expect'

import SignInForm from '@/components/SignInForm.vue'
import { useAuthStore } from '@/stores/auth'
import { wrap } from '@/test-utils'

vi.mock('vue-router', async () => {
  const actual: any = await vi.importActual('vue-router')

  return {
    useRoute: () => ({ path: '' }),
    RouterLink: actual.RouterLink,
  }
})

let wrapper: VueWrapper<typeof SignInForm>
let authStore: ReturnType<typeof useAuthStore>
let usernameField: DOMWrapper<HTMLInputElement>
let passwordField: DOMWrapper<HTMLInputElement>

beforeEach(async () => {
  wrapper = wrap(SignInForm, {}, false)
  authStore = useAuthStore()
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

  test('API errors are reported', async () => {
    authStore.signInErrors = { username: ['some error'] }

    await flushPromises()
    await waitForExpect(() => {
      expect(wrapper.find('span[role="alert"]').exists()).toBe(true)
    })
  })
})
