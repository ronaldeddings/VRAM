NOTE YOU MUST FULLY READ @ClaudeAgentSDKCode/cli.js and @ClaudeCodeCode/cli.js entirely!!!
I want you to stop analyzing and start **designing a full rewrite** of my application. You must also read @CLI_ENCYCLOPEDIA.md

You now have a detailed, subsystem-level understanding of my codebase from **CLI_ENCYCLOPEDIA.md**, which documents the internals of:

* `ClaudeAgentSDKCode/cli.js` (2.0.67)
* `ClaudeCodeCode/cli.js` (2.0.69)

This encyclopedia is the **ground truth**. You should treat it as a reverse-engineered spec of the current system, not something to re-implement verbatim.

### 🔴 Core Goal

Design a **single, clean, TypeScript-first codebase** that fully replaces both CLIs and:

1. **Eliminates all reliance on spawning child processes**

   * No `spawn`, `exec`, `shell: true`, or process-per-task models
   * No “shell hooks” as subprocesses
2. **Uses async-first, event-driven JavaScript**

   * Async functions, streams, iterators, message passing
   * Explicit schedulers instead of background processes
3. **Can run on non-Node platforms**

   * Mobile (React Native, Expo)
   * Desktop (Tauri / Electron)
   * Web (where possible)
   * Node remains a *host*, not an assumption

This is a **ground-up redesign**, not a refactor.

---

### 🧠 How to Think About the Rewrite

You must **not** preserve legacy constraints just because they exist today.

Assume:

* The current CLI is **over-coupled to Node + filesystem + child processes**
* Many subsystems exist only because of those constraints
* We are allowed to replace those mechanisms entirely if the *behavior* is preserved

Your task is to:

* Identify **conceptual responsibilities**, not implementation artifacts
* Replace OS/process-based boundaries with **logical async boundaries**
* Design for **testability, portability, and determinism**

---

### 🧱 Required Outputs (in order)

#### 1. New High-Level Architecture

Produce a **top-level architecture diagram (described in text)** that includes:

* Core runtime
* UI adapters (CLI, mobile, desktop)
* Tool execution layer
* Permission engine
* Hooks engine
* Settings system
* Session/runtime state
* MCP integration

Each component should clearly state:

* Inputs
* Outputs
* Ownership boundaries
* Whether it is platform-agnostic

---

#### 2. Canonical Module Graph (TypeScript)

Define a **clean TS module structure**, for example:

```txt
core/
  runtime/
  permissions/
  hooks/
  tools/
  mcp/
  settings/
  sessions/
platform/
  node/
  web/
  mobile/
ui/
  cli/
  react/
```

For **each module**, explain:

* What responsibility it owns
* What it explicitly does NOT own
* What legacy subsystems from the encyclopedia it replaces

---

#### 3. Async-Only Execution Model

Explain how the rewrite handles:

* Tool execution
* Hooks
* Background agents
* Long-running tasks

**Without spawning processes**

You should propose replacements such as:

* Async task queues
* Cooperative scheduling
* AbortController-based cancellation
* Worker-style isolation without OS processes

Explicitly map:

* Old “spawned process” → new async construct

---

#### 4. Hooks System Redesign (Critical)

The current hooks system heavily relies on:

* Shell commands
* Child processes
* Environment variables
* STDIN/STDOUT contracts

You must redesign hooks so that they are:

* Pure async functions or declarative workflows
* Serializable
* Runnable in sandboxed/mobile environments

Include:

* A new hook definition schema
* Execution lifecycle
* How streaming feedback works without subprocesses

---

#### 5. MCP & Tool Execution Without Processes

Design how MCP tools and built-in tools:

* Execute asynchronously
* Stream results
* Enforce permissions
* Work in environments without `fs`, `net`, or `child_process`

Include:

* How endpoint mode vs direct mode changes
* How mobile/web environments are supported

---

#### 6. Migration Strategy (Non-Optional)

Provide a **step-by-step migration plan** from the current bundled CLIs to the new architecture:

* What can be shimmed
* What must be rewritten first
* What legacy behavior can be dropped or deferred
* How to validate correctness during the transition

