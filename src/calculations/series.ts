import type { InputData } from '../input'
import type { OutputData } from '../output'

export interface SeriesCalculation {
  type: 'series'
  operation: 'sum'
}

type Operation = SeriesCalculation['operation']

export function calculateSeries(_operation: Operation, _data: InputData): OutputData {
  return {} as OutputData
}
