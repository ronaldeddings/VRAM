# Network Permissions and Background Restrictions (Phase 4)

This phase defines where network permission decisions hook into the portability boundary.

## Network permission integration points

- The underlying capability is `HostNetwork.fetch`.
- Permission/policy integration is enforced *around* network access (Phase 7):
  - tool runner gates tool-initiated network calls
  - MCP transport gates MCP traffic
  - background agents gate their own network usage
- Decisions are domain-scoped (allow/deny/ask) and policy may override user choices.

Portable requirement:

- network access must be attributable (originating task/tool/session) so prompts and audits can explain “why we’re asking”.

## Mobile background restrictions

Hosts that background execution constraints (mobile/web) must surface lifecycle events into the engine:

- `host/backgrounded`: engine may need to pause/cancel network and streaming operations
- `host/foregrounded`: engine may resume where allowed, or rehydrate/restart if required

Determinism requirement:

- background-induced cancellation must produce explicit cancellation reasons and transcript markers (no silent truncation).

