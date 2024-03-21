import type { InputData } from '../input'
import type { OutputData } from '../output'
import { type SeriesCalculation, calculateSeries } from './series'
import { type SingleCalculation, calculateSingle } from './single'
import { type StaticCalculation, calculateStatic } from './static'

export type Calculation = SingleCalculation | SeriesCalculation | StaticCalculation

export function calculate(
  calculation: Calculation,
  data: InputData,
): OutputData {
  switch (calculation.type) {
    case 'single':
      return calculateSingle(calculation.operation, data)

    case 'series':
      return calculateSeries(calculation.operation, data)

    case 'static':
      return calculateStatic(data)
    default:
      return {
        type: 'single',
        value: 0,
      }
  }
}
