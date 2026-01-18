import type { AppState } from "../../core/state/state.js";
import { selectOverlay } from "../../core/state/selectors.js";
import { renderTranscriptLogSemantic } from "../../core/state/render.js";
import type { CliScreen } from "./hotkeys.js";

function renderOverlayDetails(state: AppState): string[] {
  const overlay = selectOverlay(state.ui);
  if (!overlay) return [];

  switch (overlay) {
    case "message-selector":
      return ["Message selector (placeholder)", "Press Esc to close"];
    case "sandbox-permission": {
      const req = state.ui.sandboxPermissions.queue[0];
      if (!req) return ["Sandbox permission (empty queue)"];
      return [
        `Sandbox permission required for host: ${req.hostPattern.host}${req.hostPattern.port ? `:${req.hostPattern.port}` : ""}`,
        "Type: y / n",
        "Tip: y! / n! to remember"
      ];
    }
    case "tool-permission": {
      const req = state.ui.toolPermission.active;
      if (!req) return ["Tool permission (none active)"];
      const remember = req.rememberChoiceAllowed ? " (remember supported: y!/n!)" : "";
      return [
        `Tool permission required: ${req.toolName}${remember}`,
        ...(req.message ? [`Message: ${req.message}`] : []),
        "Type: y / n"
      ];
    }
    case "worker-permission": {
      const queue = state.ui.workerPermissions.queue;
      const idx = state.ui.workerPermissions.selectedIndex;
      const active = queue[idx];
      return [
        `Worker permission requests: ${queue.length}`,
        ...(active ? [`Selected: ${active.requestId}${active.message ? ` (${active.message})` : ""}`] : ["Selected: (none)"]),
        "Type: y / n"
      ];
    }
    case "worker-sandbox-permission": {
      const queue = state.ui.workerSandboxPermissions.queue;
      const idx = state.ui.workerSandboxPermissions.selectedIndex;
      const active = queue[idx];
      return [
        `Worker sandbox permission requests: ${queue.length}`,
        ...(active ? [`Selected: ${active.requestId}${active.message ? ` (${active.message})` : ""}`] : ["Selected: (none)"]),
        "Type: y / n"
      ];
    }
    case "elicitation": {
      const req = state.ui.elicitation.queue[0];
      if (!req) return ["Elicitation (empty queue)"];
      return [`Elicitation (${req.source}): ${req.prompt}`, "Type your response and press Enter", "Tip: Esc cancels"];
    }
    case "cost":
      return ["Cost notice (placeholder)", "Press Enter to continue"];
    case "ide-onboarding":
      return ["IDE onboarding (placeholder)", "Press Enter to continue"];
  }
}

export function renderCliFrame(state: AppState, options: { screen: CliScreen; showAllInTranscript: boolean }): string[] {
  const overlay = selectOverlay(state.ui);
  const sessionId = state.persisted.activeSessionId;
  const session = sessionId ? state.persisted.sessions[sessionId] ?? null : null;
  const transcript = session ? renderTranscriptLogSemantic(session.transcript) : [];

  const lines: string[] = [];
  lines.push(`screen: ${options.screen}`);
  lines.push(`overlay: ${overlay ?? "none"}`);

  if (overlay) {
    lines.push("--- overlay ---");
    for (const l of renderOverlayDetails(state)) lines.push(l);
    lines.push("-------------");
  }

  if (options.screen === "transcript") {
    lines.push("Showing detailed transcript · ctrl+o to toggle");
    const visible = options.showAllInTranscript ? transcript : transcript.slice(-50);
    for (const item of visible) lines.push(`- ${item.summary}`);
    return lines;
  }

  const last = transcript[transcript.length - 1];
  if (last) lines.push(`last: ${last.summary}`);
  else lines.push("last: (none)");
  lines.push("hint: ctrl+o to toggle transcript");
  return lines;
}
