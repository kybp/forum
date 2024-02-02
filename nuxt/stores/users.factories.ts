import { faker } from '@faker-js/faker'
import type { CreateUserParams } from './users'

export const createUserParamsFactory = (
  params: Partial<CreateUserParams> = {},
): CreateUserParams => ({
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  ...params,
})
