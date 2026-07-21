import type { Battler } from '../game/battle'
import type { PartyState } from '../game/party'

export const SAVE_VERSION = 1

export interface GameSave {
  version: 1
  savedAt: string
  player: { x: number; z: number }
  party: PartyState
  encounterCaptured: boolean
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function validBattler(value: unknown): value is Battler {
  if (!isRecord(value)) return false
  return typeof value.name === 'string' && value.name.length > 0 &&
    Number.isInteger(value.level) && Number(value.level) > 0 &&
    typeof value.hp === 'number' && typeof value.maxHp === 'number' &&
    value.maxHp > 0 && value.hp >= 0 && value.hp <= value.maxHp &&
    typeof value.snared === 'boolean'
}

function validParty(value: unknown): value is PartyState {
  if (!isRecord(value) || !Array.isArray(value.members) || !Array.isArray(value.sanctuary)) return false
  return Number.isInteger(value.capacity) && Number(value.capacity) > 0 &&
    value.members.length > 0 && value.members.length <= Number(value.capacity) &&
    value.members.every(validBattler) && value.sanctuary.every(validBattler)
}

export function parseGameSave(value: unknown): GameSave | undefined {
  if (!isRecord(value)) return undefined
  if (value.version === 0 && isRecord(value.position)) {
    value = {
      version: 1,
      savedAt: new Date(0).toISOString(),
      player: value.position,
      party: value.party,
      encounterCaptured: value.captured,
    }
  }
  if (!isRecord(value) || value.version !== SAVE_VERSION || !isRecord(value.player)) return undefined
  if (typeof value.savedAt !== 'string' || Number.isNaN(Date.parse(value.savedAt))) return undefined
  if (typeof value.player.x !== 'number' || typeof value.player.z !== 'number') return undefined
  if (!Number.isFinite(value.player.x) || !Number.isFinite(value.player.z)) return undefined
  if (!validParty(value.party) || typeof value.encounterCaptured !== 'boolean') return undefined
  return value as unknown as GameSave
}

export function createGameSave(player: { x: number; z: number }, party: PartyState, encounterCaptured: boolean): GameSave {
  return {
    version: SAVE_VERSION,
    savedAt: new Date().toISOString(),
    player: { x: player.x, z: player.z },
    party: structuredClone(party),
    encounterCaptured,
  }
}

