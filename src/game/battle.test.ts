import { describe, expect, it } from 'vitest'
import { captureChance, createBattle, takeBattleAction } from './battle'

describe('battle prototype', () => {
  it('never knocks out a capturable wild Aetherling', () => {
    const state = createBattle()
    state.wild.hp = 3
    expect(takeBattleAction(state, 'pulse-strike', () => 0).wild.hp).toBe(1)
  })

  it('improves capture chance through weakening and Snare', () => {
    const healthy = createBattle().wild
    const weakened = { ...healthy, hp: 5, snared: true }
    expect(captureChance(weakened)).toBeGreaterThan(captureChance(healthy))
  })

  it('captures when the roll is below the calculated chance', () => {
    const state = createBattle()
    state.wild.hp = 1
    state.wild.snared = true
    const result = takeBattleAction(state, 'aether-prism', () => 0.1)
    expect(result.outcome).toBe('captured')
    expect(result.prisms).toBe(2)
  })

  it('allows the wild Aetherling to answer a failed capture', () => {
    const result = takeBattleAction(createBattle(), 'aether-prism', () => 0.99)
    expect(result.ally.hp).toBeLessThan(result.ally.maxHp)
    expect(result.turn).toBe(2)
  })
})
