# Phase 3 — Core Async Runtime and Scheduling Model (Deterministic Kernel)

This phase introduces the portable, deterministic runtime kernel that replaces legacy subprocess orchestration with explicit async tasks, cooperative scheduling, and structured concurrency scopes.

Key artifacts (code):
- `src/core/types/runtime.ts` — runtime schemas (tasks/scopes/snapshots/streams) used across hosts.
- `src/core/runtime/*` — deterministic scheduler, task scopes, kernel, streams, hang detection, replay-capture types.
- `src/core/events/*` — portable event bus + stream adapters (AsyncIterable ↔ ReadableStream).

Key artifacts (docs):
- `docs/rewrite/phase-3/runtime-kernel.md`
- `docs/rewrite/phase-3/event-bus.md`
- `docs/rewrite/phase-3/streams.md`
- `docs/rewrite/phase-3/snapshots-and-hang-detection.md`
- `docs/rewrite/phase-3/replay-capture.md`

