import { describe, expect, it } from 'vitest'
import { canStartBattle, captureChance, createBattle, takeBattleAction } from './battle'

describe('battle prototype', () => {
  it('never knocks out a capturable wild Aetherling', () => {
    const state = createBattle()
    state.wild.hp = 3
    expect(takeBattleAction(state, 'pulse-strike', () => 0).wild.hp).toBe(1)
  })

  it('creates every re-encounter with independent full wild health', () => {
    const first = createBattle()
    first.wild.hp = 1
    first.wild.snared = true
    const reEncounter = createBattle()
    expect(reEncounter.wild).toMatchObject({ hp: 30, maxHp: 30, snared: false })
    expect(reEncounter.wild).not.toBe(first.wild)
  })

  it('improves capture chance through weakening and Snare', () => {
    const healthy = createBattle().wild
    const weakened = { ...healthy, hp: 5, snared: true }
    expect(captureChance(weakened)).toBeGreaterThan(captureChance(healthy))
  })

  it('prevents a defeated lead from entering another encounter', () => {
    const lead = createBattle().ally
    expect(canStartBattle({ ...lead, hp: 0 })).toBe(false)
    expect(canStartBattle({ ...lead, hp: 1 })).toBe(true)
  })

  it('starts each encounter with five Aether Prisms', () => {
    expect(createBattle().prisms).toBe(5)
  })

  it('guarantees capture after weakening to 1 HP and applying Snare', () => {
    const wild = { ...createBattle().wild, hp: 1, snared: true }
    expect(captureChance(wild)).toBe(1)
  })

  it('captures when the roll is below the calculated chance', () => {
    const state = createBattle()
    state.wild.hp = 1
    state.wild.snared = true
    const result = takeBattleAction(state, 'aether-prism', () => 0.1)
    expect(result.outcome).toBe('captured')
    expect(result.prisms).toBe(4)
  })

  it('allows the wild Aetherling to answer a failed capture', () => {
    const result = takeBattleAction(createBattle(), 'aether-prism', () => 0.99)
    expect(result.ally.hp).toBeLessThan(result.ally.maxHp)
    expect(result.turn).toBe(2)
  })
})
