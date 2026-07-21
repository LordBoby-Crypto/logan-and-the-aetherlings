import { describe, expect, it } from 'vitest'
import { createParty } from '../game/party'
import { createGameSave } from './saveData'
import { SaveRepository, type SaveSlotStore } from './saveRepository'

class MemoryStore implements SaveSlotStore {
  slots: Record<string, unknown> = {}
  async read(slot: 'primary' | 'backup') { return this.slots[slot] }
  async commit(primary: unknown, backup: unknown) { this.slots.backup = backup; this.slots.primary = primary }
  async clear() { this.slots = {} }
}

describe('SaveRepository', () => {
  it('backs up the previous primary before replacement', async () => {
    const store = new MemoryStore()
    const repository = new SaveRepository(store)
    const first = createGameSave({ x: 1, z: 1 }, createParty(), false)
    const second = createGameSave({ x: 2, z: 2 }, createParty(), true)
    await repository.save(first)
    await repository.save(second)
    expect(store.slots.backup).toEqual(first)
  })

  it('recovers a valid backup when primary data is corrupt', async () => {
    const store = new MemoryStore()
    store.slots.primary = { broken: true }
    store.slots.backup = createGameSave({ x: 3, z: 4 }, createParty(), true)
    const result = await new SaveRepository(store).load()
    expect(result.recovered).toBe(true)
    expect(result.save?.player).toEqual({ x: 3, z: 4 })
  })

  it('clears both save slots for a deliberate test reset', async () => {
    const store = new MemoryStore()
    const repository = new SaveRepository(store)
    await repository.save(createGameSave({ x: 1, z: 1 }, createParty(), true))
    await repository.clear()
    expect(await repository.load()).toEqual({ save: undefined, recovered: false })
  })
})
