# AppState queues + overlays — legacy spec (queue semantics, overlay ordering)

This document captures legacy queue semantics and overlay ordering which are externally observable UI behaviors.

Primary sources:
- `CLI_ENCYCLOPEDIA.md` Chapter 7 (“AppState runtime + notifications”)
- `CLI_ENCYCLOPEDIA.md` Chapter 9 §9.7–§9.8 (“Overlay selection” + sandbox networking prompts)

## 1) Queues present in AppState (baseline)

Reference: Chapter 7 §7.2.

Observed queue-bearing fields:
- `notifications: { current, queue }`
- `elicitation: { queue }` (MCP ask-user prompts)
- `workerPermissions: { queue, selectedIndex }` (team/worker permission requests)
- 2.0.69 only:
  - `workerSandboxPermissions: { queue, selectedIndex }` (team/worker network approvals)
  - `pendingSandboxRequest` (waiting-for-leader overlay)

## 2) Notifications queue semantics

Reference: Chapter 7 §7.7.

Stable behavior:
- Priority tiers: `immediate`, `high`, `medium`, `low`.
- Immediate interrupts current; others enqueue with key-based dedupe.
- `invalidates` list drops queued items with matching keys.
- Drain behavior shows next notification when idle with timeouts.

## 3) Overlay selection: single-choice precedence order

Reference: Chapter 9 §9.7.

Legacy computes a single active overlay string (single-choice, not stacked). Precedence order (simplified):
1. Exiting / exit message → no overlay
2. Message selector open → `message-selector`
3. Sandbox permission requests exist → `sandbox-permission`
4. Tool permission prompt active → `tool-permission`
5. Worker permission prompt exists → `worker-permission`
6. 2.0.69 only: worker sandbox prompt exists → `worker-sandbox-permission`
7. Elicitation exists → `elicitation`
8. Cost notice → `cost`
9. IDE onboarding → `ide-onboarding`

Rewrite requirement:
- This ordering must become a deterministic, testable state machine (not implicit UI branching).

## 4) Sandbox networking prompt queues (baseline)

Reference: Chapter 9 §9.8.

Legacy has:
- Local sandbox prompt queue (both versions).
- Team-mediated approvals (2.0.69 only): worker requests leader approval and shows “waiting for leader” overlay, with fallback to local prompts if leader request fails.

