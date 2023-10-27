import { VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, it } from 'vitest'

import ReactionIcon from '@/components/ReactionIcon.vue'
import ReactionList from '@/components/ReactionList.vue'
import { reactionTypes } from '@/stores/thread'
import type { Thread } from '@/stores/thread'
import { threadFactory } from '@/stores/thread.factories'
import { wrap } from '@/test-utils'

let wrapper: VueWrapper<typeof ReactionList>
let thread: Thread

beforeEach(() => {
  thread = threadFactory()
  wrapper = wrap(ReactionList, { propsData: { thread } })
})

it('renders a ReactionIcon for each ReactionType', () => {
  const icons = wrapper.findAllComponents(ReactionIcon)

  expect(icons.length).toEqual(reactionTypes.length)
  expect(new Set(icons.map((x) => x.props().type))).toEqual(
    new Set(reactionTypes),
  )
})
