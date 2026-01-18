import type { EngineInternalCommandDefinition, EngineInternalCommandName } from "./types.js";

export class EngineInternalCommandRegistry {
  private readonly commands = new Map<EngineInternalCommandName, EngineInternalCommandDefinition<any, any>>();

  register<Request, Response>(def: EngineInternalCommandDefinition<Request, Response>): void {
    if (this.commands.has(def.name)) throw new Error(`Engine command already registered: ${def.name}`);
    this.commands.set(def.name, def);
  }

  get(name: EngineInternalCommandName): EngineInternalCommandDefinition<any, any> | null {
    return this.commands.get(name) ?? null;
  }

  list(): EngineInternalCommandName[] {
    return [...this.commands.keys()].sort();
  }
}

