import type { InputData, ReferenceInputData } from '../input'
import type { SingleOutput } from '../output'
import { MemoryStorageAdapter } from '../storage/memory'

export interface ReferenceCalculation {
  type: 'reference'
  key: string
}

export function calculateReference(_data: InputData, calculation: ReferenceCalculation) {
  return {
    type: 'single',
    value: getValue(calculation.key),
  } satisfies SingleOutput
}

export function getValue(key: string): number {
  const storage = new MemoryStorageAdapter()
  const data = storage.get(key) as ReferenceInputData
  return data.data.value
}
