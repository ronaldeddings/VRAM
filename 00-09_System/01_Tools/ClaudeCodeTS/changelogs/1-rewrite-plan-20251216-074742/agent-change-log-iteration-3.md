## Agent Change Log — Iteration 3 of 5

### What sections were added or expanded
- Expanded Phase 1 baseline capture:
  - Added `1.8` (legacy hooks deep inventory: event list incl. `UserPromptSubmit`, hook gating, hook-agent safeguards, `updatedMCPToolOutput`-style effects).
  - Added `1.9` (sandbox/network approval + leader/worker overlay ordering capture).
  - Added `1.10` (env/flag compatibility mapping and deprecation map for mobile/web).
- Expanded Phase 3 runtime kernel:
  - Deepened `3.4` with channel semantics + resumable subscription cursors.
  - Added `3.10` (structured concurrency scopes + portable resource accounting/budgets).
- Expanded Phase 4 capabilities:
  - Deepened `4.1–4.2` with lifecycle/background/file import-export capability notes and storage quota/keying semantics.
  - Added `4.9` (host capability matrix + polyfill policy + “minimal mobile-safe boot” conformance test).
- Expanded Phase 5 state model:
  - Deepened `5.3` with deterministic overlay selection parity and sandbox-network approval queue semantics.
  - Added `5.7` (derived view models + transcript rendering contracts + snapshot testing).
- Expanded Phase 6 settings:
  - Added `6.8` (computed `EffectiveConfig` snapshot + feature gates such as `disableAllHooks` and env/flag aliases).
  - Added `6.9` (explicit secrets/config boundary and secret reference failure semantics).
- Expanded Phase 7 permissions:
  - Deepened `7.2` by decomposing legacy Bash/sandbox special cases into discrete, testable rules (parsing, display, matching, override policy).
  - Added `7.9` (sandbox-network approval as a first-class policy decision model with leader/worker mediation).
- Expanded tools/hooks/MCP specifics:
  - Deepened `8.3` with `ToolRunId` + per-run stream sequence numbers (deterministic rendering/resume).
  - Deepened `9.1/9.4/9.7/9.9` with `UserPromptSubmit`, global hook gating precedence, legacy hook-agent turn-limit parity, and `asyncTimeout` semantics.
  - Deepened `10.1–10.2` with streaming backpressure, correlation fields, reconnection policy contract, endpoint warn-once parity, and concurrency limits.
- Updated endgame sections:
  - Updated Risk Register title to Iteration 3 and added new risks around hook gating and MCP backpressure.
  - Expanded Completion Criteria to include `UserPromptSubmit` + hook-gate parity and sandbox-network approval invariants.
  - Updated Checklist Summary count to `~1020`.

### What technical depth was increased
- Converted several “implicit behaviors” into explicit, testable contracts: overlay selection priority, event-bus channels, subscription cursors, and per-run stream sequence numbers.
- Added structured-concurrency primitives and scope invariants (no leaked timers/subscriptions/streams) to make cancellation and shutdown correctness measurable.
- Elevated sandbox-network approvals into the same policy/explainability framework as tool permissions, with an explicit leader/worker mediation protocol.
- Made legacy hook behavior parity more concrete by capturing gating precedence (`disableAllHooks` vs managed-only) and translating legacy async-hook stdout JSON into typed background-task semantics (no stdout parsing).
- Added portability guardrails as executable requirements (minimal capability boot test; polyfill policy; storage quota/error mapping).

### Assumptions made
- The portable core can rely on baseline Web APIs (`AbortController`, `fetch`, `TextEncoder/Decoder`) with host adapters/polyfills where required.
- Streaming support varies by host; the internal stream abstraction + bounded buffering/backpressure is the portability escape hatch.
- “Env var compatibility” is a CLI/desktop host concern; mobile/web must use settings/policy equivalents only.

### What remains incomplete or risky
- Transport feasibility and reliability details for MCP direct mode on web/mobile remain uncertain; endpoint-first remains the assumed default.
- The exact implementation choices for WASM search/git and any worker/isolation tech are still intentionally deferred behind benchmark + security gates.
- iOS background execution constraints may force stricter pausing/cancellation behavior for long-running tasks than desktop/CLI parity expectations.
- Hook action surface area is still intentionally provisional; additional effect types may be required once real migrated hook workloads are modeled.
