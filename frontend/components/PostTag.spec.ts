import { DOMWrapper, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

import PostTag from '~/components/PostTag.vue'
import { wrap } from '~/test-utils'

let wrapper: VueWrapper<typeof PostTag>
let deleteButton: DOMWrapper<HTMLButtonElement>

describe('when editable', () => {
  beforeEach(async () => {
    wrapper = await wrap(PostTag, { props: { value: '', editable: true } })
    deleteButton = wrapper.find('button')
  })

  it('emits delete events', async () => {
    await deleteButton.trigger('click')
    expect(wrapper.emitted().delete.length).toEqual(1)
  })
})

describe('when not editable', () => {
  const tag = 'tag text'

  beforeEach(async () => {
    wrapper = await wrap(PostTag, { props: { value: tag } })
  })

  it('renders the tag name', () => {
    expect(wrapper.text()).toEqual(tag)
  })
})
