# DEC-002: Web technical foundation

- Status: Accepted
- Date: 2026-07-21
- Decision owner: AI studio under approved technical-foundation milestone

## Decision

Use a TypeScript 6, Vite 8, Babylon.js 9, and vite-plugin-pwa foundation. The interface is responsive HTML/CSS above a managed WebGL canvas. Prototype saves will later use IndexedDB. The first scene is explicitly temporary graybox geometry.

## Rationale

This supports one codebase for Windows browsers and iPhone Safari/PWA while retaining direct control over rendering budgets, touch presentation, cache updates, and data-driven gameplay.

## Consequences

Browser lifecycle, iPhone WebGL performance, PWA updates, and local save migrations require explicit tests. Temporary geometry must never be presented as production art.
