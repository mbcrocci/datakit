import { beforeEach, describe, expect, it } from 'vitest'
import {
  createDataEngine,
} from '../src'
import type { InputData } from '../src/input'
import type { OutputData } from '../src/output'
import { memoryAdapter } from '../src/storage/memory'
import type { StorageAdapter } from '../src/adapters'
import { calcByType, outputKey } from '../src/engine'

function createMockSourceAdapter() {
  const data: Record<string, InputData> = {}

  const setData = (key: string, input: InputData) => {
    data[key] = input
  }

  async function fetch(input: { key: string }): Promise<InputData> {
    return data[input.key]
  }

  return {
    data,
    setData,
    fetch,
  }
}

function createMockOutputAdapter() {
  const count = { used: 0 }

  const format = (output: OutputData) => {
    count.used++
    return output
  }

  return { count, format }
}

describe('should return data', () => {
  it('should return data', async () => {
    const sa = createMockSourceAdapter()
    const oa = createMockOutputAdapter()
    const storage = memoryAdapter()
    const engine = createDataEngine({ source: sa, output: oa, storage })

    const output = await engine.calculate({ key: 'test', type: 'static', value: 123 })

    expect(oa.count.used).toBe(1)
    expect(output).toStrictEqual({ type: 'single', value: 123 })
  })
})

describe('element operations', () => {
  let source: ReturnType<typeof createMockSourceAdapter>
  let storage: StorageAdapter
  beforeEach(() => {
    source = createMockSourceAdapter()
    storage = memoryAdapter()
  })

  it('static', async () => {
    const result = await calcByType(
      { key: 'teste', type: 'static', value: 10 },
      source,
      storage,
    )

    expect(result).toStrictEqual({ type: 'single', value: 10 })
  })

  it('reference', async () => {
    storage.set(outputKey('keyToMatch'), {
      type: 'single',
      value: 10,
    })

    const result = await calcByType(
      { key: 'teste', type: 'reference', reference: 'keyToMatch' },
      source,
      storage,
    )

    expect(result).toStrictEqual({ type: 'single', value: 10 })
  })

  it('single', async () => {
    source.setData('inputKey', { type: 'series', data: [{ value: 10, timestamp: 0, metadata: {} }] })
    const result = await calcByType({
      key: 'singleTest',
      type: 'single',
      input: { key: 'inputKey' },
      operation: 'sum',
    }, source, storage)

    expect(result).toStrictEqual({ type: 'single', value: 10 })
  })
})

describe('tree node operations', () => {
  let source: ReturnType<typeof createMockSourceAdapter>
  let storage: StorageAdapter

  beforeEach(() => {
    source = createMockSourceAdapter()
    storage = memoryAdapter()
  })

  it('tree static + static', async () => {
    const result = await calcByType(
      {
        key: 'node1',
        type: 'tree',
        operation: 'add',
        left: { key: 'node2', type: 'static', value: 10 },
        right: { key: 'node3', type: 'static', value: 5 },
      },
      source,
      storage,
    )

    expect(result).toStrictEqual({ type: 'single', value: 15 })
  })

  it('tree static - static', async () => {
    const result = await calcByType(
      {
        key: 'teste',
        type: 'tree',
        operation: 'sub',
        left: { key: 'teste', type: 'static', value: 10 },
        right: { key: 'teste', type: 'static', value: 8 },
      },
      source,
      storage,
    )
    expect(result).toStrictEqual({ type: 'single', value: 2 })
  })

  it('tree static * static', async () => {
    const result = await calcByType(
      {
        key: 'teste',
        type: 'tree',
        operation: 'mul',
        left: { key: 'teste', type: 'static', value: 3 },
        right: { key: 'teste', type: 'static', value: 4 },
      },
      source,
      storage,
    )

    expect(result).toStrictEqual({ type: 'single', value: 12 })
  })

  it('tree static / static', async () => {
    const result = await calcByType(
      {
        key: 'teste',
        type: 'tree',
        operation: 'div',
        left: { key: 'teste', type: 'static', value: 32 },
        right: { key: 'teste', type: 'static', value: 8 },
      },
      source,
      storage,
    )
    expect(result).toStrictEqual({ type: 'single', value: 4 })
  })
})

describe('tree calculations', () => {
  let source: ReturnType<typeof createMockSourceAdapter>
  let storage: StorageAdapter

  beforeEach(() => {
    source = createMockSourceAdapter()
    storage = memoryAdapter()
  })

  it('tree static with reference', async () => {
    storage.set(outputKey('ref1'), { type: 'single', value: 40 })
    const result = await calcByType(
      {
        key: 'node1',
        type: 'tree',
        operation: 'add',
        left: { key: 'node2', type: 'static', value: 30 },
        right: { key: 'node3', type: 'reference', reference: 'ref1' },
      },
      source,
      storage,
    )

    expect(result).toStrictEqual({ type: 'single', value: 70 })
  })

  it('static tree with depth 2', async () => {
    const result = await calcByType(
      {
        key: 'teste1',
        type: 'tree',
        operation: 'add',
        left: { key: 'teste', type: 'static', value: 30 },
        right: {
          key: 'teste1',
          type: 'tree',
          operation: 'sub',
          left: { key: 'teste2', type: 'static', value: 20 },
          right: { key: 'teste3', type: 'static', value: 10 },
        },
      },
      source,
      storage,
    )

    expect(result).toStrictEqual({ type: 'single', value: 40 })
  })

  it('tree static + single', async () => {
    source.setData('ref1', { type: 'series', data: [{ value: 10, timestamp: 0, metadata: {} }] })
    const result = await calcByType(
      {
        key: 'teste1',
        type: 'tree',
        operation: 'add',
        left: { key: 'teste', type: 'static', value: 7 },
        right: { key: 'teste', type: 'single', operation: 'sum', input: { key: 'ref1' } },
      },
      source,
      storage,
    )
    expect(result)
      .toStrictEqual(
        { type: 'single', value: 17 },
      )
  })
})
