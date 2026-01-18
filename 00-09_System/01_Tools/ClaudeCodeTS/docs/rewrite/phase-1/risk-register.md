# Risk register (Phase 1 skeleton)

This is a live document. Add entries as new risks are discovered.

| Risk | Owner | Impact | Likelihood | Mitigation | Decision deadline |
|---|---|---:|---:|---|---|
| Accidental Node-only APIs in portable core | TBD | High | Medium | Enforce import boundaries + TS config + review gates | Phase 2 |
| Behavior drift in settings merge/precedence | TBD | High | Medium | Lock spec now + fixtures later + shadow-run diffs | Phase 6 |
| Permission source precedence mismatch | TBD | High | Medium | Preserve legacy precedence list until ADR changes it | Phase 7 |
| Hooks redesign breaks compatibility silently | TBD | High | Medium | Formalize events + input shape + gating; build match diagnostics fixtures | Phase 9 |
| Secret leakage in logs/telemetry | TBD | High | Low | Redaction classes + centralized sinks + tests for redaction | Phase 13 |
| Non-deterministic concurrency in async runtime | TBD | High | Medium | Deterministic scheduler + test clock + replay harness | Phase 3 |

