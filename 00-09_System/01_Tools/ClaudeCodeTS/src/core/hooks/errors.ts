import type { HookEventName, HookSource } from "./types.js";

export type HookErrorCode =
  | "invalid_hook_config"
  | "matcher_invalid"
  | "hook_blocked"
  | "hook_cancelled"
  | "hook_timeout"
  | "hook_unsupported"
  | "effect_invalid"
  | "effect_conflict"
  | "effect_denied"
  | "internal_error";

export class HookError extends Error {
  readonly name = "HookError";
  readonly code: HookErrorCode;
  readonly hookId?: string;
  readonly hookEvent?: HookEventName;
  readonly hookSource?: HookSource;
  readonly details?: unknown;

  constructor(
    code: HookErrorCode,
    message: string,
    options: { hookId?: string; hookEvent?: HookEventName; hookSource?: HookSource; details?: unknown } = {}
  ) {
    super(message);
    this.code = code;
    if (options.hookId !== undefined) this.hookId = options.hookId;
    if (options.hookEvent !== undefined) this.hookEvent = options.hookEvent;
    if (options.hookSource !== undefined) this.hookSource = options.hookSource;
    if (options.details !== undefined) this.details = options.details;
  }
}
