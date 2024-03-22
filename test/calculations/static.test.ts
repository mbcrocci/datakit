import { describe, expect, it } from 'vitest'
import type { InputData } from '../../src/input'
import type { SingleOutput } from '../../src/output'
import { calculateStatic } from '../../src/calculations/static'

describe('element operations', () => {
  it('static', () => {
    const data = [
      { element: 1, expected: { type: 'single', value: 1 } as SingleOutput },
      { element: 2, expected: { type: 'single', value: 2 } as SingleOutput },
      { element: 3, expected: { type: 'single', value: 3 } as SingleOutput },
      { element: 4, expected: { type: 'single', value: 4 } as SingleOutput },
      { element: 5, expected: { type: 'single', value: 5 } as SingleOutput },
    ]

    for (const { element, expected } of data)
      expect(calculateStatic({} as InputData, { type: 'static', value: element })).toStrictEqual(expected)
  })
})
