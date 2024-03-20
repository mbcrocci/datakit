import { describe, expect, it } from 'vitest'
import { calculateSimpleSingleElement, calculateSingle, calculateSingleElement } from '../../src/calculations/single'
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

  it('sum', () => {
    const data = [
      { elements: [], expected: 0 },
      { elements: [1, 2], expected: 3 },
      { elements: [1, 2, 3], expected: 6 },
      { elements: [2, 10, 1000], expected: 1012 },
    ]

    for (const { elements, expected } of data)
      expect(calculateSingleElement ('sum', elements.map(e => ({ value: e } as DataElement)))).toBe(expected)
  })

  it('avg', () => {
    const data = [
      { elements: [], expected: 0 },
      { elements: [1, 2], expected: 1.5 },
      { elements: [1, 2, 3], expected: 2 },
      { elements: [2, 10, 12], expected: 8 },
    ]

    for (const { elements, expected } of data)
      expect(calculateSingleElement ('avg', elements.map(e => ({ value: e } as DataElement)))).toBe(expected)
  })

  it('max', () => {
    const data = [
      { elements: [], expected: 0 },
      { elements: [1, 2], expected: 2 },
      { elements: [1, 2, 3], expected: 3 },
      { elements: [2, 10, 1000], expected: 1000 },
    ]

    for (const { elements, expected } of data)
      expect(calculateSingleElement ('max', elements.map(e => ({ value: e } as DataElement)))).toBe(expected)
  })

  it('min', () => {
    const data = [
      { elements: [], expected: 0 },
      { elements: [1, 2], expected: 1 },
      { elements: [1, 2, 3], expected: 1 },
      { elements: [2, 10, 1000], expected: 2 },
      { elements: [1000, 2, 3], expected: 2 },
    ]

    for (const { elements, expected } of data)
      expect(calculateSingleElement ('min', elements.map(e => ({ value: e } as DataElement)))).toBe(expected)
  })
  it('add', () => {
    const data = [
      { elements: [1, 2], expected: 3 },
    ]

    for (const { elements, expected } of data)
      expect(calculateSimpleSingleElement ('add', ({ valueLeft: elements[0], valueRight: elements[1] } as DataElement))).toBe(expected)
  })

  it('sub', () => {
    const data = [
      { elements: [2, 1], expected: 1 },
    ]

    for (const { elements, expected } of data)
      expect(calculateSimpleSingleElement ('sub', ({ valueLeft: elements[0], valueRight: elements[1] } as DataElement))).toBe(expected)
  })

  it('div', () => {
    const data = [
      { elements: [2, 2], expected: 1 },
    ]

    for (const { elements, expected } of data)
      expect(calculateSimpleSingleElement ('div', ({ valueLeft: elements[0], valueRight: elements[1] } as DataElement))).toBe(expected)
  })

  it('mul', () => {
    const data = [
      { elements: [1, 2], expected: 2 },
    ]

    for (const { elements, expected } of data)
      expect(calculateSimpleSingleElement ('mul', ({ valueLeft: elements[0], valueRight: elements[1] } as DataElement))).toBe(expected)
  })

  it('rule-of-three', () => {
    const data = [
      { elements: [3, 2, 1], expected: 6 },
    ]

    for (const { elements, expected } of data)
      expect(calculateSimpleSingleElement ('rule-of-three', ({ valueLeft: elements[0], valueRight: elements[1], valueDivisor: elements[2] } as DataElement))).toBe(expected)
  })
})

describe('input operations', () => {
  it('calculates from series', () => {
    const input: InputData = {
      type: 'series',
      data: [
        { value: 1 } as DataElement,
        { value: 2 } as DataElement,
        { value: 3 } as DataElement,
      ],
    }

    const result: OutputData = calculateSingle('count', input)

    expect(result).toStrictEqual({
      type: 'single',
      value: 3,
    })
  })

  it('calculates from grouped Data', () => {
    const input: InputData = {
      type: 'grouped',
      data: [
        {
          key: '1',
          data: [
            { value: 1 } as DataElement,
            { value: 2 } as DataElement,
          ],
        },
        {
          key: '2',
          data: [
            { value: 1 } as DataElement,
            { value: 2 } as DataElement,
          ],
        },
      ],
    }

    const result = calculateSingle('count', input)

    expect(result).toStrictEqual({
      type: 'single',
      value: 2,
    })
  })
})
