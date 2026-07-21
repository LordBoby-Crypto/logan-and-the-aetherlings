# BUG-001 — Defeated lead re-enters battle at zero health

## Issue identity

Issue ID: BUG-001
Title: Zero-health state crosses encounter boundary
State: Fixed awaiting retest
Severity: Major
Priority: Current milestone
First reported: 2026-07-21
Reported build: 0.0.7-pages.1
Current repair build: 0.0.9-pages.1
Affected platforms: Windows browser observed; shared web/PWA logic affects Windows and iPhone
AI verification status: PASS
User retest status: PENDING
Reopen count: 1
Duplicate of: None

## Original report

<!-- ORIGINAL_REPORT_START -->
Was not able to capture it and it died then when I re encountered it, it started with 0 health so there was no way of testing if capture worked until I went to the crystal to heal my party and it healed it not just my party. I was able to capture after the 4th time and it did add to my party. When I refresh everything does return, I am not testing the install yet.
<!-- ORIGINAL_REPORT_END -->
Original report SHA-256: c16130f9a112108aec1a84179f2692cf0d1d4e7eaf49c2d26dcf25556664bd2e

### Reporter clarification

<!-- CLARIFICATION_REPORT_START -->
How do I reset the game state so I can test properly since when I load in I already have the Wild Aetherling in my party. And what I ment before was that I was battling the wild Aetherling and killed it. When I reencountered the Wild Aetherling still had 0 HP and when I enteracted with the crystal to heal my Aetherling it healed both my Aetherling and the wild one not just my Aetherling. But you are saying you fixed that right?
<!-- CLARIFICATION_REPORT_END -->
Clarification report SHA-256: ac704789c8bc6811118b939c8ae212b4b34837d66d75ca8bd1b3eaa2e12c5487

The reporter confirmed that “it” meant the wild Mirelume, not Kivren. The earlier 0.0.8 triage interpreted the entity incorrectly, so BUG-001 was reopened before verification. The reporter subsequently confirmed that clearing the browser’s site data successfully reset the save.

## Context and evidence

- Source: owner playtest, Test 2 and refresh portion of Test 3 in `docs/playtests/0.0.7-handoff.md`.
- Device/platform: Windows laptop browser; exact browser/OS/input/display unknown.
- Save/mode/scene: existing local save, Mossmere Path, first wild encounter.
- Frequency: zero-HP re-entry occurred on the next encounter; capture required four encounters.
- Restart behavior: refresh restored progress successfully.
- Evidence: user report above; no screenshot, video, log, or crash.
- Clarification received: the observed 0 HP and crystal restoration were identified by the reporter as belonging to wild Mirelume.

## Triage

- Severity rationale: Major. A defeated lead could immediately enter the core capture flow unable to act successfully. The crystal was a workaround, but it materially interrupted and obscured the primary loop.
- Affected range/population: reported on 0.0.7 Windows browser; the shared battle lifecycle applies to Windows and iPhone web/PWA.
- Data/security/safety risk: no corruption, privacy, or security risk found; the valid zero-HP party state persisted as designed.
- Workaround: clear only this game site’s browser data to start a new save; this permanently erases that device’s progress.
- Release impact: production asset work remains gated on this focused retest.
- Regression status: exact clarified wild-state path is not reproduced by current source; 0.0.7 contained the independently confirmed missing defeat recovery.
- Duplicate search: no existing bug record or known issue matched.
- Owner: battle lifecycle and battle UI.

## Reproduction

Attempt 1 — code-path reproduction

- Build/configuration: 0.0.7 source, release web/PWA rules.
- Starting state: Kivren is the lead and loses all HP to Mirelume.
- Steps: return to route; interact with Mirelume again before using the crystal.
- Expected: approved design returns Logan safely with a battle-ready party, or blocks a zero-HP lead.
- Actual: `updateLead` persisted 0 HP and `showBattle` passed that lead directly into a new battle.
- Frequency/result: deterministic, REPRODUCED by code path.
- Evidence: former `src/main.ts` return handler and `createBattle` input path.