---

### 🚫 Explicit Non-Goals

You must NOT:

* Reproduce minified symbol names
* Preserve bundler/runtime artifacts
* Re-implement third-party libraries
* Assume Node-only APIs unless abstracted

---

### ✅ Success Criteria

This rewrite is successful if:

* The core runtime could run inside a React Native app
* The CLI becomes a thin adapter, not the core
* No feature *requires* a child process to function
* The system is understandable without reading the old bundle

---

### 🧭 Tone & Style

* Be decisive, not tentative
* Prefer architectural clarity over backward compatibility
* Use diagrams (ASCII is fine), tables, and structured sections
* Treat this like a **technical design document for a v3 rewrite**

---

**React Native itself cannot run shell commands**, but **desktop apps built with React Native *can*** — *if* you put the shell access behind a **platform-specific host layer**.

The distinction matters a lot for the architecture you’re designing.

---

## The precise breakdown

### 1. React Native (core) ❌

React Native runs in:

* iOS (JavaScriptCore / Hermes)
* Android (Hermes / JSC)

These environments:

* **Do not have a shell**
* **Do not have `fork`, `spawn`, or `exec`**
* **Do not allow arbitrary process execution**
* **Do not expose the filesystem freely**

So **pure React Native cannot run shell commands** — and should not try.

This is non-negotiable.

---

### 2. Desktop apps *using* React Native ✅ (with a host)

If your **desktop app** is one of the following:

| Platform                         | Can run shell commands?        | How                               |
| -------------------------------- | ------------------------------ | --------------------------------- |
| **Electron**                     | ✅                              | Node.js backend (`child_process`) |
| **Tauri**                        | ✅                              | Rust backend (`Command`)          |
| **React Native macOS / Windows** | ⚠️ Yes, but via native modules |                                   |
| **Expo Desktop (experimental)**  | ⚠️ Limited / host-dependent    |                                   |

In all of these cases:

> **React Native is only the UI layer**
> **Shell execution lives in the host runtime**

This is the paradigm you want to preserve — but **correctly isolated**.

---

## The architectural rule you want

You **should keep shell execution as a capability**, but **never as a dependency of core logic**.

### Correct mental model

```
┌─────────────────────────────┐
│ React / React Native UI     │
│                             │
│  calls                       │
│   ↓                          │
│  ToolRuntime interface       │
└──────────────┬──────────────┘
               │
        Platform Adapter
               │
   ┌───────────┴───────────┐
   │                       │
Node Host            Mobile Host
(Electron/Tauri)     (No shell)
   │
Shell / OS
```

---

## What this means for your rewrite

### ✅ You CAN support shell commands if:

* They are **declared capabilities**
* They are **implemented only on supported hosts**
* They **fail gracefully or are substituted** elsewhere

### ❌ You should NOT:

* Call shell commands directly from “tool logic”
* Assume shell availability in hooks, tools, or permissions
* Use shell execution as a control-flow mechanism

---

## The correct abstraction (this is the key)

Instead of:

```ts
spawn("git", ["status"])
```

You design:

```ts
interface ShellExecutor {
  run(cmd: CommandSpec, opts: ExecOptions): AsyncResult<ExecOutput>
}
```

Then provide **host implementations**:

### Node / Desktop

```ts
NodeShellExecutor → child_process / Rust Command
```

### Mobile / Web

```ts
NullShellExecutor → throws CapabilityError
```

or:

```ts
RemoteShellExecutor → RPC to trusted desktop host
```

---

## How this aligns with your goals

You said:

> “I want to stop launching multiple processes and focus on async JS opportunities”

That does **not** mean:

* “No shell commands ever”

It means:

* **Shell is not your concurrency model**
* **Async tasks are**

Shell commands become:

* One *kind* of async effect
* Not the backbone of orchestration

---

## Practical examples

### ✔️ Good use of shell (desktop only)

* Git operations
* Ripgrep fallback
* Local tooling integrations
* Power-user workflows

### ❌ Bad use of shell (current codebase does this)

