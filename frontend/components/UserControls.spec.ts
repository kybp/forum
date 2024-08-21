import { RouterLinkStub, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, test, vi } from 'vitest'

import SignInForm from '~/components/SignInForm.vue'
import UserControls from '~/components/UserControls.vue'
import { useAuthStore } from '~/stores/auth'
import { accountFactory } from '~/factories'
import { wrap, type Wrapper } from '@/test-utils'

let wrapper: VueWrapper<typeof UserControls>
let authStore: ReturnType<typeof useAuthStore>
let signInForm: () => Wrapper
let signOutButton: () => Wrapper

beforeEach(async () => {
  wrapper = await wrap(UserControls)
  signInForm = () => wrapper.findComponent(SignInForm)
  signOutButton = () => wrapper.find('button.sign-out')
  authStore = useAuthStore()
  authStore.signOut = vi.fn()
})

describe('rendering', () => {
  describe('when the user is signed in', () => {
    beforeEach(() => {
      authStore.account = accountFactory()
    })

    it('renders a sign-out button', () => {
      expect(signOutButton().text()).toMatch(/sign out/i)
    })

    it('does not render a sign-in form', () => {
      expect(signInForm().exists()).toBe(false)
    })

    it('renders a link to the account page', () => {
      const link = wrapper.findComponent(RouterLinkStub)
      expect(link.exists()).toBe(true)
      expect(link.props().to).toEqual('/account')
    })
  })

  describe('when the user is signed out', () => {
    beforeEach(() => {
      authStore.account = null
    })

    it('does not render a sign-out button', () => {
      expect(signOutButton().exists()).toBe(false)
    })

    it('renders a sign-in form', () => {
      expect(signInForm().exists()).toBe(true)
    })

    it('does not link to the account page', () => {
      expect(wrapper.findComponent(RouterLinkStub).exists()).toBe(false)
    })
  })
})

test('signOut calls authStore.signOut', () => {
  wrapper.vm.signOut()

  expect(authStore.signOut).toHaveBeenCalled()
})
