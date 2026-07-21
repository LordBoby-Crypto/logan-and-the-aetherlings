# Feature: Party placement and healing

## Feature identity

- ID: FEAT-005
- Delivery state: Implemented
- Target build: 0.0.5
- Milestone: Preproduction — core battle/capture loop
- Record date: 2026-07-21

## Approval and milestone

Approval source: the approved prototype loop in `../concept/game-design.md` and `../concept/preproduction-roadmap.md` requires captures to enter the party or sanctuary and damaged teams to heal before progressing.

## Required for delivery

- Three-slot prototype party with a sanctuary overflow path.
- Captured Aetherling placement after battle.
- Battle damage retained on the lead party member.
- Readable party screen with levels and health.
- In-world party healing interaction.

## Deferred

Reordering, switching during battle, experience, moveset editing, items, reserve withdrawal, and save persistence.

## Out of scope

Final party capacity, production art, evolution, equipment, storage search, and multiplayer trading.

## Acceptance criteria

- [x] AC-01 — A capture enters an open party slot with capture-only conditions cleared. (evidence: placement test)
- [x] AC-02 — A full party sends later captures to sanctuary. (evidence: overflow test)
- [x] AC-03 — Lead damage returns from battle and healing restores all party members. (evidence: state test and battle integration)
- [x] AC-04 — Party membership, level, and health are readable from exploration. (evidence: responsive party panel)
- [x] AC-05 — Healing requires interaction with the teal route crystal. (evidence: range-gated scene integration)
- [ ] AC-06 — Pending hosted validation: party and healing controls are readable on Windows and iPhone.

## Impact map

- Systems: party capacity, placement, overflow, lead synchronization, healing.
- UI/controls: Party button, health cards, sanctuary count, contextual healing, toast feedback.
- World: teal Mossmere crystal becomes an interactive healing station.
- Tests/builds: three party tests; total suite 22 tests.
- Saves: party state is session-only until the next slice.

## Implementation

`party.ts` owns immutable party operations. Battle creation accepts the current lead, and battle completion synchronizes damage before placing a capture. The existing interaction system selects the wild target or healing crystal by range.

## Verification

`npm run check` passed: lint, 8 test files/22 tests, TypeScript compilation, production build, manifest, and service worker generation.

## Regression checks

Battle/capture, encounter transition, exploration movement, orientation, quality, and Babylon scene tests remain passing.

## Playable result

Build 0.0.5 carries Kivren’s battle damage into the Party screen, places captured Mirelume into slot two, and restores the team when Logan interacts with the teal crystal farther up Mossmere Path.

## Project records updated

Feature record, current status, roadmap, backlog, changelog, README, package version, source, and tests.

## Known issues and limitations

Party state is lost on refresh. Party capacity is provisional. The prototype cannot reorder, switch, or withdraw sanctuary members. Hosted device validation is pending.

## User testing instructions

No user test is requested until a hosted combined build is available.

### Test environment

Pending hosted URL; Windows browser and project-owner iPhone landscape.

### Setup

No setup requested yet.

### Test cases

Take battle damage, capture Mirelume, inspect Party, walk to the teal crystal, heal, and inspect Party again.

### Expected results

Damage persists after battle, Mirelume occupies slot two, and crystal interaction restores every damaged member.

### Regression spot checks

Exploration, interaction, battle actions, capture, defeat, orientation, reload, and PWA launch.

### Failure report

Include device/browser, party state, exact steps, expected versus observed result, reproducibility, and screenshot/video if useful.
