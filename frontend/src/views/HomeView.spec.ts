import { VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { RouterLink } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'
import { userFactory } from '@/stores/auth.factories'
import { wrap } from '@/test-utils'

let wrapper: VueWrapper<typeof HomeView>
let authStore: ReturnType<typeof useAuthStore>

beforeEach(() => {
  wrapper = wrap(HomeView)
  authStore = useAuthStore()
})

describe('rendering', () => {
  describe('when the user is signed in', () => {
    beforeEach(() => {
      authStore.user = userFactory()
    })

    it('links the "new thread" page', () => {
      const link = wrapper.findComponent(RouterLink)
      expect(link.exists()).toBe(true)
      expect(link.vm.$props.to).toEqual('/post')
    })
  })

  describe('when the user is signed out', () => {
    beforeEach(() => {
      authStore.user = null
    })

    it('does not render a "new thread" button', () => {
      const link = wrapper.findComponent(RouterLink)
      expect(link.exists()).toBe(false)
    })
  })
})
