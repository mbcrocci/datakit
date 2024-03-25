import { measureMemory } from 'node:vm'
import type { InputData } from '../input'
import type { OutputData } from '../output'
import { MemoryStorageAdapter } from '../storage/memory'
import type { StorageAdapter } from '..'
import type { ReferenceCalculation } from './reference'
import { calculateReference } from './reference'
import { type SeriesCalculation, calculateSeries } from './series'
import { type SingleCalculation, calculateSingle } from './single'

export type Calculation = SingleCalculation | SeriesCalculation | ReferenceCalculation

export function calculate(
  calculation: Calculation,
  data: InputData,
  storage?: StorageAdapter,
): OutputData {
  switch (calculation.type) {
    case 'single':
      return calculateSingle(calculation.operation, data)

    case 'series':
      return calculateSeries(calculation.operation, data)

    case 'reference':
      return calculateReference(calculation, storage)

    default:
      return {
        type: 'single',
        value: 0,
      }
  }
}
