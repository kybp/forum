import { VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

import MarkdownPages from '~/components/MarkdownPages.vue'
import MarkdownBody from '~/components/MarkdownBody.vue'
import type { Page } from '~/types'
import { wrap } from '~/test-utils'
import { pageFactory } from '~/factories'

let wrapper: VueWrapper<typeof MarkdownPages>

const previousPageLink = () => wrapper.find('[data-testid="previous-page"]')

const nextPageLink = () => wrapper.find('[data-testid="next-page"]')

const markdownBody = () => wrapper.findComponent(MarkdownBody)

const defaultProps = Object.freeze({ title: 'title', value: 'Body 1' })

beforeEach(async () => {
  wrapper = await wrap(MarkdownPages, { props: defaultProps })
})

describe('rendering', () => {
  describe('when the page body has at least 2 pages', () => {
    let pages: Page[]

    beforeEach(async () => {
      pages = [
        pageFactory({
          title: 'Title 1',
          body: 'Body 1',
        }),
        pageFactory({
          title: 'Title 2',
          body: 'Body 2',
        }),
      ]

      await wrapper.setProps({
        title: pages[0].title,
        value: `${pages[0].body}\n\n# ${pages[1].title}\n\n${pages[1].body}`,
      })
    })

    describe('when on first page', () => {
      it('renders the first page of the post body', () => {
        expect(markdownBody().text()).toBe(pages[0].body)
      })

      it('does not render the previous page link', () => {
        expect(previousPageLink().exists()).toBe(false)
      })

      it('renders the next page link', () => {
        expect(nextPageLink().exists()).toBe(true)
      })
    })
  })

  describe('when the page body only has 1 page', () => {
    const props = Object.freeze({
      title: 'a title',
      value: 'a body',
    })

    beforeEach(async () => {
      await wrapper.setProps(props)
    })

    it('renders the post body in a MarkdownBody', () => {
      // The pagination logic appends an extra newline
      expect(markdownBody().props().value.trimEnd()).toBe(props.value)
    })

    it('does not render the previous page link', () => {
      expect(previousPageLink().exists()).toBe(false)
    })

    it('does not render the next page link', () => {
      expect(nextPageLink().exists()).toBe(false)
    })
  })
})
