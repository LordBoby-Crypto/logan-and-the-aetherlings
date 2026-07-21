export interface ViewportShape {
  width: number
  height: number
  coarsePointer: boolean
}

export function needsLandscapePrompt(viewport: ViewportShape): boolean {
  const isPortrait = viewport.height > viewport.width
  const isPhoneSized = Math.min(viewport.width, viewport.height) < 600
  return viewport.coarsePointer && isPhoneSized && isPortrait
}
