import { describe, expect, it } from 'vitest'
import { chooseRenderTier, hardwareScaleFor } from './quality'

describe('render quality policy', () => {
  it('selects mobile for coarse pointers', () => {
    expect(chooseRenderTier(true, 900)).toBe('mobile')
  })

  it('selects desktop for a large fine-pointer viewport', () => {
    expect(chooseRenderTier(false, 1080)).toBe('desktop')
  })

  it('caps high-density mobile rendering', () => {
    expect(hardwareScaleFor('mobile', 3)).toBeCloseTo(2 / 3)
  })
})
