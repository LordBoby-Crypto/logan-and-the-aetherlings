import { Vector2, Vector3 } from '@babylonjs/core/Maths/math.vector.pure.js'

export interface MovementBounds {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

export interface CircleObstacle {
  x: number
  z: number
  radius: number
}

export interface MovementState {
  position: Vector3
  facingRadians: number
}

export function normalizedInput(input: Vector2): Vector2 {
  return input.lengthSquared() > 1 ? input.normalize() : input.clone()
}

function outsideObstacle(position: Vector3, obstacle: CircleObstacle, playerRadius: number): boolean {
  const dx = position.x - obstacle.x
  const dz = position.z - obstacle.z
  const minimumDistance = obstacle.radius + playerRadius
  return dx * dx + dz * dz >= minimumDistance * minimumDistance
}

export function solveMovement(
  state: MovementState,
  rawInput: Vector2,
  deltaSeconds: number,
  speed: number,
  bounds: MovementBounds,
  obstacles: readonly CircleObstacle[],
  playerRadius = 0.48,
): MovementState {
  const input = normalizedInput(rawInput)
  if (input.lengthSquared() === 0 || deltaSeconds <= 0) return state

  const distance = Math.min(deltaSeconds, 0.05) * speed
  const next = state.position.clone()
  next.x += input.x * distance
  next.z += input.y * distance
  next.x = Math.min(Math.max(next.x, bounds.minX), bounds.maxX)
  next.z = Math.min(Math.max(next.z, bounds.minZ), bounds.maxZ)

  if (!obstacles.every((obstacle) => outsideObstacle(next, obstacle, playerRadius))) {
    const xOnly = state.position.clone()
    xOnly.x = Math.min(Math.max(xOnly.x + input.x * distance, bounds.minX), bounds.maxX)
    const zOnly = state.position.clone()
    zOnly.z = Math.min(Math.max(zOnly.z + input.y * distance, bounds.minZ), bounds.maxZ)

    if (obstacles.every((obstacle) => outsideObstacle(xOnly, obstacle, playerRadius))) next.copyFrom(xOnly)
    else if (obstacles.every((obstacle) => outsideObstacle(zOnly, obstacle, playerRadius))) next.copyFrom(zOnly)
    else next.copyFrom(state.position)
  }

  return {
    position: next,
    facingRadians: Math.atan2(input.x, input.y),
  }
}
