import type { AppState } from "../../core/state/state.js";
import { selectOverlay } from "../../core/state/selectors.js";
import { renderTranscriptLogSemantic } from "../../core/state/render.js";

export type WebViewModel = {
  ui: "web";
  overlay: ReturnType<typeof selectOverlay>;
  transcript: ReturnType<typeof renderTranscriptLogSemantic>;
  lines: string[];
};

export function selectWebViewModel(state: AppState): WebViewModel {
  const sessionId = state.persisted.activeSessionId;
  const session = sessionId ? state.persisted.sessions[sessionId] ?? null : null;
  const transcript = session ? renderTranscriptLogSemantic(session.transcript) : [];
  const overlay = selectOverlay(state.ui);
  const lines = transcript.map((item) => `WEB ${item.summary}`);
  return { ui: "web", overlay, transcript, lines };
}

