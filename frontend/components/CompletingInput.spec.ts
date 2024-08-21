import { VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, it } from 'vitest'

import CompletingInput from '~/components/CompletingInput.vue'
import { wrap } from '~/test-utils'

let wrapper: VueWrapper<typeof CompletingInput>

const lastEmit = (type: string) => {
  const emitted = wrapper.emitted()

  if (emitted[type] === undefined) return

  const lastIndex = emitted[type].length - 1
  return emitted[type][lastIndex]
}

const choice = 'some text'

beforeEach(async () => {
  wrapper = await wrap(CompletingInput, {
    props: { choices: [choice], modelValue: '' },
  })
})

it('does not initially show suggestions', () => {
  expect(wrapper.find('ul').classes()).toContainEqual('closed')
})

it('shows suggestions after pressing down', async () => {
  await wrapper.find('input').trigger('keydown.down')

  expect(wrapper.find('ul').classes()).toContainEqual('open')
})

it('shows suggestions after entering text', async () => {
  await wrapper.find('input').setValue('value')

  expect(wrapper.find('ul').classes()).toContainEqual('open')
})

it('shows suggestions after clicking', async () => {
  await wrapper.find('input').trigger('click')

  expect(wrapper.find('ul').classes()).toContainEqual('open')
})

it('does not show suggestions after selecting one', async () => {
  await wrapper.find('input').trigger('keydown.down')
  await wrapper.find('input').trigger('keydown.enter')

  expect(wrapper.find('ul').classes()).toContainEqual('closed')
})

it('emits update to active suggestion on keydown.enter', async () => {
  await wrapper.setProps({ choices: ['foo', 'bar', 'baz'] })

  await wrapper.find('input').setValue('b')
  await wrapper.find('input').trigger('keydown.down')
  await wrapper.find('input').trigger('keydown.enter')

  expect(lastEmit('update:modelValue')).toEqual(['bar'])
})

it('emits change to active suggestion on blur', async () => {
  await wrapper.setProps({ choices: ['foo', 'bar', 'baz'] })

  await wrapper.find('input').setValue('b')
  await wrapper.find('input').trigger('keydown.down')
  await wrapper.find('input').trigger('blur')

  expect(lastEmit('update:modelValue')).toEqual(['bar'])
})

it('cycles through choices when pressing down', async () => {
  await wrapper.setProps({ choices: ['foo', 'bar', 'baz'] })

  await wrapper.find('input').setValue('b')
  await wrapper.find('input').trigger('keydown.down')
  await wrapper.find('input').trigger('keydown.down')
  await wrapper.find('input').trigger('blur')

  expect(lastEmit('update:modelValue')).toEqual(['baz'])
})

it('cycles through choices when pressing up', async () => {
  await wrapper.setProps({ choices: ['foo', 'bar', 'baz'] })

  await wrapper.find('input').setValue('b')
  await wrapper.find('input').trigger('keydown.up')
  await wrapper.find('input').trigger('keydown.up')
  await wrapper.find('input').trigger('blur')

  expect(lastEmit('update:modelValue')).toEqual(['bar'])
})

it('unselects when pressing up on the first suggestion', async () => {
  await wrapper.setProps({ choices: ['foo', 'bar', 'baz'] })

  await wrapper.find('input').setValue('b')
  await wrapper.find('input').trigger('keydown.down')
  await wrapper.find('input').trigger('keydown.up')
  await wrapper.find('input').trigger('blur')

  expect(lastEmit('update:modelValue')).toEqual(['b'])
})

it('unselects when pressing down on the last suggestion', async () => {
  await wrapper.setProps({ choices: ['bar', 'baz'] })

  await wrapper.find('input').setValue('b')
  await wrapper.find('input').trigger('keydown.down')
  await wrapper.find('input').trigger('keydown.up')
  await wrapper.find('input').trigger('blur')

  expect(lastEmit('update:modelValue')).toEqual(['b'])
})

it('unselects when user types beyond suggestions', async () => {
  await wrapper.setProps({ choices: ['bar', 'baz'] })

  await wrapper.find('input').setValue('b')
  await wrapper.find('input').trigger('keydown.down')
  await wrapper.find('input').setValue('bb')
  await wrapper.find('input').trigger('blur')

  expect(lastEmit('update:modelValue')).toEqual(['bb'])
})

it('unselects on keydown.escape', async () => {
  await wrapper.setProps({ choices: ['bar', 'baz'] })

  await wrapper.find('input').setValue('b')
  await wrapper.find('input').trigger('keydown.down')
  await wrapper.find('input').trigger('keydown.esc')
  await wrapper.find('input').trigger('blur')

  expect(lastEmit('update:modelValue')).toEqual(['b'])
})
