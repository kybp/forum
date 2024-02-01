import { it, expect } from 'vitest'
import { countBy } from './countBy'

it('returns a count of elements by key', () => {
  const elements = [
    { key: 'one' },
    { key: 'three' },
    { key: 'two' },
    { key: 'three' },
    { key: 'two' },
    { key: 'three' },
  ]

  expect(countBy(elements, (x) => x.key)).toEqual({
    one: 1,
    two: 2,
    three: 3,
  })
})
