# Known Issues

| ID | State | Issue | Impact | Next action |
|---|---|---|---|---|
| KI-001 | Open | Hosted visual and real-iPhone checks have not run. | Prevents calling FEAT-001 ready for user testing. | Verify after hosted build exists. |
| KI-002 | Monitor | Main JavaScript chunk is about 849 kB minified/197 kB gzip. | Growth could increase iPhone startup cost. | Track bundle output and introduce larger system boundaries/code splitting as features arrive. |
