export type EncounterState = 'exploring' | 'transitioning' | 'battle-staging'

export function startEncounter(state: EncounterState): EncounterState {
  return state === 'exploring' ? 'transitioning' : state
}

export function finishTransition(state: EncounterState): EncounterState {
  return state === 'transitioning' ? 'battle-staging' : state
}

export function leaveEncounter(): EncounterState {
  return 'exploring'
}

