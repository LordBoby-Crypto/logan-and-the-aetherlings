import { Engine } from '@babylonjs/core/Engines/engine.js'
import { registerSW } from 'virtual:pwa-register'
import { createGrayboxScene } from './game/createGrayboxScene'
import { captureChance, createBattle, takeBattleAction, type BattleAction, type BattleState } from './game/battle'
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
const battleActions = requireElement<HTMLElement>('#battle-actions')
const battleMessage = requireElement<HTMLElement>('#battle-message')
const battleTurn = requireElement<HTMLElement>('#battle-turn')
const prismCount = requireElement<HTMLElement>('#prism-count')
const allyHp = requireElement<HTMLElement>('#ally-hp')
const wildHp = requireElement<HTMLElement>('#wild-hp')
const allyHpBar = requireElement<HTMLElement>('#ally-hp-bar')
const wildHpBar = requireElement<HTMLElement>('#wild-hp-bar')
const wildStatus = requireElement<HTMLElement>('#wild-status')
const captureOdds = requireElement<HTMLElement>('#capture-odds')

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
  let battleState: BattleState = createBattle()
  const routeBounds = { minX: -3.2, maxX: 3.2, minZ: -15, maxZ: 10.5 }
  const obstacles = [{ x: 1.5, z: 13.5, radius: 3.9 }]

  const renderBattle = (): void => {
    battleTurn.textContent = String(battleState.turn)
    prismCount.textContent = `${battleState.prisms} Aether Prism${battleState.prisms === 1 ? '' : 's'}`
    allyHp.textContent = `${battleState.ally.hp} / ${battleState.ally.maxHp} HP`
    wildHp.textContent = `${battleState.wild.hp} / ${battleState.wild.maxHp} HP`
    allyHpBar.style.width = `${battleState.ally.hp / battleState.ally.maxHp * 100}%`
    wildHpBar.style.width = `${battleState.wild.hp / battleState.wild.maxHp * 100}%`
    wildStatus.textContent = battleState.wild.snared ? 'Snared' : 'No status'
    captureOdds.textContent = `${Math.round(captureChance(battleState.wild) * 100)}% capture chance`
    battleMessage.textContent = battleState.message
    const finished = battleState.outcome !== 'active'
    battleActions.hidden = finished
    returnToRoute.hidden = !finished
    returnToRoute.textContent = battleState.outcome === 'captured' ? 'Continue with Mirelume' : 'Return to Mossmere Path'
  }

  const showBattle = (): void => {
    encounterState = finishTransition(encounterState)
    battleState = createBattle()
    renderBattle()
    encounterScreen.hidden = false
    interactionPrompt.hidden = true
    interactButton.disabled = true
  }

  battleActions.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-action]')
    if (!button || battleState.outcome !== 'active') return
    battleState = takeBattleAction(battleState, button.dataset.action as BattleAction)
    renderBattle()
  })

  returnToRoute.addEventListener('click', () => {
    if (battleState.outcome === 'captured') encounterTarget.setEnabled(false)
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
      transitionTimer = window.setTimeout(showBattle, 360)
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
