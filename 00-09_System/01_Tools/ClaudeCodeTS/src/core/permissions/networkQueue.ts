import { createDeferred } from "../runtime/deferred.js";
import type { Deferred } from "../runtime/deferred.js";
import type { NetworkApprovalDecision, NetworkApprovalRequest } from "./types.js";

type Pending = {
  request: NetworkApprovalRequest;
  dedupeKey: string;
  deferred: Deferred<NetworkApprovalDecision>;
  createdSeq: number;
};

export class NetworkApprovalQueue {
  private seq = 0;
  private readonly pendingByRequestId = new Map<string, Pending>();
  private readonly pendingByDedupeKey = new Map<string, Pending>();
  private readonly ordered: Pending[] = [];

  size(): number {
    return this.ordered.length;
  }

  snapshot(): NetworkApprovalRequest[] {
    return this.ordered.map((p) => p.request);
  }

  enqueue(request: NetworkApprovalRequest, dedupeKey: string): Promise<NetworkApprovalDecision> {
    const existing = this.pendingByDedupeKey.get(dedupeKey);
    if (existing) return existing.deferred.promise;

    const deferred = createDeferred<NetworkApprovalDecision>();
    const createdSeq = ++this.seq;
    const pending: Pending = { request, dedupeKey, deferred, createdSeq };
    this.pendingByRequestId.set(request.requestId, pending);
    this.pendingByDedupeKey.set(dedupeKey, pending);
    this.ordered.push(pending);
    this.ordered.sort((a, b) => (a.request.createdAtMonoMs !== b.request.createdAtMonoMs ? a.request.createdAtMonoMs - b.request.createdAtMonoMs : a.createdSeq - b.createdSeq));
    return deferred.promise;
  }

  resolve(requestId: string, decision: NetworkApprovalDecision): boolean {
    const pending = this.pendingByRequestId.get(requestId);
    if (!pending) return false;
    this.remove(pending);
    pending.deferred.resolve(decision);
    return true;
  }

  cancel(requestId: string, reason = "cancelled"): boolean {
    const pending = this.pendingByRequestId.get(requestId);
    if (!pending) return false;
    this.remove(pending);
    pending.deferred.reject(new Error(reason));
    return true;
  }

  private remove(p: Pending): void {
    this.pendingByRequestId.delete(p.request.requestId);
    this.pendingByDedupeKey.delete(p.dedupeKey);
    const idx = this.ordered.indexOf(p);
    if (idx >= 0) this.ordered.splice(idx, 1);
  }
}

