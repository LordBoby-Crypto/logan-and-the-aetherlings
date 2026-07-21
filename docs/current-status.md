# Current Status

- Date: 2026-07-21
- Current build: 0.0.8 BUG-001 repair; deployed to GitHub Pages
- Current milestone: Preproduction — save/PWA reliability
- Approval source: `decisions/DEC-001-concept-greenlight.md`

## Completed

- Concept approved for preproduction.
- Five-document greenlight package created.
- Pinned TypeScript/Vite/Babylon.js/PWA foundation implemented.
- Responsive shell, orientation policy, install/update handling, disposable Mossmere graybox, automated checks, and CI workflow implemented.
- WASD/arrow movement, touch joystick, camera following, bounded movement, obstacle collision/sliding, and input lifecycle recovery implemented.
- Contextual wild interaction and the repeatable route-to-battle staging seam implemented.
- Turn-based damage/status choices, visible capture odds, limited Aether Prisms, counter-turns, defeat, and capture implemented.
- Three-slot party placement, sanctuary overflow rules, battle-damage carryover, party UI, and in-world healing implemented.
- Validated IndexedDB saves, schema migration, atomic primary/backup writes, recovery fallback, and autosave lifecycle implemented.
- Fixed zero-HP defeat re-entry, clarified battle ownership labels, and made the intended 1-HP-plus-Snare capture setup deterministic in build 0.0.8.

## Verification

- Recovered greenlight package passed validation with no errors or warnings.
- Continuity audit found all required record classes with no conflicts.
- `npm run check` passed lint, 10 test files/30 tests, TypeScript compilation, production build, and PWA generation.
- Headless Babylon scene construction/render and production HTTP/PWA smoke checks passed.
- Public HTTPS index, scoped assets, manifest, CI, and Pages deployment passed. Cloud 3D launch is blocked by unavailable WebGL; owner Windows/iPhone tests are pending under `playtests/0.0.7-handoff.md`.
- Version 0.0.8 CI, Pages deployment, public HTML version label, and manifest HTTP response passed; focused BUG-001 owner retest is in `playtests/0.0.8-bug-001-retest.md`.

## Known issues

- Cloud browser access to workspace localhost is blocked; visual browser verification requires a hosted build.
- Main JavaScript bundle is approximately 849 kB minified/197 kB gzip and requires continued monitoring.
- BUG-001 is fixed in source and awaiting a focused Windows retest on the deployed 0.0.8 build.

## Next task

Complete the focused BUG-001 Windows retest on deployed 0.0.8; install/offline testing remains pending by owner choice.
