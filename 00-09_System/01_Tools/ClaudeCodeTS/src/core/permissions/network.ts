import type { PermissionDiagnostic } from "./types.js";
import type { CanonicalNetworkTarget } from "./types.js";

const DEFAULT_PORT: Record<CanonicalNetworkTarget["scheme"], number> = {
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
};

function isValidPort(n: number): boolean {
  return Number.isInteger(n) && n >= 1 && n <= 65535;
}

function parseIpv4(host: string): number[] | null {
  const parts = host.split(".");
  if (parts.length !== 4) return null;
  const out: number[] = [];
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) return null;
    const n = Number.parseInt(p, 10);
    if (n < 0 || n > 255) return null;
    out.push(n);
  }
  return out;
}

function classifyIpv4(octets: number[]): CanonicalNetworkTarget["classification"] {
  const [a, b] = octets;
  if (a === 127) return "loopback";
  if (a === 10) return "private";
  if (a === 172 && b !== undefined && b >= 16 && b <= 31) return "private";
  if (a === 192 && b === 168) return "private";
  if (a === 169 && b === 254) return "link_local";
  return "public";
}

function isIpv6(host: string): boolean {
  return host.includes(":");
}

function expandIpv6(host: string): number[] | null {
  const h = host.toLowerCase();
  const idx = h.indexOf("::");
  const left = idx >= 0 ? h.slice(0, idx) : h;
  const right = idx >= 0 ? h.slice(idx + 2) : "";
  const leftParts = left.length > 0 ? left.split(":") : [];
  const rightParts = idx >= 0 && right.length > 0 ? right.split(":") : idx >= 0 ? [] : [];

  const total = idx >= 0 ? leftParts.length + rightParts.length : leftParts.length;
  if (idx < 0 && total !== 8) return null;
  if (idx >= 0 && total > 8) return null;

  const zerosToInsert = idx >= 0 ? 8 - total : 0;
  const parts: string[] = idx >= 0 ? [...leftParts, ...new Array(zerosToInsert).fill("0"), ...rightParts] : leftParts;
  if (parts.length !== 8) return null;

  const out: number[] = [];
  for (const part of parts) {
    if (!/^[0-9a-f]{0,4}$/.test(part)) return null;
    const n = part.length === 0 ? 0 : Number.parseInt(part, 16);
    if (!Number.isFinite(n) || n < 0 || n > 0xffff) return null;
    out.push(n);
  }
  return out;
}

function classifyIpv6(host: string): CanonicalNetworkTarget["classification"] {
  const hextets = expandIpv6(host);
  if (!hextets) return "public";
  const isLoopback = hextets.slice(0, 7).every((n) => n === 0) && hextets[7] === 1;
  if (isLoopback) return "loopback";

  const first = hextets[0]!;
  if ((first & 0xffc0) === 0xfe80) return "link_local";
  if ((first & 0xfe00) === 0xfc00) return "private";
  return "public";
}

function classifyHostname(host: string): CanonicalNetworkTarget["classification"] {
  const h = host.toLowerCase();
  if (h === "localhost" || h === "localhost.") return "loopback";
  return "unknown";
}

function normalizeHostname(host: string): { host: string; hostKind: CanonicalNetworkTarget["hostKind"]; classification: CanonicalNetworkTarget["classification"] } {
  const lower = host.toLowerCase();
  const bracketedIpv6 = lower.startsWith("[") && lower.endsWith("]") ? lower.slice(1, -1) : null;
  if (bracketedIpv6 && isIpv6(bracketedIpv6)) {
    return { host: bracketedIpv6, hostKind: "ipv6", classification: classifyIpv6(bracketedIpv6) };
  }
  const ipv4 = parseIpv4(lower);
  if (ipv4) return { host: ipv4.join("."), hostKind: "ipv4", classification: classifyIpv4(ipv4) };
  if (isIpv6(lower)) return { host: lower, hostKind: "ipv6", classification: classifyIpv6(lower) };
  return { host: lower, hostKind: "hostname", classification: classifyHostname(lower) };
}

export function canonicalizeNetworkTargetFromUrl(input: string): { ok: true; target: CanonicalNetworkTarget; diagnostics: PermissionDiagnostic[] } | { ok: false; diagnostics: PermissionDiagnostic[] } {
  const diagnostics: PermissionDiagnostic[] = [];
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return { ok: false, diagnostics: [{ kind: "invalid_network_target", input, message: "Invalid URL" }] };
  }

  const schemeRaw = url.protocol.replace(/:$/, "");
  if (schemeRaw !== "http" && schemeRaw !== "https" && schemeRaw !== "ws" && schemeRaw !== "wss") {
    return { ok: false, diagnostics: [{ kind: "invalid_network_target", input, message: `Unsupported scheme: ${schemeRaw}` }] };
  }
  const scheme = schemeRaw as CanonicalNetworkTarget["scheme"];

  const hostRaw = url.hostname;
  if (!hostRaw) return { ok: false, diagnostics: [{ kind: "invalid_network_target", input, message: "Missing host" }] };
  if (/[\\s]/.test(hostRaw)) return { ok: false, diagnostics: [{ kind: "invalid_network_target", input, message: "Invalid host" }] };

  const { host, hostKind, classification } = normalizeHostname(hostRaw);
  const port = url.port ? Number.parseInt(url.port, 10) : DEFAULT_PORT[scheme];
  if (!isValidPort(port)) return { ok: false, diagnostics: [{ kind: "invalid_network_target", input, message: "Invalid port" }] };

  return { ok: true, target: { scheme, host, port, hostKind, classification }, diagnostics };
}

export type RedirectApprovalPolicy = "approve_final_only" | "approve_each_hop";

export const LEGACY_NETWORK_DOMAIN_RULE_TOOL_NAME = "WebFetch";

export function formatLegacyNetworkDomainRule(host: string): string {
  return `domain:${host}`;
}
