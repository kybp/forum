export type AsyncResponse<T> = ReturnType<typeof useFetch<T | null>>
