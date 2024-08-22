export type AsyncResponse<T> = ReturnType<typeof useFetch<T | null>>

export const apiUrl = (path: string): string => {
  return `${import.meta.env.VITE_API_HOST}${path}`
}

export * from './authOptions'
