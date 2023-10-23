import { faker } from '@faker-js/faker'

import type { Reply, ReplyParams, Thread } from '@/stores/thread'
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

export const replyParamsFactory = (
  props: Partial<ReplyParams> = {},
): ReplyParams => ({
  postId: makeId(),
  body: faker.lorem.paragraph(),
  ...props,
})
