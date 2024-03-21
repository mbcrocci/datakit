import type { InputData } from '../input'
import type { SingleOutput } from '../output'

export interface StaticCalculation {
  type: 'static'
  value: number
}

/* export function calculateStatic(inputdata: InputData): SingleOutput {
    const data = inputdata as StaticInputData;
  return {
    type: 'single',
    value: data.data.value,
  }
} */

export function calculateStatic(_data: InputData, calculation: StaticCalculation) {
  return { type: 'single', value: calculation.value } satisfies SingleOutput
}
