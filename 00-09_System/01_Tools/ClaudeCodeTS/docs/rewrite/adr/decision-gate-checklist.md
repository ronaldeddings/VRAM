# ADR Decision Gate Checklist

Before accepting an ADR for any “do not decide yet” topic, include:

- Benchmarks (if performance-sensitive) across target hosts
- Security review notes (secrets, sandboxing, supply chain)
- Host feasibility matrix (Node / web / RN / desktop)
- Migration impact (legacy behavior compatibility and cutover plan)
- Test strategy (unit/integration/golden fixtures)
- Rollback plan with clear triggers

