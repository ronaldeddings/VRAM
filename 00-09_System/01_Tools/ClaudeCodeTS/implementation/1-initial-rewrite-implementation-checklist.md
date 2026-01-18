# Claude Code v3 — Rewrite Implementation Checklist (Iteration 5)

## Project Overview

This project is a ground-up rewrite of the current Claude Code CLI application (two bundled variants) into a single, TypeScript-first, **platform-agnostic engine** that can run inside iOS (React Native), web, and desktop hosts. The rewrite explicitly removes the current architecture’s reliance on spawning child processes as an orchestration/concurrency mechanism, replacing it with **async-first, event-driven execution** and explicit cooperative scheduling.

### Why this rewrite exists

- The current system is tightly coupled to Node + filesystem + subprocess execution, which blocks mobile/web support and makes correctness/testing nondeterministic.
- Multiple “systems” (hooks, permissions, background tasks) exist primarily to manage process boundaries instead of explicit async boundaries.
- The bundled codebase is difficult to reason about and evolve; the rewrite aims for a clean module graph with explicit ownership boundaries.

### High-level goals

- Core “engine” is TypeScript, portable, and deterministic under test.
- UI layers (CLI, React Native, web) are thin adapters over the engine.
- Tool execution, hooks, and background agents are implemented as **async tasks** (no process-per-task model).
- Permissions and policy are explicit, enforceable, and testable across hosts.
- MCP works in endpoint mode and direct mode with **mobile-safe transports** and consistent streaming semantics.

### Explicit non-goals (Iteration 5 scope guards)

- Do not lock in final public APIs for hooks/tools/permissions in this iteration; define boundaries, lifecycles, and data flow first.
- Do not commit to Node-only APIs (e.g., `fs`, `child_process`, `AsyncLocalStorage`) in core modules.
- Do not replicate bundler artifacts, minified symbol names, or third-party library internals.
- Do not optimize prematurely (performance work is staged behind correctness + determinism).
- Do not “solve” portability by adding hidden host-only fallbacks; missing capabilities must be explicit, typed, and user-visible.

### Iteration 5 focus (what changed vs Iteration 4)

- Deepened the runtime kernel into an operable spec: hang/progress detection, runtime introspection snapshots, and replay capture formats tied to deterministic clocks and event cursors.
- Decomposed tool execution into fully testable contracts: tool stream envelopes, attachment lifecycles, idempotency/replay keys, and an explicit “no pipeline bypass” enforcement model.
- Expanded hooks into a portable workflow system: schema normalization rules, stricter recursion/loop guards, long-running hook replacement, and migration linting/auto-conversion boundaries.
- Hardened permissions/policy into a full decision system: network approval canonicalization (scheme/host/IP/local-net), decision caching/invalidation rules, and policy refresh semantics across hosts.
- Expanded MCP endpoint/direct into transport- and resume-aware behavior: schema drift handling, streaming fallback policy, strict auth handling, and external-client bridging constraints without state-file dependence.
- Tightened testing/migration gates: deterministic “golden event streams” harness, cross-host conformance matrix, and explicit phase exit criteria for incremental cutover.

---

***Phase 1: Rewrite Charter, Spec Capture, and Behavioral Baseline***

Why this phase exists: establish a precise target spec (behavioral, not implementation) and a shared vocabulary so later phases can be reviewed and tested objectively.

Risks mitigated: scope creep, accidental Node-only assumptions, and silent behavior regressions vs the legacy CLIs.

Dependencies: none; this phase unblocks architecture and module boundary work.

1.1 Ground-truth extraction from existing bundles (without re-implementing artifacts)
- [x] Enumerate the externally observable behaviors that must remain stable (CLI UX flows, prompts, approvals, settings precedence, hook events, MCP modes).
- [x] Create a “legacy behavior matrix” that maps each behavior to its source in `CLI_ENCYCLOPEDIA.md` (chapter/section) and relevant entrypoints.
- [x] Identify “process boundary artifacts” (features that exist only because the legacy CLI uses subprocesses) and flag them as redesign candidates.
- [x] Extract the canonical settings sources and precedence rules (user/project/local/policy/flag/cliArg/command/session) as a formal spec to preserve until explicitly changed.
- [x] Extract canonical hook event names and the hook-input shapes (base + event-specific) as a formal spec to preserve until explicitly changed.
- [x] Extract canonical hook gating switches (e.g., `disableAllHooks`, managed-only hooks) and the exact precedence of those gates vs per-event hook configuration.
- [x] Extract canonical permission rule syntax (`Tool(ruleContent)` and bare-tool rules) and the legacy source-precedence order as a formal spec to preserve until explicitly changed.
- [x] Extract MCP “endpoint mode vs state-file/direct mode” behaviors (discovery, timeouts, telemetry differences, connection failure semantics) as a formal spec.
- [x] Document all legacy “async hook protocol” behaviors (long-running hook handoff, async IDs, cancellation handling) as a formal spec to preserve or intentionally replace.
- [x] Capture all legacy “AppState queue” behaviors (notifications, elicitation queue, worker permission queues, sandbox permission queues) as formal queue semantics.
- [x] Capture legacy overlay selection/priority ordering for queues (which prompt renders when multiple queues are non-empty) as a testable state machine.

1.2 Rewrite success criteria and portability constraints (platform-first)
- [x] Define a portability rubric for every engine module: `portable`, `host-dependent`, `optional capability`, `unsupported on mobile/web`.
- [x] Define a “no Node-only API in core” rule and list disallowed APIs/classes by category (filesystem, subprocess, raw sockets, process globals).
- [x] Define minimum supported execution environments (Hermes/JSC, modern browsers, Node LTS) and their baseline Web APIs (AbortController, fetch, streams).
- [x] Define a capability policy for optional “shell-like” features (desktop-only, remote execution, or excluded).
- [x] Define explicit failure semantics for missing capabilities (typed errors, UI messaging, fallback strategies).
- [x] Define “mobile-safe” networking constraints (TLS only, fetch-based transports, background limitations).

1.3 Security and data-classification boundaries (before APIs fossilize)
- [x] Define data sensitivity tiers (credentials, tokens, local file contents, transcripts, telemetry payloads).
- [x] Define redaction rules for logs/telemetry (never emit secrets; hash stable identifiers where needed).
- [x] Define where policy/enterprise-managed settings can override user/project/local behavior and which overrides must be transparent to the user.
- [x] Define a “policy audit trail” requirement (which decisions must be explainable and attributable to a source).
- [x] Define a threat model for plugin/hook execution in a portable environment (no arbitrary shell, restricted capabilities, deterministic timeouts).

1.4 Migration constraints from existing CLI (to keep rewrite shippable)
- [x] Define “migration target stages” (engine library, new CLI adapter, RN host, web host) and what qualifies as “usable” at each stage.
- [x] Define a shadow-run strategy (run legacy + new engine in parallel where possible, compare decisions/outputs deterministically).
- [x] Define a compatibility budget: which legacy behaviors are required for v3 launch vs can be deferred.
- [x] Identify legacy subsystems that must be supported early for migration (settings merge/IO, permissions prompts, MCP invocation).

1.5 Initial risk register skeleton (live document)
- [x] Create a risk register section (owner, impact, likelihood, mitigation, “decision deadline”) to be expanded in later phases.
- [x] Create a deferred-decisions list with explicit “do not decide yet” notes for API surfaces (hooks schema, tool registry, transport choices).

1.6 Legacy corpus capture (golden fixtures for determinism + migration)
- [x] Capture a sanitized corpus of legacy sessions that exercise: permissions prompts, hooks (including async hooks), MCP endpoint mode, MCP direct/state-file flows, background agents (Magic Docs, session memory), and stop/resume flows.
- [x] For each captured session, store:
  - [x] normalized effective settings snapshot (all sources + precedence applied)
  - [x] normalized permission rule set (all sources + precedence applied)
  - [x] ordered hook selection results per event (including match diagnostics)
  - [x] tool invocation transcripts (inputs redacted; streaming event counts/hashes)
  - [x] MCP mode selection + connection outcomes
- [x] Define sanitization/redaction rules for the corpus and validate them with automated scans (no secrets, no raw file contents unless explicitly allowed).
- [x] Define a “golden replay contract”: given recorded nondeterministic inputs (clock/RNG/network stubs), the engine must emit byte-for-byte identical normalized event logs.

1.7 Legacy multi-process artifact inventory (explicit redesign targets)
- [x] Inventory all “special entrypoints” and sidecar modes in the legacy CLIs (at minimum: `--mcp-cli`, `--ripgrep`, Chrome native host mode, teleport/remote session helpers).
- [x] For each entrypoint, document:
  - [x] user-facing invocation forms and outputs
  - [x] internal dependencies (files, env vars, network endpoints)
  - [x] whether behavior is required for v3 launch, CLI-only, or optional future
- [x] Classify each entrypoint as: `in-process engine command`, `host adapter feature`, `desktop-only capability`, or `deprecated`.

1.8 Legacy hooks deep inventory (parity inputs for redesign)
- [x] Inventory all legacy hook event names and confirm inclusion/exclusion rules across builds (at minimum include `UserPromptSubmit` in addition to the pre/post tool and session lifecycle events).
- [x] Capture the per-event hook selection algorithm inputs (event name, matcher set, ordering, dedupe) and expected outputs (selected hook list + diagnostics).
- [x] Capture hook-specific payload variants and “special outputs” that affect core behavior (e.g., `updatedMCPToolOutput` style post-processing) as explicit compatibility requirements.
- [x] Capture legacy “hook agent” safeguards (turn limits, budgeting defaults) and convert them into explicit v3 budgeting constraints for model-driven hooks.
- [x] Capture the legacy behavior when hooks are disabled globally (`disableAllHooks`) vs disabled by policy (managed-only hooks), including the required user-visible messaging.
- [x] Capture legacy failure handling for hooks (when hook errors block tool execution vs become warnings) and the exact conditions that trigger stop hooks.

1.9 Legacy sandbox/network approval UX capture (leader/worker + overlay ordering)
- [x] Capture the legacy “network request outside sandbox” approval interaction as a spec: request identity, queueing behavior, retry, and UI copy constraints (copy may change, but required fields must exist).
- [x] Capture the legacy worker/leader-mediated sandbox approval path (queue semantics, timeout behavior, and failure fallback when the leader is unreachable).
- [x] Capture how sandbox approval prompts interact with other overlays (permission prompts, elicitation prompts, notifications) and define a deterministic selection priority order.
- [x] Capture request-id generation constraints (uniqueness scope, correlation to host/time) and define v3-equivalent correlation requirements without relying on `Date.now()` in tests.

1.10 Legacy env var / CLI flag mapping (compatibility surface, not implementation)
- [x] Inventory all env vars and CLI flags that affect behavior (MCP CLI gates, endpoint mode gates, tool timeouts, enabled settings sources, “managed-only” toggles).
- [x] For each env var/flag, define the v3 mapping: `host adapter config` → `settings overlay` → `policy` (and explicitly mark “CLI-only” controls).
- [x] Define a “deprecation map” for env vars/flags that cannot exist on mobile/web (env) and the replacement knobs (settings/policy UI).
- [x] Add golden tests that assert env/flag mapping produces identical effective configuration snapshots on Node/CLI hosts.

1.11 Phase 1 sanity tests (prove the extracted spec matches bundles)
- [x] `tests/phase1-legacy-spec.test.ts` asserts the captured legacy knobs appear in both bundles (hook event names, MCP env vars, settings source list, permission rule-source list) and that permission rule parse/format matches the legacy encoding.

---

***Phase 2: High-Level Architecture and Canonical Module Graph***

Why this phase exists: define stable ownership boundaries and data flow so implementation work can proceed in parallel without entanglement.

Risks mitigated: accidental circular dependencies, UI leaking into core, and platform-specific logic contaminating portable modules.

Dependencies: Phase 1 specs (settings, hooks, permissions, MCP behavior).

2.1 Top-level architecture diagram (text-described, reviewable)
- [x] Produce an ASCII architecture diagram that includes: core runtime, state model, tools layer, hooks engine, permissions engine, settings system, MCP integration, background agents, and UI adapters.
- [x] For each component in the diagram, document:
  - [x] Inputs (events, commands, configs)
  - [x] Outputs (events, state updates, streams)
  - [x] Ownership boundaries (who can call whom)
  - [x] Platform-agnostic vs host-dependent classification
- [x] Define a single “engine entrypoint” that is UI-agnostic (no CLI assumptions) and communicates via typed events.
- [x] Define a “host boundary” where all non-portable effects occur (storage/filesystem/network/shell/clipboard/notifications).

2.2 Canonical TypeScript module graph (portable core first)
- [x] Define a module tree (example shape; final names are provisional):
  - [x] `core/runtime/*` (scheduler, task model, cancellation)
  - [x] `core/events/*` (typed event bus, stream adapters)
  - [x] `core/state/*` (app/session store, reducers, selectors)
  - [x] `core/settings/*` (schema, sources, merge, patching)
  - [x] `core/permissions/*` (rules, evaluation, explainability)
  - [x] `core/hooks/*` (schema, matching, execution)
  - [x] `core/tools/*` (tool contracts, registry, execution pipeline)
  - [x] `core/mcp/*` (client, transports, endpoint/direct modes)
  - [x] `core/agents/*` (background agents, long-running tasks)
  - [x] `platform/*` (host capability implementations for node/web/mobile/desktop)
  - [x] `ui/*` (cli adapter, react/rn adapters)
- [x] For each module, document:
  - [x] Responsibility owned
  - [x] Responsibilities explicitly not owned
  - [x] Legacy subsystems replaced (reference encyclopedia chapters/sections)
- [x] Define allowed dependency directions (e.g., `core/*` cannot import `platform/*` or `ui/*`).
- [x] Define an internal “types-only” module for shared schemas to prevent circular imports.

2.3 Boundary contracts (types before code)
- [x] Define a canonical “engine API surface” as interfaces/types only (no concrete implementations yet).
- [x] Define a canonical event taxonomy (engine events → UI adapters; host events → engine).
- [x] Define a canonical error taxonomy (capability missing, permission denied, policy override, transport failure, task cancelled, timeout).
- [x] Define a canonical serialization strategy for:
  - [x] persisted settings
  - [x] session/app state snapshots
  - [x] hook definitions and results
  - [x] tool invocations and results (including streaming)

2.4 Portability enforcement strategy (design-time and build-time)
- [x] Decide how the repo enforces “portable core” (lint rules, import boundaries, build targets, type tests).
- [x] Define a “host capability smoke test” suite that runs on each platform adapter to validate required APIs exist.
- [x] Define “mobile-safe mode” gates: core must boot and run with filesystem/shell capabilities absent.

2.5 Provisional build and packaging approach (do not lock in)
- [x] Define a monorepo/workspace layout that supports multiple builds (engine library, CLI, RN, web) without leaking platform code into core.
- [x] Define TypeScript target constraints compatible with RN + web (avoid Node globals; prefer standard Web APIs).
- [x] Define how to ship schema/types across packages without bundler-specific hacks.
- [x] ⚠️ Do not decide final bundler/toolchain yet; define constraints the toolchain must satisfy (tree-shaking, conditional exports, RN compatibility).

2.6 Protocol/schema registry (versioning and forward-compatibility)
- [x] Define a single “schema registry” location (within `core/types/*` or equivalent) that owns all versioned wire/persistence schemas:
  - [x] engine events
  - [x] persisted settings documents
  - [x] session transcripts and attachments
  - [x] hook definitions and hook results
  - [x] tool manifests and tool results
  - [x] MCP envelopes (engine-facing)
- [x] Define schema versioning rules (SemVer-like vs integer schema versions) and explicit migration behavior (upgrade-only vs downgrade support).
- [x] Define a compatibility policy: what happens when a host UI is older/newer than the engine (strict reject vs best-effort with capability flags).
- [x] Define a conformance test harness that validates:
  - [x] validator parity across packages
  - [x] stable canonical stringification for diffs/hashes

2.7 Architecture decision records (ADR) process (prevent premature lock-in)
- [x] Define an ADR template for each “⚠️ do not decide yet” topic (hook action surface, MCP transports, tool packaging, isolation tech).
- [x] Define a “decision gate checklist” (data required before deciding: benchmarks, security review, host feasibility matrix).
- [x] Require that each ADR includes a rollback path and explicit “revisit by” milestone.

2.8 Phase 2 sanity tests (prove boundaries + determinism helpers)
- [x] `tests/phase2-architecture-boundaries.test.ts` asserts import-boundary enforcement, host capability smoke checks, and canonical JSON stability.

---

***Phase 3: Core Async Runtime and Scheduling Model (Deterministic Kernel)***

Why this phase exists: the new system replaces “spawned processes” with explicit async tasks; this requires a coherent runtime model for scheduling, cancellation, and streaming.

Risks mitigated: nondeterministic concurrency bugs, untestable timing behavior, and platform divergence (Node vs RN vs web).

Dependencies: Phase 2 boundaries and event taxonomy.

3.1 Define the runtime kernel primitives (types + semantics)
- [x] Define a `Task` model (identity, parent/child relationships, labels, metadata, lifecycle state).
- [x] Define a task ID strategy that is stable for correlation (string IDs, monotonic counters in tests, host-provided UUIDs in production).
- [x] Define task result semantics (`success`, `error`, `cancelled`, `timeout`) and how results are surfaced to the store and event bus.
- [x] Define a supervision model (parent task cancels/awaits children; failure policies: fail-fast vs isolate vs escalate).
- [x] Define task-local metadata semantics (immutable vs mutable, how to update without hidden global state).
- [x] Define a `Scheduler` interface (enqueue, run loop tick, cooperative yields, priorities).
- [x] Define scheduler tick semantics (what a “tick” means; how many tasks can run per tick; when yielding is required).
- [x] Define scheduler fairness rules in a way that can be asserted under test (e.g., bounded wait time for non-immediate tasks).
- [x] Define scheduler instrumentation hooks (task queued/started/yielded/completed) to support tracing without platform-specific APIs.
- [x] Define explicit cancellation semantics using `AbortSignal` (propagation rules, cancellation reasons, idempotency).
- [x] Define a cancellation reason taxonomy (user cancel, stop request, timeout, policy denied, host lifecycle).
- [x] Define cancellation propagation rules for fan-out (single abort cancels multiple child tasks) and fan-in (child cancellation does not necessarily cancel parent).
- [x] Define timeout semantics (monotonic clock, timer cancellation, deterministic test clock).
- [x] Define a monotonic clock interface and a wall-clock interface (avoid assuming system time is monotonic).
- [x] Define timeout ownership (which component owns timers; how to prevent leaked timers on cancellation).
- [x] Define backpressure semantics for streaming (bounded queues, drop policies, pausing producers).
- [x] Define bounded-queue behavior per stream type (tool stdout-like stream vs telemetry vs debug logs) and acceptable drop policies.
- [x] Define explicit “stream closed” semantics (final event, close reason) and how consumers detect completion deterministically.
- [x] Define a “task context” object that is passed explicitly (no implicit thread-local storage assumptions).
- [x] Define which fields belong in task context (capabilities handle, settings snapshot, session ID, correlation IDs, permission mode).
- [x] Define a rule that task context must be serializable for replay (or explicitly mark non-serializable fields and exclude from recordings).

3.2 Cooperative scheduling model (no background processes)
- [x] Define scheduling queues (e.g., immediate, high, normal, low) and fairness policy.
- [x] Define the internal run-queue data structure(s) required (FIFO deques vs priority heap) and the expected big-O characteristics under load.
- [x] Define how priorities interact with fairness (e.g., weighted round-robin, aging) and what is considered starvation.
- [x] Define how long-running tasks yield cooperatively (explicit `await scheduler.yield()` checkpoints).
- [x] Define mandatory yield points for engine-owned loops (agent loops, hook chains, tool streaming adapters) so UI remains responsive.
- [x] Define a “budget per tick” policy (max work/time before yielding) and how it’s enforced without relying on Node-only timers.
- [x] Define a starvation-prevention mechanism and testable invariants.
- [x] Define how UI events (user input) preempt background tasks without killing them.
- [x] Define preemption semantics for prompts/approvals (foreground prompt can suspend a background agent waiting for user input).
- [x] Define how to cap concurrency for heavy operations (tool executions, MCP calls, background agents).
- [x] Define concurrency limiters as first-class runtime resources (named semaphores) so policies can tune them.
- [x] Define per-category limits (network, filesystem, model queries, MCP) and how limits are surfaced in diagnostics.
- [x] Define how to surface task progress to UI adapters (typed progress events, not console output).
- [x] Define “progress event throttling” semantics to avoid UI overload (coalescing, min interval, max buffered).

