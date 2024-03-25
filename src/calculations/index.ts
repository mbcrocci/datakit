import type { InputData } from '../input'
import type { OutputData } from '../output'
import type { StorageAdapter } from '..'
import { type SeriesCalculation, calculateSeries } from './series'
import { type SingleCalculation, calculateSingle } from './single'
import { type StaticCalculation, calculateStatic } from './static'

import { type ReferenceCalculation, calculateReference } from './reference'

export type Calculation = SingleCalculation | SeriesCalculation | StaticCalculation | ReferenceCalculation

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

    case 'static':
      return calculateStatic(data, calculation)

    case 'reference':
      return calculateReference(calculation, storage)

    default:
      return {
        type: 'single',
        value: 0,
      }
  }
}
