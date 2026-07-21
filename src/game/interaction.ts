export interface Point2 { x: number; z: number }

export function isInteractionAvailable(player: Point2, target: Point2, range = 2.35): boolean {
  return Math.hypot(target.x - player.x, target.z - player.z) <= range
}

