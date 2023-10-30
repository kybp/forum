import { VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, it, vi } from 'vitest'

import UserAvatar from '@/components/UserAvatar.vue'
import { userFactory } from '@/stores/user.factories'
import type { User } from '@/stores/user'
import { wrap } from '@/test-utils'

const sha256 = vi.hoisted(() => vi.fn())

vi.mock('@/utils', () => ({
  sha256,
}))

let wrapper: VueWrapper<typeof UserAvatar>
let user: User

beforeEach(async () => {
  user = userFactory()
  wrapper = wrap(UserAvatar, { propsData: { user } })
})

it('renders a Gravatar for that email', async () => {
  const hash = 'a hashed email address'
  sha256.mockResolvedValue(hash)

  await wrapper.setProps({ user: { ...user, email: 'x' + user.email } })

  expect(sha256).toHaveBeenCalledWith(user.email)
  expect(wrapper.find('img').attributes().src).toMatch(
    new RegExp(`^https://gravatar.com/avatar/`),
  )
})
