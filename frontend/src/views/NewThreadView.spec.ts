import { VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, describe, it, vi } from 'vitest'

import NewThreadView from '@/views/NewThreadView.vue'
import { useThreadStore } from '@/stores/thread'
import { wrap } from '@/test-utils'
import { useAuthStore } from '@/stores/auth'
import { userFactory } from '@/stores/auth.factories'
import { threadFactory } from '@/stores/thread.factories'

let wrapper: VueWrapper<typeof NewThreadView>
let threadStore: ReturnType<typeof useThreadStore>

const api = vi.hoisted(() => ({
  post: vi.fn(),
}))

vi.mock('mande', () => ({
  mande: () => api,
}))

const router = vi.hoisted(() => ({
  push: vi.fn(),
}))

vi.mock('vue-router', () => ({
  useRouter: () => router,
}))

beforeEach(() => {
  wrapper = wrap(NewThreadView)
  threadStore = useThreadStore()

  const authStore = useAuthStore()
  authStore.user = userFactory()
})

describe('posting a thread', () => {
  const doIt = async (title = '', body = '') => {
    await wrapper.find('input[placeholder="Title"]').setValue(title)
    await wrapper.find('input[placeholder="Body"]').setValue(body)
    await wrapper.find('form').trigger('submit')
  }

  it('calls threadStore.post', async () => {
    const title = 'a title'
    const body = 'some body text'
    const postThread = vi.spyOn(threadStore, 'post')
    postThread.mockResolvedValueOnce(threadFactory())

    await doIt(title, body)

    expect(postThread).toHaveBeenCalledWith({ title, body })
  })

  it('redirects to the new thread', async () => {
    const thread = threadFactory()
    const pushRoute = vi.spyOn(router, 'push')
    const postThread = vi.spyOn(threadStore, 'post')
    postThread.mockResolvedValueOnce(thread)

    await doIt()

    expect(pushRoute).toHaveBeenCalledWith({
      name: 'thread detail',
      params: { id: thread.id },
    })
  })
})
