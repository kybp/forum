export const countBy = <T, Value extends string | number | symbol>(
  items: T[],
  key: (x: T) => Value,
): Record<Value, number> => {
  return items.reduce(
    (acc, x) => ({ ...acc, [key(x)]: (acc[key(x)] || 0) + 1 }),
    {} as any,
  )
}

export const sha256 = async (text: string): Promise<string> => {
  const encoded = new TextEncoder().encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded)
  const hashArray = Array.from(new Uint8Array(hashBuffer))

  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}