3.3 Cancellation and interruption model (user-driven + system-driven)
- [x] Define user-initiated cancel/stop semantics (what gets cancelled: current tool, hook chain, agent loop, entire session).
- [x] Define stop escalation policy (e.g., soft stop → hard cancel after grace period) and ensure it is deterministic/testable.
- [x] Define system-initiated cancellation (timeouts, host lifecycle events, policy enforcement).
- [x] Define “partial completion” rules for cancellable operations (what state is committed vs rolled back).
- [x] Define which operations must be atomic from the user’s perspective (settings patch apply, permission update persistence).
- [x] Define how cancellation interacts with streaming outputs (final event, resource cleanup, idempotent close).
- [x] Define translation rules between platform abort errors and engine cancellation errors (normalize to engine taxonomy).
- [x] Define how cancellation is represented in persisted logs (so replay can reproduce outcomes).
- [x] Define a durable “interrupt marker” event format for transcripts (so resumed sessions preserve why a run ended).

3.4 Engine event bus and streaming foundation (portable)
- [x] Define an event bus abstraction that supports:
  - [x] async iteration (`AsyncIterable<Event>`)
  - [x] fan-out to multiple subscribers
  - [x] bounded buffering and backpressure signals
- [x] Define a canonical `EngineEvent` envelope contract with fields that are stable across hosts:
  - [x] `eventId` (unique, stable string; deterministic in tests)
  - [x] `sessionId` / `workspaceId` (when applicable)
  - [x] `channel` (see below) and `severity`
  - [x] `seq` (monotonic per `(sessionId, channel)`; never reused)
  - [x] `tsMono` (monotonic clock tick for ordering) and optional `tsWall` (display only)
  - [x] correlation IDs (`taskId`, `toolRunId`, `hookRunId`, `mcpRequestId`) when applicable
  - [x] `redactionClass`/`sensitivity` marker(s) required for downstream sinks
  - [x] a versioned `payload` (validated at emit time)
- [x] Define event “channels” (e.g., `ui`, `diagnostic`, `telemetry`, `transcript`, `debug`) with explicit redaction + persistence rules per channel.
- [x] Define channel-level delivery contracts (must-deliver vs best-effort) and which channels may drop events under load.
- [x] Define per-channel QoS knobs (buffer size, drop policy, coalescing keys, min emit interval) and require that they are configurable via policy/settings for managed environments.
- [x] Define event ordering guarantees (per-session total order vs per-subsystem partial order) and make them testable.
- [x] Define subscription lifecycle semantics (late subscribers get snapshot? only new events? configurable per channel).
- [x] Define a “subscription cursor” concept (monotonic sequence numbers per session/channel) so hosts can resume event consumption after backgrounding/crash.
- [x] Define cursor persistence rules per host:
  - [x] where cursors live (ephemeral memory vs durable storage)
  - [x] when cursor updates are flushed (periodic vs on important events)
  - [x] crash-consistency expectations (at-least-once vs exactly-once delivery semantics per channel)
- [x] Define “snapshot on subscribe” semantics for stateful channels (e.g., `ui`/`transcript`):
  - [x] snapshot payload contract (bounded; may reference attachments)
  - [x] snapshot versioning and compatibility rules
  - [x] deterministic snapshot timing relative to ongoing event emission
- [x] Define bridging adapters for environments with/without native streams (ReadableStream vs AsyncIterator).
- [x] Define a strict contract: core emits structured events; UI layers render them.
- [x] Define a test harness that can deterministically consume and assert event sequences.
- [x] Define a “record/replay” event sink that can persist event streams for debugging and regression harnesses (bounded, redacted).

3.5 Determinism and reproducibility guarantees
- [x] Define what “deterministic” means per subsystem (scheduler order, timestamps, random IDs, network nondeterminism).
- [x] Introduce abstractions for nondeterministic inputs (clock, RNG/UUID, filesystem ordering) behind injectable interfaces.
- [x] Define deterministic UUID/RNG sources for tests and “seed injection” for reproducible runs.
- [x] Define deterministic ordering rules when host APIs return unordered collections (directory listing, Map iteration) and enforce in adapters.
- [x] Define a “replay mode” concept for tests (recorded inputs → deterministic event outputs).
- [x] Define invariants and property tests for the scheduler (no lost tasks, cancellation propagation correctness).

3.6 Failure handling and escalation (supervision tree)
- [x] Define error classification rules (recoverable vs fatal vs policy-denied) and required UI/telemetry behavior for each.
- [x] Define how background task failures are surfaced (notification banners vs logs only) without interrupting foreground workflows.
- [x] Define how “fatal engine errors” are handled (safe shutdown, state snapshot, user messaging).
- [x] Define retry policies for transient failures (network/MCP) in a way that is deterministic under test.

3.7 Host integration points (portable adapters)
- [x] Define how the runtime integrates with host UI event loops (RN/UI thread constraints, web rendering loops, CLI input loop) without blocking.
- [x] Define a host-provided “idle callback” or “yield hint” interface (optional) to improve responsiveness without changing semantics.
- [x] Define how host lifecycle events are delivered into the runtime (background/foreground, connectivity, termination) as typed events.

3.8 Portable stream abstraction (text + binary, uniform backpressure)
- [x] Define the single internal stream type used by core (`AsyncIterable<StreamEvent>` or equivalent) and a strict event set:
  - [x] `chunk` (bytes or string + encoding)
  - [x] `progress` (typed, bounded)
  - [x] `diagnostic` (redacted, non-user-visible)
  - [x] `close` (reason + final counters)
- [x] Define canonical chunk encoding rules (UTF-8 by default; binary chunks explicitly tagged; no implicit platform encodings).
- [x] Define backpressure signals (consumer can request pause/resume; bounded buffering policies) and how they map onto environments without native stream pausing.
- [x] Define “stream transcript hashing” rules for tests (store hashes + counters instead of raw chunks for sensitive outputs).
- [x] Define adapters:
  - [x] stream ↔ ReadableStream (web)
  - [x] stream ↔ Node streams (Node host only, adapter-layer)
  - [x] stream ↔ RN event emitter (RN host only, adapter-layer)

3.9 Deterministic time and scheduling integration with JS runtimes
- [x] Define how scheduler “ticks” relate to JS microtask/macrotask queues (avoid relying on Node-specific `setImmediate` behavior).
- [x] Define a deterministic test clock contract that supports:
  - [x] advancing time
  - [x] running due timers
  - [x] inspecting pending timers/leaks
- [x] Define a runtime self-check that can detect “busy loop without yields” (budget violations) and emit diagnostics in dev/test builds.

3.10 Structured concurrency scopes and resource accounting (portable, enforceable)
- [x] Define a `TaskScope` (or equivalent) concept that provides:
  - [x] structured lifetimes (scope owns all child tasks)
  - [x] guaranteed cancellation on scope close
  - [x] deterministic “join” semantics in tests (no orphaned work)
- [x] Define scope types used by the engine (app-global scope, session scope, tool-run scope, hook-run scope, MCP-connection scope).
- [x] Define resource accounting primitives that can be measured portably:
  - [x] time budget (via injected monotonic clock)
  - [x] event budget (max emitted events per channel per time window)
  - [x] network budget (requests in-flight, bytes read/written where observable)
  - [x] storage budget (bytes persisted, attachment size ceilings)
- [x] Define what “resource exhaustion” does (throttle, backpressure, fail with typed `BudgetExceededError`) and which subsystems are allowed to degrade vs must fail.
- [x] Define invariants that must hold at scope boundaries (no leaked timers, no leaked subscriptions, all streams closed, capability handles released).
- [x] Add deterministic tests that assert: closing a session scope cancels all tool/hook/MCP/background tasks and emits a bounded, redacted “shutdown summary” event.

3.11 Runtime introspection, hang detection, and debug controls (portable)
- [x] Define a `RuntimeSnapshot` schema that captures, at minimum:
  - [x] runnable queue depths by priority
  - [x] all live tasks (state, parent, labels, correlation IDs, start tick, last-yield tick)
  - [x] all live scopes and their owned tasks
  - [x] all active concurrency permits/limiters (current, max, wait queue length)
  - [x] all active streams (tool/hook/MCP) and last-emitted sequence numbers
  - [x] all pending timers/timeouts (owner task, deadline tick, reason)
- [x] Define a “progress heartbeat” mechanism: what constitutes progress (task yield, event emission, stream chunk) and how frequently progress must occur per long-running category.
- [x] Define hang detection rules that are deterministic under test:
  - [x] “no progress for N monotonic ticks” thresholds per category (tool run, MCP streaming, background agent)
  - [x] explicit “waiting on user” states that suppress hang alerts
  - [x] single-fire escalation (emit diagnostic once per incident; no spam)
  - [x] escalation actions (capture snapshot, emit redacted summary, optionally cancel under explicit policy)
- [x] Define a portable “debug dump” engine command that emits a redacted `RuntimeSnapshot` + summary counters; hosts may attach stacks if available.
- [x] Define production safety gates: snapshot capture is bounded, redacted, and policy-controlled (may be disabled in managed environments).
- [x] Add conformance tests that assert:
  - [x] snapshots are deterministic given a seeded scheduler/test clock
  - [x] hang detection triggers exactly once per simulated hang and does not regress event ordering guarantees
  - [x] hang detection does not auto-cancel tasks that are awaiting elicitation/approvals unless configured

3.12 Replay capture format and deterministic reproduction harness (engine-level)
- [x] Define a “replay capture” artifact format that can reproduce engine behavior without relying on host APIs:
  - [x] initial capability descriptor (availability + versions; no secrets)
  - [x] seeded RNG/UUID source identity
  - [x] deterministic clock timeline (monotonic ticks advanced by the harness)
  - [x] injected host events (lifecycle, connectivity) with timestamps
  - [x] injected UI inputs (prompt submit, approvals, elicitation responses) with stable IDs
  - [x] recorded nondeterministic capability responses (filesystem listing order, simulated network responses)
- [x] Define capture redaction rules (PII/secrets/file contents) and require a “redaction manifest” explaining what was removed/hashed.
- [x] Define what is not captured (secret store contents; raw model thoughts) and how replays behave when those inputs are absent.
- [x] Define replay assertions:
  - [x] engine event sequences match (channel + seq + kind + correlation IDs)
  - [x] state snapshots at selected checkpoints match (hash-based diff)
  - [x] permission decisions + explanations match (source attribution)
- [x] Define a replay diff classifier (allowed nondeterminism vs benign UI formatting vs correctness regressions) and require it to be deterministic.
- [x] Add a conformance suite that replays a fixture capture across Node + web-like + RN-like adapters and asserts identical classified outcomes.

3.11 Phase 3 sanity tests (prove scheduler/kernel semantics)
- [x] `tests/phase3-runtime.test.ts` asserts cooperative yield, timeout behavior, limiter blocking/unblocking, stream sequencing, and a robust `runUntilIdle` for microtask-driven resumption.

---

***Phase 4: Host Capability Abstraction (iOS/Web/Desktop-Safe)***

Why this phase exists: the engine must run without assuming filesystem, raw sockets, shell, or Node globals; all effects must be capability-gated.

Risks mitigated: accidental platform lock-in, security boundary leaks, and undefined behavior when capabilities are missing.

Dependencies: Phase 3 task context and error taxonomy.

4.1 Capability taxonomy and discovery
- [x] Define a canonical list of host capabilities (minimum viable set):
  - [x] storage (key/value, structured, encryption optional)
  - [x] filesystem (optional; may be absent)
  - [x] network (fetch-based)
  - [x] crypto/uuid (portable)
  - [x] clock/timers (injectable)
  - [x] lifecycle (foreground/background/terminate, connectivity) as a first-class event source
  - [x] background execution (optional; iOS/web constraints explicit)
  - [x] file import/export (document picker / downloads) as optional
  - [x] UI affordances (clipboard, notifications, haptics) as optional
  - [x] shell/command execution (optional; desktop-only or remote)
  - [x] local endpoint exposure (optional; desktop/CLI only; policy-gated)
  - [x] IPC/extension bridge (optional; desktop only; policy-gated)
  - [x] process/environment access (optional; heavily restricted)
- [x] Define how capabilities are queried (static descriptor + runtime availability checks).
- [x] Define typed capability errors (`CapabilityUnavailableError`, `CapabilityPolicyDeniedError`) and required UI messaging hooks.
- [x] Define “capability policy” (engine-level rules that can further restrict available capabilities at runtime based on permissions/policy).

4.2 Storage and persistence capabilities (portable first)
- [x] Define a storage interface that can back:
  - [x] settings files (or settings documents)
  - [x] session transcripts/logs
  - [x] caches (MCP endpoint configs, tool caches)
- [x] Define storage consistency requirements (atomic write, compare-and-swap, versioning).
- [x] Define storage quota/error semantics (quota exceeded, transient failure, corruption detected) and how each maps to engine error taxonomy + recovery UX.
- [x] Define storage keying rules (per-app vs per-workspace vs per-session namespaces) to prevent cross-workspace leakage.
- [x] Define encryption-at-rest expectations and how keys are provisioned (host-provided; engine does not manage secrets).
- [x] Define how storage change notifications are delivered (watchers/events) without assuming filesystem watchers exist.

4.3 Filesystem abstraction (optional; capability-gated)
- [x] Define a filesystem interface that supports only what engine needs (read/write/list/stat, path normalization) and avoids Node path semantics.
- [x] Define path canonicalization rules (POSIX-like internal representation; host adapter handles OS specifics).
- [x] Define sandboxing hooks (restrict root directories; expose an “allowed working directories” view to permissions engine).
- [x] Define a strategy for environments without filesystem (iOS/web): emulate via storage where feasible; otherwise fail gracefully.

4.4 Network abstraction (fetch-based, streaming-aware)
- [x] Define a network interface that is expressible via `fetch` semantics (request/response, headers, streaming bodies where available).
- [x] Define retry/backoff policies as a library component (configurable; deterministic under test).
- [x] Define network permission integration points (domain allow/deny/ask; policy override).
- [x] Define how to run on mobile with background restrictions (pause/resume, cancel on app background when required).

4.5 Optional “shell-like” execution capability (do not depend on it)
- [x] Define an optional capability for “shell-like automation” that is **explicitly non-required** and **must not be a concurrency model**.
- [x] Define an explicit constraint: the v3 codebase must not rely on OS process spawning as an implementation mechanism (no Node `child_process`, no “spawn-per-tool” designs).
- [x] Define an explicit constraint: hooks must never be granted any “shell-like” capability (even on desktop); hooks are declarative only.
- [x] Define strict constraints: core engine and hooks must not require this capability to function.
- [x] Define alternative strategies for shell-dependent legacy features:
  - [x] pure TS/WASM substitutes (e.g., search, diff)
  - [x] remote execution via trusted host/server (explicit policy + auth; not an implicit fallback)
  - [x] feature gating (hide/disable with clear UX)
- [x] Define a “desktop power feature” stance that remains compliant with the no-subprocess goal:
  - [x] host-native libraries (e.g., libgit2 bindings) instead of invoking `git`
  - [x] WASM bundles for portable engines
  - [x] optional authenticated RPC to a separately installed companion (not spawned by the app)
- [x] Define failure semantics: if this capability is absent, tools/features that require it are not silently replaced; they must be explicitly unavailable with actionable guidance.
- [x] ⚠️ Do not decide the exact automation mechanism yet; define only the capability boundary, security model, and failure semantics.

4.6 Capability enforcement and least-privilege injection
- [x] Define a rule: tools/hooks/agents receive only the subset of capabilities they are authorized to use (filtered capability view).
- [x] Define how filtered capability views are constructed (based on permission decision + policy + tool metadata) and how attempts to access missing capabilities are surfaced.
- [x] Define how to prevent accidental retention/leakage of full capability handles into long-lived closures (review checklist + lint rules).
- [x] Define a capability “audit mode” for tests that records which capabilities were exercised during a run.

4.7 Secure storage and secret handling (portable)
- [x] Define a “secret storage” interface for credentials/tokens (MCP endpoint keys, auth tokens) that is separate from general settings storage.
- [x] Define rules for what may be stored in plain settings vs secret storage (never store bearer tokens in settings JSON).
- [x] Define rotation/invalidations semantics for secrets (logout, policy changes, token expiry) and how they propagate to running tasks.

4.8 Workspace identity and project scoping (portable replacement for “cwd” assumptions)
- [x] Define a `WorkspaceId` concept that can exist without a filesystem path (mobile/web), and a mapping to a path-based workspace on desktop/Node.
- [x] Define workspace discovery/selection flows per host:
  - [x] CLI: default workspace = cwd (but explicitly captured as a workspace record)
  - [x] Desktop GUI: user selects a folder (workspace record persisted)
  - [x] Mobile/web: user selects a “workspace profile” (remote repo, synced snapshot, or document set)
- [x] Define how settings sources that are “project-scoped” bind to `WorkspaceId` on non-filesystem hosts.
- [x] Define a “workspace trust” artifact per workspace (used by hooks/tools) with clear UX for establishing/withdrawing trust.
- [x] Define workspace-to-repo binding semantics (optional): how a `WorkspaceId` can map to a remote repo identifier (URL + branch) even when no local checkout exists.
- [x] Define workspace renaming/migration semantics (IDs stable; display names mutable) and ensure persisted settings/policy references remain valid.

4.9 Host capability matrix and polyfill strategy (make portability testable)
- [x] Produce a host/capability matrix for: Node/CLI, desktop GUI, web, RN (Hermes/JSC), including known gaps (ReadableStream support, crypto APIs, filesystem availability).
- [x] Define per-capability “polyfill allowed?” rules (e.g., `fetch` polyfill allowed in RN; filesystem polyfill not allowed if it breaks trust model).
- [x] Define a “capability compliance” diagnostic report: at boot, enumerate available capabilities, polyfills activated, and policy restrictions applied.
- [x] Add a conformance test that boots the engine with a “minimal mobile-safe” capability set (no filesystem, no local endpoint, no process/env) and asserts required subsystems still function (settings, permissions prompts, hooks lifecycle, MCP endpoint).

4.10 Phase 4 sanity tests (prove capability plumbing works)
- [x] `tests/phase4-capabilities.test.ts` asserts typed capability errors, filtered capability views, compliance reporting, Node storage CAS semantics, path normalization, and retry/backoff determinism.

---

***Phase 5: App and Session State Model (UI-Agnostic, Event-Driven)***

Why this phase exists: the legacy CLI’s wide React/Ink `AppState` acts as a central runtime container; the rewrite needs a portable, testable state model independent of any UI framework.

Risks mitigated: UI-framework coupling, state inconsistency, and inability to replay/debug decisions.

Dependencies: Phase 2 event taxonomy and Phase 3 runtime primitives.

5.1 Define canonical domain entities and their lifecycles
- [x] Define `AppState` vs `SessionState` separation (global settings/capabilities vs per-session conversation/task state).
- [x] Define session identity and lifecycle states (created, active, paused, ended, error).
- [x] Define transcript/event-log model (append-only log + derived views) and retention policy.
- [x] Define “tool use” entity model (tool name, input, output, streaming events, permissions decision, timing, cancellation).
- [x] Define “hook run” entity model (event name, selected hooks, per-hook outcomes/effects, streaming messages).
- [x] Define “MCP connection” model (server identity, mode, connection status, resources/tools snapshot).

5.2 Store architecture (deterministic reducers + derived selectors)
- [x] Define a store interface that supports:
  - [x] dispatching typed actions/commands
  - [x] emitting typed events to UI
  - [x] snapshotting and restoring state
- [x] Define reducer purity requirements (no side effects; side effects happen via runtime tasks).
- [x] Define selector strategy for UI adapters (memoization without platform-specific caching primitives).
- [x] Define how state updates are serialized for persistence (versioned schemas; migrations).

