import { VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, test } from 'vitest'

import RegisterView from '@/views/RegisterView.vue'
import { useAuthStore } from '@/stores/auth'
import { wrap } from '@/test-utils'

let wrapper: VueWrapper<typeof RegisterView>
let authStore: ReturnType<typeof useAuthStore>

beforeEach(() => {
  wrapper = wrap(RegisterView)
  authStore = useAuthStore()
})

test('register calls authStore.register', async () => {
  const username = 'username'
  const email = 'foo@example.com'
  const password = 'password'

  await wrapper.find('input[placeholder="Username"]').setValue(username)
  await wrapper.find('input[placeholder="Email"]').setValue(email)
  await wrapper.find('input[type="password"]').setValue(password)
  await wrapper.find('button[type="submit"]').trigger('click')

  expect(authStore.register).toHaveBeenCalledWith({ username, email, password })
})
