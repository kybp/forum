import type { MandeError } from 'mande'

export type Errors = Record<string, string[]>

export const isMandeError = (x: unknown): x is MandeError => {
  return x !== null && typeof x === 'object' && 'response' in x && 'body' in x
}
