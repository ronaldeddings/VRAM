import { canonicalJsonStringify } from "../types/canonicalJson.js";
import type { PermissionDecision } from "./types.js";

export type PermissionDecisionCacheKeyParts = {
  toolName: string;
  inputRiskSignature: unknown;
  workspaceId?: string;
  workspaceTrust?: "trusted" | "untrusted" | "unknown";
  effectiveConfigHash?: string;
  policyHash?: string;
  capabilityFingerprint?: string;
};

export function buildPermissionDecisionCacheKey(parts: PermissionDecisionCacheKeyParts): string {
  return canonicalJsonStringify(parts);
}

export function isCacheablePermissionDecision(decision: PermissionDecision): boolean {
  return decision.behavior === "allow" || decision.behavior === "deny";
}

type CacheEntry = { decision: PermissionDecision; lastAccessTick: number; createdTick: number };

export class PermissionDecisionCache {
  private readonly maxEntries: number;
  private tick = 0;
  private readonly map = new Map<string, CacheEntry>();

  constructor(options: { maxEntries: number }) {
    this.maxEntries = Math.max(0, options.maxEntries);
  }

  size(): number {
    return this.map.size;
  }

  clear(): void {
    this.map.clear();
  }

  invalidateWhere(predicate: (key: string) => boolean): void {
    for (const key of this.map.keys()) {
      if (predicate(key)) this.map.delete(key);
    }
  }

  get(key: string): PermissionDecision | null {
    const entry = this.map.get(key);
    if (!entry) return null;
    this.tick += 1;
    entry.lastAccessTick = this.tick;
    return entry.decision;
  }

  set(key: string, decision: PermissionDecision): void {
    if (this.maxEntries === 0) return;
    this.tick += 1;
    const existing = this.map.get(key);
    if (existing) {
      existing.decision = decision;
      existing.lastAccessTick = this.tick;
      return;
    }

    this.map.set(key, { decision, lastAccessTick: this.tick, createdTick: this.tick });
    this.evictIfNeeded();
  }

  private evictIfNeeded(): void {
    if (this.map.size <= this.maxEntries) return;
    const entries = [...this.map.entries()];
    entries.sort((a, b) => {
      const ea = a[1];
      const eb = b[1];
      if (ea.lastAccessTick !== eb.lastAccessTick) return ea.lastAccessTick - eb.lastAccessTick;
      return ea.createdTick - eb.createdTick;
    });
    const toEvict = entries.slice(0, Math.max(0, this.map.size - this.maxEntries));
    for (const [key] of toEvict) this.map.delete(key);
  }
}

