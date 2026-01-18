import type { Engine, EngineEventHandler } from "../../core/types/engine.js";
import type { EngineEventEnvelope } from "../../core/types/events.js";
import type { AppState } from "../../core/state/state.js";
import { selectOverlay } from "../../core/state/selectors.js";
import { renderCliFrame } from "./render.js";
import type { CliHotkey, CliScreen } from "./hotkeys.js";
import { applyTranscriptHotkey } from "./hotkeys.js";

export type CliAdapterState = {
  screen: CliScreen;
  showAllInTranscript: boolean;
};

export class CliAdapter {
  private readonly engine: Engine;
  private readonly unsub: () => void;
  private appState: AppState | null = null;
  private state: CliAdapterState = { screen: "prompt", showAllInTranscript: false };
  private lastFrame: string[] = [];

  constructor(engine: Engine) {
    this.engine = engine;
    const handler: EngineEventHandler = (evt) => this.onEngineEvent(evt);
    this.unsub = engine.subscribe(handler);
  }

  getAdapterState(): CliAdapterState {
    return this.state;
  }

  getAppState(): AppState | null {
    return this.appState;
  }

  getFrameLines(): string[] {
    return this.lastFrame.slice();
  }

  private onEngineEvent(envelope: EngineEventEnvelope): void {
    if (envelope.payload.type === "state/app-state") {
      this.appState = envelope.payload.state;
      this.lastFrame = renderCliFrame(envelope.payload.state, this.state);
    }
  }

  async start(): Promise<void> {
    await this.engine.start();
  }

  async stop(reason?: string): Promise<void> {
    this.unsub();
    await this.engine.stop(reason);
  }

  async sendText(text: string): Promise<void> {
    const app = this.appState;
    if (!app) {
      await this.engine.dispatch({ type: "engine/dispatchHostEvent", event: { type: "host/user-input", text } });
      return;
    }

    const overlay = selectOverlay(app.ui);
    const trimmed = text.trim();

    if (!overlay) {
      await this.engine.dispatch({ type: "engine/dispatchHostEvent", event: { type: "host/user-input", text } });
      return;
    }

    const decisionFromText = (t: string): { decision: "allow" | "deny"; remember?: boolean } | null => {
      const lower = t.toLowerCase();
      if (lower === "y" || lower === "yes" || lower === "allow") return { decision: "allow" };
      if (lower === "y!" || lower === "yes!" || lower === "allow!") return { decision: "allow", remember: true };
      if (lower === "n" || lower === "no" || lower === "deny") return { decision: "deny" };
      if (lower === "n!" || lower === "no!" || lower === "deny!") return { decision: "deny", remember: true };
      return null;
    };

    switch (overlay) {
      case "sandbox-permission": {
        const req = app.ui.sandboxPermissions.queue[0];
        if (!req) return;
        const parsed = decisionFromText(trimmed);
        if (!parsed) return;
        await this.engine.dispatch({
          type: "engine/dispatchUiAction",
          action: { type: "ui/sandbox-permission/resolve", requestId: req.requestId, decision: parsed.decision, ...(parsed.remember !== undefined ? { remember: parsed.remember } : {}) }
        });
        return;
      }
      case "tool-permission": {
        const req = app.ui.toolPermission.active;
        if (!req) return;
        const parsed = decisionFromText(trimmed);
        if (!parsed) return;
        await this.engine.dispatch({
          type: "engine/dispatchUiAction",
          action: { type: "ui/tool-permission/resolve", requestId: req.requestId, decision: parsed.decision, ...(parsed.remember !== undefined ? { remember: parsed.remember } : {}) }
        });
        return;
      }
      case "worker-permission": {
        const q = app.ui.workerPermissions.queue;
        const req = q[app.ui.workerPermissions.selectedIndex];
        if (!req) return;
        const parsed = decisionFromText(trimmed);
        if (!parsed) return;
        await this.engine.dispatch({
          type: "engine/dispatchUiAction",
          action: { type: "ui/worker-permissions/resolve", requestId: req.requestId, decision: parsed.decision, ...(parsed.remember !== undefined ? { remember: parsed.remember } : {}) }
        });
        return;
      }
      case "worker-sandbox-permission": {
        const q = app.ui.workerSandboxPermissions.queue;
        const req = q[app.ui.workerSandboxPermissions.selectedIndex];
        if (!req) return;
        const parsed = decisionFromText(trimmed);
        if (!parsed) return;
        await this.engine.dispatch({
          type: "engine/dispatchUiAction",
          action: { type: "ui/worker-sandbox-permissions/resolve", requestId: req.requestId, decision: parsed.decision, ...(parsed.remember !== undefined ? { remember: parsed.remember } : {}) }
        });
        return;
      }
      case "elicitation": {
        const req = app.ui.elicitation.queue[0];
        if (!req) return;
        if (!trimmed) return;
        await this.engine.dispatch({
          type: "engine/dispatchUiAction",
          action: { type: "ui/elicitation/respond", requestId: req.requestId, response: text }
        });
        return;
      }
      case "message-selector":
        await this.engine.dispatch({ type: "engine/dispatchUiAction", action: { type: "ui/message-selector/set-open", open: false } });
        return;
      case "cost":
        await this.engine.dispatch({ type: "engine/dispatchUiAction", action: { type: "ui/cost-notice/set-active", active: false } });
        return;
      case "ide-onboarding":
        await this.engine.dispatch({ type: "engine/dispatchUiAction", action: { type: "ui/ide-onboarding/set-active", active: false } });
        return;
    }
  }

  applyHotkey(hotkey: CliHotkey): void {
    this.state = applyTranscriptHotkey(this.state, hotkey);
    if (this.appState) this.lastFrame = renderCliFrame(this.appState, this.state);
  }

  async handleHotkey(hotkey: CliHotkey): Promise<void> {
    const before = this.appState;
    this.applyHotkey(hotkey);
    const app = before ?? this.appState;
    if (!app) return;

    if (hotkey === "esc" || hotkey === "ctrl+c") {
      const overlay = selectOverlay(app.ui);
      switch (overlay) {
        case "message-selector":
          await this.engine.dispatch({ type: "engine/dispatchUiAction", action: { type: "ui/message-selector/set-open", open: false } });
          break;
        case "cost":
          await this.engine.dispatch({ type: "engine/dispatchUiAction", action: { type: "ui/cost-notice/set-active", active: false } });
          break;
        case "ide-onboarding":
          await this.engine.dispatch({ type: "engine/dispatchUiAction", action: { type: "ui/ide-onboarding/set-active", active: false } });
          break;
        case "elicitation": {
          const req = app.ui.elicitation.queue[0];
          if (req) await this.engine.dispatch({ type: "engine/dispatchHostEvent", event: { type: "host/cancel", requestId: req.requestId } });
          break;
        }
      }
    }
  }
}
