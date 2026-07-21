import { describe, expect, it } from 'vitest'
import { createParty } from '../game/party'
import { createGameSave, parseGameSave } from './saveData'

describe('save data', () => {
  it('round-trips a valid current save', () => {
    const save = createGameSave({ x: 2, z: -4 }, createParty(), false)
    expect(parseGameSave(structuredClone(save))).toEqual(save)
  })

  it('rejects corrupted health and position values', () => {
    const save = createGameSave({ x: 2, z: -4 }, createParty(), false)
    expect(parseGameSave({ ...save, player: { x: Number.NaN, z: 0 } })).toBeUndefined()
    save.party.members[0].hp = 999
    expect(parseGameSave(save)).toBeUndefined()
  })

  it('migrates the prototype version-zero shape', () => {
    const migrated = parseGameSave({ version: 0, position: { x: 1, z: 2 }, party: createParty(), captured: true })
    expect(migrated).toMatchObject({ version: 1, player: { x: 1, z: 2 }, encounterCaptured: true })
  })
})

