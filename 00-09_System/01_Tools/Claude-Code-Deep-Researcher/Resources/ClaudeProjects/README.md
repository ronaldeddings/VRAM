# Claude Projects JSONL (Local) — Reverse‑Engineered Documentation

This folder documents the **JSON Lines (`.jsonl`) event logs** found under `~/.claude/projects/`.

These files appear to be produced by **Claude Code / Claude Desktop tooling** while you work inside a “project” (a directory on disk) and run one or more “sessions” (chat transcripts, tool calls, subagents, etc).

This documentation is intentionally **very thorough and structural**:
- How the `~/.claude/projects/` directory is laid out
- How individual `.jsonl` files are named and what they represent
- The **record types** you’ll see (top-level `"type"`)
- All observed **keys and key-combinations** (schema variants)
- The `"message"` object and its `"content"` block formats
- How `"tool_use"` and `"tool_result"` correlate, including `"toolUseResult"` shapes
- How to reconstruct timelines, threads, and compaction boundaries

Important notes:
- This is **reverse-engineered** from local data and may change across app versions.
- Examples are **redacted/synthetic** (no real prompt/tool output content).

## Start here
- `Resources/ClaudeProjects/Directory-Layout.md`
- `Resources/ClaudeProjects/Record-Types.md`
- `Resources/ClaudeProjects/Message-Content-Blocks.md`
- `Resources/ClaudeProjects/Tools-and-toolUseResult.md`
- `Resources/ClaudeProjects/Reconstructing-Conversations.md`
- `Resources/ClaudeProjects/Field-Reference.md`
- `Resources/ClaudeProjects/Appendix-Observed-Frequencies.md`
- `Resources/ClaudeProjects/Resume-and-Continue.md`
- `Resources/ClaudeProjects/CLI-Resume-Flow.md`
- `Resources/ClaudeProjects/Extending-Projects-and-Resume.md`
- `Resources/ClaudeProjects/Extending-Projects-and-Resume-Practical-Recipes.md`
- `Resources/ClaudeProjects/Extending-Projects-and-Resume-TS-Blueprint.md`
- `Resources/ClaudeProjects/SessionStore-$LB-API.md`
- `Resources/ClaudeProjects/CLI-JS-to-TS-Decomposition.md`
- `Resources/ClaudeProjects/cli.js-Symbols-to-TypeScript-Signatures.md`

## Machine-readable summaries (optional)
These are useful for auditing what keys/types exist on *this* machine and are designed to avoid including prompt/output text:
- `Resources/ClaudeProjects/_observed_schema_summary.json`
