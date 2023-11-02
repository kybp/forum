import { faker } from '@faker-js/faker'

import type { User } from '@/stores/user'
import { makeId } from '@/test-utils'

export const userFactory = (props: Partial<User> = {}): User => ({
  id: makeId(),
  username: faker.internet.userName(),
  avatar: faker.internet.url(),
  ...props,
})
