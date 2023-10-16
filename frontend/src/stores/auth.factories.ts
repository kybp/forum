import { faker } from '@faker-js/faker'

import type { User, RegisterProps, SignInProps } from '@/stores/auth'

export const userFactory = (props: Partial<User> = {}): User => ({
  id: Math.floor(Math.random()),
  username: faker.internet.userName(),
  email: faker.internet.email(),
  token: faker.internet.ipv6(),
  ...props,
})

export const signInPropsFactory = (
  props: Partial<SignInProps> = {},
): SignInProps => ({
  username: faker.internet.userName(),
  password: faker.internet.password(),
  ...props,
})

export const registerPropsFactory = (
  props: Partial<RegisterProps> = {},
): RegisterProps => ({
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  ...props,
})
