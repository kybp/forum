import { faker } from '@faker-js/faker'

import type { Account, ThreadFilters, Reaction, Thread, Reply } from '~/types'
import type {
  CreatePostParams,
  UpdatePostParams,
  CreateReplyParams,
  UpdateReplyParams,
} from '~/stores/posts'
import { makeId } from '~/test-utils'

export const accountFactory = (props: Partial<Account> = {}): Account => ({
  id: Math.floor(Math.random()),
  username: faker.internet.userName(),
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
  theme: 'light',
  token: faker.internet.ipv6(),
  ...props,
})

export const reactionFactory = (props: Partial<Reaction> = {}): Reaction => ({
  user: makeId(),
  content: makeId(),
  type: 'like',
  ...props,
})

export const threadFactory = (props: Partial<Thread> = {}): Thread => ({
  id: makeId(),
  is_deleted: false,
  author: makeId(),
  title: faker.lorem.sentence(),
  body: faker.lorem.paragraph(),
  date_posted: faker.date.anytime().toISOString(),
  date_edited: faker.date.anytime().toISOString(),
  replies: [],
  reactions: [],
  user_reaction_type: 'like',
  tags: [faker.animal.cat()],
  ...props,
})

export const createPostParamsFactory = (
  props: Partial<CreatePostParams> = {},
): CreatePostParams => ({
  title: faker.lorem.sentence(),
  body: faker.lorem.paragraph(),
  tags: [faker.animal.bird()],
  ...props,
})

export const updatePostParamsFactory = (
  props: Partial<UpdatePostParams> = {},
): UpdatePostParams => ({
  id: makeId(),
  title: faker.lorem.sentence(),
  body: faker.lorem.paragraph(),
  tags: [faker.animal.bird()],
  ...props,
})

export const replyFactory = (props: Partial<Reply> = {}): Reply => ({
  id: makeId(),
  author: makeId(),
  post: makeId(),
  body: faker.lorem.paragraph(),
  date_posted: faker.date.anytime().toISOString(),
  date_edited: faker.date.anytime().toISOString(),
  ...props,
})

export const threadFiltersFactory = (
  props: Partial<ThreadFilters> = {},
): ThreadFilters => ({
  authors: [],
  tags: [],
  ...props,
})

export const createReplyParamsFactory = (
  props: Partial<CreateReplyParams> = {},
): CreateReplyParams => ({
  postId: makeId(),
  body: faker.lorem.paragraph(),
  ...props,
})

export const updateReplyParamsFactory = (
  props: Partial<UpdateReplyParams> = {},
): UpdateReplyParams => ({
  id: makeId(),
  postId: makeId(),
  body: faker.lorem.paragraph(),
  ...props,
})
