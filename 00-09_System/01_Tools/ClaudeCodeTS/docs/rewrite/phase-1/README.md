# Phase 1 — Rewrite Charter, Spec Capture, Behavioral Baseline

This folder contains Phase 1 deliverables from `implementation/1-initial-rewrite-implementation-checklist.md`: a *behavioral* spec baseline for the legacy Claude Code CLIs (2.0.67/2.0.69 bundles + installed CLI), plus portability/security constraints that must remain true as the TypeScript rewrite proceeds.

Authoritative legacy references:
- `CLI_ENCYCLOPEDIA.md` (reverse-engineered ground truth)
- `bundles/ClaudeCodeCode/cli.js` and `bundles/ClaudeAgentSDKCode/cli.js` (bundled/minified legacy code)

## Outputs

- `docs/rewrite/phase-1/legacy-behavior-matrix.md`
- `docs/rewrite/phase-1/legacy-process-boundary-artifacts.md`
- `docs/rewrite/phase-1/settings-legacy-spec.md`
- `docs/rewrite/phase-1/permissions-legacy-spec.md`
- `docs/rewrite/phase-1/hooks-legacy-spec.md`
- `docs/rewrite/phase-1/mcp-cli-legacy-spec.md`
- `docs/rewrite/phase-1/appstate-queues-and-overlays-legacy-spec.md`
- `docs/rewrite/phase-1/sandbox-network-approvals-legacy-spec.md`
- `docs/rewrite/phase-1/env-flags-and-compatibility-surface.md`
- `docs/rewrite/phase-1/portability-rubric.md`
- `docs/rewrite/phase-1/security-boundaries.md`
- `docs/rewrite/phase-1/migration-constraints.md`
- `docs/rewrite/phase-1/risk-register.md`
- `docs/rewrite/phase-1/deferred-decisions.md`
- `docs/rewrite/phase-1/legacy-entrypoints-inventory.md`
- `docs/rewrite/phase-1/legacy-corpus-and-golden-fixtures.md`

Generated inventories captured from bundles/installed CLI:
- `docs/rewrite/phase-1/generated/env-vars.process-env-dot.txt`
- `docs/rewrite/phase-1/generated/env-vars.process-env-bracket.txt`
- `docs/rewrite/phase-1/generated/cli-flags.top-200.txt`
- `docs/rewrite/phase-1/generated/claude-help.txt`
- `docs/rewrite/phase-1/generated/claude-mcp-help.txt`
- `docs/rewrite/phase-1/generated/claude-plugin-help.txt`
- `docs/rewrite/phase-1/generated/claude-update-help.txt`
- `docs/rewrite/phase-1/generated/claude-install-help.txt`
