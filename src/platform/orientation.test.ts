import { describe, expect, it } from 'vitest'
import { needsLandscapePrompt } from './orientation'

describe('needsLandscapePrompt', () => {
  it('prompts on a portrait phone with touch input', () => {
    expect(needsLandscapePrompt({ width: 390, height: 844, coarsePointer: true })).toBe(true)
  })

  it('allows a landscape phone', () => {
    expect(needsLandscapePrompt({ width: 844, height: 390, coarsePointer: true })).toBe(false)
  })

  it('does not block a portrait desktop window', () => {
    expect(needsLandscapePrompt({ width: 500, height: 900, coarsePointer: false })).toBe(false)
  })
})
