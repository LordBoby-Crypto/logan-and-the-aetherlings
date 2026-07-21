# Current Status

- Date: 2026-07-21
- Current build: 0.0.5 party placement and healing; not deployed
- Current milestone: Preproduction — core battle/capture loop
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

## Verification

- Recovered greenlight package passed validation with no errors or warnings.
- Continuity audit found all required record classes with no conflicts.
- `npm run check` passed lint, 8 test files/22 tests, TypeScript compilation, production build, and PWA generation.
- Headless Babylon scene construction/render and production HTTP/PWA smoke checks passed.
- Hosted visual and real-device checks have not run.

## Known issues

- Cloud browser access to workspace localhost is blocked; visual browser verification requires a hosted build.
- Main JavaScript bundle is approximately 849 kB minified/197 kB gzip and requires continued monitoring.

## Next task

Implement validated, versioned local saves with recovery behavior.
