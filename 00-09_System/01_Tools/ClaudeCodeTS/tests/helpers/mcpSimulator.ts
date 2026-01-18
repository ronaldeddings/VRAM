import type { McpEnvelopeV1, McpRequestEnvelopeV1, McpResponseEnvelopeV1, McpToolCallParams, McpToolStreamEvent } from "../../src/core/mcp/types.js";
import type { McpTransport } from "../../src/core/mcp/transport.js";
import { CancelledError, ProtocolError } from "../../src/core/mcp/errors.js";
import type { DeterministicScheduler } from "../../src/core/runtime/scheduler.js";

export type SimulatedMcpHandler = (req: McpRequestEnvelopeV1) => Promise<McpResponseEnvelopeV1> | McpResponseEnvelopeV1;

export type SimulatedMcpToolHandler = (params: McpToolCallParams) => AsyncIterable<McpToolStreamEvent>;

export type SimulatedMcpTransportOptions = {
  scheduler?: DeterministicScheduler;
  delayMs?: number;
  handler: SimulatedMcpHandler;
  toolHandler?: SimulatedMcpToolHandler;
};

async function maybeDelay(scheduler: DeterministicScheduler | undefined, delayMs: number | undefined, signal?: AbortSignal): Promise<void> {
  if (!delayMs || delayMs <= 0) return;
  if (!scheduler) return;
  await scheduler.sleep(undefined, delayMs, { ...(signal ? { signal } : {}) });
}

function assertRequest(req: McpEnvelopeV1): McpRequestEnvelopeV1 {
  if (req.type !== "request") throw new ProtocolError(`Expected request envelope, got: ${req.type}`);
  return req as McpRequestEnvelopeV1;
}

export function createSimulatedMcpTransport(options: SimulatedMcpTransportOptions): McpTransport {
  return {
    mode: "direct",
    capabilities: { supportsStreaming: true },
    send: async (req, sendOptions) => {
      const request = assertRequest(req);
      if (sendOptions?.signal?.aborted) throw new CancelledError("aborted");
      await maybeDelay(options.scheduler, options.delayMs, sendOptions?.signal);
      if (sendOptions?.signal?.aborted) throw new CancelledError("aborted");
      return await options.handler(request);
    },
    callToolStream: async function* (params, callOptions) {
      if (callOptions?.signal?.aborted) throw new CancelledError("aborted");
      await maybeDelay(options.scheduler, options.delayMs, callOptions?.signal);
      if (callOptions?.signal?.aborted) throw new CancelledError("aborted");
      if (!options.toolHandler) {
        yield { kind: "final", value: { ok: true } };
        return;
      }
      yield* options.toolHandler(params);
    }
  };
}

