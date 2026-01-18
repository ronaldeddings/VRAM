import type { HostCapabilities } from "../types/host.js";

export type McpHostPlatform = "node" | "web" | "rn" | "unknown";

export type McpTransportCapabilityMatrix = Record<
  McpHostPlatform,
  {
    fetchStreaming: "required" | "optional" | "unsupported";
    sse: "optional" | "unsupported";
    webSocket: "optional" | "unsupported";
    directSockets: "optional" | "unsupported";
    notes?: string;
  }
>;

export const MCP_TRANSPORT_CAPABILITY_MATRIX: McpTransportCapabilityMatrix = {
  node: { fetchStreaming: "optional", sse: "optional", webSocket: "optional", directSockets: "optional" },
  web: {
    fetchStreaming: "optional",
    sse: "optional",
    webSocket: "optional",
    directSockets: "unsupported",
    notes: "Do not assume localhost reachability; CORS applies to endpoint mode."
  },
  rn: {
    fetchStreaming: "optional",
    sse: "unsupported",
    webSocket: "optional",
    directSockets: "unsupported",
    notes: "Background/foreground transitions may cancel network requests."
  },
  unknown: { fetchStreaming: "optional", sse: "optional", webSocket: "optional", directSockets: "optional" }
};

export function detectFetchStreamingSupport(): boolean {
  try {
    const hasReadableStream = typeof (globalThis as any).ReadableStream === "function";
    const hasBody = typeof (globalThis as any).Response === "function" && "body" in (globalThis as any).Response.prototype;
    return hasReadableStream && hasBody;
  } catch {
    return false;
  }
}

export function inferHostPlatform(host: HostCapabilities): McpHostPlatform {
  const proc = host.process;
  if (proc.kind === "available") {
    const p = proc.value.platform?.() ?? "";
    if (p === "darwin" || p === "linux" || p === "win32") return "node";
  }
  return "unknown";
}

