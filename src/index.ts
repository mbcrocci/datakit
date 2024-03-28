import { calculateSingle } from './calculations/single'
import { calculateSeries } from './calculations/series'
import type { Calculation, Input } from './config'
import type { InputData } from './input'
import type { OutputData, SingleOutput } from './output'
import { MemoryStorageAdapter } from './storage/memory'
import { calculateNode } from './calculations/tree'

export interface SourceAdapter {
  fetch: (input: Input) => Promise<InputData>
}

export type StorageData = InputData | OutputData

export interface StorageAdapter {
  get: (key: string) => StorageData | undefined
  set: (key: string, value: StorageData) => void
}

export interface OutputAdapter {
  format: (output: OutputData) => unknown
}

function hashInput(input: Input): string {
  const json = JSON.stringify(input) // TODO: use a faster library
  return btoa(json)
}

// Fetch data based on input
async function fetchData(input: Input, source: SourceAdapter) {
  const data = await source.fetch(input)
  if (!data)
    return

  return data
}

export function outputKey(key: string) {
  return `output-${key}`
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function fetchFromStorage(storage: StorageAdapter, key: string) {
  const okey = outputKey(key)
  let data = storage.get(okey)

  let retries = 0
  let interval = 500
  while (!data && retries < 10) {
    await sleep(interval)

    data = storage.get(okey)

    interval = interval - (interval * 0.2)
    retries++
  }

  return data as OutputData
}

export async function calcByType(calculation: Calculation, source: SourceAdapter, storage: StorageAdapter): Promise<OutputData | undefined> {
  if (calculation.type === 'static')
    return { type: 'single', value: calculation.value } satisfies SingleOutput

  if (calculation.type === 'reference')
    return fetchFromStorage(storage!, calculation.reference)

  if (calculation.type === 'tree') {
    const left = await calcByType(calculation.left, source, storage)
    if (!left)
      return undefined

    const right = await calcByType(calculation.right, source, storage)
    if (!right)
      return undefined

    if (left.type !== 'single' || right.type !== 'single')
      return undefined

    return calculateNode({ type: 'tree', left: left.value, right: right.value, operation: calculation.operation })
  }

  const data = await fetchData(calculation.input, source)

  // Store fetched data
  const inputHash = hashInput(calculation.input)
  const inputKey = `${calculation.key}-${inputHash}`
  storage!.set(inputKey, data!)

  if (calculation.type === 'single')
    return calculateSingle(calculation.operation, data!)

  if (calculation.type === 'series')
    return calculateSeries(calculation.operation, data!)
}

export function createDataEngine({ source, output, storage }: {
  source: SourceAdapter
  output: OutputAdapter
  storage?: StorageAdapter
}) {
  storage ??= new MemoryStorageAdapter()

  return {
    calculate: async (calculation: Calculation) => {
      const result = await calcByType(calculation, source, storage!)
      if (!result)
        throw new Error('can\'t generate result')

      // Store result of calculating
      storage!.set(outputKey(calculation.key), result)

      return output.format(result)
    },
  }
}
