# Feature: Graybox exploration controls

## Feature identity

- ID: FEAT-002
- Delivery state: Implemented
- Target build: 0.0.2
- Milestone: Preproduction — graybox exploration
- Owner/team model: AI studio implementation; user device testing later
- Record date: 2026-07-21

## Approval and milestone

Approval source: the approved preproduction roadmap assigns movement, camera, collision, and keyboard/touch input to graybox exploration. The user approved that roadmap and visual direction on 2026-07-21. See `../concept/preproduction-roadmap.md`, `../roadmap.md`, and `../decisions/DEC-001-concept-greenlight.md`.

## Required for delivery

- WASD and arrow-key movement.
- Landscape touch joystick with pointer capture and cancel/reset recovery.
- Camera target follows Logan while retaining the approved angle.
- Frame-rate-independent movement with long-frame clamping.
- Route bounds, obstacle blocking, diagonal normalization, and collision sliding.
- Touch-safe-area layout and a nonfunctional interact control reserved for the next slice.
- Automated solver and graybox-scene checks.

## Deferred

Interaction behavior, animation blending, navigation mesh, production Logan model, footsteps, controller support, save persistence, and hosted device validation.

## Out of scope

Battle transition, capture gameplay, NPC dialogue, final art/UI fidelity, and production performance claims.

## Acceptance criteria

- [x] AC-01 — WASD and arrow inputs feed one normalized movement vector. (evidence: input implementation and diagonal solver test)
- [x] AC-02 — Touch joystick captures one pointer, clamps displacement, maps direction, and resets on release/cancel/blur. (evidence: implementation review and TypeScript/lint pass)
- [x] AC-03 — Movement is bounded, frame-delta-capped, obstacle-aware, and can slide on an unblocked axis. (evidence: four passing movement tests)
- [x] AC-04 — Camera target follows the player root while maintaining the fixed exploration angle. (evidence: render-loop integration and headless scene test)
- [ ] AC-05 — Keyboard movement feels responsive in a hosted Windows build. (pending: hosted combined playtest)
- [ ] AC-06 — Touch movement is comfortable and unclipped on the owner's iPhone in landscape. (pending: hosted combined playtest)

## Impact map

- Systems: movement solver, input controller, render-loop player/camera integration.
- Data/saves: not affected.
- Controls: keyboard and touch joystick added; controller deferred.
- UI: touch movement and interact controls added.
- Art/animation/VFX: temporary Logan root/geometry only; no animation.
- Audio: not affected.
- Networking/platform: pointer/touch and browser lifecycle handling.
- Tests/builds: four movement tests; total suite now 11 tests.
- Documents: feature, status, roadmap, backlog, issues, changelog, README.

## Implementation

`movement.ts` is a pure, testable route movement solver. `input.ts` combines keyboard and touch without coupling to the scene. `createGrayboxScene.ts` exposes a player root and fixed camera. `main.ts` applies movement and camera tracking each render frame. The interact button is intentionally inert until interaction targeting is implemented. Rollback is removal of FEAT-002 files/integration; no save migration exists.

## Verification

- `npm run check` on Node 24.14.0: lint passed, 4 test files/11 tests passed, TypeScript compiled, production PWA built.
- Movement tests passed for diagonal normalization, route clamps, obstacle blocking, and long-frame delta caps.
- Babylon NullEngine graybox scene construction/render remained passing.
- Hosted visual and input verification remains unavailable until deployment.

## Regression checks

Orientation tests, render-quality tests, scene construction/render, production build, manifest generation, and service worker generation remain passing. No prior saves or battle systems exist.

## Playable result

Build 0.0.2 is implemented locally and will be published to `main`. It is not yet labeled Ready for user testing because no hosted URL or visual/device evidence exists.

## Project records updated

Feature record, current status, roadmap, backlog, known issues, changelog, README, package version, source, and tests.

## Known issues and limitations

- The player is temporary geometry without animation.
- The interact button is intentionally nonfunctional.
- Collision uses a bounded-route solver and explicit obstacle list, not a navigation mesh.
- Hosted keyboard/touch comfort and clipping are pending.

## User testing instructions

No user test is requested until a hosted combined graybox build is available.

### Test environment

Pending hosted URL; Windows keyboard and project-owner iPhone landscape touch.

### Setup

No setup requested yet.

### Test cases

Pending the hosted graybox handoff; it will cover eight directions, simultaneous keys, touch drag/release/cancel, bounds, obstacle sliding, camera tracking, rotation prompt, and reload.

### Expected results

Movement should be consistent, camera tracking stable, controls unobtrusive, and route/obstacle collision free of tunneling.

### Regression spot checks

Loading, PWA launch, orientation prompt, location/prototype labels, and WebGL failure state.

### Failure report

Report case/step, pass/fail, expected versus observed behavior, device/browser/input, restart reproducibility, and screenshot/video when useful.
