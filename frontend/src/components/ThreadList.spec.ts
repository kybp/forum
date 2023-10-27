import { VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { RouterLink } from 'vue-router'

import PostTag from '@/components/PostTag.vue'
import ThreadList from '@/components/ThreadList.vue'
import type { Thread } from '@/stores/thread'
import { threadFactory } from '@/stores/thread.factories'
import { wrap } from '@/test-utils'

let wrapper: VueWrapper<typeof ThreadList>

describe('when there are no threads', () => {
  beforeEach(() => {
    wrapper = wrap(ThreadList, { propsData: { threads: [] } })
  })

  it('tells you to post', () => {
    expect(wrapper.find('.thread-list').exists()).toBe(false)
    expect(wrapper.text()).toMatch(/post/i)
  })
})

describe('when there are threads', () => {
  let threads: Thread[]

  beforeEach(() => {
    threads = [threadFactory({ id: 17 }), threadFactory({ id: 23 })]
    wrapper = wrap(ThreadList, { propsData: { threads } })
  })

  it('links threads', () => {
    const links = wrapper.findAllComponents(RouterLink)

    expect(links.length).toEqual(threads.length)

    links.forEach((link: VueWrapper<any>) => {
      const href = `${link.vm.$props.to}`
      expect(href).toMatch(new RegExp('threads/\\d+$'))
    })
  })

  it('renders tags for threads', () => {
    const tags = wrapper.findAllComponents(PostTag)

    expect(tags.length).toEqual(
      threads.reduce((acc, x) => acc + x.tags.length, 0),
    )
    tags.forEach((t) => expect(t.props().editable).toBe(false))
  })
})
