import { RouterLinkStub, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

import PostTag from '~/components/PostTag.vue'
import ThreadList from '~/components/ThreadList.vue'
import { threadFactory } from '~/stores/posts.factories'
import { wrap } from '~/test-utils'
import type { Thread } from '~/types'

let wrapper: VueWrapper<typeof ThreadList>

describe('when there are no threads', () => {
  beforeEach(async () => {
    wrapper = await wrap(ThreadList, { props: { threads: [] } })
  })

  it('tells you to post', () => {
    expect(wrapper.find('.thread-list').exists()).toBe(false)
    expect(wrapper.text()).toMatch(/post/i)
  })
})

describe('when there are threads', () => {
  let threads: Thread[]

  beforeEach(async () => {
    threads = [threadFactory({ id: 17 }), threadFactory({ id: 23 })]
    wrapper = await wrap(ThreadList, { props: { threads } })
  })

  it('links threads', () => {
    const links = wrapper.findAllComponents(RouterLinkStub)

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
