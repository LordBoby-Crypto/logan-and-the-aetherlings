# Feature: Versioned local saves

## Feature identity

- ID: FEAT-006
- Delivery state: Implemented
- Target build: 0.0.6
- Milestone: Preproduction — save/PWA reliability
- Record date: 2026-07-21

## Approval and milestone

Approval source: the approved technical requirements and roadmap (`../concept/game-design.md` and `../concept/preproduction-roadmap.md`) require versioned IndexedDB saves with validation, atomic replacement, backup, and migration tests.

## Required for delivery

- Versioned save schema for position, party, health, sanctuary, and capture completion.
- Strict validation before applying stored data.
- Migration path for an older prototype schema.
- Atomic primary replacement with the previous primary retained as backup.
- Automatic backup recovery when primary data is missing or corrupt.
- Autosave at meaningful gameplay and browser lifecycle points.

## Deferred

Multiple named slots, manual save UI, cloud synchronization, cross-device transfer, and encrypted exports.

## Out of scope

Accounts, server storage, conflict resolution, leaderboards, and multiplayer state.

## Acceptance criteria

- [x] AC-01 — Valid current saves round-trip without data loss. (evidence: schema test)
- [x] AC-02 — Invalid position and health data are rejected before use. (evidence: corruption tests)
- [x] AC-03 — Version-zero prototype data migrates to version one. (evidence: migration test)
- [x] AC-04 — Replacing a primary save retains the previous primary as backup. (evidence: repository test and atomic IndexedDB transaction)
- [x] AC-05 — A corrupt primary loads a valid backup and reports recovery. (evidence: repository recovery test)
- [ ] AC-06 — Pending hosted validation: refresh, close/reopen, installed-PWA, and iPhone lifecycle restore correctly.

## Impact map

- Systems: schema, validation, migration, repository, IndexedDB adapter, save queue.
- Data: position, party/sanctuary, health/status, encounter capture flag, timestamp.
- Lifecycle: autosave on gameplay events, movement intervals, backgrounding, and exit.
- UI: restored/recovered/unavailable status messages.
- Tests/builds: five save tests; total suite 27 tests.

## Implementation

`saveData.ts` owns the version-one contract, validation, migration, and snapshots. `saveRepository.ts` owns primary/backup policy; its IndexedDB adapter commits both slots atomically. `main.ts` clamps restored coordinates to route bounds, restores party/capture state, and serializes writes through one promise chain.

## Verification

`npm run check` passed: lint, 10 test files/27 tests, TypeScript compilation, production build, manifest, and service worker generation.

## Regression checks

Party/healing, battle/capture, encounter transition, movement, orientation, quality, and Babylon scene tests remain passing.

## Playable result

Build 0.0.6 automatically retains Logan’s route position, party members and health, sanctuary contents, and captured encounter state across browser sessions, with schema validation and backup recovery.

## Project records updated

Feature record, current status, roadmap, backlog, known issues, changelog, README, package version, source, and tests.

## Known issues and limitations

Browser lifecycle behavior still needs hosted Windows/iPhone testing. Battle-in-progress state is not saved; restoration returns to exploration at the last completed autosave. Clearing site data removes local progress by design.

## User testing instructions

No user test is requested until the build has a stable hosted URL.

### Test environment

Pending hosted URL; Windows browser, installed Windows PWA, iPhone Safari, and iPhone home-screen PWA.

### Setup

No setup requested yet.

### Test cases

Move and refresh; capture and reopen; take damage and reopen; heal and reopen; background/restore on iPhone; verify installed-PWA state.

### Expected results

Completed progress restores accurately, corrupt primary data falls back safely, and no invalid save can place Logan outside route bounds.

### Regression spot checks

Loading, movement, interaction, battle, capture, party, healing, orientation, offline shell, and PWA update behavior.

### Failure report

Include device/browser/install mode, action before closure, closure method, expected versus restored state, reproducibility, and screenshot/video if useful.
