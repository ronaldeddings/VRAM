# CLI Function/Class Map (Manual) — `ClaudeAgentSDKCode/cli.js` vs `ClaudeCodeCode/cli.js`

This document is a **manual, human-curated** inventory of the **application-level** functions/classes that are easy to identify by reading the bundled `cli.js` builds, plus a mapping of symbol renames between the two builds.

Because both `cli.js` files are **bundled + minified** and include **thousands** of third‑party/internal helper functions (plus WASM glue code), enumerating *every* function/class in the bundle is not useful for a “single maintainable codebase” goal. Instead, this focuses on the parts that look like “Claude Code product logic” (MCP CLI, Magic Docs, remote tasks/hooks, etc.) and that you’d actually want to factor into shared TypeScript modules.

---

## Files & build metadata

- `ClaudeAgentSDKCode/cli.js` (comment header: **Version 2.0.67**)  
  - CLI version banner embedded in `dD5()` at `ClaudeAgentSDKCode/cli.js:4761`
- `ClaudeCodeCode/cli.js` (comment header: **Version 2.0.69**)  
  - CLI version banner embedded in `XF5()` at `ClaudeCodeCode/cli.js:4751`

High-level observation: the two files appear to be **the same product code**, rebuilt at different versions, with **different minifier symbol choices** (lots of `uQ` vs `mQ`, `coB` vs `zrB`, etc.). In the areas mapped below, the features are present in *both* builds.

---

## Overlap summary (feature-level)

Present in both builds (based on direct string/symbol inspection):

