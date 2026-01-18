# Phase 8 — Tool Catalog Security Checklist

## Risk categories

- `read`: filesystem reads/search
- `write`: filesystem writes/patch application
- `network`: outbound requests (must pass network-approval gate)
- `auth`: tokens/secret access (host secrets boundary)
- `remote_execution`: explicit remote tool/service invocation (policy-gated)

## Required guarantees

- Inputs/outputs stored in logs are redacted by default for sensitive fields (tokens, raw file contents in managed environments).
- Permission decisions must be explicit (deny/ask/allow) and never silently escalate mid-run.
- Capability access is deny-by-default via filtered `HostCapabilities` views (capability membrane).
- Tool streaming is bounded (buffer size + output truncation markers).

