import type { StorageAdapter, StorageData } from '..'

export class MemoryStorageAdapter implements StorageAdapter {
  data = new Map<string, StorageData>()

  get(key: string): StorageData | undefined {
    return this.data.get(key)
  }

  set(key: string, value: StorageData): void {
    this.data.set(key, value)
  }
}
