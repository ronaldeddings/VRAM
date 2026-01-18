export type McpErrorCode =
  | "config_missing"
  | "server_disabled"
  | "connection_failed"
  | "handshake_timeout"
  | "protocol_error"
  | "auth_failed"
  | "rate_limited"
  | "not_found"
  | "cancelled"
  | "unsupported"
  | "internal_error";

export class McpError extends Error {
  readonly code: McpErrorCode;
  readonly retryable: boolean;
  readonly details?: unknown;

  constructor(code: McpErrorCode, message: string, options?: { retryable?: boolean; cause?: unknown; details?: unknown }) {
    super(message, options?.cause ? { cause: options.cause } : undefined);
    this.name = "McpError";
    this.code = code;
    this.retryable = options?.retryable ?? false;
    if (options?.details !== undefined) this.details = options.details;
  }
}

export class ConfigMissingError extends McpError {
  constructor(message = "MCP config missing", options?: { cause?: unknown; details?: unknown }) {
    super("config_missing", message, { retryable: false, ...options });
    this.name = "ConfigMissingError";
  }
}

export class ServerDisabledError extends McpError {
  constructor(message = "MCP server disabled", options?: { cause?: unknown; details?: unknown }) {
    super("server_disabled", message, { retryable: false, ...options });
    this.name = "ServerDisabledError";
  }
}

export class ConnectionFailedError extends McpError {
  constructor(message = "MCP connection failed", options?: { retryable?: boolean; cause?: unknown; details?: unknown }) {
    super("connection_failed", message, { retryable: options?.retryable ?? true, ...options });
    this.name = "ConnectionFailedError";
  }
}

export class HandshakeTimeoutError extends McpError {
  constructor(message = "MCP handshake timeout", options?: { cause?: unknown; details?: unknown }) {
    super("handshake_timeout", message, { retryable: true, ...options });
    this.name = "HandshakeTimeoutError";
  }
}

export class ProtocolError extends McpError {
  constructor(message = "MCP protocol error", options?: { cause?: unknown; details?: unknown }) {
    super("protocol_error", message, { retryable: false, ...options });
    this.name = "ProtocolError";
  }
}

export class AuthFailedError extends McpError {
  constructor(message = "MCP auth failed", options?: { cause?: unknown; details?: unknown }) {
    super("auth_failed", message, { retryable: false, ...options });
    this.name = "AuthFailedError";
  }
}

export class RateLimitedError extends McpError {
  constructor(message = "MCP rate limited", options?: { retryable?: boolean; cause?: unknown; details?: unknown }) {
    super("rate_limited", message, { retryable: options?.retryable ?? true, ...options });
    this.name = "RateLimitedError";
  }
}

export class NotFoundError extends McpError {
  constructor(message = "MCP not found", options?: { cause?: unknown; details?: unknown }) {
    super("not_found", message, { retryable: false, ...options });
    this.name = "NotFoundError";
  }
}

export class CancelledError extends McpError {
  constructor(message = "MCP request cancelled", options?: { cause?: unknown; details?: unknown }) {
    super("cancelled", message, { retryable: false, ...options });
    this.name = "CancelledError";
  }
}

export function isRetryableMcpError(error: unknown): boolean {
  return error instanceof McpError && error.retryable === true;
}

export function toMcpError(error: unknown): McpError {
  if (error instanceof McpError) return error;
  if (error instanceof Error && (error as any).name === "AbortError") return new CancelledError("MCP request aborted", { cause: error });
  if (error instanceof Error) return new McpError("internal_error", error.message, { cause: error });
  return new McpError("internal_error", String(error));
}