* Hook execution
* Permission evaluation
* Background agents
* State transitions
* Telemetry
* App lifecycle events

Those must become **pure async workflows**, not subprocesses.

---

## Final clarity statement

> **React Native cannot run shell commands.**
> **Desktop apps that host React Native can.**
> **Your rewrite should treat shell access as an optional host capability, not a core feature.**

----


**most users are iOS** *and* you also need **web**, the best architecture is usually:

### Keep React Native for the product UI, but make your “engine” platform-agnostic TypeScript.

Then ship it through:

* **React Native (iOS/Android)** as the main app
* **React (web)** for web users
* Optional **desktop host** later (Electron/Tauri) for “power features” like shell

That matches your current situation (a big JS/Node-ish CLI brain) and your stated goal (stop spawning processes, go async, run on mobile).

---

## Why not “rewrite it all in Swift”?

Swift is great for iOS performance and native UX, but **Swift does not buy you web**. You’d end up with:

* Swift app on iOS
* a *separate* web app in JS/TS anyway
* duplicated business logic unless you introduce a shared core (which is harder in Swift+web than TS+RN+web)

So if your goal is “one codebase across iOS + web”, **Swift-only is the wrong fit**.

The only time Swift-first wins here is if:

* your app is deeply OS-native (heavy camera/AR/BLE/background tasks)
* performance constraints dominate
* and web is secondary enough that duplication is acceptable

From your context (CLI/tooling/permissions/hooks/MCP/settings), your core complexity is **logic**, not native rendering. That’s a strong signal to keep the core in TS.

---

## The architecture I’d recommend (based on your context)

### 1) Core “Engine” (platform-agnostic TypeScript)

This is your rewrite target:

* runtime / scheduling
* permissions + rules engine
* hooks (redesigned to be async + portable)
* MCP client layer (portable transports)
* settings + merge logic (abstract storage)
* app state model (pure state machine + events)

**No Node assumptions**. Everything uses injected interfaces:

* storage (filesystem vs AsyncStorage vs IndexedDB)
* networking (fetch)
* crypto/uuid
* process/shell (capability-gated, often absent)
* telemetry

### 2) Platform Hosts (thin adapters)

* `host-ios` (React Native)
* `host-web` (React)
* optional later: `host-desktop` (Tauri/Electron) with shell

Each host provides the capabilities the engine requests.

### 3) UI

* RN UI for iOS
* React UI for web
  They share as much UI logic as practical (design system + view models), but the **engine is the real shared code**.

---

## How you keep “shell paradigm” without breaking iOS/web

Treat shell as a **capability** that only exists on some hosts:

* iOS: ❌ no shell
* web: ❌ no shell
* desktop host: ✅ shell via Rust/Node backend

So the engine never *requires* shell. It can:

* offer the same “tool” concept everywhere
* but certain tools are marked `requiresCapability("shell")`
* those tools either don’t appear on iOS/web or fall back to remote execution

If you truly need shell-like power for iOS users, the realistic options are:

* remote execution (call a server / your own agent host)
* WASM-based substitutes (e.g., ripgrep-wasm for search)
* implement native equivalents (expensive)

---

**Stay with React Native + Web (React), and do the rewrite as a portable TypeScript engine with host adapters.**


<FINAL GOAL>
Create an implementation plan that's exhaustive of what needs to happen to make this work and get this job done. The implementation plan should be in the form of a checklist. 

You are generating an **Implementation Plan**, not code.

This document is the **first iteration** of a long-lived implementation plan and **must not lock in premature details**. Your job is to design a **comprehensive, phased, checklist-based execution plan** for a full rewrite of my application.

---

## 1. Absolute Constraints (Read Carefully)

### 🚫 You MUST NOT:

* Write production code
* Write full function implementations
* Generate large code blocks
* Commit to exact APIs that are likely to change
* Optimize prematurely
* Skip steps because they feel “obvious”

### ✅ You MAY:

* Include **small illustrative code snippets** (interfaces, pseudo-types, or 5–10 line examples)
* Use pseudo-code or structural sketches
* Reference files, modules, and directories
* Use TODO-style placeholders where design is still evolving

