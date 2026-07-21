# Feature: Battle and capture prototype

## Feature identity

- ID: FEAT-004
- Delivery state: Implemented
- Target build: 0.0.4
- Milestone: Preproduction — core battle/capture loop
- Record date: 2026-07-21

## Approval and milestone

Approval source: the user-approved game design and preproduction roadmap (`../concept/game-design.md` and `../concept/preproduction-roadmap.md`) require strategic turn-based battles and weaken-and-capture gameplay using triangular Aether Prisms.

## Required for delivery

- One readable wild turn-based battle.
- Damage and Snare actions.
- Health/status-dependent capture odds.
- Limited triangular Aether Prisms with success and failure.
- Wild counter-turn, defeat, capture completion, and return to exploration.
- Keyboard/mouse and direct-touch compatible battle actions.

## Deferred

Party management, healing, switching, affinities, abilities, experience, final balance, animation, audio, and production creature assets.

## Out of scope

Trainer battles, complete move sets, save persistence, final art, and full encounter tables.

## Acceptance criteria

- [x] AC-01 — Damage weakens but cannot knock out the capturable target. (evidence: automated battle test)
- [x] AC-02 — Lower health and Snare measurably improve capture chance. (evidence: capture formula test and visible odds)
- [x] AC-03 — A failed Prism consumes inventory and allows a wild counter-turn. (evidence: automated failure-path test)
- [x] AC-04 — A successful Prism completes battle and removes the overworld target. (evidence: automated success test and shell integration)
- [x] AC-05 — Defeat and capture both expose a route-return path. (evidence: battle rendering implementation)
- [ ] AC-06 — Pending hosted validation: the battle is readable and touch-friendly on Windows and iPhone.

## Impact map

- Systems: deterministic battle state, damage, status, capture probability, inventory, outcomes.
- Controls/UI: three direct battle actions, health bars, status, turn count, odds, messages.
- Art: symbolic temporary battlers; no production asset dependency.
- Tests/builds: one new test file and four battle tests; total 19 tests.
- Saves/audio/networking: unaffected.

## Implementation

`battle.ts` contains pure battle rules with injected randomness for deterministic testing. The browser shell renders battle state and passes direct action selections into the rules. Wild health floors at one so this prototype teaches weakening and capture rather than accidental knockout.

## Verification

`npm run check` passed: lint, 7 test files/19 tests, TypeScript compilation, production build, manifest, and service worker generation.

## Regression checks

Exploration movement, interaction range, encounter transition, orientation, quality, and Babylon scene tests remain passing.

## Playable result

Build 0.0.4 lets Logan encounter Mirelume, use Pulse Strike or Binding Spore, see capture odds change, spend an Aether Prism, handle failure/counterattack, capture the target, and return to the route.

## Project records updated

Feature record, current status, roadmap, backlog, known issues, changelog, README, version, source, and tests.

## Known issues and limitations

Balance and prototype names are provisional. Actions resolve instantly without animation/audio. Party placement, healing, switching, and persistence are deferred. Hosted device evidence is unavailable.

## User testing instructions

No user test is requested until a hosted combined build is available.

### Test environment

Pending hosted URL; Windows browser and project-owner iPhone landscape.

### Setup

No setup requested yet.

### Test cases

Enter battle, attack, apply Snare, compare odds, fail and succeed at capture, reach defeat, return to route, and confirm the captured target is removed.

### Expected results

Each choice has a visible consequence, capture odds rise through tactics, and terminal outcomes cannot accept further actions.

### Regression spot checks

Loading, movement, collision, interaction, transition, orientation, reload, and PWA launch.

### Failure report

Include device/browser, action sequence, health/Prism counts, expected versus observed result, reproducibility, and screenshot/video if useful.
