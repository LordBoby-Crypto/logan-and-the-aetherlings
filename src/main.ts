import { Engine } from '@babylonjs/core/Engines/engine.js'
import { registerSW } from 'virtual:pwa-register'
import { createGrayboxScene } from './game/createGrayboxScene'
import { chooseRenderTier, hardwareScaleFor } from './game/quality'
import { needsLandscapePrompt } from './platform/orientation'
import './styles.css'

interface InstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector)
  if (!element) throw new Error(`Required game shell element is missing: ${selector}`)
  return element
}

const canvas = requireElement<HTMLCanvasElement>('#game-canvas')
const loadingScreen = requireElement<HTMLElement>('#loading-screen')
const loadingStatus = requireElement<HTMLElement>('#loading-status')
const unsupportedScreen = requireElement<HTMLElement>('#unsupported-screen')
const rotateScreen = requireElement<HTMLElement>('#rotate-screen')
const prototypeLabel = requireElement<HTMLElement>('#prototype-label')
const locationLabel = requireElement<HTMLElement>('#location-label')
const installButton = requireElement<HTMLButtonElement>('#install-button')

let installPrompt: InstallPromptEvent | undefined

function viewportShape() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    coarsePointer: window.matchMedia('(pointer: coarse)').matches,
  }
}

function updateOrientationPrompt(): void {
  rotateScreen.hidden = !needsLandscapePrompt(viewportShape())
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault()
  installPrompt = event as InstallPromptEvent
  installButton.hidden = false
})

installButton.addEventListener('click', async () => {
  if (!installPrompt) return
  await installPrompt.prompt()
  await installPrompt.userChoice
  installPrompt = undefined
  installButton.hidden = true
})

registerSW({
  immediate: true,
  onNeedRefresh() {
    loadingStatus.textContent = 'A new build is ready. Reopen the game to update.'
  },
})

updateOrientationPrompt()
window.addEventListener('resize', updateOrientationPrompt)
window.addEventListener('orientationchange', updateOrientationPrompt)

try {
  const viewport = viewportShape()
  const tier = chooseRenderTier(viewport.coarsePointer, Math.min(viewport.width, viewport.height))
  const engine = new Engine(canvas, true, {
    preserveDrawingBuffer: false,
    stencil: true,
    powerPreference: 'high-performance',
  })
  engine.setHardwareScalingLevel(hardwareScaleFor(tier, window.devicePixelRatio))

  loadingStatus.textContent = 'Building the Mossmere graybox…'
  const scene = createGrayboxScene(engine)
  await scene.whenReadyAsync()

  loadingScreen.hidden = true
  prototypeLabel.hidden = false
  locationLabel.hidden = false

  engine.runRenderLoop(() => scene.render())
  window.addEventListener('resize', () => engine.resize())
} catch (error) {
  console.error(error)
  loadingScreen.hidden = true
  unsupportedScreen.hidden = false
}
