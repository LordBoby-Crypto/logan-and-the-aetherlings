export type RenderTier = 'mobile' | 'desktop'

export function chooseRenderTier(coarsePointer: boolean, shortEdge: number): RenderTier {
  return coarsePointer || shortEdge < 720 ? 'mobile' : 'desktop'
}

export function hardwareScaleFor(tier: RenderTier, devicePixelRatio: number): number {
  const cappedRatio = Math.min(Math.max(devicePixelRatio, 1), tier === 'mobile' ? 1.5 : 2)
  return 1 / cappedRatio
}
