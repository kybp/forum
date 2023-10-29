export type Errors = Record<string, string[]>

export const isMandeError = (x: unknown): x is any => {
  return x !== null && typeof x === 'object' && 'response' in x && 'body' in x
}
