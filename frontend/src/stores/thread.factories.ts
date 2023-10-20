import { faker } from '@faker-js/faker'

import type { Thread } from '@/stores/thread'
import { makeId } from '@/test-utils'

export const threadFactory = (props: Partial<Thread> = {}): Thread => ({
  id: makeId(),
  author_id: makeId(),
  title: faker.lorem.sentence(),
  body: faker.lorem.paragraph(),
  ...props,
})
