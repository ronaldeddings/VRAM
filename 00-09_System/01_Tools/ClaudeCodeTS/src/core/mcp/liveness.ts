export type McpKeepalivePolicy = {
  heartbeatIntervalMs: number;
  idleTimeoutMs: number;
  deadAfterMs: number;
};

export function normalizeKeepalivePolicy(policy: Partial<McpKeepalivePolicy> = {}): McpKeepalivePolicy {
  const heartbeatIntervalMs = Math.max(0, policy.heartbeatIntervalMs ?? 15_000);
  const idleTimeoutMs = Math.max(0, policy.idleTimeoutMs ?? 60_000);
  const deadAfterMs = Math.max(0, policy.deadAfterMs ?? 90_000);
  return { heartbeatIntervalMs, idleTimeoutMs, deadAfterMs };
}

