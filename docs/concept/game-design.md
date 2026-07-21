# Initial Game Design

## Goals and player experience

Exploration should create curiosity, battle choices should feel clever, and captures should strengthen a personally chosen team. Defeat returns Logan to a safe location without erasing captures or story progress. Difficulty begins forgiving and adds visible tactical complexity.

## Core gameplay loop

Explore → encounter → battle → weaken → throw an Aether Prism → capture or continue → manage/heal the party → advance. Long-term progress unlocks routes and traversal, evolves a preferred team, expands the field guide, and reveals the Aetherway mystery.

## Controls and camera

Fixed angled/top-down framing with contextual adjustment. Windows uses WASD/arrows and confirm/back/menu controls. iPhone uses virtual movement, contextual interaction, and direct-touch menus. Landscape is required for gameplay; portrait presents a rotate-device screen. Controller support follows the prototype.

## Game modes

Single-player only. Local and online multiplayer are not included. Exploration and offline battles pause. Saves are device-local first; optional account cloud sync is deferred.

## Progression and replayability

Aetherlings gain experience, learn bounded move sets, and may evolve through level, item, habitat, or relationship conditions. Alternate teams, optional creatures, side routes, and field-guide completion provide replay value without endless procedural content.

## World, rules, and content model

Valewynn is formed from discrete loadable settlements, routes, interiors, and wilderness scenes. Battles are turn-based. Aetherlings have health, level, statistics, one or two affinities, abilities, statuses, and up to four equipped moves.

Aether Prisms are palm-sized triangular crystals held in metallic frames. Lower health and useful statuses improve capture odds. A thrown Prism unfolds into three glowing arcs, converts the target into energy, closes, and visibly resolves success or failure. Captures enter the party or reserve sanctuary.

## Art direction

Stylized 3D with clean silhouettes, expressive proportions, restrained texture detail, modular environments, and strong readability from the angled camera. MeshyAI production models require optimized mobile derivatives, compressed textures, limited materials, efficient rigs, and standardized animation contracts. Aether Prisms must never read as spherical capture balls.

## Audio direction

Original habitat and settlement themes plus concise battle arrangements. Priority effects cover interface feedback, movement, attacks, statuses, Prism throw/open/pulse/success/failure, and discovery. Full voice acting is excluded; meaningful speech is subtitled.

## Technical requirements

Proposed stack: TypeScript, Vite, Babylon.js/WebGL, responsive HTML UI, and an installable PWA. Minimum representative target is stable 30 FPS on the owner's iPhone and 60 FPS preferred on Windows. Saves use a versioned IndexedDB schema with validation, atomic replacement, backup, and migration tests. Prototype hosting is static HTTPS with offline caching. Assets use GLB/glTF and compressed browser-safe textures/audio.

## Comparable games

Comparables validate genre patterns only and do not authorize copying protected expression; see `vision.md`.

## Open design questions

- Visible overworld creatures versus habitat encounter zones: prototype both.
- Original affinity chart: paper design plus automated matchup tests.
- Party size and turn order: decide from battle-prototype evidence.
- MeshyAI production quality and budget: validate one creature end to end.
