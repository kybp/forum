export type AsyncResponse<T> = ReturnType<typeof useFetch<T | null>>

export const apiUrl = (path: string): string => {
  return `http://localhost:8000/api/${path}`
}
