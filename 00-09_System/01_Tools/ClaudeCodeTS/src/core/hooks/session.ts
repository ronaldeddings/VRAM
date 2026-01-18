import type { HookEventName, HookMatcherInput, HookSource, HooksConfigInput } from "./types.js";

export type SessionHooksState = Record<string, { hooks: HooksConfigInput }>;

export class SessionHooksStore {
  private readonly sessions: SessionHooksState = {};

  getSessionHooks(sessionId: string): HooksConfigInput {
    return this.sessions[sessionId]?.hooks ?? {};
  }

  addHook(sessionId: string, eventName: HookEventName, matcher: HookMatcherInput, hook: unknown): void {
    const existing = this.sessions[sessionId]?.hooks ?? {};
    const list = (existing[eventName] ?? []) as HookMatcherInput[];
    list.push({ matcher: matcher.matcher, hooks: [...(matcher.hooks ?? []), hook] } as any);
    const next: HooksConfigInput = { ...existing, [eventName]: list as any };
    this.sessions[sessionId] = { hooks: next };
  }

  setSessionHooks(sessionId: string, hooks: HooksConfigInput): void {
    this.sessions[sessionId] = { hooks };
  }

  clearSession(sessionId: string): void {
    delete this.sessions[sessionId];
  }
}

