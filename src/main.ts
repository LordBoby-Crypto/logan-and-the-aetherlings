import { Engine } from '@babylonjs/core/Engines/engine.js'
import { registerSW } from 'virtual:pwa-register'
import { createGrayboxScene } from './game/createGrayboxScene'
import { finishTransition, leaveEncounter, startEncounter, type EncounterState } from './game/encounterState'
import { isInteractionAvailable } from './game/interaction'
import { solveMovement } from './game/movement'
import { chooseRenderTier, hardwareScaleFor } from './game/quality'
import { InputController } from './platform/input'
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
const touchControls = requireElement<HTMLElement>('#touch-controls')
const movementPad = requireElement<HTMLElement>('#movement-pad')
const movementKnob = requireElement<HTMLElement>('#movement-knob')
const interactButton = requireElement<HTMLButtonElement>('#interact-button')
const interactionPrompt = requireElement<HTMLElement>('#interaction-prompt')
const encounterScreen = requireElement<HTMLElement>('#encounter-screen')
const returnToRoute = requireElement<HTMLButtonElement>('#return-to-route')

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
  touchControls.hidden = !window.matchMedia('(pointer: coarse)').matches
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
  const { scene, camera, player, encounterTarget } = createGrayboxScene(engine)
  const input = new InputController(movementPad, movementKnob, interactButton)
  await scene.whenReadyAsync()

  loadingScreen.hidden = true
  prototypeLabel.hidden = false
  locationLabel.hidden = false

  let movementState = { position: player.position.clone(), facingRadians: 0 }
  let encounterState: EncounterState = 'exploring'
  let transitionTimer: number | undefined
  const routeBounds = { minX: -3.2, maxX: 3.2, minZ: -15, maxZ: 10.5 }
  const obstacles = [{ x: 1.5, z: 13.5, radius: 3.9 }]

  const showBattleStaging = (): void => {
    encounterState = finishTransition(encounterState)
    encounterScreen.hidden = false
    interactionPrompt.hidden = true
    interactButton.disabled = true
  }

  returnToRoute.addEventListener('click', () => {
    encounterState = leaveEncounter()
    encounterScreen.hidden = true
  })

  engine.runRenderLoop(() => {
    const canInteract = encounterState === 'exploring' && isInteractionAvailable(player.position, encounterTarget.position)
    interactionPrompt.hidden = !canInteract
    interactButton.disabled = !canInteract

    const interactionRequested = input.consumeInteraction()
    if (canInteract && interactionRequested) {
      encounterState = startEncounter(encounterState)
      interactionPrompt.hidden = true
      transitionTimer = window.setTimeout(showBattleStaging, 360)
    }

    const movementInput = encounterState === 'exploring' ? input.update() : input.movement.set(0, 0)
    movementState = solveMovement(movementState, movementInput, engine.getDeltaTime() / 1000, 5.2, routeBounds, obstacles)
    player.position.copyFrom(movementState.position)
    player.rotation.y = movementState.facingRadians
    camera.target.set(player.position.x, 0.7, player.position.z + 4.5)
    scene.render()
  })
  window.addEventListener('resize', () => engine.resize())
  window.addEventListener('pagehide', () => {
    input.dispose()
    if (transitionTimer !== undefined) window.clearTimeout(transitionTimer)
  }, { once: true })
} catch (error) {
  console.error(error)
  loadingScreen.hidden = true
  unsupportedScreen.hidden = false
}
