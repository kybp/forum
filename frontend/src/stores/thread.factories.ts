import { faker } from '@faker-js/faker'

import type { Reply, Thread } from '@/stores/thread'
import { makeId } from '@/test-utils'

export const threadFactory = (props: Partial<Thread> = {}): Thread => ({
  id: makeId(),
  author: makeId(),
  title: faker.lorem.sentence(),
  body: faker.lorem.paragraph(),
  date_posted: faker.date.anytime().toISOString(),
  replies: [],
  ...props,
})

export const replyFactory = (props: Partial<Reply> = {}): Reply => ({
  id: makeId(),
  author: makeId(),
  post: makeId(),
  body: faker.lorem.paragraph(),
  date_posted: faker.date.anytime().toISOString(),
  ...props,
})
