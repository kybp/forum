import { VueWrapper } from '@vue/test-utils'
import { expect, it } from 'vitest'
import { RouterLink } from 'vue-router'

import ThreadList from '@/components/ThreadList.vue'
import { threadFactory } from '@/stores/thread.factories'
import { wrap } from '@/test-utils'

let wrapper: VueWrapper<typeof ThreadList>

it('links each thread when there are threads', () => {
  const threads = [threadFactory({ id: 17 }), threadFactory({ id: 23 })]

  wrapper = wrap(ThreadList, { propsData: { threads } })

  const links = wrapper.findAllComponents(RouterLink)

  expect(links.length).toEqual(threads.length)

  links.forEach((link: VueWrapper<any>) => {
    const href = `${link.vm.$props.to}`
    expect(href).toMatch(new RegExp('threads/\\d+$'))
  })
})

it('tells you to post when there are no threads', () => {
  wrapper = wrap(ThreadList, { propsData: { threads: [] } })
  expect(wrapper.find('.thread-list').exists()).toBe(false)
  expect(wrapper.text()).toMatch(/post/i)
})