Attempt 2 — clarified wild-state path inspection

- Build/configuration: 0.0.8 source and deployed bundle path.
- Starting state: wild Mirelume hypothetically reaches 0 HP, encounter ends, player uses the crystal, then re-enters.
- Expected: attacks clamp capturable wild HP to 1; a re-encounter creates a separate Mirelume at 30 HP; the crystal mutates only `partyState`.
- Actual: static and automated inspection found no path that saves wild battle state or passes it to `healParty`; the exact clarified variant was NOT REPRODUCED in available AI environment.
- Evidence: `takeBattleAction`, `createBattle`, `healParty`, and version-1 save schema; cloud runtime remains blocked by unavailable WebGL.

## Root cause

- Symptom: Kivren begins the next encounter at 0 HP; capture testing becomes impractical.
- Trigger: defeat, return, then re-enter without crystal healing.
- Root cause: the confirmed zero-HP re-entry path was caused by the return handler saving lead HP without a defeat recovery branch or encounter-entry guard. The exact clarified wild-health variant has no matching persistence or crystal mutation path in the inspected source; its cause remains unconfirmed pending device retest.
- Escape cause: rule tests covered damage, capture, party healing, and persistence separately, but not defeat-to-reencounter lifecycle behavior.
- Affected surface: keyboard and touch interaction share the same route; existing saves can validly contain a zero-HP lead.
- Rejected as current-code paths, not as player observations: attacks reaching wild 0 HP, saves storing a wild battler, and the crystal mutating an active wild battler.
- Contributing usability issue: the battle cards did not explicitly label “Wild Aetherling” and “Your lead.”

## Repair

- Build 0.0.8 adds `canStartBattle`, blocks any old zero-HP save from entering, and shows a crystal recovery instruction.
- After defeat, the party is restored and Logan returns to the safe Mossmere Outpost start before saving.
- Battle cards now identify wild versus player-owned creatures.
- Each encounter supplies five Prisms. Capture chance now starts at 20%, scales more strongly, and is 100% at 1 HP plus Snare, preserving the intended tactical setup while removing multi-encounter test friction.
- Files: `src/game/battle.ts`, `src/game/battle.test.ts`, `src/main.ts`, `index.html`.
- Save compatibility: no schema change; existing saves remain valid. A saved zero-HP lead is safely blocked until crystal healing.
- Failure handling: both the pre-transition input path and battle-opening path guard health.
- Tradeoff: the prototype’s optimal capture setup is deterministic; final balance remains deferred.
- Rollback: revert the 0.0.8 repair commit. No data rollback or migration is needed.
- Residual risk: target-device interaction and visual clarity require owner confirmation.

### 0.0.9 state-isolation repair

- Wild Mirelume now comes from a dedicated factory that always returns a new full-health, status-free object.
- Leaving any battle explicitly discards the old battle object before another interaction.
- Crystal isolation and independent re-encounter state have dedicated automated regressions.
- Party includes a guarded **Reset Test Save** action that clears both primary and backup slots only after explicit confirmation, then reloads.
- The exact clarified symptom remains a target-device retest requirement because it was not reproducible in the AI environment.

## Automated regression coverage

Automated regression test: `src/game/battle.test.ts` — “creates every re-encounter with independent full wild health”; `src/game/party.test.ts` — “heals only the party without changing wild encounter health”; `src/platform/saveRepository.test.ts` — “clears both save slots for a deliberate test reset”
Faulty-build result: reproduced through controlled zero-HP fixture and comparison with the former unconditional start path
Repair-build result: PASS
Manual fallback: Retest 1 below verifies the integrated route-to-battle lifecycle.

## Surrounding-system checks

