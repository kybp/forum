export const countBy = <T, Value extends string | number | symbol>(
  items: T[],
  key: (x: T) => Value,
): Record<Value, number> => {
  return items.reduce(
    (acc, x) => ({ ...acc, [key(x)]: (acc[key(x)] || 0) + 1 }),
    {} as any,
  )
}
