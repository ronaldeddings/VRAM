import type { TranscriptEventV1, TranscriptLogV1, TranscriptMessageEventV1 } from "../types/state.js";

export type RenderedTranscriptItem = {
  id: string;
  tsMonoMs: number;
  type: "message" | "tool" | "hook" | "mcp";
  summary: string;
};

function renderMessageContent(content: TranscriptMessageEventV1["content"]): string {
  if (typeof content === "string") return content;
  return content
    .map((part) => {
      if (part.type === "text") return part.text;
      if (part.type === "attachment") return `[attachment:${part.ref}]`;
      return "";
    })
    .filter(Boolean)
    .join("");
}

export function renderTranscriptEventSemantic(event: TranscriptEventV1): RenderedTranscriptItem {
  switch (event.type) {
    case "message":
      return {
        id: event.id,
        tsMonoMs: event.tsMonoMs,
        type: "message",
        summary: `${event.role}: ${renderMessageContent(event.content)}`
      };
    case "tool":
      return {
        id: event.id,
        tsMonoMs: event.tsMonoMs,
        type: "tool",
        summary: `tool:${event.toolName} stage:${event.stage}${event.error ? ` error:${event.error}` : ""}`
      };
    case "hook":
      return {
        id: event.id,
        tsMonoMs: event.tsMonoMs,
        type: "hook",
        summary: `hook:${event.eventName} stage:${event.stage}${event.error ? ` error:${event.error}` : ""}`
      };
    case "mcp":
      return {
        id: event.id,
        tsMonoMs: event.tsMonoMs,
        type: "mcp",
        summary: `mcp:${event.serverName ?? event.connectionId} stage:${event.stage}${event.error ? ` error:${event.error}` : ""}`
      };
    case "interrupt":
      return {
        id: event.id,
        tsMonoMs: event.tsMonoMs,
        type: "message",
        summary: `interrupt:${event.reason.kind}${event.message ? ` ${event.message}` : ""}`
      };
  }
}

export function renderTranscriptLogSemantic(log: TranscriptLogV1): RenderedTranscriptItem[] {
  return log.events.map(renderTranscriptEventSemantic);
}
