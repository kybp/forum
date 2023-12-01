import { VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, it } from 'vitest'

import { RouterLink } from 'vue-router'
import NotFoundView from '@/views/NotFoundView.vue'
import { wrap } from '@/test-utils'

let wrapper: VueWrapper<typeof NotFoundView>

const header = () => wrapper.find('h1')
const homeLink = () => wrapper.findComponent(RouterLink)

beforeEach(() => {
  wrapper = wrap(NotFoundView)
})

it('renders a header with the post title', () => {
  expect(header().text()).toMatch(/not found/i)
})

it('links to the home page', () => {
  expect(homeLink().exists()).toBe(true)
  expect(homeLink().vm.$props.to).toEqual('/')
})
