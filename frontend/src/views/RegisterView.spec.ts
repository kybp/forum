import { DOMWrapper, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, test } from 'vitest'
import flushPromises from 'flush-promises'
import waitForExpect from 'wait-for-expect'

import RegisterView from '@/views/RegisterView.vue'
import { useAuthStore } from '@/stores/auth'
import { wrap } from '@/test-utils'

let wrapper: VueWrapper<typeof RegisterView>
let authStore: ReturnType<typeof useAuthStore>

beforeEach(() => {
  wrapper = wrap(RegisterView, {}, false)
  authStore = useAuthStore()
})

describe('form', () => {
  let usernameField: DOMWrapper<HTMLInputElement>
  let emailField: DOMWrapper<HTMLInputElement>
  let passwordField: DOMWrapper<HTMLInputElement>
  let passwordCofirmationField: DOMWrapper<HTMLInputElement>

  beforeEach(async () => {
    ;[usernameField, emailField, passwordField, passwordCofirmationField] =
      wrapper.findAll('input')

    await usernameField.setValue('username')
    await emailField.setValue('email@example.com')
    await passwordField.setValue('password')
  })

  test('form is valid when data is valid', async () => {
    await flushPromises()
    await waitForExpect(() => {
      expect(wrapper.find('span[role="alert"]').exists()).toBe(false)
    })
  })

  test('username is required', async () => {
    await usernameField.setValue('')

    await flushPromises()
    await waitForExpect(() => {
      expect(wrapper.find('span[role="alert"]').exists()).toBe(true)
    })
  })

  test('email is required', async () => {
    await emailField.setValue('')

    await flushPromises()
    await waitForExpect(() => {
      expect(wrapper.find('span[role="alert"]').exists()).toBe(true)
    })
  })

  test('email must be valid', async () => {
    await emailField.setValue('a good email')

    await flushPromises()
    await waitForExpect(() => {
      expect(wrapper.find('span[role="alert"]').exists()).toBe(true)
    })
  })

  test('password is required', async () => {
    await passwordField.setValue('')

    await flushPromises()
    await waitForExpect(() => {
      expect(wrapper.find('span[role="alert"]').exists()).toBe(true)
    })
  })

  test('password confirmation must match password', async () => {
    await passwordField.setValue('some password')
    await passwordCofirmationField.setValue('a different password')

    await flushPromises()
    await waitForExpect(() => {
      expect(wrapper.find('span[role="alert"]').exists()).toBe(true)
    })
  })

  test('API errors are reported', async () => {
    authStore.registerErrors = { username: ['some error'] }

    await flushPromises()
    await waitForExpect(() => {
      expect(wrapper.find('span[role="alert"]').exists()).toBe(true)
    })
  })
})
