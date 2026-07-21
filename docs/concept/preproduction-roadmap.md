# Preproduction Roadmap

## Preproduction objective

Prove that exploration → battle → capture is enjoyable and readable on Windows and iPhone, saves are reliable, and one MeshyAI creature can complete the optimized production pipeline.

## Prototype objective

Primary question: does a 5–15 minute exploration, battle, weakening, and capture loop feel understandable and satisfying on both targets? Secondary questions cover 30 FPS iPhone feasibility, touch comfort, and save lifecycle reliability.

## Prototype scope

One route, one outpost, Logan, three temporary creatures, one wild encounter, one trainer battle, party management, healing, capture, local saves, keyboard/touch input, and PWA installation. Cloud accounts, large maps, full roster production, multiplayer, native packaging, and final audio are excluded. Stop if iPhone Safari cannot sustain the minimum loop without a credible reduction path.

## Prototype test plan

The user will receive exact steps when a build is ready: open/install on Windows and iPhone; start new; move/interact; enter a wild battle; attack/use status; throw a Prism; manage the capture; heal; save; close/reopen; confirm restoration. Pass requires completion on both devices, no blocker/lost save/clipped primary UI/crash, at least 30 FPS for 90% of sampled iPhone play with no sustained segment below 24 FPS, color-independent information, and successful refresh/reopen/migration save tests.

## Preproduction stages

1. Concept lock — approved and validated records.
2. Technical foundation — pinned tools, PWA shell, rendering canvas, tests, lint/build.
3. Graybox exploration — movement, camera, collision, interaction, transitions, keyboard/touch.
4. Core battle/capture loop — data, turns, statuses, Prism capture, party, healing.
5. Save/PWA reliability — IndexedDB migrations, backup, install/update/offline.
6. Visual/audio target — user-approved primary-screen concepts and budgets.
7. Production pipeline proof — one specified MeshyAI creature integrated and profiled.
8. Scope revision and production gate — evidence-based production decision.

## Exit criteria

Core loop passes user and technical thresholds; Windows/iPhone paths are verified; save/PWA lifecycle passes; one MeshyAI pipeline completes acceptably; scope/cost are revised from evidence; and no blocking decision or unmitigated Extreme risk remains.

## Stop and pivot criteria

Reduce rendering/art tier for failed iPhone budgets, reduce roster for unsustainable pipeline cost, revise battle rules after two weak playtests, delay cloud saves until local saves work, and return to concept or park if originality or enjoyment cannot be achieved.
