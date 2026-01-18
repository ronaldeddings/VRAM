import type { HostCapabilities } from "../types/host.js";
import { CapabilityUnavailableError } from "../types/host.js";
import { retryWithBackoff, type BackoffConfig } from "../network/retry.js";
import { assertValidMcpRequestEnvelopeV1, assertValidMcpResponseEnvelopeV1, type McpRequestEnvelopeV1, type McpResponseEnvelopeV1 } from "./envelope.js";
import { AuthFailedError, ConfigMissingError, ConnectionFailedError, HandshakeTimeoutError, ProtocolError, RateLimitedError, toMcpError } from "./errors.js";
import type { McpEndpointConfig } from "./types.js";

function isExplicitFalse(v: string | undefined): boolean {
  if (!v) return false;
  const s = v.trim().toLowerCase();
  return s === "0" || s === "false" || s === "off";
}

export type EndpointRequestOptions = {
  timeoutMs?: number;
  signal?: AbortSignal;
  retry?: { maxAttempts: number; backoff: BackoffConfig; sleep: (ms: number) => Promise<void> };
  credentials?: RequestCredentials;
  skipTelemetry?: boolean;
};

function mergeSignals(a: AbortSignal | undefined, b: AbortSignal | undefined): AbortSignal | undefined {
  if (!a) return b;
  if (!b) return a;
  const ctrl = new AbortController();
  const onAbort = () => ctrl.abort(a.reason ?? b.reason);
  if (a.aborted || b.aborted) {
    onAbort();
    return ctrl.signal;
  }
  a.addEventListener("abort", onAbort, { once: true });
  b.addEventListener("abort", onAbort, { once: true });
  return ctrl.signal;
}

function timeoutSignal(ms: number): AbortSignal {
  if (typeof AbortSignal !== "undefined" && typeof (AbortSignal as any).timeout === "function") {
    return (AbortSignal as any).timeout(ms) as AbortSignal;
  }
  const ctrl = new AbortController();
  setTimeout(() => ctrl.abort(new Error("timeout")), ms);
  return ctrl.signal;
}

function mapFetchError(err: unknown): Error {
  const e = toMcpError(err);
  if (e.code === "cancelled") return e;
  return new ConnectionFailedError(e.message, { cause: err, retryable: true });
}

function mapHttpError(status: number, body: unknown): Error {
  const msg =
    typeof body === "object" && body !== null && "error" in (body as any) && typeof (body as any).error === "string"
      ? ((body as any).error as string)
      : `HTTP ${status}`;

  if (status === 401 || status === 403) return new AuthFailedError(msg, { details: body });
  if (status === 429) return new RateLimitedError(msg, { details: body });
  if (status >= 500) return new ConnectionFailedError(msg, { retryable: true, details: body });
  return new ProtocolError(msg, { details: body });
}

export async function callMcpEndpoint(
  host: HostCapabilities,
  endpoint: McpEndpointConfig | null,
  req: McpRequestEnvelopeV1,
  options: EndpointRequestOptions = {}
): Promise<McpResponseEnvelopeV1> {
  const network = host.network;
  if (network.kind !== "available") throw new CapabilityUnavailableError("network", network.reason);
  if (!endpoint) throw new ConfigMissingError("MCP endpoint config missing");

  const url = new URL("/mcp", endpoint.url).toString();
  const sendOnce = async (): Promise<McpResponseEnvelopeV1> => {
    const validatedReq = assertValidMcpRequestEnvelopeV1(req);
    const timeoutMs = Math.max(0, options.timeoutMs ?? 10_000);
    const tSig = timeoutMs > 0 ? timeoutSignal(timeoutMs) : undefined;
    const signal = mergeSignals(options.signal, tSig);

    let res: Response;
    try {
      res = await network.value.fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${endpoint.bearerKey}`,
          "Content-Type": "application/json"
        },
        credentials: options.credentials ?? "omit",
        body: JSON.stringify(validatedReq),
        ...(signal ? { signal } : {})
      });
    } catch (err) {
      if (signal?.aborted) throw new HandshakeTimeoutError("Request timeout", { cause: err });
      throw mapFetchError(err);
    }

    const text = await res.text();
    let data: unknown = null;
    if (text.trim() !== "") {
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new ProtocolError("Invalid JSON from MCP endpoint", { cause: err, details: { text: text.slice(0, 1024) } });
      }
    }

    if (!res.ok) throw mapHttpError(res.status, data);
    return assertValidMcpResponseEnvelopeV1(data);
  };

  if (options.retry && !isExplicitFalse(host.process.kind === "available" ? host.process.value.getEnv?.("MCP_DISABLE_RETRY") : undefined)) {
    return await retryWithBackoff(
      async () => {
        return await sendOnce();
      },
      {
        maxAttempts: options.retry.maxAttempts,
        backoff: options.retry.backoff,
        sleep: options.retry.sleep,
        ...(options.signal ? { signal: options.signal } : {}),
        shouldRetry: (err) => {
          const e = toMcpError(err);
          return e.retryable === true;
        }
      }
    );
  }

  return await sendOnce();
}
