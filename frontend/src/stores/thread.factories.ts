import { faker } from '@faker-js/faker'

import type { Thread } from '@/stores/thread'

export const threadFactory = (props: Partial<Thread> = {}): Thread => ({
  id: Math.floor(Math.random()),
  author_id: Math.floor(Math.random()),
  title: faker.lorem.sentence(),
  body: faker.lorem.paragraph(),
  ...props,
})
