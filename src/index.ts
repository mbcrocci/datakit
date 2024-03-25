import { type Calculation, calculate } from './calculations'
import type { InputData } from './input'
import type { OutputData } from './output'
import { MemoryStorageAdapter } from './storage/memory'

export interface MetricConfig {
  key: string
  input: {
    filter: {
      field: string
      value: string | number | boolean | null
      opearation:
        | ''
        | 'eq'
        | 'equal'
        | 'neq'
        | 'or'
        | 'and'
        | 'contains'
        | 'exists'
        | 'nexists'
      children: MetricConfig['input']['filter'][]
    }
    orderBy: string[]
    groupBy: string[]
    range: {
      start: Date
      end: Date
    }
  }
  calculation: Calculation
}

export type Input = MetricConfig['input']

export interface SourceAdapter {
  fetch: (input: Input) => Promise<InputData>
}

export interface DataObserver {
  update: (data: unknown) => void
}

export type StorageData = InputData | OutputData

export interface StorageAdapter {
  get: (key: string) => StorageData | undefined
  set: (key: string, value: StorageData) => void
}

export interface OutputAdapter {
  format: (output: OutputData) => unknown
}

export class DataEngine {
  constructor(
    private source: SourceAdapter,
    private output: OutputAdapter,
    private storage?: StorageAdapter,
  ) {
    if (!storage)
      this.storage = new MemoryStorageAdapter()
  }

  private observers = new Map<string, DataObserver[]>()

  private subscribe(key: string, observer: DataObserver) {
    if (!this.observers.has(key)) {
      this.observers.set(key, [observer])
      return
    }

    const observers = this.observers.get(key)
    this.observers.set(key, observers!.concat(observer))
  }

  private publish(key: string, data: unknown) {
    const observers = this.observers.get(key)
    if (observers)
      for (const o of observers) o.update(data)
  }

  private hashInput(input: Input): string {
    const json = JSON.stringify(input) // TODO: use a faster library
    return btoa(json)
  }

  attach(observer: DataObserver, config: MetricConfig) {
    this.subscribe(config.key, observer);

    (async () => {
      // Fetch data based on input
      const data = await this.source.fetch(config.input)
      if (!data)
        return

      // Store fetched data
      const inputHash = this.hashInput(config.input)
      const inputKey = `${config.key}-${inputHash}`
      this.storage!.set(inputKey, data)

      // perform calculations
      const result = calculate(config.calculation, data, this.storage)

      // Store result of calculating
      const outputKey = `output-${config.key}`
      this.storage!.set(outputKey, result)

      // transform output and publish
      const output = this.output.format(result)
      this.publish(config.key, output)
    })()
  }
}
