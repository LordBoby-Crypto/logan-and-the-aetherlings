# Technical Design

## Pinned foundation

| Component | Version |
|---|---:|
| Node.js development/CI line | 24 |
| TypeScript | 6.0.3 |
| Vite | 8.1.5 |
| Babylon.js core | 9.17.1 |
| vite-plugin-pwa | 1.3.0 |
| Vitest | 4.1.10 |
| ESLint | 10.7.0 |
| typescript-eslint | 8.65.0 |

## Architecture boundary

- `src/main.ts`: browser/PWA lifecycle and system screens.
- `src/game/`: rendering and future game-domain modules.
- `src/platform/`: device/browser policy without gameplay coupling.
- HTML/CSS: accessible responsive overlays above the canvas.
- IndexedDB save layer: planned, not implemented.

## Performance policy

Mobile/coarse-pointer views use a capped 1.5 device-pixel ratio; desktop uses a capped 2. The representative target remains 30 FPS minimum on the owner's iPhone and 60 FPS preferred on Windows, but no performance claim is valid until measured on devices.

## Asset boundary

The graybox geometry and vector mark are temporary validation assets. Production GLB/texture/animation budgets will be set after the representative scene and first MeshyAI pipeline proof.
