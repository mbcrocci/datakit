import type { InputData } from '../input'
import type { OutputData } from '../output'
import { type SeriesCalculation, calculateSeries } from './series'
import { type SingleCalculation, calculateSingle } from './single'

export type Calculation = SingleCalculation | SeriesCalculation

export function calculate(
  calculation: Calculation,
  data: InputData,
): OutputData {
  switch (calculation.type) {
    case 'single':
      return calculateSingle(calculation.operation, data)

    case 'series':
      return calculateSeries(calculation.operation, data)

    default:
      return {
        type: 'single',
        value: 0,
      }
  }
}
