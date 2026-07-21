# Known Issues

| ID | State | Issue | Impact | Next action |
|---|---|---|---|---|
| KI-001 | In verification | Hosted shell is live; 3D visual and real-iPhone checks have not run. | Target-device readiness remains unverified. | Execute the 0.0.7 playtest handoff. |
| KI-002 | Monitor | Main JavaScript chunk is about 849 kB minified/197 kB gzip. | Growth could increase iPhone startup cost. | Track bundle output and introduce larger system boundaries/code splitting as features arrive. |
| KI-003 | Open | Touch/keyboard movement has no hosted device evidence. | FEAT-002 remains Implemented rather than Ready for user testing. | Test after deployment. |
| KI-004 | Expected | Graybox Logan has no production model or animation. | Movement visibly slides temporary geometry. | Replace after scale/performance validation and MeshyAI asset brief. |
| KI-005 | Open | Battle balance and touch readability lack hosted device evidence. | FEAT-004 remains Implemented rather than Ready for user testing. | Validate after deployment. |
| KI-006 | Open | IndexedDB lifecycle and recovery have not run in hosted Windows/iPhone browsers. | Save reliability is automated-test verified only. | Run refresh, close/reopen, background, installed-PWA, and recovery tests after deployment. |