5.3 Queue-based UX primitives (generalize legacy UI queues)
- [x] Define a generic queue model with priority and exclusivity (only one overlay renders at a time).
- [x] Define a deterministic overlay-selection algorithm (priority tiers + stable tie-breakers) and assert it with golden tests from legacy overlay behavior.
- [x] Define notification queue semantics matching legacy behavior (immediate vs queued, invalidation keys, timeouts).
- [x] Define elicitation queue semantics (MCP “ask user” prompts) including:
  - [x] request identity
  - [x] concurrency rules (serial vs parallel)
  - [x] cancellation propagation
- [x] Define permission prompt queue semantics (tool approvals; “don’t ask again” persistence).
- [x] Define worker/agent permission queue semantics (leader/worker split; mobile-safe behavior).
- [x] Define sandbox-network approval queue semantics (distinct from tool permissions; domain-scoped; leader/worker mediated where supported).
- [x] Define queue persistence rules across app lifecycle events (what survives background/foreground; what is cancelled) and require explicit host adapters to surface resume/restore behavior.

5.4 Persistence and hydration (cross-platform)
- [x] Define what state must persist across app restarts (settings, sessions, caches) vs what is ephemeral (UI overlays).
- [x] Define schema versioning and migration hooks for persisted state.
- [x] Define crash recovery semantics (incomplete tool runs, partially applied settings patches, in-flight background agents).
- [x] Define a “safe startup sequence” that can boot with partial state and recover gradually.

5.5 Multi-session and concurrency boundaries
- [x] Define whether multiple sessions can run concurrently in one engine instance (and if not, define enforcement).
- [x] Define resource-sharing rules across sessions (MCP connections, caches, network budgets).
- [x] Define how background agents are scoped (per app, per session, or both) and cancellation rules.

5.6 Transcript, attachments, and redaction (portable persistence surface)
- [x] Define a versioned transcript event schema that is:
  - [x] append-only
  - [x] serializable (no functions/classes)
  - [x] bounded (supports truncation/compaction markers)
  - [x] portable across hosts (no OS-specific fields)
- [x] Define a canonical “attachment reference” model (content-addressed or stable IDs) so large payloads do not live inline in transcript events.
- [x] Define attachment classes and constraints:
  - [x] text artifacts (tool logs, hook logs)
  - [x] structured artifacts (JSON tool outputs)
  - [x] binary artifacts (optional; capability-gated; stored out-of-line)
- [x] Define redaction markers at the schema level (fields annotated as `sensitive`) and a deterministic redaction pass used by:
  - [x] logs
  - [x] diagnostic bundles
  - [x] regression corpora
- [x] Define transcript hashing/summary rules for tests (hash chunks + counts; avoid storing sensitive raw data).
- [x] Define export/import behavior for sessions:
  - [x] export contains transcript + minimal metadata + redacted attachments
  - [x] import rehydrates into a read-only “replay session” unless explicitly migrated

5.7 Derived views and UI adapter contracts (state-to-UI determinism)
- [x] Define “view model selectors” for each host UI (CLI/RN/web) as pure functions over canonical state (no host-specific IO in selectors).
- [x] Define a stable transcript rendering contract (how tool/hook/MCP events become UI lines/cards) that is consistent across hosts and can be snapshot-tested.
- [x] Define “state diff” event emission rules (when to emit incremental diffs vs full snapshots) to keep mobile/web performant without losing determinism.
- [x] Add golden snapshot tests that render a known transcript into each UI adapter’s view model and assert identical semantic output (text differs by UI chrome, not by meaning).

5.8 Phase 5 sanity tests (prove state+queues+rendering)
- [x] `tests/phase5-state.test.ts` asserts session lifecycle creation/activation, overlay selection precedence, and stable transcript semantic rendering.
- [x] `tests/phase1-5-e2e-baseline.test.ts` asserts an end-to-end boot path: engine start → deterministic `state/app-state` emission → host user input → transcript append → monotonic UI event sequencing → clean stop with `engine/stopped`.

---

***Phase 6: Settings and Configuration System (Layered, Watchable, Portable)***

Why this phase exists: settings drive permissions, hooks, tool behavior, MCP, and UI; the rewrite needs a portable equivalent of the legacy layered settings pipeline and watcher semantics.

Risks mitigated: silent behavior drift, incorrect precedence, and non-portable IO/watch assumptions.

Dependencies: Phase 4 storage abstraction and Phase 5 state/persistence.

6.1 Schema strategy (types and validation without bundler artifacts)
- [x] Decide how settings schemas are authored and validated (schema-first with generated TS types, or TS-first with runtime validation).
- [x] Define a versioned settings schema format with explicit migration steps.
- [x] Define a strict parse/validate error model that can surface structured errors to UI (not just logs).
- [x] Define how “empty/missing settings” are treated (valid empty object) and how IO errors are handled per source.
- [x] ⚠️ Do not decide final schema tooling yet; define required capabilities (runtime validation, JSON schema export, RN compatibility).

6.2 Settings sources and precedence (portable representation of legacy behavior)
- [x] Define settings sources: user/project/local/policy/flag and non-file sources (cliArg/command/session) as first-class keys.
- [x] Define enabled-source selection semantics (legacy: allowlist for user/project/local, always include policy + flag).
- [x] Define merge semantics (deep merge rules, array replace/merge policy) and document per-field merge expectations.
- [x] Define policy settings origin semantics (remote vs local vs absent) and how origin is represented/explained to the user.
- [x] Define how “command configuration” and “cliArg” overlays are represented without conflating with persisted sources.

6.3 Watchers and change propagation (no filesystem assumption)
- [x] Define a settings event bus that emits `(source, effectiveSettings, errors)` updates.
- [x] Define internal-write suppression semantics (prevent write→watch loop) without relying on filesystem watcher timestamps.
- [x] Define how watchers are implemented per host:
  - [x] Node/desktop: filesystem watcher adapter (optional)
  - [x] Web: storage event adapter or polling (as needed)
  - [x] Mobile: storage subscription or “settings changed” command-only model
- [x] Define how settings changes trigger state updates in the engine store (invalidate caches, recompute derived contexts).

6.4 Settings patching and atomicity (portable “partial update” semantics)
- [x] Define a “settings patch” format (deep partial + array semantics) and how patches are applied deterministically.
- [x] Define atomic update expectations per storage backend (transaction/CAS where possible).
- [x] Define conflict resolution for concurrent updates (last-write wins vs version checks).
- [x] Define how settings edits are attributed to a source and how UI confirms the destination (user vs project vs local).

6.5 Compatibility and migration of existing settings files
- [x] Define how legacy file paths map into the new storage model (especially policy managed settings locations).
- [x] Define a migration plan for settings schema evolution (v2 files → v3 schema) with rollback.
- [x] Define a “doctor” report for settings health (parse errors, invalid fields, policy overrides).
- [x] Define how to handle broken symlinks / unreadable settings sources in host environments that support symlinks (must not brick startup).
- [x] Define the legacy “enabled sources” CLI parsing behavior and how it maps into portable settings selection.

6.6 Settings precedence and merge edge cases (test-first inventory)
- [x] Enumerate settings fields that require non-default merge behavior (arrays, maps, special objects) and document expected behavior.
- [x] Define explicit merge semantics for hook configs, permission rules, and MCP config subtrees (so later refactors don’t accidentally change them).
- [x] Define how to represent and surface settings validation errors from multiple sources (aggregate + per-source attribution).
- [x] Define how the engine behaves when policy settings are present but invalid (fail-closed vs ignore with warning; must be explicit and tested).

6.7 Portable settings storage mapping (per-host implementation checklist)
- [x] Define the storage keys / documents used to represent each source on non-filesystem hosts (user/project/local/policy/flag).
- [x] Define how “project settings” are scoped on mobile/web when there is no project root (explicit workspace concept, user-chosen workspace IDs).
- [x] Define how policy-managed settings are delivered on mobile (secure fetch + cache) and how offline behavior works.
- [x] Define how to export/import settings for support and migration (sanitized bundle; reproducible).

6.8 Settings-derived feature gates and computed configuration (make implicit toggles explicit)
- [x] Inventory all legacy boolean “switches” that alter behavior (e.g., `disableAllHooks`, experimental MCP CLI enable, endpoint-mode enable, sandbox/network approval toggles) and classify each as:
  - [x] portable setting (works on all hosts)
  - [x] host-only setting (Node/desktop)
  - [x] env/flag alias (CLI convenience only)
- [x] Define a computed `EffectiveConfig` snapshot that the engine derives from settings + policy + host capabilities (single place to reason about feature gating).
- [x] Define which fields in `EffectiveConfig` are safe to persist vs must remain ephemeral (session-only, host-only).
- [x] Define how UI adapters render feature availability (capability-gated tool/hook visibility) without reading raw settings trees directly.
- [x] Add golden tests that assert: for a given set of sources, `EffectiveConfig` fields are computed identically across hosts (modulo capability presence).

6.9 Secrets, credentials, and redaction boundaries in configuration
- [x] Define an explicit schema boundary between configuration values and secrets (secrets never appear in exported settings snapshots or diagnostic bundles).
- [x] Define how secret references are represented in settings/config (opaque IDs that resolve via secret storage capability).
- [x] Define failure semantics when a secret reference cannot be resolved (prompt user vs hard error vs policy deny), and test each host’s UX path.

---

***Phase 7: Permissions and Policy Engine (Rules, Explainability, Persistence)***

Why this phase exists: permission decisions are safety-critical, affect portability (capability gating), and must be explainable across multiple sources with deterministic outcomes.

Risks mitigated: unsafe defaults, inconsistent approvals across platforms, and non-auditable policy overrides.

Dependencies: Phase 6 settings model (sources), Phase 4 capability boundary, and Phase 5 prompt queue semantics.

7.1 Permission domain model (portable, explicit)
- [x] Define `PermissionMode` semantics (default, plan, acceptEdits, bypassPermissions, dontAsk) as first-class values with normalization rules.
- [x] Define a normalization function spec that maps unknown/invalid mode strings to a safe default (and records a diagnostic).
- [x] Define mode-derived UI affordances (label/icon/theme key) as pure formatting rules in UI adapters, not core state.
- [x] Define `PermissionRule` representation (tool name + optional rule content) and serialization format compatible with legacy strings.
- [x] Define a rule grammar spec that matches legacy parsing limitations (no nested parentheses/escaping) unless explicitly extended later.
- [x] Define a canonical normalization for tool names (case, separators, MCP namespacing) so rule matching is deterministic.
- [x] Define `PermissionRuleSource` keys and ensure they align with settings sources + session/cli overlays.
- [x] Define the permission context that is computed from settings and session state (additional directories, mode availability).
- [x] Define how “additional working directories” are represented (normalized absolute paths + source attribution) without host-specific path semantics.
- [x] Define a canonical “permission scope” concept (session-only vs persisted) that maps to legacy destinations.
- [x] Define a canonical “permission decision” structure that includes:
  - [x] behavior (allow/deny/ask)
  - [x] explanation (human-readable)
  - [x] attributable source(s)
  - [x] suggested persistence actions (“don’t ask again” updates)
  - [x] machine-readable reasoning codes (so tests can assert why a decision was made without relying on exact phrasing)

7.2 Rule evaluation pipeline (preserve legacy semantics until explicitly changed)
- [x] Implement (as spec) the legacy source precedence ordering and document any surprising implications.
- [x] Define the flattening algorithm spec (source iteration order, overwrite semantics, first-match behavior) and capture as golden tests.
- [x] Define tool-group semantics (e.g., MCP tool grouping) and how rules match grouped tools.
- [x] Inventory legacy “tool special cases” that affect permissions (at minimum: Bash/shell tool shortcuts, sandbox overrides, MCP grouped tools) and codify each as explicit, testable decision logic (not scattered conditionals).
- [x] Decompose the legacy Bash/sandbox shortcut into discrete rules:
  - [x] identify what qualifies as “Bash tool” invocation in legacy UX
  - [x] specify when sandboxing implies auto-allow vs still prompts
  - [x] specify how “sandboxOverride” requests are represented and whether policy can forbid override
- [x] Specify legacy Bash redirection/command parsing requirements for permission prompts:
  - [x] what is displayed to the user (sanitized summary)
  - [x] what is evaluated for allow/deny matching (tool name vs parsed target paths/hosts)
  - [x] how ambiguous/invalid shell syntax is handled (fail-closed vs prompt with warning)
- [x] Define deterministic normalization for parsed Bash “targets” (hosts/paths) so permission prompts are stable across platforms and do not depend on OS-specific parsing.
- [x] Define how tool-specific policy logic plugs into global rule evaluation (tool introspection of inputs).
- [x] Define how tool-specific checkers declare “required interactions” (if tool needs user interaction, mode overrides are constrained).
- [x] Define deterministic “first-match” behavior and how ties/conflicts are resolved.
- [x] Define evaluation ordering between allow/deny/ask sets (deny-first vs allow-first) and preserve legacy until explicitly changed.

7.3 Ask/deny/allow UX integration (portable prompts)
- [x] Define a portable “permission prompt request” event with:
  - [x] prompt title/body
  - [x] structured context for rendering (tool, inputs summary, redirections summary if applicable)
  - [x] allowed response set (allow once, deny, allow+persist, deny+persist, edit scope)
- [x] Define a portable “why are we asking?” payload: matched rules summary, mode, and source labels (user/project/local/policy/session).
- [x] Define how “don’t ask again” becomes persisted rule updates (destination selection, preview of change).
- [x] Define how persistence destination selection is constrained by policy (managed-only environments).
- [x] Define how permission prompts are serialized and resumed (if app is backgrounded mid-prompt).
- [x] Define how policy-managed environments restrict user persistence options (managed-only hooks/permissions).
- [x] Define a UX requirement for “deny” messaging that is consistent across CLI/RN/web and is fully attributable.

7.4 Permissions as a capability gate (enforcement layer)
- [x] Define how permission decisions gate capability access (filesystem, network domains, clipboard, shell/remote).
- [x] Define enforcement points (tool runner, MCP transport, settings edits, hook actions).
- [x] Define “defense in depth”: capability can be present but denied by policy (must fail with attributable error).
- [x] Define a mandatory enforcement test suite: attempts to bypass permissions via direct capability calls must be impossible from portable modules.

7.5 Policy engine integration (managed settings, enterprise constraints)
- [x] Define how policy settings can:
  - [x] enforce managed-only hooks
  - [x] restrict plugin loading
  - [x] force-deny certain tools/capabilities
  - [x] restrict persistence destinations
- [x] Define audit trail requirements for policy-driven denials.
- [x] Define remote-policy refresh semantics and UI messaging (when policy updates mid-session).
- [x] Define policy-controlled overrides that must be visible to the user (e.g., “managed settings prevent custom hooks”) vs silent hardening.

7.6 Permission updates and persistence (write-side semantics)
- [x] Define an update model that matches legacy operations (setMode, add/replace/remove rules, add/remove directories) with deterministic ordering.
- [x] Define which destinations are writable (user/project/local) and ensure attempts to write others fail safely and explainably.
- [x] Define atomic persistence semantics for permission updates (batching, rollback on partial failures, internal-write suppression).
- [x] Define how “session” rules are stored and cleared (never persisted; cleared at end-of-session).

7.7 Explainability and auditability (policy-grade)
- [x] Define a required “decision explanation contract” for all permission decisions (must identify: tool, matched rule(s), source, mode, any tool-specific overrides).
- [x] Define an audit event schema for permission changes (who/what/when; destination; old→new preview; policy constraints applied).
- [x] Define log/telemetry redaction rules for permission explanations (no raw secrets in tool inputs).

7.8 Leader/worker approvals and sandbox permissions (portable model)
- [x] Define how “worker” contexts request approvals from a “leader” UI in a multi-agent scenario (message passing, queueing, timeouts).
- [x] Define a separate approval channel for network/sandbox permissions (parity with legacy workerSandboxPermissions) and how it maps to capability gating.
- [x] Define how leader/worker approval flows degrade on mobile (single-device leader only; no background worker that can’t prompt).

7.9 Sandbox-network approval policy model (separate from tool permissions, but unified UX)
- [x] Define the “network approval” decision object (host, port/scheme if known, reason, originating task/tool, workspace scope) and its serialization for persistence and auditing.
- [x] Define canonicalization rules for network targets so approvals are stable and non-bypassable:
  - [x] normalize scheme (`https`, `http`, `wss`, `ws`) and default ports
  - [x] normalize hostnames (case-folding, punycode) and reject invalid/ambiguous hosts
  - [x] treat IP literals (IPv4/IPv6) distinctly from hostnames; specify whether DNS resolution affects approval matching
  - [x] classify loopback/local-network/private ranges explicitly and require separate policy gates for local network access
  - [x] define redirect handling (approve final destination only vs every hop) and require explicit tests for both policies
- [x] Define allow/deny persistence semantics for network approvals (domain patterns, expiry/TTL options, per-workspace vs global) and how policy can forbid persistence.
- [x] Define deterministic queueing semantics for multiple concurrent network approval requests (dedupe keys, stable ordering, cancellation if origin task cancels).
- [x] Define leader/worker mediation protocol for network approvals (request IDs, retries, ack/nack, timeout) without relying on filesystem mailboxes/state files.
- [x] Add conformance tests that assert: network approval decisions cannot be bypassed by direct `fetch` usage inside tools (capability filtered + policy enforced).

7.10 Permission decision caching and invalidation (correctness-first performance)
- [x] Define which decisions are cacheable (pure function of inputs + effective settings + policy version + workspace trust) vs never cacheable (interactive prompts, time-sensitive, user-contextual).
- [x] Define canonical cache keys for tool permissions that include:
  - [x] tool identity + normalized input risk signature (schema-based, redacted)
  - [x] workspace identity/trust state
  - [x] effective config hash and policy hash/version
  - [x] capability availability fingerprint (to avoid “allowed but unavailable” mismatches)
- [x] Define invalidation triggers (settings change, policy refresh, hook config change, workspace trust change) and deterministic ordering when multiple triggers occur.
- [x] Define cache storage semantics:
  - [x] in-memory only by default
  - [x] optional persisted cache with TTL (policy-controlled; never stores sensitive inputs)
  - [x] bounded size + eviction policy that is deterministic in tests (e.g., stable LRU keyed by monotonic ticks)
- [x] Add regression tests asserting caching does not change observable behavior:
  - [x] cached allow/deny decisions preserve explanation attribution
  - [x] cached “ask” decisions do not skip UI prompts
  - [x] invalidation happens before the next decision after a policy/settings update

---

***Phase 8: Tool Execution Layer (Async, Streaming, No Subprocess Model)***

Why this phase exists: tools are the primary side-effect boundary. The rewrite must replace “shell commands + child processes” with in-process async tools and/or capability-gated remote execution, with consistent streaming and cancellation semantics.

Risks mitigated: reintroducing subprocess-as-orchestrator patterns, breaking streaming UX, and inconsistent behavior across platforms.

Dependencies: Phase 3 runtime, Phase 4 capabilities, Phase 7 permission engine, Phase 5 state model.

8.1 Tool contract (types + lifecycle, no implementation yet)
- [x] Define a tool interface that supports:
  - [x] typed input/output schemas
  - [x] streaming outputs and progress events
  - [x] cancellation via AbortSignal
  - [x] resource budgeting (time, memory, IO)
- [x] Define tool input validation semantics (schema validation failure is a typed error; never reaches tool body).
- [x] Define tool output validation semantics (tools must produce schema-conformant outputs or fail with a typed error).
- [x] Define a tool error model that preserves machine-readable codes (permission denied, capability missing, network error, invalid input, internal error).
- [x] Define the tool execution lifecycle events (queued, started, streaming, completed, failed, cancelled).
- [x] Define “tool start” semantics (when a tool is considered started: after permission decision, after pre-hooks, etc.) and make it consistent across tools.
- [x] Define a canonical tool result model that separates:
  - [x] machine result (`data`, schema-validated)
  - [x] user-facing rendering hints (`display` summaries, optional; UI-controlled formatting)
  - [x] attachments (structured artifacts referenced by ID; persisted separately from logs)
