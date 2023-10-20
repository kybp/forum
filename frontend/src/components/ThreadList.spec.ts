import { VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, it } from 'vitest'
import { RouterLink } from 'vue-router'

import ThreadList from '@/components/ThreadList.vue'
import { threadFactory } from '@/stores/thread.factories'
import { wrap } from '@/test-utils'

let wrapper: VueWrapper<typeof ThreadList>

beforeEach(async () => {
  wrapper = wrap(ThreadList)
})

it('links each thread', () => {
  const threads = {
    17: threadFactory({ id: 17 }),
    23: threadFactory({ id: 23 }),
  }

  wrapper = wrap(ThreadList, { propsData: { threads } })

  const links = wrapper.findAllComponents(RouterLink)

  expect(links.length).toEqual(Object.keys(threads).length)

  links.forEach((link) => {
    const href = `${link.vm.$props.to}`
    expect(href).toMatch(new RegExp('threads/\\d+$'))
  })
})
