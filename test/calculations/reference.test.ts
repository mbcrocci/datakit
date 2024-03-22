import { describe, expect, it } from 'vitest'
import { calculateSingle, calculateSingleElement } from '../../src/calculations/single'
import type { DataElement, InputData } from '../../src/input'
import type { OutputData } from '../../src/output'

describe('element operations', () => {
  it('count', () => {
    const data = [
      { elements: [], expected: 0 },
      { elements: [1, 2], expected: 2 },
      { elements: [1, 2, 3], expected: 3 },
    ]

    for (const { elements, expected } of data)
      expect(calculateSingleElement ('count', elements.map(e => ({ value: e } as DataElement)))).toBe(expected)
  })
})
