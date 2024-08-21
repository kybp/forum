import { VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, it, test } from 'vitest'

import ReactionIcon from '~/components/ReactionIcon.vue'
import ReactionList from '~/components/ReactionList.vue'
import { reactionTypes } from '~/types'
import type { Thread } from '~/types'
import { reactionFactory, threadFactory } from '~/stores/posts.factories'
import { wrap } from '~/test-utils'
import { useAuthStore } from '~/stores/auth'
import { accountFactory } from '~/factories'

let wrapper: VueWrapper<typeof ReactionList>
let authStore: ReturnType<typeof useAuthStore>
let post: Thread

beforeEach(async () => {
  post = threadFactory({ reactions: [reactionFactory()] })
  wrapper = await wrap(ReactionList, { props: { post } })
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
  post = threadFactory({
    author: authStore.account!.id,
    reactions: [reactionFactory()],
  })

  await wrapper.setProps({ post })
  const buttons = wrapper.findAll('li button')

  buttons.forEach((b) => expect(b.attributes().disabled).not.toBeUndefined())
})
