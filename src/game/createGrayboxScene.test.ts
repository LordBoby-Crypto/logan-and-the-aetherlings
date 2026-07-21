import { NullEngine } from '@babylonjs/core/Engines/nullEngine.js'
import { afterEach, describe, expect, it } from 'vitest'
import { createGrayboxScene } from './createGrayboxScene'

let engine: NullEngine | undefined

afterEach(() => {
  engine?.dispose()
  engine = undefined
})

describe('Mossmere graybox scene', () => {
  it('constructs the complete validation scene in a headless renderer', () => {
    engine = new NullEngine({
      renderWidth: 1280,
      renderHeight: 720,
      textureSize: 512,
      deterministicLockstep: false,
      lockstepMaxSteps: 4,
    })
    const { scene, player } = createGrayboxScene(engine)

    expect(scene.activeCamera?.name).toBe('exploration-camera')
    expect(scene.getMeshByName('route-ground')).not.toBeNull()
    expect(scene.getMeshByName('logan-graybox')).not.toBeNull()
    expect(scene.getMeshByName('outpost')).not.toBeNull()
    expect(player.name).toBe('logan-player-root')
    expect(scene.meshes.length).toBeGreaterThan(65)

    expect(() => scene.render()).not.toThrow()
  })
})
