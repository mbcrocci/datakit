import { describe, expect, it } from 'vitest'
import type { DataElement, InputData } from '../../src/input'
import type { OutputData, TopOutput } from '../../src/output'
import { calculateTopGrouped, calculateTopSeries } from '../../src/calculations/top'

describe('top input operations', () => {
  it('calculates top ascending', () => {
    const input: InputData = {
      type: 'series',
      data: [
        { value: 1 } as DataElement,
        { value: 7 } as DataElement,
        { value: 3 } as DataElement,
      ],
    }

    const result: OutputData = calculateTopSeries({ type: 'top' }, input)

    expect(result).toStrictEqual({ metadata: [undefined, undefined, undefined], type: 'top', values: [1, 3, 7] } as TopOutput)
  })
  it('calculates top descending', () => {
    const input: InputData = {
      type: 'series',
      data: [
        { value: 1 } as DataElement,
        { value: 7 } as DataElement,
        { value: 3 } as DataElement,
      ],
    }

    const result: OutputData = calculateTopSeries({ type: 'top', order: 'desc' }, input)

    expect(result).toStrictEqual({ metadata: [undefined, undefined, undefined], type: 'top', values: [7, 3, 1] } as TopOutput)
  })
})
