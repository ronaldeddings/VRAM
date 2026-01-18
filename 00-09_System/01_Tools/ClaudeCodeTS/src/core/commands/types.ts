import type { JsonObject } from "../types/json.js";

export type EngineInternalCommandName =
  | "mcp.servers/list"
  | "mcp.tools/list"
  | "mcp.tools/info"
  | "mcp.resources/list"
  | "mcp.resources/read"
  | "mcp.tools/call"
  | "mcp.grep"
  | "search.grep";

export type EngineCommandSchema<T> = {
  schemaName: string;
  schemaVersion: number;
  jsonSchema?: JsonObject;
  parse: (input: unknown) => { ok: true; value: T } | { ok: false; message: string; details?: unknown };
};

export type EngineInternalCommand<Request = unknown> = {
  name: EngineInternalCommandName;
  params: Request;
};

export type EngineInternalCommandDefinition<Request, Response> = {
  name: EngineInternalCommandName;
  requestSchema: EngineCommandSchema<Request>;
  responseSchema: EngineCommandSchema<Response>;
  run: (params: Request, options?: { signal?: AbortSignal }) => Promise<Response>;
};

export type EngineInternalCommandResult<Response> =
  | { ok: true; value: Response }
  | { ok: false; error: { code: string; message: string; details?: unknown } };
