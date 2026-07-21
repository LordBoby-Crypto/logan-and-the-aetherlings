export type BattleOutcome = 'active' | 'captured' | 'defeat'
export type BattleAction = 'pulse-strike' | 'binding-spore' | 'aether-prism'

export interface Battler {
  name: string
  level: number
  hp: number
  maxHp: number
  snared: boolean
}

export interface BattleState {
  ally: Battler
  wild: Battler
  prisms: number
  turn: number
  outcome: BattleOutcome
  message: string
}

export function createBattle(lead?: Battler): BattleState {
  return {
    ally: lead ? { ...lead } : { name: 'Kivren', level: 5, hp: 34, maxHp: 34, snared: false },
    wild: { name: 'Mirelume', level: 4, hp: 30, maxHp: 30, snared: false },
    prisms: 3,
    turn: 1,
    outcome: 'active',
    message: 'A wild Mirelume watches carefully.',
  }
}

export function captureChance(wild: Battler): number {
  const missingHealth = 1 - wild.hp / wild.maxHp
  return Math.min(0.9, 0.12 + missingHealth * 0.58 + (wild.snared ? 0.2 : 0))
}

function wildTurn(state: BattleState, random: () => number): BattleState {
  const damage = 5 + Math.floor(random() * 4)
  const hp = Math.max(0, state.ally.hp - damage)
  return {
    ...state,
    ally: { ...state.ally, hp },
    turn: state.turn + 1,
    outcome: hp === 0 ? 'defeat' : 'active',
    message: hp === 0 ? `${state.message} ${state.ally.name} cannot continue.` : `${state.message} ${state.wild.name} answers for ${damage} damage.`,
  }
}

export function takeBattleAction(state: BattleState, action: BattleAction, random: () => number = Math.random): BattleState {
  if (state.outcome !== 'active') return state

  if (action === 'aether-prism') {
    if (state.prisms === 0) return { ...state, message: 'No Aether Prisms remain.' }
    const prisms = state.prisms - 1
    if (random() < captureChance(state.wild)) {
      return { ...state, prisms, outcome: 'captured', message: `${state.wild.name} joined Logan’s team!` }
    }
    return wildTurn({ ...state, prisms, message: 'The Prism opened—but the wild Aetherling broke free.' }, random)
  }

  if (action === 'binding-spore') {
    const next = { ...state, wild: { ...state.wild, snared: true }, message: `${state.wild.name} was Snared. Capture odds rose.` }
    return wildTurn(next, random)
  }

  const damage = 7 + Math.floor(random() * 5)
  const hp = Math.max(1, state.wild.hp - damage)
  const next = { ...state, wild: { ...state.wild, hp }, message: `${state.ally.name} dealt ${damage} damage.` }
  return wildTurn(next, random)
}
