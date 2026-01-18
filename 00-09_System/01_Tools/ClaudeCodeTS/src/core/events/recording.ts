import type { EngineEventEnvelope } from "../types/events.js";
import type { EventBus } from "./bus.js";

export type EventRecording = {
  events: EngineEventEnvelope[];
  stop: () => void;
};

export function recordEventBus(bus: EventBus, options: { channel?: EngineEventEnvelope["channel"] } = {}): EventRecording {
  const events: EngineEventEnvelope[] = [];
  const iter = bus.subscribe(options.channel ? { channel: options.channel } : {});
  let stopped = false;

  (async () => {
    try {
      for await (const evt of iter) {
        if (stopped) break;
        events.push(evt);
      }
    } catch {
      // ignore; recording should never throw to callers
    }
  })();

  return {
    events,
    stop: () => {
      stopped = true;
      iter.unsubscribe();
    }
  };
}

