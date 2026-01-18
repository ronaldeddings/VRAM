import type { HostCapabilities } from "../../types/host.js";

export type BuiltInSubsystemTriggerPlan =
  | { kind: "time"; intervalMs: number; note?: string }
  | { kind: "event"; event: string; note?: string };

export type BuiltInSubsystemCapabilityPlan = {
  key: keyof HostCapabilities;
  optional?: boolean;
  note?: string;
};

export type BuiltInSubsystemPlan = {
  id: string;
  name: string;
  featureGates: string[];
  configKnobs: string[];
  triggers: BuiltInSubsystemTriggerPlan[];
  requiredCapabilities: BuiltInSubsystemCapabilityPlan[];
  mobileSafeFallback: string;
  privacyNotes: string[];
};

