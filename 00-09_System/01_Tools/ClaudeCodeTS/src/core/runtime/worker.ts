import type { CancellationReason } from "../types/runtime.js";
import type { Capability, HostCapabilities } from "../types/host.js";
import { unavailableCapability } from "../types/host.js";
import { createCapabilityView } from "../capabilities/view.js";

export type JsonSerializable =
  | null
  | boolean
  | number
  | string
  | JsonSerializable[]
  | { [k: string]: JsonSerializable };

export type WorkerRequest = {
  id: string;
  type: string;
  payload: JsonSerializable;
};

export type WorkerResponse =
  | { id: string; ok: true; payload: JsonSerializable }
  | { id: string; ok: false; error: string };

export type WorkerPort = {
  post: (msg: WorkerRequest) => Promise<void>;
  onMessage: (handler: (msg: WorkerResponse) => void) => () => void;
  close?: () => Promise<void>;
};

export type WorkerHandler = (req: WorkerRequest, ctx: { signal?: AbortSignal }) => Promise<WorkerResponse>;

export function assertJsonSerializable(value: unknown): asserts value is JsonSerializable {
  try {
    JSON.stringify(value);
  } catch (e) {
    throw new Error(`Value is not JSON-serializable: ${e instanceof Error ? e.message : String(e)}`);
  }
}

export function createInMemoryWorkerPair(handler: WorkerHandler): { main: WorkerPort; worker: WorkerPort } {
  const mainHandlers = new Set<(msg: WorkerResponse) => void>();
  const workerHandlers = new Set<(msg: WorkerResponse) => void>();

  const deliver = async (handlers: Set<(msg: WorkerResponse) => void>, msg: WorkerResponse) => {
    for (const h of handlers) h(msg);
  };

  const mkPort = (direction: "main_to_worker" | "worker_to_main"): WorkerPort => {
    const isMain = direction === "main_to_worker";
    return {
      post: async (req) => {
        assertJsonSerializable(req.payload);
        if (isMain) {
          const res = await handler(req, {});
          await deliver(mainHandlers, res);
        } else {
          await deliver(workerHandlers, { id: req.id, ok: true, payload: req.payload });
        }
      },
      onMessage: (cb) => {
        const set = isMain ? mainHandlers : workerHandlers;
        set.add(cb);
        return () => set.delete(cb);
      }
    };
  };

  return { main: mkPort("main_to_worker"), worker: mkPort("worker_to_main") };
}

export async function callWorker(port: WorkerPort, request: WorkerRequest, options: { signal?: AbortSignal; timeoutMs?: number } = {}): Promise<WorkerResponse> {
  if (options.signal?.aborted) throw options.signal.reason ?? new Error("aborted");
  const controller = new AbortController();
  if (options.signal) options.signal.addEventListener("abort", () => controller.abort(options.signal!.reason), { once: true });

  return await new Promise<WorkerResponse>((resolve, reject) => {
    const timeout = options.timeoutMs
      ? setTimeout(() => {
          controller.abort({ kind: "timeout", message: "worker call timeout" } satisfies CancellationReason);
        }, options.timeoutMs)
      : null;

    const unsub = port.onMessage((msg) => {
      if (msg.id !== request.id) return;
      if (timeout) clearTimeout(timeout);
      unsub();
      resolve(msg);
    });

    const onAbort = () => {
      if (timeout) clearTimeout(timeout);
      unsub();
      reject(controller.signal.reason ?? new Error("aborted"));
    };
    controller.signal.addEventListener("abort", onAbort, { once: true });

    port
      .post(request)
      .catch((err) => {
        if (timeout) clearTimeout(timeout);
        unsub();
        reject(err);
      })
      .finally(() => {
        controller.signal.removeEventListener("abort", onAbort);
      });
  });
}

export function filterHostCapabilitiesForWorker(
  host: HostCapabilities,
  allowed: readonly (keyof HostCapabilities)[],
  options?: { policyId?: string }
): HostCapabilities {
  const filtered = createCapabilityView(host, allowed, { policyId: options?.policyId ?? "worker" });
  const deny: Partial<Record<keyof HostCapabilities, Capability<any>>> = {
    secrets: unavailableCapability({ kind: "disabled", message: "secrets not available in worker" }),
    ipc: unavailableCapability({ kind: "disabled", message: "ipc not available in worker" })
  };
  return { ...filtered, ...deny } as HostCapabilities;
}

