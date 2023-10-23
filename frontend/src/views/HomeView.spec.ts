import { VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { RouterLink } from 'vue-router'

import LoadingPlaceholder from '@/components/LoadingPlaceholder.vue'
import ThreadList from '@/components/ThreadList.vue'
import { useAuthStore } from '@/stores/auth'
import { userFactory } from '@/stores/auth.factories'
import { useThreadStore } from '@/stores/thread'
import { threadFactory } from '@/stores/thread.factories'
import { wrap } from '@/test-utils'
import HomeView from '@/views/HomeView.vue'

let wrapper: VueWrapper<typeof HomeView>
let authStore: ReturnType<typeof useAuthStore>
let threadStore: ReturnType<typeof useThreadStore>

beforeEach(() => {
  wrapper = wrap(HomeView)
  authStore = useAuthStore()
  threadStore = useThreadStore()
})

describe('rendering', () => {
  const itRendersThreadList = () => {
    it('is loading when the thread list is loading', async () => {
      threadStore.loadingThreadList = true
      await wrapper.vm.$nextTick()
      expect(wrapper.findComponent(LoadingPlaceholder).exists()).toBe(true)
    })

    it('renders a ThreadList when not loading', async () => {
      const threads = { 1: threadFactory({ id: 1 }) }

      threadStore.allThreads = threads
      await wrapper.vm.$nextTick()

      const list = wrapper.findComponent(ThreadList)
      expect(list.exists()).toBe(true)
      expect(list.vm.$props.threads).toEqual([threads[1]])
    })
  }

  describe('when the user is signed in', () => {
    beforeEach(() => {
      authStore.user = userFactory()
    })

    it('links the "new thread" page', () => {
      const link = wrapper.findComponent(RouterLink)
      expect(link.exists()).toBe(true)
      expect(link.vm.$props.to).toEqual('/post')
    })

    itRendersThreadList()
  })

  describe('when the user is signed out', () => {
    beforeEach(() => {
      authStore.user = null
    })

    it('does not render a "new thread" button', () => {
      const link = wrapper.findComponent(RouterLink)
      expect(link.exists()).toBe(false)
    })

    itRendersThreadList()
  })
})
