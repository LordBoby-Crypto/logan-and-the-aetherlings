import { Engine } from '@babylonjs/core/Engines/engine.js'
import { registerSW } from 'virtual:pwa-register'
import { createGrayboxScene } from './game/createGrayboxScene'
import { canStartBattle, captureChance, createBattle, takeBattleAction, type BattleAction, type BattleState } from './game/battle'
import { finishTransition, leaveEncounter, startEncounter, type EncounterState } from './game/encounterState'
import { isInteractionAvailable } from './game/interaction'
import { createParty, healParty, placeCapture, updateLead, type PartyState } from './game/party'
import { solveMovement } from './game/movement'
import { chooseRenderTier, hardwareScaleFor } from './game/quality'
import { InputController } from './platform/input'
import { needsLandscapePrompt } from './platform/orientation'
import { createGameSave } from './platform/saveData'
import { IndexedDbSaveStore, SaveRepository } from './platform/saveRepository'
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
const interactionPromptText = requireElement<HTMLElement>('#interaction-prompt span')
const partyButton = requireElement<HTMLButtonElement>('#party-button')
const partyCount = requireElement<HTMLElement>('#party-count')
const partyScreen = requireElement<HTMLElement>('#party-screen')
const closeParty = requireElement<HTMLButtonElement>('#close-party')
const partyMembers = requireElement<HTMLElement>('#party-members')
const sanctuaryCount = requireElement<HTMLElement>('#sanctuary-count')
const gameToast = requireElement<HTMLElement>('#game-toast')
const fpsLabel = requireElement<HTMLElement>('#fps-label')

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
  const { scene, camera, player, encounterTarget, healingStation } = createGrayboxScene(engine)
  const input = new InputController(movementPad, movementKnob, interactButton)
  await scene.whenReadyAsync()

  loadingScreen.hidden = true
  prototypeLabel.hidden = false
  locationLabel.hidden = false

  let movementState = { position: player.position.clone(), facingRadians: 0 }
  let encounterState: EncounterState = 'exploring'
  let transitionTimer: number | undefined
  let battleState: BattleState = createBattle()
  let partyState: PartyState = createParty()
  let encounterCaptured = false
  let toastTimer: number | undefined
  let lastPositionSave = 0
  let saveChain = Promise.resolve()
  let lastFpsUpdate = 0
  const routeBounds = { minX: -3.2, maxX: 3.2, minZ: -15, maxZ: 10.5 }
  const obstacles = [{ x: 1.5, z: 13.5, radius: 3.9 }]

  const renderParty = (): void => {
    partyCount.textContent = `${partyState.members.length} / ${partyState.capacity}`
    sanctuaryCount.textContent = `Sanctuary: ${partyState.sanctuary.length} Aetherling${partyState.sanctuary.length === 1 ? '' : 's'}`
    partyMembers.replaceChildren(...partyState.members.map((member, index) => {
      const card = document.createElement('article')
      card.innerHTML = `<span>${index === 0 ? 'Lead' : `Slot ${index + 1}`}</span><strong>${member.name} <small>Lv. ${member.level}</small></strong><div class="party-hp"><i style="width:${member.hp / member.maxHp * 100}%"></i></div><em>${member.hp} / ${member.maxHp} HP</em>`
      return card
    }))
  }

  const showToast = (message: string): void => {
    gameToast.textContent = message
    gameToast.hidden = false
    if (toastTimer !== undefined) window.clearTimeout(toastTimer)
    toastTimer = window.setTimeout(() => { gameToast.hidden = true }, 2200)
  }

  const saveRepository = new SaveRepository(new IndexedDbSaveStore())
  const persistGame = (): Promise<void> => {
    const snapshot = createGameSave(player.position, partyState, encounterCaptured)
    saveChain = saveChain.then(() => saveRepository.save(snapshot)).catch((error) => {
      console.error('Unable to save game', error)
    })
    return saveChain
  }

  try {
    const loaded = await saveRepository.load()
    if (loaded.save) {
      partyState = loaded.save.party
      encounterCaptured = loaded.save.encounterCaptured
      player.position.x = Math.max(routeBounds.minX, Math.min(routeBounds.maxX, loaded.save.player.x))
      player.position.z = Math.max(routeBounds.minZ, Math.min(routeBounds.maxZ, loaded.save.player.z))
      movementState.position.copyFrom(player.position)
      encounterTarget.setEnabled(!encounterCaptured)
      partyButton.hidden = false
      renderParty()
      showToast(loaded.recovered ? 'Recovered progress from the backup save.' : 'Progress restored.')
    }
  } catch (error) {
    console.error('Unable to load saved game', error)
    showToast('Local saving is unavailable in this browser session.')
  }

  partyButton.addEventListener('click', () => { renderParty(); partyScreen.hidden = false })
  closeParty.addEventListener('click', () => { partyScreen.hidden = true })

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
    if (!canStartBattle(partyState.members[0])) {
      encounterState = leaveEncounter()
      showToast('Kivren cannot battle. Restore your party at the teal crystal.')
      return
    }
    encounterState = finishTransition(encounterState)
    battleState = createBattle(partyState.members[0])
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
    partyState = updateLead(partyState, battleState.ally)
    if (battleState.outcome === 'captured') {
      partyState = placeCapture(partyState, battleState.wild)
      encounterCaptured = true
      encounterTarget.setEnabled(false)
      showToast('Mirelume was placed in your party.')
    } else if (battleState.outcome === 'defeat') {
      partyState = healParty(partyState)
      player.position.set(0, player.position.y, -7)
      movementState.position.copyFrom(player.position)
      showToast('Kivren recovered safely at Mossmere Outpost.')
    }
    renderParty()
    encounterState = leaveEncounter()
    encounterScreen.hidden = true
    partyButton.hidden = false
    void persistGame()
  })

  engine.runRenderLoop(() => {
    const nearWild = encounterTarget.isEnabled() && isInteractionAvailable(player.position, encounterTarget.position)
    const nearHealing = isInteractionAvailable(player.position, healingStation.position, 2.6)
    const canInteract = encounterState === 'exploring' && (nearWild || nearHealing)
    interactionPromptText.textContent = nearWild ? 'Approach wild Aetherling' : 'Restore party at Aether crystal'
    interactionPrompt.hidden = !canInteract
    interactButton.disabled = !canInteract

    const interactionRequested = input.consumeInteraction()
    if (canInteract && interactionRequested) {
      if (nearHealing) {
        partyState = healParty(partyState)
        renderParty()
        showToast('Your party is fully restored.')
        void persistGame()
        return
      }
      if (!canStartBattle(partyState.members[0])) {
        showToast('Kivren cannot battle. Restore your party at the teal crystal.')
        return
      }
      encounterState = startEncounter(encounterState)
      interactionPrompt.hidden = true
      transitionTimer = window.setTimeout(showBattle, 360)
    }

    const movementInput = encounterState === 'exploring' ? input.update() : input.movement.set(0, 0)
    movementState = solveMovement(movementState, movementInput, engine.getDeltaTime() / 1000, 5.2, routeBounds, obstacles)
    player.position.copyFrom(movementState.position)
    player.rotation.y = movementState.facingRadians
    camera.target.set(player.position.x, 0.7, player.position.z + 4.5)
    if (performance.now() - lastFpsUpdate > 1000) {
      lastFpsUpdate = performance.now()
      fpsLabel.textContent = `${Math.round(engine.getFps())} FPS`
    }
    if (encounterState === 'exploring' && input.movement.lengthSquared() > 0 && performance.now() - lastPositionSave > 2000) {
      lastPositionSave = performance.now()
      void persistGame()
    }
    scene.render()
  })
  window.addEventListener('resize', () => engine.resize())
  window.addEventListener('pagehide', () => {
    void persistGame()
    input.dispose()
    if (transitionTimer !== undefined) window.clearTimeout(transitionTimer)
    if (toastTimer !== undefined) window.clearTimeout(toastTimer)
  }, { once: true })
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') void persistGame()
  })
} catch (error) {
  console.error(error)
  loadingScreen.hidden = true
  unsupportedScreen.hidden = false
}
