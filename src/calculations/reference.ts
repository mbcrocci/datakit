import type { StorageAdapter } from '..'
import type { InputData, ReferenceInputData } from '../input'
import type { SingleOutput } from '../output'

export interface ReferenceCalculation {
  type: 'reference'
  key: string
}

export function calculateReference(calculation: ReferenceCalculation, storage?: StorageAdapter) {
  const value = getValue(calculation.key, storage)
  return {
    type: 'single',
    value,
  } satisfies SingleOutput
}

export function getValue(key: string, storage?: StorageAdapter): number {
  if (storage === undefined)
    return 0

  const data = storage.get(key) as ReferenceInputData
  return data?.data?.value
}
