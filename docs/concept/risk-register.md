# Risk Register

## Risk rating method

Likelihood, impact, and residual risk use Low, Moderate, High, and Extreme. High or Extreme residual risk is escalated before production expands.

## Active risks

| ID | Risk | Category | Likelihood | Impact | Early warning | Mitigation | Preproduction test | Contingency | Residual risk | Decision owner |
|---|---|---|---|---|---|---|---|---|---|---|
| R-001 | 3D scenes exceed iPhone budget | Performance | High | High | stalls/reloads/frame drops | streaming, budgets, compression, limited rigs | representative profiling | reduce density/materials/bones/effects | Moderate | AI/user |
| R-002 | 60–80 creatures are unsustainable | Scope | High | Extreme | pipeline is too slow or unreliable | prove one early, standardize, batch validate | full creature pipeline proof | reduce launch roster | High | User |
| R-003 | Touch controls are uncomfortable | UX | Moderate | High | missed/blocked input | landscape UI and large targets | owner device test | revise movement/HUD | Moderate | AI/user |
| R-004 | PWA caching serves stale builds | Platform | Moderate | High | mismatched assets after update | versioned cache and update prompt | install/update/offline cycle | online refresh for dev builds | Low–Moderate | AI |
| R-005 | Saves are lost after updates | Data | Moderate | High | migration/load failures | schema validation, migrations, backup | lifecycle/corruption tests | recover backup/export | Low–Moderate | AI |
| R-006 | Identity drifts toward Pokémon | Legal/IP | Moderate | Extreme | copied expression appears | originality audits and license register | milestone content audit | redesign/remove | Moderate | AI/user |
| R-007 | Core loop is not engaging | Design | Moderate | High | choices are obvious or tedious | small falsifiable prototype | 5–15 minute playtest | revise before content production | Moderate | User |
| R-008 | Public repo exposes secrets/assets | Operations | Moderate | High | keys or unclear licenses committed | no client secrets, license checks | pre-publish audit | revoke/remove affected material | Low | AI |

## Accepted residual risks

R-002 is accepted only as an eventual 60–80 target subject to production-pipeline evidence.

## Retired risks

None.
