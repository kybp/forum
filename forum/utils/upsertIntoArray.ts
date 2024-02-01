export const upsertIntoArray = <T>(
  array: T[],
  value: T,
  equal = (a: T, b: T) => a === b,
): void => {
  for (let i = 0; i < array.length; ++i) {
    if (equal(array[i], value)) {
      array[i] = value
      return
    }
  }

  // Still here, so nothing matched
}
