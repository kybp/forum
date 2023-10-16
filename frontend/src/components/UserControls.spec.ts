import { VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, test } from 'vitest'
import { RouterLink } from 'vue-router'

import SignInForm from '@/components/SignInForm.vue'
import UserControls from '@/components/UserControls.vue'
import { useAuthStore } from '@/stores/auth'
import { userFactory } from '@/stores/auth.factories'
import { wrap } from '@/test-utils'

let wrapper: VueWrapper<typeof UserControls>
let authStore: ReturnType<typeof useAuthStore>

beforeEach(() => {
  wrapper = wrap(UserControls)
  authStore = useAuthStore()
})

describe('rendering', () => {
  describe('when the user is signed in', () => {
    beforeEach(() => {
      authStore.user = userFactory()
    })

    it('renders a sign-out button', () => {
      expect(wrapper.find('button').text()).toMatch(/sign out/i)
    })

    it('does not render a sign-in form', () => {
      expect(wrapper.findComponent(SignInForm).exists()).toBe(false)
    })

    it('does not link to the registration page', () => {
      expect(wrapper.findComponent(RouterLink).exists()).toBe(false)
    })
  })

  describe('when the user is signed out', () => {
    beforeEach(() => {
      authStore.user = null
    })

    it('does not render a sign-out button', () => {
      expect(wrapper.find('button').exists()).toBe(false)
    })

    it('renders a sign-in form', () => {
      expect(wrapper.findComponent(SignInForm).exists()).toBe(true)
    })

    it('links to the registration page', () => {
      const link = wrapper.findComponent(RouterLink)

      expect(link.props().to).toEqual('/register')
    })
  })
})

test('signOut calls authStore.signOut', () => {
  wrapper.vm.signOut()

  expect(authStore.signOut).toHaveBeenCalled()
})