If you are unsure whether something is “too code-like,” **err on the side of explanation, not implementation**.

---

## 2. Required Format (Non-Negotiable)

Your output **must follow this structure**:

### 📌 Title

A clear, descriptive title, e.g.:

> **<Project Name> — Initial Rewrite Implementation Checklist**

### 📄 Project Overview

A short but clear overview covering:

* What is being rewritten
* Why the rewrite exists
* High-level goals (platform reach, async-first, portability, maintainability)
* Explicit non-goals

---

### 🧩 Phased Checklist Structure

The document must be organized into **phases**, each with:

* A phase header:

  ```
  ***Phase N: <Phase Name>
  ```
* Subsections numbered `N.X`
* Individual checklist items written as **imperative actions**

Example style (you must match this tone):

```
3.2 Capability Abstraction Layer
Define the concept of “host capabilities” (storage, network, shell, clipboard)
Document which capabilities are required vs optional
Define failure semantics for missing capabilities
Decide how capability availability is queried at runtime
Add checklist item for revisiting capability granularity in later iterations
```

Every checklist item must be:

* Discrete
* Testable
* Reviewable
* Capable of being checked off independently

---

## 3. Verbosity & Depth Requirements

This plan should be **long and detailed**.

For each phase:

* Explain *why* the phase exists
* Explain *what risks it mitigates*
* Explain *what future phases depend on it*

For complex subsystems (runtime, permissions, hooks, MCP, settings):

* Include **design goals**
* Include **known open questions**
* Include **explicit “do not decide yet” notes**

Example:

> ⚠️ Do not finalize the hook execution API in this phase.
> Only define lifecycle boundaries and data flow.
> Exact signatures will be refined in a later iteration.

---

## 4. Checklist Style Rules (Very Important)

* Use **imperative verbs**: *Define*, *Design*, *Document*, *Decide*, *Validate*
* Avoid vague bullets like “Implement system”
* Prefer:

  * “Define error taxonomy for async task failures”
  * over
  * “Handle errors”

Each checklist item should represent **real engineering work**, not hand-waving.

---

## 5. Scope of the Plan

The plan must cover (at minimum):

### Core Rewrite

* Async-first runtime model
* Removal of subprocess-centric logic
* Deterministic scheduling and cancellation
* Event-driven architecture

### Platform Strategy

* Shared TypeScript engine
* React Native host (iOS primary)
* Web host
* Optional desktop host (capability-gated shell)

### Key Subsystems

* Permissions & rule engine
* Hooks (redesigned without shell dependence)
* Tool execution model
* MCP integration
* Settings & configuration
* App/session state
* Background work & agents

### Non-Functional Concerns

* Testability
* Observability
* Telemetry boundaries
* Performance guardrails
* Migration strategy from the legacy system

---

## 6. Iterative Mindset (Critical)

This plan is **Iteration 1**.

You must:

* Explicitly call out where later iterations will refine decisions
* Mark sections that are intentionally provisional
* Avoid claiming completeness or finality

Include a section near the end titled:

```
***Future Iterations & Deferred Decisions
```

---

## 7. Completion Criteria

End the document with:

* A **Completion Criteria** section
* A **Checklist Summary** (estimated number of checklist items)
* A **Notes & Assumptions** section

Use checkmarks (`✅`) only in the **criteria**, not throughout the plan.

---

## 8. Tone & Authority

Write like:

* A senior staff engineer
* Authoring a design execution plan for a multi-platform rewrite
* That will be reviewed, debated, and revised

Be:

* Confident
* Explicit
* Structured
* Conservative about locking in details

---

## 9. Final Instruction

Start immediately.

Do **not** ask clarifying questions.
Do **not** shorten the output.
Do **not** generate code.

Begin with the **Project Overview**, then **Phase 1**, and proceed sequentially.

 store Implementation Plan in: ./implementation/1-[description]
</FINAL GOAL>

NOTE YOU MUST FULLY READ @ClaudeAgentSDKCode/cli.js and @ClaudeCodeCode/cli.js entirely!!!