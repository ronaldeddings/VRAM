# Security + data-classification boundaries (Phase 1)

Goal: define security boundaries and redaction rules *before* APIs fossilize.

## Data sensitivity tiers

1. **Secrets**: access tokens, refresh tokens, API keys, session tokens, auth cookies.
2. **Sensitive local data**: file contents, diffs, filesystem paths (may be sensitive by policy), clipboard.
3. **Transcripts**: user prompts, assistant outputs, tool IO (redaction may be required).
4. **Telemetry**: event names, durations, coarse feature flags (must never include secrets).
5. **Public**: documentation, non-sensitive logs without identifiers.

## Redaction rules (baseline)

- Never emit secrets to logs, telemetry, diagnostic bundles, or error messages.
- Hash or tokenize stable identifiers where correlation is needed (session IDs, workspace IDs) unless explicitly allowed.
- File contents must not appear in telemetry; transcript capture must be user-controlled and/or policy-controlled.
- Diagnostic bundles must be redacted by default and include a manifest describing what was removed/hashed.

## Policy override transparency + audit trail

- When policy/enterprise-managed settings override user/project/local behavior, the user must be able to see:
  - what decision was made
  - which source enforced it (`policySettings`, etc.)
  - (where safe) why (policy reason code/message)

## Threat model notes (hooks/plugins)

- Hooks/plugins must be treated as untrusted inputs.
- Portable environments must not allow arbitrary shell execution; “command hooks” become restricted workflows or host-gated capabilities.
- Timeouts, recursion limits, and turn limits must be explicit and deterministic.

