export type CapabilityAuditRecord = {
  atMs: number;
  capability: string;
  operation: string;
};

export class CapabilityAuditLog {
  private readonly nowMs: () => number;
  private readonly _records: CapabilityAuditRecord[] = [];

  constructor(nowMs: () => number) {
    this.nowMs = nowMs;
  }

  record(capability: string, operation: string): void {
    this._records.push({ atMs: this.nowMs(), capability, operation });
  }

  records(): readonly CapabilityAuditRecord[] {
    return this._records;
  }
}

export function auditWrap<T extends object>(capability: string, value: T, audit: CapabilityAuditLog): T {
  return new Proxy(value, {
    get(target, prop, receiver) {
      const got = Reflect.get(target, prop, receiver) as unknown;
      if (typeof prop === "string") audit.record(capability, `get:${prop}`);
      if (typeof got === "function" && typeof prop === "string") {
        return function (this: unknown, ...args: unknown[]) {
          audit.record(capability, `call:${prop}`);
          return (got as (...innerArgs: unknown[]) => unknown).apply(this, args);
        };
      }
      return got;
    }
  });
}
