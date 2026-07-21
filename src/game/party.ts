import type { Battler } from './battle'

export interface PartyState {
  members: Battler[]
  sanctuary: Battler[]
  capacity: number
}

export function createParty(): PartyState {
  return {
    members: [{ name: 'Kivren', level: 5, hp: 34, maxHp: 34, snared: false }],
    sanctuary: [],
    capacity: 3,
  }
}

export function updateLead(party: PartyState, lead: Battler): PartyState {
  return { ...party, members: party.members.map((member, index) => index === 0 ? { ...lead } : member) }
}

export function placeCapture(party: PartyState, captured: Battler): PartyState {
  const member = { ...captured, hp: captured.maxHp, snared: false }
  if (party.members.length < party.capacity) return { ...party, members: [...party.members, member] }
  return { ...party, sanctuary: [...party.sanctuary, member] }
}

export function healParty(party: PartyState): PartyState {
  return {
    ...party,
    members: party.members.map((member) => ({ ...member, hp: member.maxHp, snared: false })),
  }
}

