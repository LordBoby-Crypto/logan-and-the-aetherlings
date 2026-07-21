import { Vector2 } from '@babylonjs/core/Maths/math.vector.pure.js'

const movementKeys = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'])
const interactionKeys = new Set(['KeyE', 'Enter', 'Space'])

export class InputController {
  readonly movement = new Vector2(0, 0)
  private readonly pressed = new Set<string>()
  private touchMovement = new Vector2(0, 0)
  private touchPointerId: number | undefined
  private interactionQueued = false

  constructor(
    private readonly pad: HTMLElement,
    private readonly knob: HTMLElement,
    private readonly interactButton: HTMLButtonElement,
  ) {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
    window.addEventListener('blur', this.reset)
    this.pad.addEventListener('pointerdown', this.onPointerDown)
    this.pad.addEventListener('pointermove', this.onPointerMove)
    this.pad.addEventListener('pointerup', this.onPointerEnd)
    this.pad.addEventListener('pointercancel', this.onPointerEnd)
    this.interactButton.addEventListener('click', this.onInteract)
  }

  update(): Vector2 {
    const keyboard = new Vector2(
      Number(this.pressed.has('ArrowRight') || this.pressed.has('KeyD')) - Number(this.pressed.has('ArrowLeft') || this.pressed.has('KeyA')),
      Number(this.pressed.has('ArrowUp') || this.pressed.has('KeyW')) - Number(this.pressed.has('ArrowDown') || this.pressed.has('KeyS')),
    )
    this.movement.copyFrom(keyboard.lengthSquared() > 0 ? keyboard : this.touchMovement)
    return this.movement
  }

  consumeInteraction(): boolean {
    const queued = this.interactionQueued
    this.interactionQueued = false
    return queued
  }

  dispose(): void {
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
    window.removeEventListener('blur', this.reset)
    this.pad.removeEventListener('pointerdown', this.onPointerDown)
    this.pad.removeEventListener('pointermove', this.onPointerMove)
    this.pad.removeEventListener('pointerup', this.onPointerEnd)
    this.pad.removeEventListener('pointercancel', this.onPointerEnd)
    this.interactButton.removeEventListener('click', this.onInteract)
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (interactionKeys.has(event.code)) {
      event.preventDefault()
      if (!event.repeat) this.interactionQueued = true
      return
    }
    if (!movementKeys.has(event.code)) return
    event.preventDefault()
    this.pressed.add(event.code)
  }

  private readonly onInteract = (): void => { this.interactionQueued = true }

  private readonly onKeyUp = (event: KeyboardEvent): void => {
    this.pressed.delete(event.code)
  }

  private readonly onPointerDown = (event: PointerEvent): void => {
    if (this.touchPointerId !== undefined) return
    this.touchPointerId = event.pointerId
    this.pad.setPointerCapture(event.pointerId)
    this.updateTouch(event)
  }

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (event.pointerId === this.touchPointerId) this.updateTouch(event)
  }

  private readonly onPointerEnd = (event: PointerEvent): void => {
    if (event.pointerId !== this.touchPointerId) return
    this.touchPointerId = undefined
    this.touchMovement.set(0, 0)
    this.knob.style.transform = 'translate(0, 0)'
  }

  private readonly reset = (): void => {
    this.pressed.clear()
    this.touchPointerId = undefined
    this.touchMovement.set(0, 0)
    this.knob.style.transform = 'translate(0, 0)'
  }

  private updateTouch(event: PointerEvent): void {
    const bounds = this.pad.getBoundingClientRect()
    const radius = bounds.width * 0.34
    const x = event.clientX - (bounds.left + bounds.width / 2)
    const y = event.clientY - (bounds.top + bounds.height / 2)
    const length = Math.hypot(x, y)
    const scale = length > radius ? radius / length : 1
    const limitedX = x * scale
    const limitedY = y * scale
    this.touchMovement.set(limitedX / radius, -limitedY / radius)
    this.knob.style.transform = `translate(${limitedX}px, ${limitedY}px)`
  }
}
