import type { HostCapabilities, HostTelemetry } from "../types/host.js";
import { SCHEMA_VERSION } from "../types/schema.js";
import type { TelemetryDropStats, TelemetryEventClass, TelemetryEventEnvelopeV1, TelemetryFields, TelemetryPrivacyTier } from "../types/observability.js";
import type { JsonObject } from "../types/json.js";
import type { Sampler } from "./sampling.js";
import { createDeterministicSampler } from "./sampling.js";

export type TelemetryDedupeDecision = { emit: true } | { emit: false; reason: string };

export type TelemetryDedupePolicy = {
  decide: (evt: { name: string; class: TelemetryEventClass }) => TelemetryDedupeDecision;
};

export function createEndpointModeTelemetryDedupePolicy(options: { endpointModeActive: boolean }): TelemetryDedupePolicy {
  const endpoint = options.endpointModeActive;
  return {
    decide: ({ class: eventClass }) => {
      if (!endpoint) return { emit: true };
      if (eventClass === "crash" || eventClass === "health") return { emit: true };
      return { emit: false, reason: "endpoint_mode_dedupe" };
    }
  };
}

export function isTelemetryOptedOutFromEnv(env: Record<string, string | undefined>): boolean {
  const v = (env.DO_NOT_TRACK ?? env.CLAUDE_TS_DISABLE_TELEMETRY ?? "").toLowerCase().trim();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

function isPlainObject(value: unknown): value is JsonObject {
  if (value === null || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export type TelemetryPolicy = {
  enabled: boolean;
  reason?: string;
  managedEndpoint?: string;
  managedOnly?: boolean;
};

export function resolveTelemetryPolicy(options: {
  env: Record<string, string | undefined>;
  effectiveSettings?: JsonObject;
  policySettings?: JsonObject | null;
  policyOrigin?: "absent" | "invalid" | "local" | "remote";
}): TelemetryPolicy {
  if (isTelemetryOptedOutFromEnv(options.env)) return { enabled: false, reason: "opt_out_env" };

  const merged: JsonObject = {};
  if (options.effectiveSettings) Object.assign(merged, options.effectiveSettings);
  if (options.policySettings && isPlainObject(options.policySettings)) Object.assign(merged, options.policySettings);

  const topDisable = merged["disableTelemetry"];
  if (topDisable === true) return { enabled: false, reason: "settings_disableTelemetry" };

  const telemetry = merged["telemetry"];
  if (!isPlainObject(telemetry)) return { enabled: true };

  const enabled = telemetry["enabled"];
  const disabled = telemetry["disabled"];
  if (disabled === true) return { enabled: false, reason: "settings_telemetry.disabled" };
  if (enabled === false) return { enabled: false, reason: "settings_telemetry.enabled_false" };

  const endpoint = telemetry["endpoint"];
  const managedOnly = telemetry["managedOnly"];
  const policy = {
    enabled: true,
    ...(typeof endpoint === "string" && endpoint.trim() ? { managedEndpoint: endpoint.trim() } : {}),
    ...(managedOnly === true ? { managedOnly: true } : {})
  } satisfies TelemetryPolicy;

  if (policy.managedOnly && !policy.managedEndpoint) return { enabled: false, reason: "policy_managed_only_missing_endpoint", managedOnly: true };
  return policy;
}

function sanitizeFields(fields?: TelemetryFields): TelemetryFields | undefined {
  if (!fields) return undefined;
  const out: TelemetryFields = {};
  for (const [k, v] of Object.entries(fields)) {
    if (!k) continue;
    if (k.length > 128) continue;
    if (v === null || typeof v === "string" || typeof v === "number" || typeof v === "boolean") out[k] = v;
    else if (Array.isArray(v)) out[k] = v.filter((x) => x === null || typeof x === "string" || typeof x === "number" || typeof x === "boolean");
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export type TelemetryReporter = {
  emit: (evt: { name: string; class: TelemetryEventClass; privacy?: TelemetryPrivacyTier; fields?: TelemetryFields; correlationId?: string }) => Promise<void>;
  flush: () => Promise<void>;
  getSuppressedByDedupe: () => Record<string, number>;
  getDropStats: () => TelemetryDropStats | undefined;
};

export function createTelemetryReporter(options: {
  host: HostCapabilities;
  env: Record<string, string | undefined>;
  dedupe?: TelemetryDedupePolicy;
  samplerSeed?: string;
  sampler?: Sampler;
  correlationId?: string;
  effectiveSettings?: JsonObject;
  policySettings?: JsonObject | null;
  policyOrigin?: "absent" | "invalid" | "local" | "remote";
}): TelemetryReporter {
  const policy = resolveTelemetryPolicy({
    env: options.env,
    ...(options.effectiveSettings ? { effectiveSettings: options.effectiveSettings } : {}),
    ...(options.policySettings !== undefined ? { policySettings: options.policySettings } : {}),
    ...(options.policyOrigin !== undefined ? { policyOrigin: options.policyOrigin } : {})
  });
  const transport: HostTelemetry | null =
    policy.enabled ? (options.host.telemetry.kind === "available" ? options.host.telemetry.value : null) : null;
  const sampler = options.sampler ?? createDeterministicSampler(options.samplerSeed ?? "telemetry");
  const dedupe = options.dedupe ?? { decide: () => ({ emit: true }) };
  const suppressed: Record<string, number> = {};

  return {
    emit: async ({ name, class: eventClass, privacy, fields, correlationId }) => {
      if (!transport) return;
      const decision = dedupe.decide({ name, class: eventClass });
      if (!decision.emit) {
        suppressed[decision.reason] = (suppressed[decision.reason] ?? 0) + 1;
        return;
      }

      const sampled = sampler.shouldSample(`${eventClass}:${name}`, eventClass === "debug" ? 0.1 : 1);
      if (!sampled) {
        suppressed["sampled_out"] = (suppressed["sampled_out"] ?? 0) + 1;
        return;
      }

      const corr = correlationId ?? options.correlationId;
      const sanitizedFields = sanitizeFields(fields);
      const evt: TelemetryEventEnvelopeV1 = {
        kind: "telemetry_event",
        schemaVersion: SCHEMA_VERSION.telemetryEvent,
        name,
        class: eventClass,
        tsWallMs: Date.now(),
        privacy: privacy ?? "internal",
        ...(corr ? { correlationId: corr } : {}),
        ...(sanitizedFields ? { fields: sanitizedFields } : {})
      };

      await transport.enqueue(evt);
    },
    flush: async () => {
      if (!transport) return;
      if (transport.flush) await transport.flush();
    },
    getSuppressedByDedupe: () => ({ ...suppressed }),
    getDropStats: () => (transport && transport.getDropStats ? transport.getDropStats() : undefined)
  };
}
