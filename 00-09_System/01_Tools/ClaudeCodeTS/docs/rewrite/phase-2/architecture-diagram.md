# Phase 2 — Architecture Diagram (Text/ASCII)

This is a portable-first, UI-agnostic architecture for the rewrite. It is intentionally “types-before-code” and is meant to be reviewable without requiring any runtime implementation decisions.

## ASCII diagram

```
                 ┌────────────────────────────────────────────────────┐
                 │                    UI Adapters                     │
                 │  cli adapter   rn adapter   web adapter   desktop   │
                 │        (ui/* hosts: argv/stdio, RN, browser, etc.)  │
                 └───────────────┬────────────────────────────────────┘
                                 │ engine commands + user input
                                 │ UI subscribes to typed engine events
                                 v
                 ┌────────────────────────────────────────────────────┐
                 │                 Engine Entrypoint                  │
                 │        (UI-agnostic; no CLI assumptions)           │
                 └───────────────┬────────────────────────────────────┘
                                 │
             ┌───────────────────┼───────────────────────────────────┐
             │                   │                                   │
             v                   v                                   v
  ┌─────────────────┐  ┌──────────────────┐                ┌─────────────────┐
  │ core/runtime/*   │  │  core/events/*   │                │   core/state/*  │
  │ task model,      │  │ event taxonomy,  │                │ session/app     │
  │ cancellation,    │  │ stream adapters  │                │ store/snapshots │
  │ scheduling       │  └────────┬─────────┘                └────────┬────────┘
  └────────┬────────┘           │                                   │
           │                    │                                   │
           v                    v                                   v
  ┌─────────────────┐  ┌──────────────────┐                ┌─────────────────┐
  │ core/settings/*  │  │ core/permissions/*│               │   core/hooks/*  │
  │ schema, sources, │  │ rules, eval,      │               │ match/exec      │
  │ merge/patch      │  │ explainability    │               │ (async)         │
  └────────┬────────┘  └────────┬──────────┘               └────────┬────────┘
           │                    │                                   │
           └──────────┬─────────┴───────────┬───────────────────────┘
                      │                     │
                      v                     v
            ┌──────────────────┐   ┌──────────────────┐
            │   core/tools/*   │   │    core/mcp/*     │
            │ tool contracts,  │   │ endpoint/direct,  │
            │ exec pipeline,   │   │ transports,       │
            │ streaming        │   │ streaming         │
            └────────┬─────────┘   └────────┬─────────┘
                     │                      │
                     └──────────┬───────────┘
                                v
                      ┌──────────────────┐
                      │  core/agents/*   │
                      │ background tasks │
                      └────────┬─────────┘
                               │ non-portable effects via capability calls only
                               v
                 ┌────────────────────────────────────────────────────┐
                 │                  Host Boundary                      │
                 │                   (platform/*)                      │
                 │ storage/fs/network/shell/clipboard/notifications/... │
                 └────────────────────────────────────────────────────┘
```

## Components (inputs/outputs/ownership/portability)

### Engine Entrypoint
- Inputs: engine commands from UI (start/stop, submit prompt, approve/deny, tool invocations, configuration updates).
- Outputs: typed engine events to UI (stream deltas, state snapshots, notifications, prompts/approvals, diagnostics).
- Ownership: owns orchestration; may call into core subsystems; must not call `platform/*` directly (only through injected host capabilities).
- Portability: portable.

### `core/runtime/*`
- Inputs: scheduling requests (enqueue task), cancellation signals, time budget configuration.
- Outputs: task lifecycle events, cancellation results, deterministic “ticks” under test.
- Ownership: task model + cooperative scheduler; no policy, no UI, no I/O.
- Portability: portable.

### `core/events/*`
- Inputs: events produced by engine/subsystems, host events forwarded by adapters.
- Outputs: typed event stream to consumers; bounded queues/backpressure behavior (later phases).
- Ownership: event taxonomy and adapter helpers; no I/O.
- Portability: portable.

### `core/state/*`
- Inputs: reducer actions/engine events; settings snapshots; tool/hook outcomes.
- Outputs: derived state snapshots/selectors; UI-ready view models (thin).
- Ownership: deterministic state model; no I/O.
- Portability: portable.

### `core/settings/*`
- Inputs: settings documents from sources (user/project/local/policy/flags/session), patches, validation errors.
- Outputs: merged settings snapshot + provenance/explainability.
- Ownership: schema + merge semantics; no persistence (host handles storage).
- Portability: portable.

### `core/permissions/*`
- Inputs: permission mode, permission rules, proposed tool/network actions, policy docs.
- Outputs: allow/deny/ask decisions with explanation metadata.
- Ownership: decision system only; no prompting/UI.
- Portability: portable.

### `core/hooks/*`
- Inputs: hook definitions + hook events (from engine), settings gates.
- Outputs: hook results (edits, messages, denials) and hook telemetry events.
- Ownership: matching + lifecycle; host provides execution (shell/script) when applicable.
- Portability: portable (hook “effects” are mediated via host capabilities).

### `core/tools/*`
- Inputs: tool registry, tool invocation requests, permission decisions, replay/idempotency keys.
- Outputs: tool result streams + final outcomes, tool usage events for hooks/state.
- Ownership: tool pipeline (permission gating, streaming envelopes, attachments).
- Portability: portable (tool implementations may be host-dependent).

### `core/mcp/*`
- Inputs: MCP config, transport capabilities (endpoint/direct), auth material (host-provided).
- Outputs: MCP tool/resource listing/calls; streaming results and errors.
- Ownership: MCP protocol integration and engine-facing envelopes.
- Portability: portable (transports implemented under `platform/*`).

### `core/agents/*`
- Inputs: background agent definitions, run budgets, cancellation signals, settings snapshot.
- Outputs: agent progress/events; tool invocations via `core/tools/*`.
- Ownership: long-running tasks; no UI, no direct I/O.
- Portability: portable.

### Host Boundary (`platform/*`)
- Inputs: capability calls (read/write storage, network requests, filesystem operations, shell exec, keychain/secrets, time, notifications).
- Outputs: results/errors; host lifecycle events (suspend/resume/background/foreground).
- Ownership: all non-portable side effects, per-host implementations.
- Portability: host-dependent by definition.