- [x] Define a canonical `ToolStreamEvent` envelope (toolRunId, seq, tsMono, kind, payload, sensitivity) and validation rules at emit time.
- [x] Define attachment primitives and lifecycle:
  - [x] attachment kinds (file reference, diff/patch artifact, table, image, diagnostic bundle ref)
  - [x] storage location policy (in-memory vs persisted) and retention TTLs per host/policy
  - [x] reference semantics (by content hash + metadata; avoid duplicating large blobs in event logs)
  - [x] attachment access control (must respect permissions; UI cannot fetch an attachment if denied)
- [x] Define attachment size ceilings and truncation rules (deterministic, signaled in metadata).
- [x] Define how tools request elicitation/ask-user flows (portable, UI-mediated) including:
  - [x] request schema (prompt, choices, validation)
  - [x] cancellation/timeout semantics
  - [x] stable request IDs and dedupe behavior
- [x] Define how tools request additional permissions mid-run (must re-enter the permission pipeline; no implicit escalation) and how partial progress is handled if denied.
- [x] Define tool idempotency expectations:
  - [x] declare idempotent vs non-idempotent tools in registry metadata
  - [x] define “dry run / preview” mode requirements for write tools (used by migration shadow mode)
  - [x] define how retries are handled (never auto-retry non-idempotent tools)

8.2 Tool registry and discovery (portable and extensible)
- [x] Define a registry format for built-in tools (name, schema, capabilities required, permission categories).
- [x] Define a capability-requirements expression model (required vs optional; “any of” vs “all of”) to avoid hardcoding platform logic in tools.
- [x] Define tool metadata for UX (display name, help text, risk level) without letting UI strings leak into core decisions.
- [x] Define how MCP-provided tools are represented alongside built-ins (namespacing, grouping, versioning).
- [x] Define a stable name normalization and conflict-resolution policy for tool identifiers (avoid collisions across MCP servers/plugins).
- [x] Define how plugins can contribute tools (if supported) without violating portability/security constraints.
- [x] Define a stable “tool identity” format for logs and permissions rules.
- [x] Define how tool schemas are versioned and how schema changes are migrated across engine versions (compatibility story).

8.3 Execution pipeline orchestration (replace spawned-process boundaries)
- [x] Define the full pipeline for a tool invocation:
  - [x] build tool context (session, settings snapshot, permission context, capabilities)
  - [x] run pre-tool hooks (see Phase 9) and apply any effects (block, modified input, permission updates)
  - [x] evaluate permissions for the invocation
  - [x] execute the tool with streaming events
  - [x] run post-tool hooks and apply effects (tool output modification, transcript injection)
- [x] Define a `ToolRunId` and per-run monotonic stream sequence numbers so hosts can render partial output deterministically and resume after backgrounding.
- [x] Define explicit ordering and cancellation propagation across the pipeline.
- [x] Define transactional semantics for effect application (e.g., permission updates suggested by hooks only apply if tool ultimately runs and completes successfully, unless explicitly marked otherwise).
- [x] Define where “tool output modification” is allowed (post hooks) and how it is recorded to preserve auditability (original output vs modified output).
- [x] Define how to enforce that tools cannot bypass the pipeline (no direct capability calls outside tool runner).
- [x] Define a “tool runner policy” that rejects any tool registration that requests forbidden capabilities on a given host (fail fast at startup).

8.4 Replacing legacy subprocess-heavy tools (design-first inventory)
- [x] Inventory all legacy tool behaviors that currently rely on external binaries/processes (search, git, shell hooks, installers).
- [x] Build a mapping table: legacy “spawn/process” usage → new async construct (tool, background task, MCP request, or removed artifact), with explicit parity notes.
- [x] Identify legacy “internal entrypoints” (`--mcp-cli`, `--ripgrep`) that exist primarily to support multi-process packaging, and define v3 equivalents that are in-process.
- [x] For each such behavior, create a decision record with options:
  - [x] pure TS implementation
  - [x] WASM implementation
  - [x] remote execution via trusted host/server
  - [x] capability-gated desktop-only implementation
  - [x] deprecate/omit (with explicit rationale)
- [x] Define an explicit constraint for any “remote execution” option:
  - [x] it must not be implemented by spawning local helper processes
  - [x] it must be an authenticated, separately deployed service or an explicit host capability
  - [x] it must be visible in permissions/policy UX (origin, destination, and risk classification)
- [x] Define a “no subprocess in engine” enforcement test (static scan + runtime guard).
- [x] Define a parity plan for search/diff operations that avoids shelling out:
  - [x] evaluate WASM search (ripgrep-wasm) vs TS search for common cases
  - [x] define correctness tests (regex features, unicode, large repos)
  - [x] define performance gates per host (mobile budgets)

8.5 Tool streaming and UI rendering contracts (portable)
- [x] Define a standard set of tool stream event types (stdout-like text, structured chunks, progress, diagnostics).
- [x] Define chunking rules (max bytes per chunk, line buffering expectations, flush intervals) so UI can render consistently.
- [x] Define a “diagnostics channel” separate from user-visible output (debug logs, trace IDs) to avoid polluting transcripts.
- [x] Define how to render tool output consistently across CLI and RN/web UIs (UI adapter responsibility).
- [x] Define how tool outputs are persisted (final result + optionally a bounded stream transcript for debugging).
- [x] Define how to handle binary-like outputs (file diffs, patches) without leaking huge payloads into transcripts by default.
- [x] Define a strict mapping from `ToolStreamEvent.kind` → engine event channels (`transcript`, `ui`, `diagnostic`, `telemetry`) so:
  - [x] user-visible output is never emitted on diagnostic-only channels
  - [x] diagnostic output is never treated as transcript content
  - [x] hosts can safely “render only transcript” without missing required user content
- [x] Define “replaceable output” semantics for status-like UI (e.g., progress/status line):
  - [x] stable `replaceKey` contract (replaces prior event with same key in UI-only views)
  - [x] explicit rule: replaceable output must not alter persisted transcript ordering (persist summaries, not per-tick status)
- [x] Define truncation/overflow semantics for high-volume tool streams:
  - [x] deterministic thresholds (bytes, chunks, time) per host/policy
  - [x] required “truncated” marker event containing counters and a retrieval hint (attachment ref if available)
  - [x] test fixtures for “huge output” ensuring bounded memory usage and stable final summaries
- [x] Define transcript persistence rules for tool streams:
  - [x] default: persist only summarized output + hashes/counters for chunks flagged sensitive
  - [x] debug mode (policy-gated): persist bounded raw chunks with redaction applied
  - [x] explicit replay strategy: compare hashes/counters for sensitive streams instead of raw content

8.6 Tool isolation and sandboxing (without OS processes)
- [x] Define an isolation policy spectrum: in-process trusted tools (default) vs constrained tools (limited capabilities) vs remote tools.
- [x] Define how constrained tools are prevented from accessing forbidden capabilities (capability object given to tool is a filtered proxy, not the full host).
- [x] Define a “capability membrane” contract for filtered proxies:
  - [x] deny-by-default for any method not explicitly exposed
  - [x] stable, typed error on deny (`CapabilityPolicyDeniedError`) with attribution
  - [x] per-call auditing hooks (who called, which toolRunId/taskId, which capability method)
  - [x] explicit prohibition on leaking raw underlying handles across the membrane (review checklist + tests)
- [x] Define per-tool resource budgets and enforcement hooks (time, memory proxy metrics, max output size).
- [x] Define how to run constrained tools in a worker context when available (Phase 11.5), with a main-thread fallback.
- [x] Define worker execution semantics (when available) that remain deterministic:
  - [x] request/response correlation IDs and monotonic sequence numbers for streamed events
  - [x] cancellation propagation across worker boundary (abort reasons preserved)
  - [x] bounded message queue sizes and backpressure signals (producer pause/resume)
  - [x] crash/restart policy for workers (fail tool run vs restart + retry only if idempotent)
- [x] Define recursion/loop safety rules for tool-to-tool calls (tool A requesting tool B) so a tool cannot create unbounded nested executions without policy approval.

8.7 Tool idempotency, caching, and replay
- [x] Define which tools are cacheable (pure read operations) and what cache keys look like (inputs + settings snapshot + workspace ID).
- [x] Define safe caching invalidation triggers (settings changes, filesystem changes where supported).
- [x] Define replay semantics for tools in test harnesses (recorded inputs/outputs; compare deterministic event sequences).

8.8 Security review checklist for tool catalog
- [x] Categorize tools by risk level and required approvals (read-only, write, network, auth, remote execution).
- [x] Define mandatory redaction rules for tool inputs/outputs stored in logs (secrets, tokens, file contents in managed environments).
- [x] Define penetration-test style scenarios (attempt prompt injection to bypass tool runner; attempt capability escalation).

8.9 In-process search/grep tool track (replacement for legacy embedded `--ripgrep`)
- [x] Define a portable `search.grep` tool contract that supports:
  - [x] literal and regex queries (explicit flags; documented unsupported features)
  - [x] glob include/exclude rules
  - [x] streaming match output (per-file groups + match locations)
  - [x] bounded results (max matches, max files, per-file cap)
  - [x] encoding handling (UTF-8 default; explicit “binary” detection)
- [x] Define required correctness semantics relative to legacy “ripgrep abstraction”:
  - [x] matching behavior for multiline, unicode, and case-folding
  - [x] directory traversal ordering (deterministic)
  - [x] error handling (permission denied, unreadable files, too-large files)
- [x] Create an evaluation matrix for implementations:
  - [x] WASM ripgrep-like engine (preferred for parity)
  - [x] pure TS fallback engine (for constrained hosts or small inputs)
  - [x] remote execution (optional; policy-gated)
- [x] Define packaging constraints for WASM (bundle size ceilings, memory ceilings, streaming decode strategy) and host feasibility notes (RN Hermes/JSC, web).
- [x] Define a “ripgrep health/doctor parity” checklist:
  - [x] explicit capability: `searchEngine` available/unavailable
  - [x] diagnostics fields (mode, version, limits)
  - [x] telemetry rules (do not double-log in endpoint-style modes)
- [x] Add golden tests that compare `search.grep` results against recorded legacy outputs on a fixed fixture repo (normalized ordering).

8.10 Git operations tool track (no subprocess, host-gated where necessary)
- [x] Inventory legacy git-dependent behaviors that must be preserved (teleport cleanliness checks, stash UI path, diff/status usage, branch detection).
- [x] Define a portable `vcs.git` capability boundary:
  - [x] read-only operations (status, diff, branch, root detection)
  - [x] write operations (stash, apply patch, checkout) gated by explicit permissions
  - [x] credential access boundary (host-managed; never store raw tokens in core settings)
- [x] Define an evaluation matrix for implementations:
  - [x] pure JS git (isomorphic) with host filesystem adapter
  - [x] WASM libgit2-like engine (desktop/web)
  - [x] host-native git bridge (desktop-only; still “no subprocess”)
  - [x] remote VCS service integration (future; policy-gated)
- [x] Define deterministic semantics for git reads (ordering, normalization of paths, handling of line endings) to keep golden tests stable.
- [x] Define fallback UX when git capability is absent (mobile/web): explicit messaging + capability-gated disablement of teleport-local behaviors.

8.11 Patch/apply-edits engine (portable, deterministic, audit-friendly)
- [x] Define a canonical “edit set” schema (file path, original hash/etag, hunks/edits, newline policy) that is serializable and reviewable.
- [x] Define deterministic patch application rules:
  - [x] path normalization and workspace scoping
  - [x] conflict detection (context mismatch) and error taxonomy
  - [x] CRLF/LF handling and trailing newline rules
  - [x] atomic write semantics via storage/filesystem capability
- [x] Define a “preview” mode that produces a structured diff artifact without writing (used for permission prompts and UI review).
- [x] Define audit trail requirements (store proposed edits, user approval decision, applied result hashes).
- [x] Add golden tests for patch application using fixture files across platforms (newline variants, unicode, large files).

8.12 Engine-internal command surface (replacing legacy `--mcp-cli` / `--ripgrep` entrypoints)
- [x] Define an engine command registry distinct from “tools used by the model” (explicit user/operator commands).
- [x] Define command parity targets:
  - [x] `mcp.servers/list`
  - [x] `mcp.tools/list`
  - [x] `mcp.resources/list`
  - [x] `mcp.resources/read`
  - [x] `mcp.tools/call`
  - [x] `mcp.grep` (server-scoped, if supported)
  - [x] `search.grep` (workspace-scoped)
- [x] Define a CLI adapter mapping: CLI arguments → engine commands → typed output formatting (no separate process execution).
- [x] Define telemetry boundaries for commands (especially “endpoint-mode dedupe” parity).

8.13 Tool packaging, distribution, and plugin sandboxing (design gates; no code)
- [x] Define a tool packaging format for optional tools/plugins:
  - [x] manifest schema (tool IDs, schemas, required capabilities, versioning)
  - [x] integrity metadata (hash/signature) and trust source (policy-controlled allowlist)
  - [x] compatibility constraints (engine version range, host capability requirements)
- [x] Define a plugin loading policy model:
  - [x] disabled by default on mobile/web unless explicitly enabled by policy/user
  - [x] directory-based discovery only on filesystem hosts, and only within scoped, user-approved directories
  - [x] policy-managed allow/deny lists for plugin sources and identities
- [x] Define sandboxing requirements for plugin-provided tool code (if supported):
  - [x] no direct access to raw host capabilities; only mediated tool-context handles
  - [x] explicit resource budgets and hard timeouts
  - [x] deterministic message-passing contract if isolation is used (no shared mutable state assumptions)
- [x] Define conformance tests for plugin tool registration:
  - [x] manifests with forbidden capabilities are rejected at startup with actionable diagnostics
  - [x] plugin tools cannot register IDs that collide with built-ins or MCP tools
  - [x] plugin tools cannot emit events without valid envelopes/sequence numbers

---

***Phase 9: Hooks System Redesign (Pure Async, No Shell, Serializable)***

Why this phase exists: legacy hooks rely on shell commands, environment variables, stdin/stdout protocols, and subprocess orchestration; this must become a portable, deterministic async workflow system.

Risks mitigated: security vulnerabilities (arbitrary code execution), non-portability, and untestable hook behavior.

Dependencies: Phase 6 settings (hook config sources), Phase 8 tool pipeline (hook integration), Phase 3 runtime (streaming).

9.1 Hook schema redesign (portable and serializable)
- [x] Define a new hook definition schema that is:
  - [x] JSON-serializable
  - [x] versioned
  - [x] validated at load time
  - [x] portable across hosts
- [x] Define hook event names to preserve (at minimum: PreToolUse, PostToolUse, PostToolUseFailure, PermissionRequest, Stop, SubagentStart/Stop, UserPromptSubmit, SessionStart/End, Notification, PreCompact, StatusLine, FileSuggestion).
- [x] Define the hook input payload shapes (base + event-specific) and ensure they are serializable (no functions, no class instances).
- [x] Define hook matcher semantics (regex/wildcard/or patterns) and deterministic ordering rules.
- [x] Define a normalization pipeline for hook configs (sort matchers, sort hooks within matchers, canonical stringification for diffs) so changes are detectable and deterministic.
- [x] Define a “hook config diff report” format that can be shown in UI when hooks change (parity with legacy “hooks configuration changed” messaging).
- [x] Define deduplication semantics by hook type (preserve legacy intent where it matters).
- [x] Define explicit schema support for “status line” and “file suggestion” hooks (legacy has dedicated commands) as first-class events with constrained actions.
- [x] Define required hook identity and provenance fields:
  - [x] stable `hookId` (deterministic; not derived from file paths)
  - [x] `source` attribution (user config vs project config vs policy-managed vs plugin vs session-injected)
  - [x] versioned `definitionVersion` and optional `migratedFrom` legacy metadata
- [x] Define per-hook execution policy fields:
  - [x] `priority` (integer; stable sorting)
  - [x] `maxRunsPerSession` / `cooldownMs` (anti-spam controls; deterministic via monotonic clock)
  - [x] `concurrency` (serial per hook vs allow parallel; default serial)
  - [x] `budget` (time/IO/tool-call budget) and default budgets by event type
- [x] Define explicit “capability request” prohibition: hooks cannot request arbitrary capabilities; they may only request effects interpreted by the engine (tool runs/permission prompts remain mediated).
- [x] Add schema-level constraints that prevent unbounded growth:
  - [x] maximum matcher count
  - [x] maximum action count per hook
  - [x] maximum nested effect depth (if effects can reference sub-actions)
- [x] Add schema conformance tests:
  - [x] canonical stringification is stable across platforms
  - [x] invalid configs produce deterministic, user-actionable error reports (with source attribution)
- [x] ⚠️ Do not finalize the exact hook action API in this phase; define lifecycle + data flow boundaries only.

9.2 Pure-async hook execution model (no shell, no environment variables)
- [x] Define a hook execution engine that runs hooks as async tasks inside the runtime scheduler.
- [x] Define two execution surfaces:
  - [x] streaming mode (UI consumes incremental events)
  - [x] non-streaming mode (returns a summarized result array for background/non-UI contexts)
- [x] Define `HookRunId` and per-run monotonic sequence numbers for hook stream events so hosts can resume rendering after backgrounding/crash (mirror the `ToolRunId` sequencing contract).
- [x] Define a strict `HookStreamEvent` envelope (hookId, hookRunId, seq, tsMono, kind, payload) and validation rules.
- [x] Define hook cancellation semantics (user stop, tool cancellation, timeout) and required cleanup behavior.
- [x] Define hook timeouts and budgeting per hook (time, tokens for model hooks, IO budgets for tool calls).
- [x] Define streaming feedback events for UI (progress/success/non-blocking error/blocking error/cancelled).
- [x] Define how hooks can produce structured effects (block/allow/ask, modify inputs/outputs, inject messages, update permissions).
- [x] Define hook chaining semantics (sequential vs parallel; default sequential to preserve legacy ordering) and make it explicit per event.
- [x] Define how hook failures are classified (blocking vs non-blocking) and when the engine must halt continuation.

9.3 Hook actions/effects (declarative primitives)
- [x] Define a minimal, composable set of hook actions (examples; final set is provisional):
  - [x] `EmitNotification`
  - [x] `RequestPermissionDecision` (advisory; must flow through permissions engine)
  - [x] `UpdateToolInput`
  - [x] `UpdateToolOutput` (including MCP output adjustment parity)
  - [x] `AppendTranscriptContext`
  - [x] `BlockContinuation` with reason
  - [x] `RunTool` (restricted; capability-gated and permission-checked)
  - [x] `RunModelCheck` (prompt hook analog, but portable)
- [x] Define effect application rules and conflicts (multiple hooks propose edits; deterministic resolution).
- [x] Define effect precedence rules (e.g., first blocking effect wins; later non-blocking messages still recorded; input edits compose deterministically).
- [x] Define deterministic conflict-resolution algorithms for each effect class:
  - [x] `UpdateToolInput`: edit composition order (by hook priority, then stable hook id), conflict detection rules, and “last-writer-wins” prohibition unless explicitly chosen
  - [x] `UpdateToolOutput`: original output retention + modified output provenance; ability to chain multiple transforms deterministically
  - [x] `UpdatePermissions`: staging semantics (proposed vs committed) and merge strategy when multiple hooks propose rule changes
  - [x] `AppendTranscriptContext`: canonical ordering + dedupe keys to prevent spam
- [x] Define a hook recursion/loop-prevention policy:
  - [x] prevent a hook from re-triggering the same event infinitely (event reentrancy guard with max depth)
  - [x] prevent `RunTool` effects from triggering PreTool hooks that re-run the same hook unless explicitly allowed (reentrancy flags)
  - [x] require explicit “allow nested tool runs” permission for hooks that can `RunTool`
- [x] Define how effects are applied to pipeline state (tool input/output, permissions updates, transcript injections) with an audit trail.
- [x] Define how to surface “why a hook blocked” in a portable UX (no reliance on stderr formatting).
- [x] Define a structured “blocking error” payload (reason code + message + source hook identity) for consistent rendering across UI adapters.

