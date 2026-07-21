# Logan and the Aetherlings

An original, family-friendly 3D creature-collecting RPG for Windows browsers and iPhone as an installable Progressive Web App.

## Project status

Approved for preproduction on 2026-07-21. Version 0.0.9 isolates wild encounter health from party healing, rebuilds wild state for every encounter, adds an in-game test-save reset, and retains the browser/PWA foundation, Mossmere exploration, capture, party/healing, validated local saves, and live FPS diagnostics.

[Play version 0.0.9](https://lordboby-crypto.github.io/logan-and-the-aetherlings/)

## Approved direction

- Stylized angled/top-down 3D world
- Connected settlements, routes, interiors, and wilderness spaces
- Strategic turn-based battles
- Capture through triangular Aether Prisms
- Local saves first; optional cloud synchronization later
- 60–80 original Aetherlings as the eventual complete-game target

Project records live in [`docs/`](docs/).

## Development

Requires Node.js 24.

```bash
npm ci
npm run dev
```

Run the full local gate with `npm run check`.
