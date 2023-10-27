import { faker } from '@faker-js/faker'

import type {
  PostParams,
  Reaction,
  Reply,
  ReplyParams,
  Thread,
} from '@/stores/thread'
import { makeId } from '@/test-utils'

export const reactionFactory = (props: Partial<Reaction> = {}): Reaction => ({
  user: makeId(),
  content: makeId(),
  type: 'like',
  ...props,
})

export const threadFactory = (props: Partial<Thread> = {}): Thread => ({
  id: makeId(),
  author: makeId(),
  title: faker.lorem.sentence(),
  body: faker.lorem.paragraph(),
  date_posted: faker.date.anytime().toISOString(),
  replies: [],
  reactions: [],
  user_reaction_type: 'like',
  tags: [faker.animal.cat()],
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

export const postParamsFactory = (
  props: Partial<PostParams> = {},
): PostParams => ({
  title: faker.lorem.sentence(),
  body: faker.lorem.paragraph(),
  tags: [faker.animal.bird()],
  ...props,
})

export const replyParamsFactory = (
  props: Partial<ReplyParams> = {},
): ReplyParams => ({
  postId: makeId(),
  body: faker.lorem.paragraph(),
  ...props,
})
