import { faker } from '@faker-js/faker'

import type { Account, RegisterProps, SignInProps } from '@/stores/auth'

export const accountFactory = (props: Partial<Account> = {}): Account => ({
  id: Math.floor(Math.random()),
  username: faker.internet.userName(),
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
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
