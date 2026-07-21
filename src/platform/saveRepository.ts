import { parseGameSave, type GameSave } from './saveData'

export interface SaveSlotStore {
  read(slot: 'primary' | 'backup'): Promise<unknown>
  commit(primary: GameSave, backup: unknown): Promise<void>
}

export class SaveRepository {
  constructor(private readonly store: SaveSlotStore) {}

  async load(): Promise<{ save?: GameSave; recovered: boolean }> {
    const primary = parseGameSave(await this.store.read('primary'))
    if (primary) return { save: primary, recovered: false }
    const backup = parseGameSave(await this.store.read('backup'))
    return { save: backup, recovered: Boolean(backup) }
  }

  async save(next: GameSave): Promise<void> {
    const previous = await this.store.read('primary')
    await this.store.commit(next, previous)
  }
}

export class IndexedDbSaveStore implements SaveSlotStore {
  private readonly database: Promise<IDBDatabase>

  constructor() {
    this.database = new Promise((resolve, reject) => {
      const request = indexedDB.open('logan-and-the-aetherlings', 1)
      request.onupgradeneeded = () => request.result.createObjectStore('saves')
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async read(slot: 'primary' | 'backup'): Promise<unknown> {
    const database = await this.database
    return new Promise((resolve, reject) => {
      const request = database.transaction('saves', 'readonly').objectStore('saves').get(slot)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async commit(primary: GameSave, backup: unknown): Promise<void> {
    const database = await this.database
    return new Promise((resolve, reject) => {
      const transaction = database.transaction('saves', 'readwrite')
      const store = transaction.objectStore('saves')
      if (backup !== undefined) store.put(backup, 'backup')
      store.put(primary, 'primary')
      transaction.oncomplete = () => resolve()
      transaction.onerror = () => reject(transaction.error)
      transaction.onabort = () => reject(transaction.error)
    })
  }
}

