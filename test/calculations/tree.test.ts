import { describe, expect, it } from 'vitest'
import type { InputData, SeriesInputData } from '../../src/input'
import type { TreeCalculation } from '../../src/calculations/tree'
import { calculateNode } from '../../src/calculations/tree'
import { MemoryStorageAdapter } from '../../src/storage/memory'

describe('element operations', () => {
  const storage = new MemoryStorageAdapter()
  storage.set('test1', {
    type: 'reference',
    key: 'test1',
    data: {
      value: 3,
      timestamp: 111111,
      metadata: {},
    },
  })
  storage.set('test2', {
    type: 'reference',
    key: 'test2',
    data: {
      value: 3,
      timestamp: 111111,
      metadata: {},
    },
  })

  it('tree reference add', () => {
    expect(calculateNode({
      type: 'tree',
      left: { type: 'reference', key: 'test1' },
      right: { type: 'reference', key: 'test2' },
      operation: 'add',
    } as TreeCalculation, storage))
      .toStrictEqual({
        type: 'single',
        value: 6,
      })
  })

  it('tree sub', () => {
    expect(calculateNode({
      type: 'tree',
      left: { type: 'reference', key: 'test1' },
      right: { type: 'reference', key: 'test2' },
      operation: 'sub',
    } as TreeCalculation, storage))
      .toStrictEqual({
        type: 'single',
        value: 0,
      })
  })
  it('tree div', () => {
    expect(calculateNode({
      type: 'tree',
      left: { type: 'reference', key: 'test1' },
      right: { type: 'reference', key: 'test2' },
      operation: 'div',
    } as TreeCalculation, storage))
      .toStrictEqual({
        type: 'single',
        value: 1,
      })
  })
  it('tree mul', () => {
    expect(calculateNode({
      type: 'tree',
      left: { type: 'reference', key: 'test1' },
      right: { type: 'reference', key: 'test2' },
      operation: 'mul',
    } as TreeCalculation, storage))
      .toStrictEqual({
        type: 'single',
        value: 9,
      })
  })

  it('tree rule-of-three (nested nodes)', () => {
    expect(calculateNode({
      type: 'tree',
      left: {
        type: 'tree',
        left: { type: 'reference', key: 'test1' },
        right: { type: 'reference', key: 'test2' },
        operation: 'mul',
      },
      right: { type: 'reference', key: 'test2' },
      operation: 'div',
    } as TreeCalculation, storage))
      .toStrictEqual({
        type: 'single',
        value: 3,
      })
  })

  it('tree static', () => {
    expect(calculateNode({
      type: 'tree',
      left: { type: 'static', value: 5 },
      right: { type: 'static', value: -1 },
      operation: 'div',
    } as TreeCalculation, storage))
      .toStrictEqual({
        type: 'single',
        value: 0,
      })
  })

  it('tree single', () => {
    expect(calculateNode({
      type: 'tree',
      left: { type: 'single', operation: 'sum' },
      right: { type: 'static', value: 3 },
      operation: 'add',
    } as TreeCalculation, storage, {
      type: 'series',
      data: [{
        value: 3,
        timestamp: 0,
        metadata: {},
      }, {
        value: 3,
        timestamp: 0,
        metadata: {},
      }],
    } as SeriesInputData))
      .toStrictEqual({
        type: 'single',
        value: 9,
      })
  })
})
