import { DOMWrapper, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

import PostTag from '@/components/PostTag.vue'
import { wrap } from '@/test-utils'

let wrapper: VueWrapper<typeof PostTag>
let nameField: DOMWrapper<HTMLInputElement>
let deleteButton: DOMWrapper<HTMLButtonElement>

describe('when editable', () => {
  beforeEach(async () => {
    wrapper = wrap(PostTag, { propsData: { value: '', editable: true } }, false)
    nameField = wrapper.find('input')
    deleteButton = wrapper.find('button')
  })

  it('emits input events', async () => {
    const tag = 'tag name'
    await nameField.setValue(tag)
    expect(wrapper.emitted().input.length).toEqual(1)
    expect(wrapper.emitted().input[0]).toEqual([tag])
  })

  it('emits delete events', async () => {
    await deleteButton.trigger('click')
    expect(wrapper.emitted().delete.length).toEqual(1)
  })
})

describe('when not editable', () => {
  const tag = 'tag text'

  beforeEach(() => {
    wrapper = wrap(PostTag, { propsData: { value: tag } }, false)
  })

  it('renders the tag name', () => {
    expect(wrapper.text()).toEqual(tag)
  })
})
