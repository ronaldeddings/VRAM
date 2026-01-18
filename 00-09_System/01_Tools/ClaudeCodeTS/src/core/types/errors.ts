export type EngineErrorCode =
  | "capability_missing"
  | "permission_denied"
  | "policy_override"
  | "conflict"
  | "quota_exceeded"
  | "corruption_detected"
  | "transient_failure"
  | "transport_failure"
  | "task_cancelled"
  | "timeout"
  | "unknown";

export type EngineError = {
  code: EngineErrorCode;
  message: string;
  details?: unknown;
  cause?: EngineError;
};

export function toEngineError(error: unknown): EngineError {
  if (typeof error === "object" && error !== null && "code" in error && "message" in error) {
    const maybe = error as { code?: unknown; message?: unknown; details?: unknown; cause?: unknown };
    if (typeof maybe.code === "string" && typeof maybe.message === "string") {
      return {
        code: maybe.code as EngineErrorCode,
        message: maybe.message,
        ...(maybe.details !== undefined ? { details: maybe.details } : {}),
        ...(maybe.cause !== undefined ? { cause: toEngineError(maybe.cause) } : {})
      };
    }
  }
  if (error instanceof Error) return { code: "unknown", message: error.message };
  return { code: "unknown", message: String(error) };
}
