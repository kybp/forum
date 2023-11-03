import { VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, it } from 'vitest'

import { useAuthStore } from '@/stores/auth'
import { wrap } from '@/test-utils'
import AccountView from '@/views/AccountView.vue'
import { accountFactory } from '@/stores/auth.factories'

let wrapper: VueWrapper<typeof AccountView>
let authStore: ReturnType<typeof useAuthStore>

const deleteButton = () => wrapper.find('button')

const passwordInput = () => wrapper.find('input[type="password"]')

const confirmDeleteButton = () => wrapper.find('button.confirm')

const error = () => wrapper.find('span[role="alert"]')

beforeEach(() => {
  wrapper = wrap(AccountView)
  authStore = useAuthStore()
  authStore.account = accountFactory()
})

it('renders delete account button', () => {
  expect(deleteButton().text()).toMatch(/delete account/i)
})

it('does not initially render password or confirm delete', () => {
  expect(passwordInput().exists()).toBe(false)
  expect(confirmDeleteButton().exists()).toBe(false)
})

it('renders password input after delete is clicked', async () => {
  await deleteButton().trigger('click')
  expect(passwordInput().exists()).toBe(true)
})

it('renders confirm delete button after delete is clicked', async () => {
  await deleteButton().trigger('click')
  expect(confirmDeleteButton().exists()).toBe(true)
})

it('checks password when confirming delete', async () => {
  const username = authStore.account!.username
  const password = 'some password'

  await deleteButton().trigger('click')
  await passwordInput().setValue(password)
  await confirmDeleteButton().trigger('click')

  expect(authStore.signIn).toHaveBeenCalledWith({ username, password })
})

it('shows an error if password does not work', async () => {
  authStore.signInErrors = { non_field_errors: ['error'] }

  await deleteButton().trigger('click')
  await confirmDeleteButton().trigger('click')

  expect(error().exists()).toBe(true)
})

it('calls authStore.deleteAccount if password works', async () => {
  await deleteButton().trigger('click')
  await confirmDeleteButton().trigger('click')

  expect(authStore.deleteAccount).toHaveBeenCalled()
})