9.4 Hook config sources, precedence, and policy gating (portable)
- [x] Define hook sources: settings hooks, plugin hooks (if supported), session hooks (runtime-injected).
- [x] Define precedence/merging rules across sources, including managed-only policy gating (allowManagedHooksOnly).
- [x] Define global hook disable semantics (`disableAllHooks`) and its precedence vs policy-managed hooks (fail-closed vs allow policy hooks; must be explicit and tested).
- [x] Define workspace trust gating requirements for hooks (legacy gates hook execution based on trust) and how trust is established on each host.
- [x] Define plugin hook loading constraints (directory scanning on filesystem hosts only; explicit “unsupported on mobile/web” behavior).
- [x] Define how session hooks are stored in app/session state and cleared at session end (parity with legacy cleanup).
- [x] Define how hook configuration changes are detected and surfaced to UI (diff report similar to legacy “hooks configuration changed” messaging).

9.5 Legacy hook migration strategy (compatibility without shell dependence)
- [x] Define a mapping strategy from legacy hook types:
  - [x] `command` (shell) → new declarative workflows or tool calls (no shell)
  - [x] `prompt` → `RunModelCheck` equivalent with structured `{ ok, reason }` output
  - [x] `agent` → background agent task with explicit structured output contract
- [x] Define a compatibility linter that flags legacy hooks that cannot be migrated automatically.
- [x] Define a staged migration for users: warnings, auto-conversion where safe, opt-in compatibility mode where needed.
- [x] ⚠️ Do not promise full fidelity for shell hooks on mobile/web; define explicit deprecation/fallback messaging.

9.6 Hook matching algorithm spec (deterministic selection)
- [x] Define how match queries are constructed per event (tool hooks match on tool name; notification hooks match on type; other events may match all).
- [x] Define matcher evaluation semantics (regex compilation failures, wildcard matching rules, OR-pattern parsing) and required error reporting.
- [x] Define hook identity/dedup keys and explicitly document which hook types are deduped and which are not (parity with legacy where required).
- [x] Define the final execution order rules across merged sources (stable sort: source precedence → matcher order → hook order).
- [x] Define canonical matching inputs per event type (normalized strings/fields) and prohibit matching against raw, potentially sensitive payloads by default.
- [x] Define regex safety constraints for portability:
  - [x] require a deterministic “regex compile” stage at config load time (never compile on the hot path)
  - [x] define behavior when regex features are unsupported on a host (reject with actionable diagnostics vs degrade to literal)
  - [x] define protection against catastrophic backtracking (allowed regex subset, timeout budget, or safe-regex engine decision gate)
- [x] Define matcher caching rules (compiled patterns cached by hookId + definitionVersion) and invalidation on config changes.
- [x] Define performance invariants and testable limits:
  - [x] max matchers evaluated per event
  - [x] max hooks executed per event
  - [x] deterministic early-exit rules when a blocking effect occurs (what still runs, what is skipped)
- [x] Add golden tests for matching determinism:
  - [x] same config produces identical matched-hook lists across Node/web/RN-like adapters
  - [x] invalid matcher errors include hook source attribution and do not change unrelated hook ordering

9.7 Model-driven hooks parity (prompt hooks and agent hooks without shell)
- [x] Define a portable “model check” hook type that requires structured output (boolean + optional reason) and runs with explicit token/thinking limits.
- [x] Define how model-check hook prompts are templated (argument injection parity with legacy `$ARGUMENTS` behavior) without allowing arbitrary code execution.
- [x] Define a portable “hook agent” task type that:
  - [x] runs non-interactively
  - [x] has a max-turn limit
  - [x] must produce a structured terminal output event (explicit contract)
- [x] Define initial max-turn parity targets for hook agents (start with legacy 50-turn hard guard) and require explicit ADR + benchmarks before changing defaults.
- [x] Define how hook agents are permitted to call tools (explicitly set permission mode, inject only the minimum allow rules required for their operation).

9.8 Long-running hook parity (legacy “async hook protocol” replacement)
- [x] Define how hooks can “hand off” long-running work without subprocesses (spawn a background task under supervision and return a short-lived effect immediately).
- [x] Define identity and lifecycle for background hook tasks (IDs, progress events, cancellation, persistence policy).
- [x] Define how hook background tasks stream feedback to UI without relying on stdout/stderr protocols.

9.9 Legacy “async hook stdout JSON” protocol mapping (explicit replacement)
- [x] Document the legacy contract precisely (from the encyclopedia) as a behavior-spec artifact:
  - [x] hooks that emit initial stdout JSON `{ async: true, asyncTimeout?: number }` are treated as “accepted” and continue in background
  - [x] partial stdout parsing heuristics and failure modes (parse once `}` appears; ignore invalid JSON; treat plain text as non-async)
  - [x] cancellation behavior (“Hook cancelled”) and early-stdin-close behavior
- [x] Specify `asyncTimeout` semantics precisely (default when omitted, max/min clamps, and what happens on timeout: cancel task + emit stop/diagnostic events).
- [x] Define the v3 replacement contract as typed effects/events (no stdout parsing):
  - [x] hook returns `StartBackgroundTask` effect with optional timeout/budget
  - [x] engine emits `HookBackgroundTaskStarted` with stable task id + attribution to hook identity
  - [x] background hook task streams progress via engine events, not stdout/stderr
- [x] Define compatibility behavior for migrated legacy hooks:
  - [x] command hooks are not executed; they must convert to declarative actions or be blocked with an actionable migration diagnostic
  - [x] prompt/agent hooks map to `RunModelCheck` / background agent tasks with explicit limits
- [x] Add regression tests that replay the legacy async-hook corpus and assert that v3 produces equivalent “async accepted vs blocking” outcomes (using the new event surface).

9.10 Hook effect interpreter (deterministic evaluation, defense-in-depth)
- [x] Define an “effect interpreter” layer that:
  - [x] validates effects against schema and current event type
  - [x] enforces capability/permission constraints for effects that request IO/tool runs
  - [x] resolves conflicts deterministically (merge, first-win, or reject)
- [x] Define a strict rule: hook effects cannot mutate engine state directly; they only request changes via typed effects applied by the interpreter.
- [x] Define per-effect audit events (requested → allowed/denied → applied) with redaction rules and source attribution.
- [x] Add a conformance suite: for every effect type, verify deterministic outcomes under different ordering/cancellation conditions.

---

***Phase 10: MCP Integration (Endpoint vs Direct, Mobile-Safe, Streamed)***

Why this phase exists: MCP must work across platforms and integrate with tools, permissions, and elicitation without assuming local state files, raw sockets, or separate CLI processes.

Risks mitigated: inconsistent MCP behavior across hosts, double-telemetry, and fragile connection logic.

Dependencies: Phase 4 network abstraction, Phase 8 tool pipeline, Phase 5 elicitation queue model.

10.1 MCP client core abstractions (transport-agnostic)
- [x] Define MCP concepts in the engine:
  - [x] server registry/config model
  - [x] connection lifecycle and error taxonomy (connection failed, handshake timeout, protocol error)
  - [x] tool/resource enumeration and caching
- [x] Define a transport interface that can support:
  - [x] HTTP endpoint mode (`/mcp` style requests)
  - [x] direct connection mode (only where host permits; may be absent on mobile/web)
- [x] Define streaming semantics for MCP tool invocation results (chunked responses, progress, cancellations).
- [x] Define backpressure rules for MCP streaming (bounded buffering, what happens when UI cannot keep up) and require transports to surface “consumer slow” signals.
- [x] Define per-request correlation fields (sessionId, taskId, toolRunId, serverId) required on every MCP request/response so logs and diagnostics can be joined without inspecting payloads.
- [x] Define a canonical MCP request/response envelope model in core (validated and versioned) so transports are dumb pipes.
- [x] Define schema validation points (before send, after receive) and error mapping to engine error taxonomy.
- [x] Define reconnection and retry policy contracts:
  - [x] which failures are retryable (DNS, transient network, 5xx) vs not (auth, protocol)
  - [x] how retries interact with cancellation/timeouts
  - [x] how “in-flight streaming tool call” is treated on reconnect (fail-fast vs resume if protocol supports)

10.2 Endpoint mode (mobile-first)
- [x] Define endpoint discovery inputs (explicit config, cached config, environment/host-provided config) without assuming filesystem.
- [x] Define endpoint config caching strategy (secure storage keying, TTL, invalidation on auth changes).
- [x] Define endpoint auth model (bearer key handling) and storage requirements (secure storage on mobile).
- [x] Define auth rotation/expiry handling:
  - [x] token refresh trigger points (401 responses, explicit user action, policy update)
  - [x] safe in-flight request handling on auth change (cancel vs allow completion)
  - [x] cache invalidation rules for endpoint configs tied to auth identity
- [x] Define endpoint allow/deny gates (policy-controlled) and failure messaging when endpoint config is missing.
- [x] Define endpoint timeouts (default and per-request override) and ensure they are enforced via AbortSignal, not platform-specific timers.
- [x] Define telemetry behavior parity: when endpoint mode is used, avoid double-logging if the upstream session logs centrally.
- [x] Define “warn once” behavior parity for missing endpoint config and endpoint fallback selection, keyed per session/workspace.
- [x] Define endpoint-mode concurrency limits (max in-flight MCP calls per server and globally) and their integration with the runtime’s concurrency limiters.

10.3 Direct mode (host-dependent; do not assume)
- [x] Define direct mode prerequisites (host must provide transport; may rely on sockets or other mechanisms).
- [x] Define direct-mode authentication posture (if applicable):
  - [x] whether auth is supported/required per host
  - [x] where credentials live (secure storage) and how they are supplied to transports
  - [x] explicit prohibition on embedding secrets in any “state file” discovery artifact
- [x] Define direct mode server config normalization (resolve server names, normalized names mapping).
- [x] Define how direct mode discovers server configs/resources (replacement for legacy “state file” artifacts) in a portable way (host-provided registry, explicit discovery calls).
- [x] Define safe fallback rules: if direct mode is not available or fails, fall back to endpoint mode when allowed.
- [x] Define direct mode caching behavior (resources/tools snapshot) without relying on “state file” artifacts.

10.4 MCP tool invocation integration (permissions + hooks + tools)
- [x] Represent each MCP tool as a tool in the tool registry with:
  - [x] namespacing (`mcp:<server>/<tool>`)
  - [x] permission category mapping (group approvals, per-server rules)
  - [x] streaming output and structured result
- [x] Define how PreTool/PostTool hooks can observe and modify MCP tool flows (parity with legacy updatedMCPToolOutput behavior).
- [x] Define how to surface MCP connection status and errors in the app/session state for UI adapters.
- [x] Define a per-server connection pool policy (reuse vs reconnect) and how it interacts with cancellation and timeouts.

10.5 Elicitation/ask-user flow (portable)
- [x] Define an elicitation request/response protocol that is UI-agnostic and works in RN/web/CLI.
- [x] Define queueing/cancellation rules for elicitation prompts.
- [x] Define how elicitation interacts with worker/leader permission models (when a background task needs user input).

10.6 MCP CLI parity and migration considerations (no separate process)
- [x] Define how “mcp-cli” style operations are exposed in v3 (engine command surface) without launching a separate CLI process.
- [x] Define how endpoint vs direct mode selection is surfaced to users (diagnostics, warnings) in a portable UX.
- [x] Define how MCP CLI analytics/telemetry wrappers behave in endpoint mode vs non-endpoint mode (parity with legacy “skip telemetry in endpoint mode” behavior).

10.7 Mobile-safe transport constraints (explicit, testable)
- [x] Define a transport capability matrix: what is supported on RN/web/Node (fetch streaming, SSE, WebSocket) and what is optional.
- [x] Define fallback behaviors when streaming is unavailable (buffered responses with progress heuristics; explicit UI messaging).
- [x] Define liveness and keepalive requirements for long-lived transports:
  - [x] heartbeat/keepalive intervals (policy-configurable, bounded)
  - [x] idle timeout behavior (close vs keep open) per host
  - [x] deterministic “connection considered dead” thresholds for reconnection logic
- [x] Define resume semantics where feasible:
  - [x] resume token/cursor fields carried in envelopes
  - [x] explicit behavior when resume is not supported (fail-fast with retry guidance)
- [x] Define web-specific constraints explicitly:
  - [x] CORS and credential mode requirements for endpoint mode
  - [x] prohibition on assuming raw sockets or localhost reachability in browsers
- [x] Define mobile lifecycle constraints explicitly:
  - [x] what happens to in-flight streaming calls on background (cancel vs pause) per platform policy
  - [x] required UI messaging when backgrounding cancels MCP tool calls
- [x] Add conformance tests that simulate:
  - [x] endpoint config missing → warning + fallback behavior
  - [x] connection failed → typed error + retry/backoff rules
  - [x] cancelled requests → no leaked tasks/connections

10.8 MCP CLI behavior parity spec (legacy flags, warnings, timeouts)
- [x] Specify the “feature gate” inputs for MCP CLI parity on hosts that support it (CLI/desktop):
  - [x] experimental enable flag (legacy `ENABLE_EXPERIMENTAL_MCP_CLI`)
  - [x] endpoint enable/disable toggle (legacy `ENABLE_MCP_CLI_ENDPOINT`)
  - [x] tool timeout default and override (legacy `MCP_TOOL_TIMEOUT`, defaulting to “effectively infinite”)
- [x] Define how these legacy env-driven controls map to v3:
  - [x] Node/CLI host: env → host adapter config → engine settings overlay (explicit, typed)
  - [x] Mobile/web: env controls not available; settings/policy equivalents only
- [x] Define “warn once” parity requirements for endpoint mode selection (missing endpoint config triggers a single warning + fallback).
- [x] Define error taxonomy parity for MCP CLI commands (connection failed vs protocol error vs config missing) and ensure stable exit codes for CLI mode.

10.9 State-file/direct-mode replacement strategy (no separate processes, but external clients exist)
- [x] Decide what v3 supports for “external client connects to running session” scenarios (desktop extension, automation):
  - [x] HTTP endpoint exposed by host adapter (preferred, mobile-safe semantics)
  - [x] host-specific IPC bridge (desktop-only)
- [x] If a “state file” exists for external clients, define it as an optional host adapter artifact:
  - [x] strict schema (versioned; signed/hashed if needed)
  - [x] explicit lifecycle (create, rotate, delete on shutdown)
  - [x] security model (least privilege; no secrets in plaintext)
- [x] Define how name normalization and server resolution works without a state-file global namespace (server IDs stable, display names mutable).

10.10 MCP server registry persistence and trust model (portable)
- [x] Define how MCP server configs are stored without assuming a writable filesystem:
  - [x] storage-backed registry (per-app and per-workspace partitions)
  - [x] policy-managed “managed servers” that cannot be edited by the user
  - [x] migration mapping from legacy config locations (CLI files) into the registry schema
- [x] Define a trust model for MCP servers:
  - [x] trust level per server (trusted/untrusted/managed)
  - [x] default permission posture per trust level (deny-by-default for untrusted; explicit prompts)
  - [x] UI-required warnings when enabling untrusted servers (portable, not CLI-specific)
- [x] Define how server removal/disablement affects:
  - [x] cached tool/resource schemas (invalidate deterministically)
  - [x] in-flight requests (cancel vs allow completion; must be explicit and tested)

10.11 MCP schema caching, invalidation, and drift handling
- [x] Define caching policy for MCP tool/resource manifests (TTL, invalidation on reconnect, invalidation on auth rotation).
- [x] Define “schema drift” handling when a server changes tool schemas:
  - [x] detect changes (hash of manifest) and emit diagnostic event with server attribution
  - [x] invalidate permission allowlists that refer to outdated schemas (force re-approval if risk category changes)
  - [x] require re-validation of any persisted “tool allow rules” that include schema-derived signatures
- [x] Add conformance tests that simulate:
  - [x] schema changes mid-session
  - [x] cached stale schema causing validation failure
  - [x] recovery path (refresh + re-run) without losing determinism in event sequencing

10.12 MCP streaming normalization and truncation policies (portable UX parity)
- [x] Define normalization rules that map transport-specific streaming into the internal `ToolStreamEvent` model:
  - [x] stable chunk aggregation rules (do not rely on arbitrary packet segmentation)
  - [x] deterministic progress/coalescing behavior
  - [x] final counters (bytes/chunks/duration) derived from monotonic clock
- [x] Define truncation rules for overly-large MCP outputs (deterministic thresholds; always signal truncation in metadata; never silently drop).
- [x] Define a “streaming unavailable” fallback contract:
  - [x] buffered responses with bounded memory usage
  - [x] UI messaging that explains reduced fidelity
  - [x] test fixtures that assert identical behavior across hosts lacking fetch streaming

---

***Phase 11: Background Agents and Long-Running Tasks (Async, Budgeted, Portable)***

Why this phase exists: legacy includes multiple “background-ish” agents (Magic Docs, classifier, session memory, prompt suggestion) and long-running operations. The rewrite must run them in the main runtime cooperatively and portably.

Risks mitigated: runaway resource usage, unpredictable concurrency, and mobile lifecycle breakage.

Dependencies: Phase 3 scheduler, Phase 5 state model, Phase 8 tool pipeline.

11.1 Agent/task model (portable, explicit)
- [ ] Define what qualifies as a “background agent” vs a “foreground tool run”.
- [ ] Define the agent lifecycle (scheduled, running, awaiting input, paused, completed, failed, cancelled).
- [ ] Define budgeting for agents (max turns, timeouts, token budgets, concurrency).
- [ ] Define how agents emit progress and results (typed events, not console output).
- [ ] Define how agent outputs are persisted (summary-only vs full trace) with privacy constraints.

11.2 Built-in background subsystems parity plan
- [ ] Define an implementation plan for each legacy background subsystem:
  - [ ] Magic Docs (file scanning, prompt template, edit-only behavior)
  - [ ] Session quality classifier (telemetry signals; gated execution)
  - [ ] Session memory (notes file, checkpointing, compaction preference)
  - [ ] Prompt suggestion (forked query, suppression heuristics)
- [ ] For each subsystem, define:
  - [ ] feature gates and config knobs
  - [ ] triggers (time-based, event-based)
  - [ ] required capabilities (filesystem optional, storage required, network required)
  - [ ] safe behavior on mobile/web when capabilities are absent
- [ ] For Magic Docs specifically, define:
  - [ ] how files are discovered (glob rules, marker parsing) without relying on ripgrep subprocesses
  - [ ] edit-only constraints and how edits are represented/applied in a portable way
  - [ ] a concurrency policy (one doc at a time vs batch) and cancellation semantics
- [ ] For session memory specifically, define:
  - [ ] a notes schema (versioned) and storage location per host
  - [ ] checkpoint identity semantics and how checkpoints map to transcript entries
  - [ ] compaction integration: when notes-based compaction is attempted vs fallback summarization
- [ ] For prompt suggestion specifically, define:
  - [ ] suppression heuristics as a pure function with golden tests
  - [ ] a rate limit (min time between suggestions) and invalidation rules (new user prompt clears prior suggestion)

11.3 Long-running task coordination and cancellation
- [ ] Define how long-running tasks are registered and surfaced in state (task registry similar to legacy `tasks`).
- [ ] Define how tasks are resumed after restart (where supported) vs restarted cleanly.
- [ ] Define a durable “task record” schema for resumable tasks (task id, scope, last checkpoint, required capabilities, retry/backoff state) and explicitly mark which tasks may persist this record.
- [ ] Define cancellation propagation rules for nested tasks (agent→tool, tool→MCP call, hook→tool).
- [ ] Define a safe “stop” path that can run stop hooks/agents without blocking app exit indefinitely.
- [ ] Define a “task summary” payload surfaced to UI (what it’s doing, last progress, next action) without exposing sensitive inputs.

11.4 Platform lifecycle integration (mobile/web)
- [ ] Define how background tasks respond to:
  - [ ] app background/foreground transitions
  - [ ] network connectivity changes
  - [ ] memory pressure signals (if host provides)
- [ ] Define which tasks are allowed to run in background on iOS and which must pause/cancel.
- [ ] Define a consistent user experience when tasks pause/resume (notifications, banners, state indicators).
- [ ] Define a “background-safe” whitelist of operations (e.g., local bookkeeping, in-memory summarization) vs forbidden operations (network calls) when the host signals background constraints.

11.5 Optional worker-style isolation (without OS processes)
- [ ] Define a worker abstraction that can run tasks in:
  - [ ] Web Workers (web)
  - [ ] dedicated JS runtimes/native modules (mobile/desktop) if available
  - [ ] main thread fallback (portable baseline)
