import { describe, expect, it } from 'vitest'
import { isInteractionAvailable } from './interaction'

describe('isInteractionAvailable', () => {
  it('accepts a target at the edge of the interaction radius', () => {
    expect(isInteractionAvailable({ x: 0, z: 0 }, { x: 0, z: 2.35 })).toBe(true)
  })

  it('rejects a target outside the interaction radius', () => {
    expect(isInteractionAvailable({ x: 0, z: 0 }, { x: 2, z: 2 })).toBe(false)
  })
})

