import type { InputData } from './input'
import type { OutputData } from './output'

export interface InputAdapter<I> {
  fetch: (input: I) => Promise<InputData>
}

export type StorageData = InputData | OutputData

export interface StorageAdapter {
  get: (key: string) => StorageData | undefined
  set: (key: string, value: StorageData) => void
}

export interface OutputAdapter {
  format: (output: OutputData) => unknown
}