- [ ] Define message-passing contracts and serialization constraints (no functions, transferable payloads where possible).
- [ ] Define worker capability injection rules:
  - [ ] worker gets a strictly filtered capability subset (no direct access to UI, secrets, or unrestricted network)
  - [ ] permission/policy enforcement stays authoritative in the main runtime (worker requests are mediated)
  - [ ] worker cannot mint new permissions or bypass approval queues
- [ ] Define deterministic worker scheduling expectations:
  - [ ] worker tasks still contribute to the same logical budget accounting (time/event budgets)
  - [ ] event ordering between worker-produced events and main-thread events is explicit and testable (sequence number merge rules)
  - [ ] deterministic replay mode can replace the worker with an in-thread simulation adapter
- [ ] Define crash/isolation semantics:
  - [ ] worker crash produces typed failure events tied to owning task scope
  - [ ] restart policy is explicit (never auto-retry non-idempotent operations)
  - [ ] memory/CPU caps are enforced where the host can provide them; otherwise fail safe with conservative limits
- [ ] ⚠️ Do not decide final isolation tech stack yet; define the abstraction boundary and required guarantees.

11.6 Supervision trees and task ownership boundaries
- [ ] Define a supervision tree rooted at the engine instance (session tasks, background agents, MCP connections) and how shutdown cascades.
- [ ] Define ownership rules: which tasks are owned by a session vs app-global (and thus survive session end).
- [ ] Define how to detect and handle leaked tasks (tasks still running after session end) as a diagnostic failure.

11.7 Background task persistence policy (what survives restart)
- [ ] Decide which background tasks persist their internal state (memory update in progress) vs are always restarted (prompt suggestion).
- [ ] Define a persistence format for “agent checkpoints” if needed (minimal metadata; never store raw model thoughts).
- [ ] Define rehydration semantics (resume vs restart) and how UI reflects continuity.

11.8 Resource control and overload behavior
- [ ] Define a global “background budget” (CPU time per minute, max concurrent background tasks) and enforce via scheduler limits.
- [ ] Define overload behavior: when system is busy (user actively interacting), background tasks should defer/yield aggressively.
- [ ] Define how to surface overload to telemetry and diagnostics (dropped tasks, deferred runs).

11.9 Teleport/remote sessions and “remote tasks” parity (legacy feature extraction)
- [ ] Define the v3 concept model for “remote session” vs “local workspace session”:
  - [ ] identifiers (remote session id vs local session id)
  - [ ] linking/unlinking a remote session to a workspace (`WorkspaceId`)
  - [ ] what state is authoritative (remote transcript vs local cached view)
- [ ] Define CLI parity targets for `--remote` and `--teleport` behaviors:
  - [ ] remote session creation prints a resume link + a “resume command” hint (UI adapter responsibility; engine provides the data)
  - [ ] teleport resume validates workspace requirements (repo identity) before applying remote state locally
  - [ ] interactive “resolve teleport errors” flow (clean repo / stash path) is expressed as deterministic prompts + tool invocations, not shell
- [ ] Define dependencies on git tooling (Phase 8.10):
  - [ ] “repo cleanliness” detection
  - [ ] optional stash/unstash flows
  - [ ] branch detection for remote session metadata
- [ ] Define “RemoteAgentTask” parity as a background task type:
  - [ ] surfaced in task registry and attachments/progress artifacts
  - [ ] resumable state model (if required) without relying on subprocess state
- [ ] Add regression fixtures for teleport flows (clean repo, dirty repo requiring stash, wrong workspace) with deterministic expected event sequences.

---

***Phase 12: Host Adapters and UI Integration (CLI, iOS, Web, Desktop)***

Why this phase exists: the engine must be usable via thin adapters across platforms. UI and host code must not leak into core, but must provide required capabilities and render engine events.

Risks mitigated: reintroducing platform coupling and implementing features twice.

Dependencies: Phase 4 capability interfaces and Phase 5 store/event bus.

12.1 Node/CLI host adapter (migration-first)
- [x] Define a CLI adapter that maps:
  - [x] stdin user input → engine input events
  - [x] engine output events → terminal rendering
  - [x] permission prompts/elicitation → interactive UI overlays
- [x] Define how the CLI adapter provides capabilities (filesystem, network, clipboard) while respecting policy.
- [x] Define how the CLI adapter handles terminal-specific UX (Ink-like rendering) without embedding UI logic in core.
- [x] Implement engine↔CLI wiring (minimum viable end-to-end loop):
  - [x] implement a concrete `EngineFactory` (wire runtime kernel + event bus + store + host lifecycle)
  - [x] add a Node/CLI entrypoint that:
    - [x] constructs node host capabilities (`platform/node/*`)
    - [x] starts the engine + subscribes to engine events
    - [x] forwards stdin/input + signals to `EngineCommand`/`HostEvent`
    - [x] cleanly shuts down on stop/exit (flush snapshots, close subscriptions)
- [ ] Implement real CLI UI components (replace placeholders in `src/ui/cli/*`):
  - [x] prompt screen + transcript screen (incl. `ctrl+o` transcript toggle parity from `CLI_ENCYCLOPEDIA.md`)
  - [x] overlay rendering for the canonical overlays (`message-selector`, `sandbox-permission`, `tool-permission`, `worker-permission`, `worker-sandbox-permission`, `elicitation`, `cost`, `ide-onboarding`)
  - [x] render transcript semantics from core state/rendering contracts (no core-side terminal formatting)
 - [x] Add CLI integration sanity tests:
  - [x] start CLI in a harness, feed deterministic input, assert stable event stream + state snapshot
  - [x] `tests/phase12-cli-entrypoint.test.ts` asserts `bun src/cli.ts` supports `--version`, `--help`, `--print-frame`, `-p` (non-interactive prompt → model output via mocked Anthropic Messages API), gated `--mcp-cli`, and `--ripgrep`.
  - [x] `-p` auth invariant (avoid rediscovering this):
    - [x] Claude Code OAuth session tokens must be treated as **Claude Code-scoped** credentials and require Claude Code-style request shape (UA + `anthropic-beta` values + stable `/v1/messages` endpoint + OAuth-specific system block).
    - [x] Misclassifying a Claude token as an API key (sending `x-api-key`) or using a non-Claude request shape can produce `400 invalid_request_error: "This credential is only authorized for use with Claude Code..."`.
    - [x] Do not enable refresh/OAuth→API-key exchange yet; keep those code paths gated behind explicit env flags until validated.
  - [x] `tests/phase12-cli-overlays.test.ts` asserts overlay rendering + basic interactive resolution (tool permission + elicitation).
  - [x] golden tests for overlay precedence (already specified) as actually rendered (semantic output)
- [x] Enforce the “no subprocess” constraint in the CLI host adapter:
  - [x] no `child_process` usage for tool execution, hooks, or MCP helpers
  - [x] any legacy “spawn helpers” are replaced by in-process engines (`search.grep`, `vcs.git`) or explicit remote calls
  - [x] add a host-level runtime guard that fails fast if a subprocess API is reached (dev/test builds)

12.2 React Native (iOS) host adapter (primary product target)
- [ ] Define RN capability implementations (storage, network, crypto/uuid, timers) using RN-safe primitives.
- [ ] Define filesystem capability availability for RN (often limited); document explicit restrictions and UX behavior.
- [ ] Define how engine events map to RN screens/components (view models/selectors).
- [ ] Define how permission prompts and elicitation render in RN (modal flows, background-safe).

12.3 Web host adapter (where possible)
- [ ] Define web storage capability (IndexedDB/localStorage) and limits.
- [ ] Define web filesystem stance (likely absent; rely on file-picker APIs where supported; capability-gated).
- [ ] Define how engine events map to web UI components and routing.

12.4 Desktop host adapter (optional power features)
- [ ] Define desktop-only optional capabilities (shell-like execution, broader filesystem).
- [ ] Define explicit feature gating so iOS/web do not depend on desktop-only features.
- [ ] Define a remote-execution bridge option (mobile/web clients invoking desktop host securely) as a future iteration candidate.
- [ ] Define a desktop stance that remains compliant with “no subprocess”:
  - [ ] prefer embedded libraries/WASM for “power tools” (git/search)
  - [ ] if remote execution is supported, require explicit install + pairing + policy approval (never an implicit fallback)

12.5 Cross-host capability contract tests
- [ ] Define a capability conformance test suite that each host adapter must pass (behavioral, not implementation).
- [ ] Define how adapters report capability availability to UI (for feature discovery and graceful degradation).

12.6 Chrome native host / browser-extension bridge (desktop host capability)
- [x] Specify the legacy Chrome native host contract as a v3 host capability:
  - [x] length-prefixed message framing
  - [x] JSON message envelope schema (versioned)
  - [x] max message size and backpressure behavior
- [ ] Define the v3 equivalent “extension bridge” API surface as engine commands/events (no direct engine internals exposed):
  - [ ] request/response correlation ids
  - [ ] cancellation semantics
  - [ ] permission gating (extension cannot bypass tool permissions)
- [ ] Define security constraints:
  - [ ] origin/app identity checks (host responsibility)
  - [ ] rate limiting + payload size limits
  - [ ] redaction rules (never return secrets)
- [ ] Add contract tests using recorded framing fixtures (valid/invalid length prefixes, partial reads, oversized payloads).

12.7 Local endpoint exposure for external clients (optional, policy-gated)
- [ ] Define when the desktop/CLI host exposes an HTTP endpoint for external tooling (extension, automation) and how it is discovered.
- [ ] Define endpoint authentication/authorization requirements (short-lived token in secure storage; per-workspace scoping).
- [ ] Define endpoint-mode telemetry dedupe behavior (align with Phase 10 endpoint semantics).
- [ ] Define shutdown behavior (endpoint tear-down, token invalidation) to avoid stale external access.

---

***Phase 13: Observability, Logging, and Telemetry Boundaries***

Why this phase exists: the engine must be debuggable across platforms without leaking sensitive data; telemetry must respect endpoint-mode deduplication and policy constraints.

Risks mitigated: privacy regressions, untraceable failures, and platform-specific logging hacks.

Dependencies: Phase 3 task model (spans), Phase 5 state events.

13.1 Structured logging (portable)
- [x] Define a structured log event schema (timestamp, subsystem, severity, correlation IDs, redaction flags).
- [x] Define log sinks per host (console, file, remote), but keep core log API sink-agnostic.
- [x] Define redaction and sampling rules for high-volume events (tool streaming, MCP chunks).
- [x] Define sink backpressure and drop behavior (bounded queues, drop counters) so logging cannot OOM the app under high-volume streams.
- [x] Define a “log privacy tier” taxonomy (e.g., `public`, `internal`, `sensitive`) that is enforced at serialization boundaries and test-linted.

13.2 Tracing and correlation (tasks, tools, hooks, MCP)
- [x] Define correlation IDs that tie together:
  - [x] a user prompt
  - [x] tool invocations
  - [x] hook executions
  - [x] MCP requests
  - [x] background agents
- [x] Define span lifecycle events from the scheduler (start/stop/cancel) for performance diagnosis.
- [x] Define how tracing data is stored locally for debugging (bounded buffers, opt-in persistence).

13.3 Telemetry boundaries and policy compliance
- [x] Define what telemetry events exist and their payload constraints (no secrets, no raw file contents).
- [x] Define policy controls that can disable telemetry or force managed endpoints.
- [x] Define endpoint-mode telemetry behavior (avoid double logging when upstream session logs centrally).
- [x] Define a deterministic “telemetry dedupe” contract for endpoint mode:
  - [x] which event classes are suppressed locally vs still emitted (crash-only, health signals)
  - [x] how suppression is attributed in diagnostics (so support can tell why telemetry is missing)
  - [x] how dedupe interacts with shadow-mode diff logging during migration (Phase 15.3)

13.4 “Doctor” and diagnostics (portable UX)
- [x] Define a diagnostics report that can run on all hosts (capability availability, settings health, network status, MCP connectivity).
- [x] Define diagnostics output formats (human UI + machine JSON for support).

13.5 Diagnostic bundle export (supportable, privacy-preserving)
- [x] Define a “diagnostic bundle” artifact that can be generated on all hosts and shared with support:
  - [x] engine version/build info
  - [x] capability availability matrix
  - [x] effective settings snapshot (redacted)
  - [x] recent event log excerpt (bounded; redacted; hashed stream transcripts)
  - [x] MCP endpoint/direct mode status and recent errors (redacted)
- [x] Define strict redaction policy for bundles (never include secret storage, raw file contents by default).
- [x] Define bundle size limits and truncation rules (deterministic; reported in the bundle metadata).
- [x] Add an automated “bundle lint” test that scans for disallowed fields/strings.

13.6 Telemetry transport and sampling (host-owned, engine-specified)
- [x] Define a minimal telemetry interface that the host implements (enqueue event, flush, drop policy reporting).
- [x] Define sampling strategies for high-volume channels (tool streaming, scheduler spans) and require determinism in tests (seeded sampling).
- [x] Define offline buffering rules (mobile) and policy-driven disablement (fail-closed).
- [x] Define telemetry correlation with diagnostic bundles (shared correlation id without sharing sensitive content).

---

***Phase 14: Testing Strategy (Unit, Integration, Cross-Platform, Regression)***

Why this phase exists: a portable async engine requires deterministic tests; migration requires regression harnesses to prevent behavioral drift.

Risks mitigated: platform-only bugs, nondeterministic flakiness, and missed security regressions.

Dependencies: Phase 3 determinism abstractions and Phase 2 module boundaries.

14.1 Unit testing the portable core (pure logic)
- [x] Define unit-test coverage goals per core module (settings merge, permission evaluation, hook matching, tool pipeline orchestration).
- [x] Define test doubles for host capabilities (storage, network, filesystem) that are deterministic and replayable.
- [x] Define golden tests for settings precedence and permission rule evaluation (match legacy semantics until explicitly changed).

14.2 Scheduler and cancellation tests (deterministic time)
- [x] Implement a test clock and deterministic scheduler harness to simulate timeouts and task interleavings.
- [x] Add property-based tests for cancellation propagation and queue fairness invariants.
- [x] Add regression tests for edge cases (cancel during streaming, timeout vs user cancel race, nested task cancellation).

14.3 Integration tests (engine + host adapter)
- [x] Define integration tests that run the engine with:
  - [x] Node host adapter
  - [x] web-like host adapter (fetch mocked, storage mocked)
  - [x] RN-like host adapter (capability stubs)
- [x] Define contract tests for UI prompt flows (permission prompts, elicitation queue) using event sequences.
- [x] Add cross-runtime integration smoke tests that exercise the same golden session on:
  - [x] Node JS runtime (CI baseline)
  - [x] web runtime (headless browser or web-like runner)
  - [x] RN runtime (Hermes/JSC) in a simulator harness (later phase if CI cost is high)
- [x] Define a “portable transport simulator” for MCP endpoint mode (no real network) so retry/backoff/backpressure can be validated deterministically.

14.4 Cross-platform CI matrix (do not overcommit yet)
- [x] Define a CI matrix that runs core tests in Node and builds for web/RN without executing device tests initially.
- [x] Define a later iteration plan for device-level RN tests (detox/e2e) and web e2e tests.
- [x] ⚠️ Do not choose final e2e tooling yet; define requirements and evaluate later.
- [x] Define minimum RN test requirements before launch:
  - [x] engine boots under Hermes with “minimal mobile-safe capabilities” conformance suite
  - [x] background/foreground lifecycle events are delivered and cancel/pause tasks correctly
  - [x] storage quota and secure-storage failure paths are exercised with deterministic fakes

14.5 Legacy regression harness (migration-critical)
- [x] Define a harness that can replay recorded user interactions and compare:
  - [x] permission decisions
  - [x] settings merge outputs
  - [x] hook selection outcomes
  - [x] MCP mode selection behaviors
- [x] Define a corpus of “realistic sessions” to test (sanitized) and criteria for pass/fail diffs.

14.6 Tool conformance tests (no-subprocess guarantees)
- [x] Add a conformance suite for the tool runner that asserts:
  - [x] no tool can access a capability it was not granted (attempted access produces a typed denial)
  - [x] cancellation terminates streams and releases concurrency permits
  - [x] tool output schema validation errors are surfaced consistently
- [x] Add conformance tests for the new tool tracks:
  - [x] `search.grep` correctness vs fixture expectations (ordering + match locations)
  - [ ] `vcs.git` read-only correctness on fixture repos (status/diff normalization)
  - [x] patch/apply-edits deterministic behavior across newline variants
- [x] Add a “no subprocess” enforcement test:
  - [x] static scan in CI for disallowed imports/APIs in core (`child_process`, `spawn`, `exec`, shell flags)
  - [x] runtime guard in dev/test hosts that throws if a subprocess API is invoked (host adapter only, not core)

14.7 Security, policy, and redaction tests (cross-platform invariants)
- [x] Add tests that assert redaction invariants for logs/telemetry/bundles (no secrets; no raw file contents by default).
- [x] Add tests for policy override explainability (every deny/force decision attributes a source + reasoning code).
- [x] Add tests for managed-only constraints (hooks/tools/telemetry) in “enterprise policy” fixtures.

---

***Phase 15: Migration Strategy from Existing CLI (Incremental Replacement)***

Why this phase exists: the rewrite must ship incrementally; migration must validate correctness while reducing risk to users.

Risks mitigated: big-bang rewrite failure, prolonged dual-maintenance, and unbounded behavior drift.

Dependencies: Phase 12 CLI adapter, Phase 6 settings compatibility, Phase 7 permissions parity.

15.1 Define migration stages and feature flags
- [x] Define a staged rollout plan (engine in library mode → new CLI adapter → RN/web hosts).
- [x] Define feature flags that allow partial subsystem cutover (settings, permissions, hooks, MCP) independently.
- [x] Define data migration flags (settings schema versioning, session log format migration).
- [x] Define a “compatibility mode” flag that pins legacy semantics (settings precedence, permission evaluation) while allowing internal refactors.
- [x] Define an “engine-only” diagnostic mode that exercises core subsystems without invoking model calls (for CI and fast smoke tests).

15.2 Build shims for legacy compatibility (minimize coupling)
- [x] Define a compatibility layer that can read legacy settings files and produce v3 effective settings snapshots.
- [x] Define a compatibility layer for legacy permission rules (string syntax preserved) and persistence destinations.
- [x] Define a compatibility layer for legacy hook configs (migrate prompt/agent hooks; flag command hooks for redesign).
- [x] Define an MCP compatibility layer that supports endpoint mode first and provides direct mode only where supported.
- [x] Define a stable mapping from legacy tool identifiers to v3 tool IDs (including MCP tool namespacing) to preserve existing allow/deny rules where possible.

15.3 Shadow mode and diff-based validation
- [x] Implement a shadow evaluation mode where:
  - [x] legacy CLI computes a decision/output
  - [x] v3 engine computes the same decision/output
  - [x] diffs are recorded (not shown to users by default)
- [x] Define which diffs are allowed (benign formatting) vs must fail (permission behavior change, hook blocks).
- [x] Define opt-in telemetry for migration diffs (policy permitting) to prioritize fixes.
- [x] Define a “shadow mode safety rule”: shadow runs must never perform side effects twice (tools must be dry-run or simulated in shadow comparisons).
- [x] Define a set of deterministic comparison targets:
  - [x] permission decision behavior + reasoning code
  - [x] effective settings output (normalized)
  - [x] hook selection list and blocking outcomes
  - [x] MCP mode selection (endpoint vs direct)

15.4 User-facing migration UX (trust and transparency)
- [x] Define how to communicate feature unavailability on mobile/web (capability-gated explanations).
- [x] Define how to surface policy-managed limitations and their sources.
- [x] Define a rollback strategy for critical regressions (fall back to legacy behavior in CLI stage).

15.5 Cutover criteria and deprecation plan
- [x] Define minimum “parity bar” for CLI cutover (permissions, settings, MCP, core tools, hook system redesigned).
- [x] Define a deprecation plan for legacy hook command execution (timelines, automated linting, docs).
- [x] Define a post-cutover stabilization window and telemetry guardrails.

