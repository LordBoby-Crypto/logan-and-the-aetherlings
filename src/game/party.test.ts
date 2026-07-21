import { describe, expect, it } from 'vitest'
import { createParty, healParty, placeCapture, updateLead } from './party'

describe('party management', () => {
  it('places a capture into an open party slot and restores capture health', () => {
    const result = placeCapture(createParty(), { name: 'Mirelume', level: 4, hp: 1, maxHp: 30, snared: true })
    expect(result.members).toHaveLength(2)
    expect(result.members[1]).toMatchObject({ hp: 30, snared: false })
  })

  it('routes captures to sanctuary when the party is full', () => {
    let party = createParty()
    party = placeCapture(party, { name: 'One', level: 1, hp: 1, maxHp: 10, snared: false })
    party = placeCapture(party, { name: 'Two', level: 1, hp: 1, maxHp: 10, snared: false })
    party = placeCapture(party, { name: 'Three', level: 1, hp: 1, maxHp: 10, snared: false })
    expect(party.members).toHaveLength(3)
    expect(party.sanctuary[0].name).toBe('Three')
  })

  it('carries lead damage from battle and heals every party member', () => {
    const damaged = updateLead(createParty(), { name: 'Kivren', level: 5, hp: 9, maxHp: 34, snared: false })
    expect(healParty(damaged).members[0].hp).toBe(34)
  })
})
