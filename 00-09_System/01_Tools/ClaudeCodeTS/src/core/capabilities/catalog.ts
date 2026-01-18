import type { HostCapabilities } from "../types/host.js";

export type HostPlatformKind = "node" | "desktop" | "web" | "rn";

export type HostCapabilityKey = keyof HostCapabilities;

export type HostCapabilityDescriptor = {
  key: HostCapabilityKey;
  optional: boolean;
  summary: string;
  polyfillAllowed?: Partial<Record<HostPlatformKind, boolean>>;
};

export const HOST_CAPABILITIES: readonly HostCapabilityDescriptor[] = [
  { key: "clock", optional: false, summary: "Time source (monotonic + optional wall clock)" },
  { key: "random", optional: false, summary: "UUID/randomness (portable)" },
  {
    key: "crypto",
    optional: true,
    summary: "Portable crypto primitives (e.g., digest)",
    polyfillAllowed: { web: true, rn: true, desktop: true, node: true }
  },
  {
    key: "storage",
    optional: false,
    summary: "Portable persistence (CAS/atomic)",
    polyfillAllowed: { web: true, rn: true, desktop: true, node: true }
  },
  { key: "secrets", optional: false, summary: "Secret storage (tokens/keys)", polyfillAllowed: { web: false, rn: true } },
  { key: "network", optional: false, summary: "Fetch-based networking (streaming-aware)", polyfillAllowed: { rn: true } },
  { key: "lifecycle", optional: false, summary: "Foreground/background/connectivity events" },
  { key: "background", optional: true, summary: "Optional background execution coordination" },
  { key: "fileTransfer", optional: true, summary: "Optional file import/export (picker/downloads)" },
  { key: "filesystem", optional: true, summary: "Optional filesystem abstraction (sandboxed)", polyfillAllowed: { web: false, rn: false } },
  { key: "clipboard", optional: true, summary: "Clipboard affordances" },
  { key: "notifications", optional: true, summary: "Notifications affordances" },
  { key: "haptics", optional: true, summary: "Haptics affordances" },
  { key: "shell", optional: true, summary: "Optional shell-like automation (non-required)" },
  { key: "localEndpoint", optional: true, summary: "Optional local endpoint exposure (policy-gated)" },
  { key: "ipc", optional: true, summary: "Optional IPC/extension bridge (policy-gated)" },
  { key: "process", optional: true, summary: "Optional process/env access (restricted)" }
] as const;