15.6 Incremental subsystem cutover order (explicit, testable milestones)
- [ ] Cut over settings merge + watcher semantics first (engine computes effective settings; legacy consumes them) and validate via golden tests.
- [ ] Cut over permission engine next (engine computes allow/deny/ask; legacy UI renders prompts) and validate with recorded session corpora.
- [ ] Cut over MCP endpoint mode integration next (engine handles MCP requests; legacy uses engine events) and validate with conformance tests.
- [ ] Cut over tool runner for a small safe tool subset (read-only tools) before enabling write/network tools.
- [ ] Cut over hooks engine last, after declarative hook schema migration tooling exists and users have a migration path.

15.7 Persisted data migration (sessions, caches, secrets)
- [x] Define a versioned on-disk/on-device format for session transcripts/logs and a migration path from legacy storage locations.
- [x] Define how to migrate cached MCP endpoint configs and normalize server names without breaking existing workflows.
- [x] Define how secrets are migrated into secure storage (and how to recover if migration fails mid-way).
- [x] Define rollback semantics for each data migration (ability to continue using legacy without data loss).

15.8 Rollout metrics and operational readiness
- [x] Define key operational metrics for rollout (crash rate, permission prompt frequency, MCP failures, hook block frequency, latency of tool runs).
- [x] Define guardrails that automatically disable risky subsystems on repeated failure (e.g., disable background agents if they crash repeatedly).
- [x] Define support artifacts (diagnostic bundle export) that do not leak sensitive data but allow issue triage.

15.9 Cutover of legacy sidecar entrypoints (`--mcp-cli`, `--ripgrep`)
- [x] Replace legacy `--ripgrep` with `search.grep` engine command:
  - [x] preserve CLI UX expectations (exit codes, output formatting) in the CLI adapter only
  - [x] remove any dependency on packaged binaries/subprocesses (WASM/TS only)
  - [ ] validate parity on fixture repos and large repos (performance gates)
- [x] Replace legacy `--mcp-cli` with engine commands (Phase 8.12 / Phase 10):
  - [x] preserve command surface (`servers`, `resources`, `read`, `grep`, `call`) as CLI adapter formatting over typed results
  - [x] preserve endpoint-mode telemetry dedupe and warn-once behaviors
  - [x] explicitly deprecate “state-file mode” unless required for external client interoperability (Phase 10.9)

15.10 Desktop extension / Chrome native host migration (if retained)
- [ ] Implement the v3 extension bridge behind a desktop-only host adapter capability (Phase 12.6).
- [ ] Add a migration compatibility layer that can speak the legacy message framing/envelope where required (versioned).
- [ ] Validate that extension-originated requests cannot bypass permissions/policy (deny-by-default on all tool/capability calls).

---

***Phase 16: Release Engineering, Packaging, and Distribution (Multi-Host)***

Why this phase exists: the rewrite spans multiple hosts (CLI, RN, web, desktop). Packaging must preserve portability constraints, avoid Node-only leakage, and support safe incremental rollout.

Risks mitigated: shipping a Node-only core by accident, breaking upgrades due to schema drift, and platform-specific regressions that only appear post-release.

Dependencies: Phase 2 packaging constraints, Phase 4 capability adapters, Phase 5/6 persistence schemas.

16.1 Build outputs and conditional exports (portable-by-default)
- [ ] Define required build artifacts:
  - [ ] `@engine/core` (portable core)
  - [ ] `@engine/platform-*` (host capability implementations)
  - [ ] `@engine/ui-*` (adapters)
- [ ] Define conditional export rules (e.g., `react-native`, `browser`, `node`) that prevent accidental import of host-only modules in portable bundles.
- [ ] Define a build-time “portable core purity” check (bundle analysis or type tests) that fails if Node-only dependencies are pulled into core.

16.2 Node/CLI distribution strategy (do not lock in, but define requirements)
- [ ] Define distribution requirements:
  - [ ] reproducible builds
  - [ ] minimal install size
  - [ ] zero runtime dependency on external binaries for core features (no packaged ripgrep binaries; WASM/TS only)
  - [ ] deterministic `--version`/`doctor` behaviors
- [ ] Define CLI compatibility requirements for flags that must remain stable during migration (including `--mcp-cli` and `--ripgrep` replacements).
- [ ] Define update/rollback semantics (pin to known-good engine versions; safe downgrade strategy for persisted data).

16.3 Mobile/web distribution (OTA constraints and persistence safety)
- [ ] Define how engine schema migrations interact with OTA updates (must not brick existing persisted state).
- [ ] Define a forward-compatibility contract for persisted documents (unknown fields preserved; migrations idempotent).
- [ ] Define offline-first constraints for mobile (policy cache, endpoint cache, session logs) and safe “resume after update” behavior.

16.4 Desktop distribution (optional host) and capability gating
- [ ] Define how desktop-only capabilities are packaged and versioned independently from core.
- [ ] Define signature/integrity requirements for desktop builds that expose local endpoints or extension bridges.

16.5 Release validation gates (pre-ship checklist)
- [ ] Require all conformance suites to pass (capabilities, tools, hooks, MCP).
- [ ] Require deterministic replay of the golden corpus on at least one host (Node) and schema validation on all hosts (web/RN builds).
- [ ] Require security scans (dependency vulnerabilities, disallowed APIs, secret scanning) as a release gate.

---

***Phase 17: Security Hardening and Compliance (Defense-in-Depth)***

Why this phase exists: removing subprocesses reduces some risk, but in-process tools, WASM, and external bridges (MCP, extension endpoints) introduce new attack surfaces.

Risks mitigated: capability escalation, supply-chain compromise, exfiltration via telemetry/logs, and policy bypass through host adapters.

Dependencies: Phase 7 permissions/policy, Phase 8 tool isolation, Phase 12 external bridges, Phase 13 redaction.

17.1 Supply-chain and dependency controls
- [ ] Define dependency policy for core vs host packages (allowed licenses, audit cadence, lockfile discipline).
- [ ] Define SBOM generation requirements and storage (per release artifact).
- [ ] Define “no dynamic code loading” policy for portable core (no `eval`, no remote JS).

17.2 WASM security posture (search/git engines)
- [ ] Define a WASM sandboxing posture:
  - [ ] memory limits and failure behavior
  - [ ] no host filesystem/network access from WASM modules except through explicit, filtered adapters
- [ ] Define provenance requirements for WASM modules (reproducible builds, checksums, version pinning).
- [ ] Add fuzz/robustness tests for WASM boundaries (malformed inputs, large inputs, cancellation mid-execution).

17.3 External interface hardening (MCP endpoints, local endpoints, extension bridge)
- [ ] Define authentication and authorization rules for any local endpoint (tokens scoped to workspace; expiration; rotation).
- [ ] Define rate limiting and abuse controls for external callers (max concurrent requests, max payload sizes).
- [ ] Define strict allowlists for which engine commands are exposed externally (deny-by-default).

17.4 Data handling and privacy enforcement
- [ ] Define “never log” fields across schemas and enforce at serialization boundaries.
- [ ] Define policy-managed redaction overrides (enterprise can increase redaction, never decrease it).
- [ ] Validate that diagnostic bundles and telemetry share only redacted/hardened forms of data (Phase 13.5/13.6).

17.5 Security regression suite
- [ ] Add adversarial tests:
  - [ ] prompt injection attempts to coerce tool escalation
  - [ ] malformed MCP server responses (schema violations)
  - [ ] extension bridge sending oversized/malformed frames
- [ ] Define security incident response hooks (kill switches via policy; feature gating) and verify they work on all hosts.

---

***Phase 18: Performance, Memory, and UX Responsiveness (Budgeted System)***

Why this phase exists: without subprocess isolation, performance regressions affect the entire app. Mobile constraints require explicit budgeting and continuous measurement.

Risks mitigated: UI jank, out-of-memory crashes, runaway background work, and degraded large-repo workflows.

Dependencies: Phase 3 scheduler/budgets, Phase 8 tool tracks, Phase 11 background agents, Phase 13 tracing.

18.1 Baseline performance budgets (per host)
- [ ] Define budgets per host:
  - [ ] startup time (cold/warm)
  - [ ] max memory baseline
  - [ ] max CPU per tick (scheduler budget)
  - [ ] max tool concurrency
- [ ] Define budget enforcement reporting (diagnostics events emitted when budgets are exceeded).

18.2 Search and git performance benchmarks (large repo stress)
- [ ] Define benchmark fixture repos (size tiers) and canonical queries (regex-heavy, glob-heavy).
- [ ] Define acceptance criteria for `search.grep` (time-to-first-result, total time, memory peak) per host tier.
- [ ] Define acceptance criteria for `vcs.git` operations used by teleport flows (status/diff) and failure behavior on constrained hosts.

18.3 Background agent performance budgets (mobile-first)
- [ ] Define per-agent quotas (turns/time) and ensure agents yield frequently.
- [ ] Define hard stop rules for background tasks in low-memory / backgrounded states (host signals).
- [ ] Add regression benchmarks that ensure adding new agents does not regress interactive latency.

18.4 Streaming and rendering performance
- [ ] Define chunk size defaults and throttling rules for high-volume streams (tool output, MCP streaming) to avoid UI overload.
- [ ] Add tests that simulate high-volume streams and assert UI adapters remain responsive (no unbounded buffering).

18.5 Performance regression gates
- [ ] Add benchmark CI jobs (non-blocking initially) and define thresholds for promoting them to blocking gates.
- [ ] Define a triage process for regressions (profiling artifacts, trace capture, bisect strategy).

---

***Phase 19: Documentation, DX, and Operational Playbooks (Ship-Ready)***

Why this phase exists: a portable engine with strict boundaries requires clear documentation, and migration requires users/operators to understand new constraints (no shell hooks, capability gating).

Risks mitigated: misuse of APIs, accidental boundary violations, and high support burden during migration.

Dependencies: Phase 2 architecture, Phase 8/9 tool+hook redesigns, Phase 15 migration plan, Phase 13 diagnostics.

19.1 Developer documentation (for maintainability)
- [ ] Document module boundaries and dependency rules (what can import what, and why).
- [ ] Document the core runtime model (tasks, scheduler, cancellation, streaming) with invariants and test harness usage.
- [ ] Document capability interfaces with per-host implementation notes and conformance requirements.

19.2 User-facing migration docs (hooks/tools/permissions)
- [ ] Document hook migration: legacy shell hooks → declarative hooks, including “unsupported patterns” and alternatives.
- [ ] Document permission behavior and how policy-managed environments differ (attribution, managed-only constraints).
- [ ] Document feature availability by host (mobile/web limitations; explicit capability gating).

19.3 Operator/enterprise playbooks (policy + telemetry)
- [ ] Document policy deployment models (mobile offline cache, refresh cadence, failure behavior).
- [ ] Document telemetry controls and endpoint-mode dedupe behavior.
- [ ] Document incident response controls (kill switches, feature gates).

19.4 Support playbooks (diagnostics and triage)
- [ ] Document how to generate and interpret diagnostic bundles (Phase 13.5) without leaking sensitive data.
- [ ] Document common failure modes and remediation steps (MCP connectivity, permission denials, hook blocks, workspace trust issues).

---

***Phase 20: Investigation-Driven Parity Remediation (Close the Rewrite Gaps)***

Why this phase exists: the investigation run (`investigation/`) shows the TS rewrite currently has *excellent scaffolding* but is missing the legacy CLI’s **end-to-end behaviors** that make Claude Code “work”: the streaming model↔tools loop, the built-in tool catalog, and the user-facing CLI command surface. These are not optional polish items — they are the execution backbone.

Risks mitigated: shipping an engine that boots but cannot *operate* (no tool calling), shipping a CLI that parses but does not behave (help/unknown commands), and regressing user trust by silently dropping major command groups (mcp/plugin/install/update/setup-token).

Dependencies: Phase 8 tool contracts + pipeline, Phase 7 permission engine, Phase 10 MCP client, Phase 12 CLI adapter, Phase 14 regression harness.

This phase is intentionally **implementation-heavy** (not just contracts). Each subsection below includes “exit criteria” so it can be code-reviewed objectively.

### 20.0 Ground truth: adopt the investigation gaps as tracked work

Source of truth:
- `investigation/FINAL-gap-summary.md`
- `investigation/iteration-1-tool-gaps.md`
- `investigation/iteration-3-cli-parity.md`
- `investigation/iteration-4-subprocess-migration.md`
- `investigation/iteration-2-encyclopedia-verification.md`

Required outcomes:
- [ ] Track each investigation gap ID (`T*`, `C*`, `E*`, `S*`) as a first-class checklist item in this phase (no “lost in prose” gaps).
- [ ] For each gap, define: owner module(s), public behavior, test strategy, and “stub vs implemented” milestones.
- [x] Add a single “Parity Dashboard” page (doc-only) listing: implemented, stubbed-with-help, deferred, intentionally-diverged (with justification): `implementation/parity-dashboard.md`.

Gap register (must be kept in sync with `investigation/FINAL-gap-summary.md`):

Tool calling gaps:
- [ ] `T1` (P0): No end-to-end model ↔ tools loop in TS (see §20.1).
- [ ] `T2` (P0): TS model calls don’t include tools/tool manifests (see §20.1/§20.2/§20.4).
- [ ] `T3` (P0): No session tool registry composition/filtering (see §20.2).
- [ ] `T4` (P0): Missing/mismatched first-party tool inventory (see §20.3).
- [ ] `T5` (P0): No built-in tool schema export layer for model (see §20.4).
- [ ] `T6` (P1): Upstream tool input normalization parity not implemented (see §20.5).
- [ ] `T7` (P0): Permission gating + tool pipeline hooks exist but are not invoked from any model/tool loop (see §20.1).
- [ ] `T8` (P2): `StructuredOutput` tool flow missing (see §20.3/§20.8).
- [ ] `T9` (P2): `Skill` tool / skills executor path missing (see §20.8).
- [ ] `T10` (P1): MCP tools not exposed via model tool calling (see §20.6).
- [ ] `T11` (P3): Optional `LSP` tool parity missing (see §20.3 stubs; implement later).
- [ ] `T12` (P1): `HostShell` exists but is unavailable by default (see §20.9).
- [ ] `T13` (P2): Bash redirection parsing parity gap (see §20.5).

CLI command gaps:
- [ ] `C1` (P0): No default interactive REPL when invoked with no args (see §20.7).
- [ ] `C2` (P0): Unknown commands/flags fall through to interactive UI instead of error/help (see §20.7).
- [ ] `C3` (P1): Missing user-facing `mcp` command group (see §20.7 and `CLI_ENCYCLOPEDIA.md` Chapter 14).
- [ ] `C4` (P1): Missing user-facing `plugin` + marketplace commands (see §20.7 and `CLI_ENCYCLOPEDIA.md` Chapter 14).
- [ ] `C5` (P1): Missing `install` and `update` commands (see §20.7; legacy context in `CLI_ENCYCLOPEDIA.md` Chapter 12).
- [ ] `C6` (P1): Missing `setup-token` command (see §20.7 and `CLI_ENCYCLOPEDIA.md` Chapter 14).
- [ ] `C7` (P1): Missing permissions/tools flags (see §20.2 and §20.7).
- [ ] `C8` (P1): Missing session lifecycle flags (see §20.7).
- [ ] `C9` (P1): Missing model/request shaping flags (see §20.2 and §20.7).
- [ ] `C10` (P2): Missing env/config/debug plumbing flags (see §20.7).
- [ ] `C11` (P1): Missing MCP config flags for main CLI parity (see §20.6).
- [ ] `C12` (P2): Internal `--mcp-cli` parity gaps (see §20.6).
- [ ] `C13` (P2): Flag semantics mismatch: upstream `-p/--print` vs TS `-p/--prompt` (see §20.7).
- [ ] `C14` (P1): Slash commands UX missing and `--disable-slash-commands` missing (see §20.8).
- [ ] `C15` (P2): Teleport/remote sessions and resume flows not implemented (tracked in Phase 11.9).
- [ ] `C16` (P2): Session browser / resume picker UI not implemented (tracked in Phase 11/Phase 12).
- [ ] `C17` (P2): Background agents not implemented (tracked in Phase 11).
- [ ] `C18` (P2): Default `-p` model already deprecated (see §20.7; ensure overrides remain).

Encyclopedia issues:
- [ ] `E1` (P2): Missing dedicated chapter for user-facing `claude mcp ...` (addressed via `CLI_ENCYCLOPEDIA.md` Chapter 14; deepen as needed).
- [ ] `E2` (P2): Missing chapters for `claude plugin ...` / marketplace and `claude setup-token` (addressed via `CLI_ENCYCLOPEDIA.md` Chapter 14; deepen as needed).
- [ ] `E3` (P3): Anchors that are usage sites need clarification (track as ongoing doc hygiene).
- [ ] `E4` (P2): Windows policy directory selection mismatch (track in Settings docs + code alignment decision).
- [ ] `E5` (P3): Endpoint-mode warning text differs (track and decide align vs document divergence).
- [ ] `E6` (P3): Settings corrupted-file backup/restore messaging differs (track and decide align vs document divergence).

Subprocess issues:
- [ ] `S1` (P2): Audit and harden Node host keychain subprocess usage (see §20.9).
- [ ] `S2` (P1): Ensure any shell execution is only via explicit `HostShell` capability + policy gates (see §20.9).

### 20.1 P0: Implement the end-to-end streaming model ↔ tools loop (T1, T2, T5, T7)

The bundled CLI’s core behavior is: stream model output → detect `tool_use` blocks → normalize + permission-check + hook → execute tools → send `tool_result` blocks → continue until final assistant message.

Implementation checklist:
- [ ] Define a single “sampling loop” module that is usable by:
  - [ ] non-interactive prompt mode (`-p/--prompt`)
  - [ ] interactive REPL mode
  - [ ] background agents / subagents
- [ ] Define a portable streaming decoder for Anthropic Messages API events that supports:
  - [ ] incremental text
  - [ ] incremental `input_json_delta` assembly for tool inputs (including nested JSON + escaped sequences)
  - [ ] multiple content blocks per assistant message (text + tool_use + partial tool_use)
  - [ ] multiple tool_use blocks in one assistant message (sequential execution semantics)
  - [ ] tool_use id correlation to tool_result id
- [ ] Ensure every model request can include a tool manifest (see 20.2/20.3) and that the loop can be configured as:
  - [ ] “tools disabled” (no tool manifest; reject tool_use if it appears)
  - [ ] “tools enabled but constrained” (filtered manifest; hard error on missing tool_use)
  - [ ] “tools enabled, permissive” (full manifest + permission prompts)
- [ ] Wire tool execution to the existing `ToolRunner` with:
  - [ ] a strict “no bypass” rule: there is exactly one path that runs tools and it always runs (permission gate → hooks → tool runner → transcript append)
  - [ ] deterministic tool stream emission (ToolRunId + seq) into transcript/app state
  - [ ] cancellation propagation (user stop → abort model stream + abort any in-flight tool)
- [ ] Define tool failure mapping to model-visible `tool_result` blocks:
  - [ ] input schema validation failures are tool results (typed + user-visible)
  - [ ] permission denied is a tool result (with human explanation)
  - [ ] capability missing is a tool result (actionable, host-specific)
  - [ ] unexpected errors are tool results (redacted error + correlation id)
- [ ] Decide and implement “continue-after-tool-failure” semantics (legacy behavior: typically continue, letting model react).

Tests (must be deterministic, no real network):
- [ ] Fixture-driven streaming parser tests for tool_use JSON assembly (including malformed/partial inputs).
- [ ] Golden “tool loop” tests with a fake model stream that emits:
  - [ ] text → tool_use → tool_result → final text
  - [ ] two tool_use blocks back-to-back
  - [ ] tool_use with invalid input (schema error) followed by recovery
  - [ ] tool_use denied by permissions and then recovery
- [ ] Assert that permission prompts and hooks fire exactly once per tool invocation (no bypass, no double-run).

Exit criteria:
- [ ] The TS rewrite can complete a multi-turn prompt where the model calls at least `Read` + `Edit` and produces a final answer (fully local fakes).
- [ ] Tool manifests are present in model requests when tools are enabled, and absent when disabled.
- [ ] A failing tool invocation still produces a valid tool_result block and the loop continues to completion.

