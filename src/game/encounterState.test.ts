import { describe, expect, it } from 'vitest'
import { finishTransition, leaveEncounter, startEncounter } from './encounterState'

describe('encounter state', () => {
  it('moves through the route-to-battle seam', () => {
    expect(finishTransition(startEncounter('exploring'))).toBe('battle')
    expect(leaveEncounter()).toBe('exploring')
  })

  it('does not restart an active encounter', () => {
    expect(startEncounter('battle')).toBe('battle')
  })
})
