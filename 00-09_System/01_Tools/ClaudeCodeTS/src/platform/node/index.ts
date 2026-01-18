export * from "./host.js";
export * from "./workspace.js";
export * from "./streamAdapters.js";

import type { CapabilityKey } from "../smoke.js";

export const NODE_REQUIRED_CAPABILITIES = [
  "clock",
  "random",
  "secrets",
  "storage",
  "network",
  "lifecycle",
  "filesystem"
] as const satisfies readonly CapabilityKey[];

export type NodePlatform = {
  phase: "4";
  host: "node";
};
