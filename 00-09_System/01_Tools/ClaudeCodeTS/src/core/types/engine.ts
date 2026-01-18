import type { EngineEventEnvelope, HostEvent } from "./events.js";
import type { HostCapabilities } from "./host.js";
import type { MonotonicClock } from "../runtime/clock.js";
import type { IdSource } from "../runtime/ids.js";
import type { StateAction } from "../state/state.js";

export type EngineCommand =
  | { type: "engine/start" }
  | { type: "engine/stop"; reason?: string }
  | { type: "engine/dispatchHostEvent"; event: HostEvent }
  | { type: "engine/dispatchUiAction"; action: StateAction };

export type EngineEventHandler = (event: EngineEventEnvelope) => void;
export type Unsubscribe = () => void;

export type Engine = {
  start: () => Promise<void>;
  stop: (reason?: string) => Promise<void>;
  dispatch: (command: EngineCommand) => Promise<void>;
  subscribe: (handler: EngineEventHandler) => Unsubscribe;
};

export type EngineCreateOptions = {
  host: HostCapabilities;
  clock?: MonotonicClock;
  idSource?: IdSource;
};

export type EngineFactory = (options: EngineCreateOptions) => Engine;