### 20.2 P0: Session tool registry composition + filtering (T3) + CLI flags plumbing (C7, C9)

The model must see the right tools for the current session context. The registry must be filtered by: permission mode, allow/deny tool lists, capability availability, and policy constraints.

Implementation checklist:
- [ ] Define a “session tool registry builder” that composes:
  - [ ] built-in tools (first-party)
  - [ ] MCP tools from connected servers (namespaced)
  - [ ] plugin-provided tools (if supported; gated)
  - [ ] special tools (`StructuredOutput`, `Skill`) only when explicitly enabled
- [ ] Define the canonical filtering pipeline (ordered, deterministic) with explicit reasons:
  - [ ] remove unavailable-by-capability tools (HostFilesystem, HostNetwork, HostShell, etc.)
  - [ ] apply CLI flags: `--tools`, `--allowed-tools/--allowedTools`, `--disallowed-tools/--disallowedTools`
  - [ ] apply policy/tool-permission constraints (deny/ask/allow and managed-only rules)
  - [ ] apply any mode-level restrictions (e.g., suggestion/background agents deny tools)
- [ ] Define a stable “why tool not available” diagnostic output:
  - [ ] tool missing from build (not implemented)
  - [ ] tool filtered by flags
  - [ ] tool filtered by policy
  - [ ] tool filtered by missing capability
- [ ] Add flag parsing and config wiring for:
  - [ ] `--permission-mode <mode>`
  - [ ] `--tools <tools...>`
  - [ ] `--allowed-tools/--allowedTools <tools...>`
  - [ ] `--disallowed-tools/--disallowedTools <tools...>`
  - [ ] `--dangerously-skip-permissions` and `--allow-dangerously-skip-permissions` (explicit guardrails)

Tests:
- [ ] Unit tests for filtering determinism: same inputs → same tool list order + same exclusion reasons.
- [ ] Integration test: a model request includes only allowed tools when `--tools` is set.

Exit criteria:
- [ ] Tool list exposure matches the requested configuration and cannot be bypassed by “tool name mapping” or hidden aliases.

### 20.3 P0: Built-in tool catalog parity (T4) — implement core blockers first

Core blockers (must exist for Claude Code to be useful):
- `Read`, `Write`, `Edit`, `Glob`, `Grep`

Additional high-value parity tools (next):
- `WebFetch`, `WebSearch`, `TodoWrite`, `AskUserQuestion`

System/advanced tools (stub early, implement later):
- `Task`, `TaskOutput`, `KillShell`, `NotebookEdit`, `ExitPlanMode`, `Skill`, `StructuredOutput`, optional `LSP`

Implementation checklist (for each built-in tool):
- [ ] Choose the canonical tool name to match legacy (tool name is part of user permissions + model prompts).
- [ ] Define input schema and output schema (Zod or equivalent runtime-validated schema).
- [ ] Define required capabilities and failure behavior when missing.
- [ ] Define permission category and tool-specific permission checks (e.g., WebFetch domain rules).
- [ ] Define streaming behavior and what the UI renders (progress vs final result).
- [ ] Define redaction/sensitivity for outputs (file contents, secrets, network bodies).
- [ ] Define deterministic ordering guarantees (Glob/Grep results ordering; stable path normalization).

Core tool specifics:
- [ ] `Read`: path normalization, max bytes, encoding detection, “binary file” behavior, redaction policy for diagnostic bundles.
- [ ] `Write`: atomic writes, newline policy, create/overwrite rules, safe temp file strategy for hosts that support it.
- [ ] `Edit`: apply patch/edits deterministically, include precondition hashing/etag, explicit conflict reporting, reversible preview.
- [ ] `Glob`: portable glob semantics (avoid Node-only `glob` quirks), ignore rules, max match count.
- [ ] `Grep`: stable match grouping, context lines, case sensitivity and regex behavior; avoid subprocess dependency.

Stub strategy (don’t block tool loop while tool bodies are incomplete):
- [ ] For non-core tools, implement “discoverable stubs” that:
  - [ ] show up in help/tool list with accurate description
  - [ ] return a typed `not_implemented` tool_result that the model can react to
  - [ ] include actionable guidance (what to use instead; which hosts support it)

Tests:
- [ ] Unit tests per tool for schema validation + deterministic output ordering.
- [ ] Integration tests: `Read`→`Edit` chain produces expected file changes in a fake filesystem capability.
- [ ] Regression fixtures for permission prompts (e.g., `Read` on restricted path yields deny/ask/allow correctly).

Exit criteria:
- [ ] The tool loop can complete “read file → edit file → write file” prompts in a fully deterministic harness.

### 20.4 P1: Tool schema export layer for built-ins (T5)

The model needs `input_schema` for tools. MCP tools already carry schemas; built-ins must too.

Implementation checklist:
- [ ] Decide and implement Zod→JSON Schema (or equivalent) for built-in tool input schemas.
- [ ] Define schema export stability rules:
  - [ ] stable ordering of properties
  - [ ] no host-only types in schemas
  - [ ] explicit `additionalProperties` stance (prefer false where possible)
- [ ] Add a schema snapshot test suite:
  - [ ] exported schemas are stable across runs
  - [ ] schema changes require explicit approval (golden snapshots)

Exit criteria:
- [ ] Every tool in the manifest has a valid `input_schema` usable by the model.

### 20.5 P1: Tool input normalization parity (T6) + bash redirection parity (T13)

Legacy CLI normalizes tool inputs before execution (and in reverse) to support:
- JSON string inputs
- legacy alias keys
- bash cwd rewriting and redirection extraction for permission messaging
- edit/write shaping

Implementation checklist:
- [ ] Define a single normalization layer that runs before schema validation (so schema sees canonical inputs).
- [ ] Implement normalization behaviors needed for parity:
  - [ ] accept tool input as object or JSON string (with robust error mapping)
  - [ ] canonicalize known alias keys (e.g., TaskOutput fields)
  - [ ] Bash normalization: cwd rewrite stripping, command extraction sans redirections
  - [ ] Edit/Write normalization: accept legacy “content” vs “patch” styles if needed
- [ ] Decide whether to fully port upstream bash tokenizer or to:
  - [ ] implement it incrementally with a conformance test corpus
  - [ ] document intentional divergence (and update permission explanations accordingly)

Tests:
- [ ] Conformance corpus for bash redirection parsing (include upstream edge cases; lock expected outputs).
- [ ] Normalization tests that ensure schemas accept both legacy and new shapes.

Exit criteria:
- [ ] Permission explanations and tool behaviors do not materially diverge from legacy for common bash redirection cases (or divergence is explicitly documented).

### 20.6 P1: Expose MCP tools to model tool calling (T10) + MCP CLI parity gaps (C11, C12)

Implementation checklist:
- [ ] Ensure MCP tools from connected servers are included in the tool manifest with correct namespacing (`mcp__<server>__<tool>`).
- [ ] Ensure MCP tool execution is available via the same tool loop (not only internal `--mcp-cli`).
- [ ] Implement/close internal `--mcp-cli` parity gaps:
  - [ ] implement `info`
  - [ ] support state-file-mode `call`/`read` parity (direct-connect mode, not endpoint-only)
- [ ] Add main CLI flags for MCP config parity:
  - [ ] `--mcp-config`, `--strict-mcp-config`, `--mcp-debug`, `-t/--transport`

Tests:
- [ ] Deterministic mocked MCP server tests: list tools → call tool → stream result chunks → tool_result mapping.
- [ ] Schema drift tests: tool schema changes invalidate cached manifest + trigger re-approval if risk changes.

Exit criteria:
- [ ] A model can call an MCP tool end-to-end and receive a tool_result in the transcript (no `--mcp-cli`).

### 20.7 P0/P1: CLI invocation semantics and user-facing command surface (C1–C6, C10, C13)

Implementation checklist:
- [ ] Default invocation behavior:
  - [ ] `claude-ts` with no args starts interactive mode (not help)
  - [ ] `--help` prints help and exits 0
  - [ ] unknown commands/flags produce error + help excerpt and exit non-zero (no interactive UI fallback)
- [ ] Add stubbed command groups with correct parsing + help + exit codes:
  - [ ] `install [target]` (+ `--force`)
  - [ ] `update`
  - [ ] `setup-token`
  - [ ] `mcp` group: `serve/add/add-from-claude-desktop/add-json/get/list/remove/reset-project-choices`
  - [ ] `plugin` group: `validate/install/i/update/enable/disable/remove/uninstall`
  - [ ] `plugin marketplace` group: `add/list/remove/rm/update`
- [ ] Implement CLI flag parity wiring (even if some are initially no-ops, they must parse and surface config):
  - [ ] `-c/--continue`, `-r/--resume [value]`, `--fork-session`, `--session-id`, `--no-session-persistence`, `--replay-user-messages`
  - [ ] `--model`, `--fallback-model`, `--betas`, `--max-budget-usd`, `--system-prompt`, `--append-system-prompt`
  - [ ] `--input-format`, `--output-format`, `--json-schema`, `--include-partial-messages`
  - [ ] `-d/--debug [filter]`, `--verbose`, `-e/--env`, `-H/--header`, `--ide`, `-s/--scope`, `--plugin-dir`, `--force`, `--add-dir`, `--agent`, `--agents`, `--settings`, `--setting-sources`
- [ ] Resolve `-p` semantics mismatch:
  - [ ] decide compatibility aliasing (`-p` supports legacy `--print` behavior while `--prompt` becomes explicit) vs breaking change
  - [ ] document and test whichever decision is chosen

Tests:
- [ ] Command parsing parity tests derived from `investigation/iteration-3-cli-parity.md` (help output present; correct exit codes).
- [ ] Unknown flag tests: `install --help` and `mcp --help` must not drop into interactive UI.

Exit criteria:
- [ ] The rewrite has a discoverable command surface consistent with legacy, even when commands are stubbed (help + exit codes behave correctly).

### 20.8 P1/P2: Slash commands and skills/tooling integration (C14, T9)

Implementation checklist:
- [ ] Implement slash command routing in interactive mode (at minimum `/help` and `/resume` parity scaffolding).
- [ ] Add `--disable-slash-commands` with correct behavior.
- [ ] Implement `Skill` tool scaffolding:
  - [ ] skills registry (built-in + plugin-provided, if supported)
  - [ ] invocation semantics (input schema, output schema, transcript integration)
  - [ ] decide relationship between slash commands and skills (one expands into the other, or parallel systems)

Exit criteria:
- [ ] Interactive mode can execute a minimal slash command and optionally route into the same model/tool loop without bypassing permissions.

### 20.9 P1: Shell execution stance (T12, S2) + keychain subprocess hardening (S1)

Implementation checklist:
- [ ] Decide whether “Bash” tool parity exists in v3:
  - [ ] if yes, implement it only behind an explicit `HostShell` capability + policy controls
  - [ ] if no, ensure the model/tool manifest never advertises Bash and the UI explains why
- [ ] Ensure no ad-hoc subprocess usage appears outside host adapters (enforce via static checks + runtime guards).
- [ ] Harden existing macOS keychain subprocess usage:
  - [ ] bounded timeouts
  - [ ] explicit feature gate (`allowSubprocess`) remains mandatory
  - [ ] tests for “subprocess disabled” behavior

Exit criteria:
- [ ] The repo’s subprocess boundary is explicit and audited, and no new subprocess dependency is introduced by tool parity work.

### 20.10 P2/P3: Encyclopedia + docs corrections (E1–E6)

Implementation checklist:
- [ ] Add dedicated encyclopedia coverage for user-facing command groups:
  - [ ] `claude mcp ...` (not only internal `--mcp-cli`)
  - [ ] `claude plugin ...` and `claude plugin marketplace ...` (plus any top-level marketplace alias)
  - [ ] `claude setup-token`
- [ ] Clarify “definition vs usage” anchors where the encyclopedia currently points at usage sites.
- [ ] Document platform divergences discovered:
  - [ ] Windows policy directory selection (Program Files vs ProgramData)
  - [ ] endpoint-mode warning text differences
  - [ ] settings-corruption backup/restore messaging differences

Exit criteria:
- [ ] The encyclopedia can be used as a reliable mapping from legacy behavior to TS modules for the command surface that the rewrite intends to support.

---

***Risk Register & Mitigations (Iteration 5 Draft)***

- [ ] Risk: “No subprocesses” conflicts with power-user expectations (git/rg/shell workflows). Mitigation: capability-gated substitutes (TS/WASM) + optional remote/desktop host, with clear UX and policy controls.
- [ ] Risk: Portable streaming (ReadableStream vs AsyncIterator vs RN limitations) diverges by platform. Mitigation: define a single internal stream abstraction + adapters; enforce with cross-platform contract tests.
- [ ] Risk: Event bus cursor/snapshot semantics cause duplicated or missing UI events across background/restore. Mitigation: explicit cursor persistence rules, at-least-once vs exactly-once contracts per channel, and replay-based integration tests.
- [ ] Risk: Hang detection or “no progress” heuristics spam diagnostics or cancel legitimate waits. Mitigation: category-specific progress definitions, explicit “waiting on user” states, and deterministic single-fire escalation rules.
- [ ] Risk: Hook redesign breaks existing user workflows. Mitigation: migration tooling + compatibility lints + staged deprecation; prioritize declarative equivalents for common patterns.
- [ ] Risk: Permission semantics drift due to re-interpretation of precedence and tool-specific logic. Mitigation: golden tests from legacy behavior; “explainability” field must attribute sources.
- [ ] Risk: Global hook gates (`disableAllHooks`, managed-only hooks) behave differently across hosts and surprise users. Mitigation: explicit precedence spec + diagnostics that show which gate suppressed hook execution + golden regression sessions.
- [ ] Risk: MCP direct mode transport may not be feasible on web/mobile. Mitigation: endpoint-first design; direct mode as host-dependent optional.
- [ ] Risk: MCP streaming/backpressure differs across fetch implementations (RN vs web) and leads to memory spikes. Mitigation: bounded buffering + transport conformance tests + budgets (Phase 3.10).
- [ ] Risk: MCP schema drift changes tool risk profile silently (server updates). Mitigation: manifest hashing + drift diagnostics + permission revalidation gates.
- [ ] Risk: Background agents consume too many resources on mobile. Mitigation: explicit budgets + lifecycle pause/resume rules + feature gates.
- [ ] Risk: Settings watchers are not uniformly available. Mitigation: treat “watch” as optional; rely on explicit “refresh” triggers and storage events where possible.
- [ ] Risk: WASM-based search/git engines exceed mobile memory/CPU budgets or are incompatible with some RN runtimes. Mitigation: dual-path (WASM + TS fallback), strict budgets, and capability-gated feature reduction on constrained hosts.
- [ ] Risk: “No subprocess anywhere” is violated accidentally via transitive dependencies or host adapter shortcuts. Mitigation: static import/API scans across the whole repo, runtime guards in dev/test, and a dedicated conformance suite that asserts tool/hook/MCP paths remain in-process.
- [ ] Risk: Local endpoint / extension bridge expands attack surface. Mitigation: deny-by-default exposure, strong auth, rate limiting, strict allowlists, and security regression tests.
- [ ] Risk: Schema migrations + OTA updates brick persisted state on mobile. Mitigation: forward-compatible schemas, idempotent migrations, and explicit upgrade/downgrade testing gates.
- [ ] Risk: Workspace identity/trust model is confusing across hosts (no “cwd” on mobile/web). Mitigation: explicit workspace artifacts, clear UI, and policy-managed defaults.
- [ ] Risk: Deterministic replay and hashing adds overhead and leaks sensitive info if mis-designed. Mitigation: schema-level sensitivity annotations, redaction-first pipelines, and bundle/telemetry linting.

---

***Future Iterations & Deferred Decisions***

- [ ] Decide the final hook action surface area and versioning strategy after implementing lifecycle + effect application tests.
- [ ] Decide whether to adopt a full event-sourcing model for sessions or a hybrid snapshot+log approach after prototyping replay needs.
- [ ] Decide the exact MCP transport implementations (SSE/WebSocket/long-poll) per host after evaluating platform constraints.
- [ ] Decide the final tool packaging strategy (built-in vs plugin-distributed tools) after security review and host feasibility matrix.
- [ ] Decide the primary search engine implementation (WASM ripgrep-like vs TS) after parity and performance benchmarks on mobile/web/desktop.
- [ ] Decide the primary git engine strategy (JS vs WASM vs host-native bridge) after teleport flow parity is proven without subprocesses.
- [ ] Decide if/when worker-style isolation is required (and which tech) after performance profiling on iOS/web.
- [ ] Decide the long-term stance on shell-like features (desktop-only vs remote) after user research and policy requirements.
- [ ] Decide whether “external clients” (extension/automation) require a state-file artifact at all, or can be fully replaced by authenticated endpoint bridging.
- [ ] Decide policy delivery mechanism for mobile (bundled defaults vs signed remote policy) after enterprise requirements are collected.

---

***Completion Criteria***

- ✅ The core engine boots and runs on iOS (React Native) with filesystem/shell capabilities absent, using only injected portable capabilities.
- ✅ A deterministic scheduler test harness exists, and core concurrency behavior is reproducible under test (timeouts/cancellation/streaming).
- ✅ A replay capture + deterministic reproduction harness exists, and a baseline set of golden captures replays identically across Node + web-like + RN-like adapters.
- ✅ Tool execution is async-first and does not rely on a process-per-task model; streaming output is consistent across CLI/RN/web adapters.
- ✅ Static “no subprocess” enforcement passes across core and host adapters (no `child_process`/spawn/exec usage in the shipped codebase).
- ✅ Legacy `--ripgrep` behavior is replaced by an in-process `search.grep` command/tool with parity and performance gates; no packaged binaries/subprocesses required.
- ✅ Hooks are implemented as portable, serializable async workflows (no shell commands, no env var/stdio protocols).
- ✅ Hook event coverage includes `UserPromptSubmit`, and global hook gating (`disableAllHooks`, managed-only) is specified and validated with golden tests.
- ✅ Permissions decisions are explainable, attributable to sources, and enforced as capability gates across tools/MCP/hooks.
- ✅ Sandbox-network approvals are modeled as first-class policy decisions with queue/leader-worker parity tests and cannot be bypassed by direct network capability use.
- ✅ MCP supports endpoint mode with mobile-safe transports and integrates with elicitation and permissions; direct mode is optional and capability-gated.
- ✅ Legacy `--mcp-cli` workflows are available via engine commands without spawning a separate process, including endpoint-mode telemetry dedupe.
- ✅ Settings layering/merge semantics match legacy behavior unless explicitly changed, with structured errors and portable change propagation.
- ✅ Background agents run cooperatively with explicit budgets and safe mobile lifecycle behavior.
- ✅ Migration plan supports incremental cutover from the existing CLI with shadow-mode diff validation.
- ✅ A phase-gated cutover checklist exists with objective pass/fail criteria (parity suites, conformance matrices, and policy/redaction linting).
- ✅ Diagnostic bundles can be generated on all hosts and pass automated redaction linting.

---

***Checklist Summary***

- Estimated checklist items in this iteration: ~1291 (auto-counted as lines matching `^\\s*- [ ]`; includes nested checklists).
- This is Iteration 5: multiple sections intentionally avoid final API commitments and instead define boundaries, lifecycles, conformance suites, and testable invariants.

---

***Notes & Assumptions***

- Assumption: The engine can rely on standard Web APIs (`AbortController`, `fetch`, `TextEncoder/Decoder`) across targets, with host adapters providing polyfills where needed.
- Assumption: Filesystem and shell access are optional host capabilities and must not be required for core correctness or hooks.
- Assumption: The shipped v3 codebase does not spawn OS subprocesses; “power features” are achieved via in-process TS/WASM/host-native libraries or explicit remote execution.
- Assumption: Legacy behavior parity is initially preferred for settings precedence and permission rule semantics; changes require explicit design decisions and migration UX.
- Assumption: MCP endpoint mode is the primary cross-platform path; direct mode is treated as host-dependent and may be unavailable on mobile/web.
- Assumption: A WASM-based search implementation is feasible on at least desktop/web; mobile may require reduced feature sets or TS fallback to meet budgets.
- Assumption: External client interoperability (extension/automation) is optional for v3 launch and can be capability-gated to desktop/CLI hosts.
