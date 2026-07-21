import { Vector2, Vector3 } from '@babylonjs/core/Maths/math.vector.pure.js'
import { describe, expect, it } from 'vitest'
import { solveMovement } from './movement'

const bounds = { minX: -3, maxX: 3, minZ: -10, maxZ: 10 }
const initial = { position: new Vector3(0, 0, 0), facingRadians: 0 }

describe('graybox movement solver', () => {
  it('normalizes diagonal input so it is not faster', () => {
    const straight = solveMovement(initial, new Vector2(0, 1), 0.05, 5, bounds, [])
    const diagonal = solveMovement(initial, new Vector2(1, 1), 0.05, 5, bounds, [])
    expect(diagonal.position.length()).toBeCloseTo(straight.position.length())
  })

  it('clamps movement to route bounds', () => {
    const edge = { position: new Vector3(2.95, 0, 0), facingRadians: 0 }
    expect(solveMovement(edge, new Vector2(1, 0), 0.05, 5, bounds, []).position.x).toBe(3)
  })

  it('prevents movement through a circular obstacle', () => {
    const nearObstacle = { position: new Vector3(0, 0, 0), facingRadians: 0 }
    const result = solveMovement(nearObstacle, new Vector2(0, 1), 0.05, 5, bounds, [{ x: 0, z: 0.7, radius: 0.25 }])
    expect(result.position.z).toBe(0)
  })

  it('caps long frame deltas to prevent tunneling', () => {
    const result = solveMovement(initial, new Vector2(0, 1), 1, 5, bounds, [])
    expect(result.position.z).toBeCloseTo(0.25)
  })
})
