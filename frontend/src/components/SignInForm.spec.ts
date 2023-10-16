import { VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, test } from 'vitest'

import SignInForm from '@/components/SignInForm.vue'
import { useAuthStore } from '@/stores/auth'
import { wrap } from '@/test-utils'

let wrapper: VueWrapper<typeof SignInForm>
let authStore: ReturnType<typeof useAuthStore>

beforeEach(() => {
  wrapper = wrap(SignInForm)
  authStore = useAuthStore()
})

test('signIn calls authStore.signIn', async () => {
  const username = 'username'
  const password = 'password'

  await wrapper.find('input[type="text"]').setValue(username)
  await wrapper.find('input[type="password"]').setValue(password)
  await wrapper.find('button[type="submit"]').trigger('click')

  expect(authStore.signIn).toHaveBeenCalledWith({ username, password })
})
