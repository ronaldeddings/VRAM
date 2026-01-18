import type { AgentDefinition } from "./types.js";
import type { AgentId } from "../types/agents.js";

export class AgentRegistry {
  private readonly byId = new Map<AgentId, AgentDefinition>();

  register(def: AgentDefinition): void {
    const existing = this.byId.get(def.id);
    if (existing) throw new Error(`Agent already registered: ${def.id}`);
    this.byId.set(def.id, def);
  }

  get(id: AgentId): AgentDefinition | null {
    return this.byId.get(id) ?? null;
  }

  list(): AgentDefinition[] {
    return [...this.byId.values()].sort((a, b) => a.name.localeCompare(b.name));
  }
}

