import type { StorageAdapter, StorageData } from '../adapters'

export function memoryAdapter(): StorageAdapter {
  const data = new Map<string, StorageData>()

  const get = (key: string): StorageData | undefined => {
    return data.get(key)
  }

  const set = (key: string, value: StorageData): void => {
    data.set(key, value)
  }

  return { get, set }
}
