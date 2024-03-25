import { describe, expect, it } from 'vitest'
import type { ReferenceCalculation } from '../../src/calculations/reference'
import { calculateReference } from '../../src/calculations/reference'
import { MemoryStorageAdapter } from '../../src/storage/memory'

describe('save to memory', () => {
  const storage = new MemoryStorageAdapter()
  storage.set('test', {
    type: 'reference',
    key: 'test',
    data: {
      value: 3,
      timestamp: 111111,
      metadata: {},
    },
  })
  it('store value', () => {
    expect(
      calculateReference(
        {
          type: 'reference',
          key: 'test',
        } as ReferenceCalculation,
        storage,
      ),
    ).toStrictEqual(
      {
        type: 'single',
        value: 3,
      },
    )
  })
})
