import type { Account } from '~/types'

export type AsyncResponse<T> = ReturnType<typeof useFetch<T | null>>

export const apiUrl = (path: string): string => {
  return `http://backend:8000/api/${path}`
}

export * from './authOptions'
