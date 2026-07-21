# Feature: Interaction and encounter transition

## Feature identity

- ID: FEAT-003
- Delivery state: Implemented
- Target build: 0.0.3
- Milestone: Preproduction — graybox exploration
- Record date: 2026-07-21

## Approval and milestone

Approval source: the user-approved preproduction roadmap (`../concept/preproduction-roadmap.md`) and current roadmap (`../roadmap.md`) call for contextual interaction and a route-to-wild-encounter seam before battle production.

## Required for delivery

- Range-based wild Aetherling interaction.
- Keyboard and touch activation.
- Movement lock during encounter transition.
- Honest battle-staging screen with a return path.
- Temporary, clearly graybox encounter target.

## Deferred

Turn-based combat, Aether Prism capture, final creature art, animation, audio, and hosted device validation.

## Out of scope

NPC dialogue, save persistence, encounter tables, rewards, and production UI/art.

## Acceptance criteria

- [x] AC-01 — Prompt and touch control become available only inside the interaction radius. (evidence: range unit tests and render-loop integration)
- [x] AC-02 — E, Enter, Space, and the touch button can start the encounter. (evidence: input implementation and lint/type checks)
- [x] AC-03 — Movement stops during transition and battle staging. (evidence: state tests and render-loop integration)
- [x] AC-04 — The player can return to the route without reloading. (evidence: state test and return control)
- [x] AC-05 — State and range rules have automated tests. (evidence: four passing unit tests)
- [ ] AC-06 — Pending hosted validation: interaction works comfortably on Windows and iPhone builds.

## Impact map

- Systems: interaction range, encounter state, scene target, render-loop integration.
- Controls/UI: contextual prompt, enabled touch action, battle-staging overlay.
- Art: disposable primitive wild Aetherling.
- Tests/builds: two new test files and four tests.
- Saves/networking/audio: unaffected.

## Implementation

Pure modules own the interaction-radius rule and encounter-state transitions. The input controller queues one interaction from keyboard or touch. The scene exposes a temporary wild target; the shell controls its contextual prompt and transition overlay.

## Verification

`npm run check` passed: lint, 6 test files/15 tests, TypeScript compilation, production build, manifest, and service worker generation.

## Regression checks

Existing orientation, quality, movement, collision, input lifecycle, and Babylon scene tests remain passing.

## Playable result

Build 0.0.3 supports approaching the purple/teal graybox creature, interacting, entering battle staging, and returning to Mossmere Path. It is not yet Ready for user testing because no hosted URL exists.

## Project records updated

Feature record, status, roadmap, backlog, changelog, README, package version, source, and tests.

## Known issues and limitations

The encounter target and battle screen are temporary. Combat and capture are not implemented. Hosted visual and device evidence remains pending.

## User testing instructions

No user test is requested until a hosted combined build is available.

### Test environment

Pending hosted URL; Windows browser and project-owner iPhone in landscape.

### Setup

No setup requested yet.

### Test cases

Approach and leave interaction range, activate with keyboard/touch, verify movement lock, return to route, and repeat.

### Expected results

The prompt tracks range, one activation opens staging, movement remains locked, and return restores exploration.

### Regression spot checks

Movement, collision, camera tracking, orientation prompt, reload, and PWA launch.

### Failure report

Include device/browser, input used, exact step, expected versus observed result, reproducibility, and screenshot/video if useful.
