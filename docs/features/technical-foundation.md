# Feature: Technical foundation

## Feature identity

- ID: FEAT-001
- Delivery state: Implemented
- Milestone: Preproduction — technical foundation
- Team model: AI studio implementation; user device testing later
- Record date: 2026-07-21

## Approval and milestone

Approval source: the user explicitly approved preproduction and then explicitly approved the exploration/battle visual direction in ChatGPT on 2026-07-21. See `../decisions/DEC-001-concept-greenlight.md`, `../decisions/DEC-002-web-technical-foundation.md`, and `../roadmap.md`.

## Required for delivery

- Pinned TypeScript/Vite/Babylon.js/PWA toolchain.
- WebGL graybox scene with fixed angled camera and explicit temporary-art labeling.
- Responsive full-screen canvas and safe-area-aware system overlays.
- Portrait-phone rotation prompt without blocking desktop portrait windows.
- WebGL failure screen, loading state, install prompt, and service-worker registration.
- Mobile/desktop rendering policy, automated checks, production build, and CI workflow.

## Deferred

Player movement, touch joystick, interaction, battles, saves, production art, audio, deployment, cloud sync, and performance claims from real iPhone hardware.

## Out of scope

Final exploration UI fidelity, final 3D models, content production, capture gameplay, and device certification.

## Acceptance criteria

- [x] AC-01 — Clean installation, lint, seven unit tests, typecheck, and production build pass. (evidence: `npm run check`, 2026-07-21)
- [ ] AC-02 — Built preview starts and renders the Mossmere graybox in a desktop browser. (partial evidence: preview returned HTTP 200 for shell, manifest, and service worker; visual cloud-browser access to localhost was blocked)
- [x] AC-03 — Portrait-phone logic distinguishes coarse-pointer phones from desktop portrait windows. (evidence: three passing orientation unit tests)
- [x] AC-04 — The shell contains loading, WebGL failure, PWA install/update, landscape prompt, safe-area, and reduced-motion handling. (evidence: implementation review)
- [ ] AC-05 — The project owner's iPhone loads the scene in landscape without clipping or browser instability. (pending: later combined device handoff after hosting and movement)

## Impact map

- Systems: new Babylon.js engine and graybox scene.
- Data/saves: not affected yet.
- Controls: orientation policy only; movement deferred.
- UI: loading, failure, orientation, location, install, prototype label.
- Art/VFX: temporary procedural graybox and vector PWA mark.
- Audio: not affected.
- Networking: static PWA caching only.
- Tests/builds: Vitest, ESLint, TypeScript, Vite build, GitHub CI.
- Documents: decision, feature record, continuity records, README.

## Implementation

`src/main.ts` owns lifecycle and PWA integration. `src/game/createGrayboxScene.ts` owns the disposable validation scene. `src/game/quality.ts` isolates rendering policy. `src/platform/orientation.ts` isolates landscape decisions. Rollback is removal of this feature commit because no save or content migration exists.

## Verification

- `npm run check` on Node 24.14.0: passed ESLint, 3 test files/7 tests, TypeScript build, Vite production build, and PWA generation.
- Babylon NullEngine scene test: constructed more than 65 meshes and rendered one frame without throwing.
- Production preview smoke: `/`, `/manifest.webmanifest`, and `/sw.js` returned HTTP 200.
- Browser visual smoke: unavailable because the cloud browser blocked workspace localhost; no visual claim made.

## Regression checks

No prior implementation exists. Documentation validation and continuity remain required before publishing.

## Playable result

Not yet declared ready for user testing. The production output exists in `dist/`, and its preview/server/PWA assets passed HTTP smoke checks, but hosted visual and device tests remain.

## Project records updated

Decision, feature record, status, roadmap, backlog, known issues, changelog, technical design, README, and CI.

## Known issues and limitations

The scene is validation geometry, not final art. SVG install icons are sufficient for foundation testing but Apple-specific raster icon polish is deferred. The main JavaScript chunk is approximately 849 kB minified/197 kB gzip and must be monitored as gameplay grows. No hosted visual or real-device performance evidence exists.

## User testing instructions

No user test is requested for FEAT-001 alone. Device testing will follow after movement/touch input creates a meaningful test path.

### Test environment

Pending hosted URL; Windows browser and project-owner iPhone in landscape; keyboard and touch respectively.

### Setup

No setup requested yet. Hosting and movement are prerequisites.

### Test cases

Pending the combined graybox-exploration handoff.

### Expected results

The hosted build must load without clipping or instability and expose a meaningful movement path before testing begins.

### Regression spot checks

Loading, portrait rotation prompt, landscape canvas, PWA launch, and update behavior will be included in the combined handoff.

### Failure report

When testing begins, report test case/step, pass or fail, expected versus observed behavior, device/browser, input method, restart reproducibility, and screenshot/video where useful.
