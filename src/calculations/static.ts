import type { InputData, StaticInputData } from '../input'
import type { StaticOutput } from '../output'

export interface StaticCalculation {
  type: 'static'
}

export function calculateStatic(inputdata: InputData): StaticOutput {
  const data = inputdata as StaticInputData
  return {
    type: 'static',
    value: data.data.value,
  }
}