| Check ID | Surface | Build/environment | Result | Evidence |
|---|---|---|---|---|
| S-01 | Battle/capture rules | 0.0.8 local Vitest | PASS | 30 total tests |
| S-02 | Party capture/healing | 0.0.8 local Vitest | PASS | existing party suite |
| S-03 | Save compatibility/recovery | 0.0.8 local Vitest | PASS | existing save suites |
| S-04 | TypeScript/PWA production build | 0.0.8 local Node 24 | PASS | `npm run check` |
| S-05 | Windows/iPhone runtime | hosted target devices | PENDING | focused owner retest |

## AI verification

- `npm run check` on 0.0.8: PASS — lint, 10 test files/30 tests, TypeScript, production and PWA generation.
- GitHub CI and Pages deployment for repair revision `ff2f353a650c7c8ccd94fbf44161dc24ac10d868`: PASS; public HTML reports Build 0.0.8 and the manifest returns HTTP 200.
- Runtime WebGL smoke: BLOCKED in cloud browser because WebGL is unavailable; public deployment and target-device path must be confirmed after publish.
- Pre-existing bundle warning remains separate (about 861 kB minified/202 kB gzip).

## User retest history

| Attempt | Date | Build | Configuration | Result | Failed step/observation | Evidence | State after |
|---|---|---|---|---|---|---|---|
| 1 | 2026-07-21 | 0.0.7-pages.1 | Windows laptop browser, existing save | FAIL | Defeat carried 0 HP into the next encounter; capture took four encounters | Original report | Confirmed |
| 2 | 2026-07-21 | 0.0.8-pages.1 | Windows laptop browser | BLOCKED | Existing save already contained Mirelume; site-data reset instructions worked | Reporter confirmation | Reopened |

## Focused retest checklist

### Retest 1 — Reproduce the original path

- Requirement/issue: BUG-001
- Starting state: 0.0.8-pages.1, Windows laptop browser, existing local save, Mossmere Path, keyboard.
- Steps:
  1. Refresh and confirm Build 0.0.8.
  2. Enter battle and confirm Mirelume says “Wild Aetherling,” Kivren says “Your lead,” and five Prisms appear.
  3. Use Pulse Strike until Mirelume reaches 1 HP, then use Binding Spore.
  4. Confirm capture chance reads 100%, then use one Aether Prism.
  5. Return to the route, open Party, refresh, and open Party again.
- Expected result:
  1. Mirelume never falls below 1 HP; the ownership labels remain unambiguous.
  2. The 1-HP-plus-Snare Prism captures on that attempt and adds Mirelume to the party.
  3. Refresh restores the captured two-member party.
- Pass condition: all three expected results occur in one encounter with no zero-HP re-entry.
- Fail condition: a label/count is wrong, Kivren enters at 0 HP, 100% capture breaks free, capture is missing, or refresh loses it.
- Evidence if failed: screenshot showing Build 0.0.8 and battle/party state plus the exact last action.
- Cleanup/reset: leave Party closed on Mossmere Path; do not clear site data.
- Result: PENDING

### Retest 2 — Defeat recovery boundary

- Requirement/issue: BUG-001
- Starting state: only if Mirelume is still uncaptured; Build 0.0.8 on the same save.
- Steps:
  1. Allow Kivren to reach 0 HP, then choose Return to Mossmere Path.
  2. Open Party and inspect Kivren.
- Expected result:
  1. Logan returns to Mossmere Outpost, Kivren is fully restored, and the message confirms safe recovery.
- Pass condition: Kivren is above 0 HP before another encounter.
- Fail condition: Party still shows 0 HP or a new battle starts at 0 HP.
- Evidence if failed: screenshot of Party and Build 0.0.8.
- Cleanup/reset: none; do not deliberately defeat Kivren if Retest 1 already captured Mirelume.
- Result: PENDING

## Project records updated

- Updated: bug record, known issues, current status, backlog, changelog, 0.0.7 playtest results, 0.0.8 focused handoff.
- Assessed unaffected: controls, save schema, technical architecture, assets/audio, concept/design records.
