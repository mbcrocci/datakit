import { describe, expect, it } from 'vitest'
import { calculateSingle, calculateSingleElement } from '../../src/calculations/single'
import type { DataElement, InputData } from '../../src/input'
import type { OutputData, SingleOutput } from '../../src/output'
import { calculateStatic } from '../../src/calculations/static'

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
