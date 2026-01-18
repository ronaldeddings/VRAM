import type { PermissionMode } from "./permissions.js";

export type LegacyHookEventName =
  | "PreToolUse"
  | "PostToolUse"
  | "PostToolUseFailure"
  | "PermissionRequest"
  | "Stop"
  | "SubagentStop"
  | "UserPromptSubmit"
  | "SessionStart"
  | "SessionEnd"
  | "SubagentStart"
  | "Notification"
  | "PreCompact"
  | "StatusLine"
  | "FileSuggestion";

export const LEGACY_HOOK_EVENT_NAMES = [
  "PreToolUse",
  "PostToolUse",
  "PostToolUseFailure",
  "PermissionRequest",
  "Stop",
  "SubagentStop",
  "UserPromptSubmit",
  "SessionStart",
  "SessionEnd",
  "SubagentStart",
  "Notification",
  "PreCompact",
  "StatusLine",
  "FileSuggestion"
] as const satisfies ReadonlyArray<LegacyHookEventName>;

export type LegacyHookInputBase = {
  session_id: string;
  transcript_path: string;
  cwd: string;
  permission_mode?: PermissionMode;
};

export type LegacyHookInput =
  | (LegacyHookInputBase & {
      hook_event_name: "PreToolUse";
      tool_name: string;
      tool_input: unknown;
      tool_use_id: string;
    })
  | (LegacyHookInputBase & {
      hook_event_name: "PostToolUse";
      tool_name: string;
      tool_input: unknown;
      tool_response: unknown;
      tool_use_id: string;
    })
  | (LegacyHookInputBase & {
      hook_event_name: "PostToolUseFailure";
      tool_name: string;
      tool_input: unknown;
      tool_use_id: string;
      error: unknown;
      is_interrupt: boolean;
    })
  | (LegacyHookInputBase & {
      hook_event_name: "PermissionRequest";
      tool_name: string;
      tool_input: unknown;
      permission_suggestions: unknown;
    })
  | (LegacyHookInputBase & {
      hook_event_name: "Notification";
      message: string;
      title?: string;
      notification_type: string;
    })
  | (LegacyHookInputBase & { hook_event_name: "UserPromptSubmit"; prompt: string })
  | (LegacyHookInputBase & { hook_event_name: "SessionStart"; source: string })
  | (LegacyHookInputBase & { hook_event_name: "SessionEnd"; reason: string })
  | (LegacyHookInputBase & {
      hook_event_name: "SubagentStart";
      agent_id: string;
      agent_type: string;
    })
  | (LegacyHookInputBase & { hook_event_name: "Stop"; stop_hook_active: boolean })
  | (LegacyHookInputBase & {
      hook_event_name: "SubagentStop";
      stop_hook_active: boolean;
      agent_id: string;
      agent_transcript_path: string;
    })
  | (LegacyHookInputBase & {
      hook_event_name: "PreCompact";
      trigger: string;
      custom_instructions?: string;
    });

export type LegacyHookGates = {
  disableAllHooks: boolean;
  allowManagedHooksOnly: boolean;
};
