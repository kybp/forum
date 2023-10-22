import { VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

import ReplyForm from '@/components/ReplyForm.vue'
import { useThreadStore } from '@/stores/thread'
import { wrap } from '@/test-utils'

let wrapper: VueWrapper<typeof ReplyForm>
let threadStore: ReturnType<typeof useThreadStore>

const postId = 10

beforeEach(async () => {
  wrapper = wrap(ReplyForm, { propsData: { postId } })
  threadStore = useThreadStore()
})

describe('reply', () => {
  it('calls threadStore.reply', async () => {
    const body = 'lots of interesting text'

    await wrapper.find('textarea').setValue(body)
    await wrapper.find('form').trigger('submit')

    expect(threadStore.reply).toHaveBeenCalledWith({ postId, body })
  })

  it('clears the body input', async () => {
    const body = 'some great body text'

    await wrapper.find('textarea').setValue(body)
    await wrapper.find('form').trigger('submit')

    expect(wrapper.find('textarea').element.value).toEqual('')
  })
})