- Config dir + env parsing helpers (same logic, different symbols) (both near `*:9`)
- Teleport resume URLs + Remote agent tasks + task rendering (both near `*:1635`)
- “Session memory” folder under config dir (both near `*:1635`)
- Hooks registry for async hooks stdout/stderr collection + flushing (both near `*:1635`)
- Magic Docs (“# MAGIC DOC: …”) agent and updater (mapped symbols below)  
  - `ClaudeAgentSDKCode/cli.js:4543`, `ClaudeCodeCode/cli.js:4533`
- Session quality classifier agent (frustrated / PR request)  
  - `ClaudeAgentSDKCode/cli.js:4552`, `ClaudeCodeCode/cli.js:4542`
- MCP CLI entrypoint (`--mcp-cli`) + subcommands including `read`, `resources`, `grep`, `call`  
  - `ClaudeAgentSDKCode/cli.js:4761`, `ClaudeCodeCode/cli.js:4751`
- Chrome Native Host message reader (length-prefixed JSON over stdin)  
  - `ClaudeAgentSDKCode/cli.js:4761`, `ClaudeCodeCode/cli.js:4751`
- CLI bootstrap that fast-paths `--version`, handles `--mcp-cli`, handles `--ripgrep`, then dynamic-imports main  
  - `ClaudeAgentSDKCode/cli.js:4761`, `ClaudeCodeCode/cli.js:4751`

---

## Symbol mapping (where the same behavior exists but names differ)

### Config + env helpers (very early in bundle)

These are defined very early in each bundle (both show up on `*:9` due to bundling style).

| Behavior | `ClaudeAgentSDKCode/cli.js` | `ClaudeCodeCode/cli.js` |
|---|---:|---:|
| Resolve config directory (`$CLAUDE_CONFIG_DIR` or `~/.claude`) | `uQ()` | `mQ()` |
| Truthy env parsing (`"1"`, `"true"`, `"yes"`, `"on"`) | `C0(value)` | `z0(value)` |
| Falsy env parsing (`"0"`, `"false"`, `"no"`, `"off"`) | `Iz(value)` | `rC(value)` |
| Parse `-e KEY=value` env var args into object | `rI0(list)` | `UX0(list)` |
| AWS region default selection | `ka()` | `Na()` |
| Vertex/Cloud ML region default selection | `pO()` | `vO()` |
| Keep project working dir flag | `QG1()` | `CG1()` |
| Model → Vertex region override selection | `yjA(model)` | `PjA(model)` |

### Teleport URL helpers + Remote agent task + session-memory + hooks registry

All of the following are visible around the `RemoteAgentTask` definition:
- `ClaudeAgentSDKCode/cli.js:1635`
- `ClaudeCodeCode/cli.js:1635`

| Area | `ClaudeAgentSDKCode/cli.js` | `ClaudeCodeCode/cli.js` |
|---|---:|---:|
| Teleport URL builder | `poB(sessionId)` → `https://claude.ai/code/<id>` | `UrB(sessionId)` |
| Teleport CLI hint builder | `loB(sessionId)` → `claude --teleport <id>` | `$rB(sessionId)` |
| Remote agent task object | `coB = { name:"RemoteAgentTask", … }` | `zrB = { name:"RemoteAgentTask", … }` |
| “Registered tasks list” function | `$J8()` returns `[Rl, GA1, coB]` | `MI8()` returns `[Vl, QA1, zrB]` |
| Find task implementation by type | `ioB(type)` | `wrB(type)` |
| Mutate task in app state | `XW(taskId, setState, fn)` | `VW(taskId, setState, fn)` |
| Insert task in app state | `Jh(task, setState)` | `fb(task, setState)` |
| Normalize “last reported” stats for task | `aoB(task)` | `qrB(task)` |
| Build “attachments” / “progressAttachments” from tasks | `ooB(appState)` | `LrB(appState)` |
| Session-memory directory | `toB: oA0 = join(uQ(), "session-memory")` | `RrB: K10 = join(mQ(), "session-memory")` |
| Register async hook | `eoB({processId,…})` | `_rB({processId,…})` |
| Add hook stdout | `ArB(processId, chunk)` | `TrB(processId, chunk)` |
| Add hook stderr | `QrB(processId, chunk)` | `jrB(processId, chunk)` |
| Flush completed hooks to attachments | `BrB()` | `PrB()` |

### Magic Docs agent (“# MAGIC DOC: …”)

Entry points (these functions are readable in both builds):
- `ClaudeAgentSDKCode/cli.js:4543`
- `ClaudeCodeCode/cli.js:4533`

| Behavior | `ClaudeAgentSDKCode/cli.js` | `ClaudeCodeCode/cli.js` |
|---|---:|---:|
| Load Magic Docs prompt template (config override or built-in default) | `tV5()` | `UD5()` |
| Template substitution (`{{var}}`) | `eV5(template, vars)` | `$D5(template, vars)` |
| Build per-doc prompt with custom instructions | `uu2(doc, path, title, instructions)` | `lm2(doc, path, title, instructions)` |
| Parse MAGIC DOC header + optional instruction line | `BE5(contents)` | `qD5(contents)` |
| Agent definition object | `GE5()` | `LD5()` |
| Main “update this magic doc” loop | `ZE5(docRef, context)` | `MD5(docRef, context)` |
| (Empty placeholder) | `du2()` | `nm2()` |
| Module init / hook registration (creates Map, regexes, and an interceptor) | `cu2 = q(() => { … })` | `am2 = L(() => { … })` |

### Session quality classifier (frustration + PR request)

Entry points:
- `ClaudeAgentSDKCode/cli.js:4552`
- `ClaudeCodeCode/cli.js:4542`

| Behavior | `ClaudeAgentSDKCode/cli.js` | `ClaudeCodeCode/cli.js` |
|---|---:|---:|
| Collect user utterances (bounded length) | `pu2(messages)` | `om2(messages)` |
| Format conversation summary (assistant hidden) | `JE5(lines)` | `RD5(lines)` |
| Parse classifier output tags | `IE5(xmlishText)` | `_D5(xmlishText)` |
| (Empty placeholder) | `lu2()` | `rm2()` |
| Classifier agent config object | `XE5 = { name:"session_quality_classifier", … }` | `TD5 = { name:"session_quality_classifier", … }` |
| Module init | `iu2 = q(() => { … })` | `sm2 = L(() => { … })` |

### MCP CLI + Chrome Native Host + CLI bootstrap

These appear at the tail end of each file:
- `ClaudeAgentSDKCode/cli.js:4761`
- `ClaudeCodeCode/cli.js:4751`

| Behavior | `ClaudeAgentSDKCode/cli.js` | `ClaudeCodeCode/cli.js` |
|---|---:|---:|
| Read an MCP resource via live connection (non-`--mcp-cli` path) | `MV5(server, uri, opts)` | `lE5(server, uri, opts)` |
| `--mcp-cli` main dispatcher | `wu2(argv)` | `Mm2(argv)` |
| Chrome native host max message size | `qu2 = 1048576` | `Rm2 = 1048576` |
| Chrome native host logger | `OV5(msg, …)` | `iE5(msg, …)` |
| Chrome native host message reader class | `class RV5 { … read() … }` | `class nE5 { … read() … }` |
| CLI bootstrap entry | `async function dD5()` | `async function XF5()` |

---

## Non-overlaps (what’s actually different)

In the mapped regions above:

- **Build metadata differs** (versions + build timestamps) — see `dD5()` vs `XF5()` in the tail region (`ClaudeAgentSDKCode/cli.js:4761`, `ClaudeCodeCode/cli.js:4751`).
- **Minified symbol names differ** throughout, but behaviors appear equivalent.

I did not find any obvious “feature present in one build but missing in the other” in the areas above.

---

## Where to go next (for building a single maintainable codebase)

If the goal is one shared TS codebase that can emit both CLIs, the above table suggests these **natural extraction units**:

1. `config/paths.ts` (config dir + environment parsing)
2. `teleport/remoteTasks.ts` (RemoteAgentTask + task state transitions)
3. `hooks/asyncHooks.ts` (hook registry + stdout/stderr aggregation)
4. `agents/magicDocs.ts` (Magic Docs agent)
5. `agents/sessionQualityClassifier.ts`
6. `mcp/cli.ts` (internal `--mcp-cli` tool)
7. `chrome/nativeHost.ts` (length-prefixed stdin reader)
8. `cli/entry.ts` (bootstrap + fast paths)

When you’re ready, we can use this map to start extracting a shared set of TypeScript modules and then recompose two thin entrypoints.

