import type { Account } from '~/types'

export const authOptions = (account: Account | null) => {
  if (account === null) throw new Error('Not signed in')

  return {
    headers: { Authorization: `Token ${account.token}` },
  }
}
