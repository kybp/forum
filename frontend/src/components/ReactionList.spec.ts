import { VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, it, test } from 'vitest'

import ReactionIcon from '@/components/ReactionIcon.vue'
import ReactionList from '@/components/ReactionList.vue'
import { reactionTypes } from '@/stores/thread'
import type { Thread } from '@/stores/thread'
import { reactionFactory, threadFactory } from '@/stores/thread.factories'
import { wrap } from '@/test-utils'
import { useAuthStore } from '@/stores/auth'
import { accountFactory } from '@/stores/auth.factories'

let wrapper: VueWrapper<typeof ReactionList>
let authStore: ReturnType<typeof useAuthStore>
let thread: Thread

beforeEach(() => {
  thread = threadFactory({ reactions: [reactionFactory()] })
  wrapper = wrap(ReactionList, { propsData: { thread } })
  authStore = useAuthStore()
  authStore.account = accountFactory()
})

it('renders a ReactionIcon for each ReactionType', () => {
  const icons = wrapper.findAllComponents(ReactionIcon)

  expect(icons.length).toEqual(reactionTypes.length)
  expect(new Set(icons.map((x) => x.props().type))).toEqual(
    new Set(reactionTypes),
  )
})

it('does not render reactions with a 0 count when cannot react', async () => {
  const type = 'laugh'
  thread = threadFactory({ reactions: [reactionFactory({ type })] })
  await wrapper.setProps({ thread })
  authStore.account = null

  await wrapper.vm.$nextTick()
  const icons = wrapper.findAllComponents(ReactionIcon)

  expect(icons.length).toEqual(1)
  expect(icons[0].props().type).toEqual(type)
})

test('users can react to everything they can react to', async () => {
  const buttons = wrapper.findAll('li button')

  buttons.forEach((b) => expect(b.attributes().disabled).toBeUndefined())
})

test('users cannot react when not signed in', async () => {
  authStore.account = null

  await wrapper.vm.$nextTick()
  const buttons = wrapper.findAll('li button')

  buttons.forEach((b) => expect(b.attributes().disabled).not.toBeUndefined())
})

test('users cannot react to their own posts', async () => {
  thread = threadFactory({
    author: authStore.account!.id,
    reactions: [reactionFactory()],
  })

  await wrapper.setProps({ thread })
  const buttons = wrapper.findAll('li button')

  buttons.forEach((b) => expect(b.attributes().disabled).not.toBeUndefined())
})
