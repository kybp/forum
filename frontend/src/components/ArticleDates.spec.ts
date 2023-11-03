import { VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

import ArticleDates from './ArticleDates.vue'
import { wrap } from '@/test-utils'
import type { Reply } from '@/stores/thread'
import { replyFactory } from '@/stores/thread.factories'

let wrapper: VueWrapper<typeof ArticleDates>
let article: Reply

const posted = () => wrapper.find('.posted')
const edited = () => wrapper.find('.edited')

describe('when the article has been edited', () => {
  beforeEach(async () => {
    article = replyFactory({ date_edited: new Date().toISOString() })
    wrapper = wrap(ArticleDates, { propsData: { article } })
  })

  it('renders "first posted"', () => {
    expect(posted().text()).toMatch(/^first posted/i)
  })

  it('renders "updated"', () => {
    expect(edited().text()).toMatch(/^updated/i)
  })
})

describe('when the article has not been edited', () => {
  beforeEach(async () => {
    article = replyFactory({ date_edited: null })
    wrapper = wrap(ArticleDates, { propsData: { article } })
  })

  it('renders "posted"', () => {
    expect(posted().text()).toMatch(/^posted/i)
  })

  it('does not render "updated"', () => {
    expect(edited().exists()).toBe(false)
  })
})
