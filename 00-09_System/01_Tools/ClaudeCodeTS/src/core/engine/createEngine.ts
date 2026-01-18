import type { Engine, EngineCommand, EngineCreateOptions, EngineEventHandler, Unsubscribe } from "../types/engine.js";
import type { HostEvent } from "../types/events.js";
import type { AppState } from "../state/state.js";
import type { StateAction } from "../state/state.js";
import { EventBus } from "../events/bus.js";
import type { MonotonicClock } from "../runtime/clock.js";
import { systemMonotonicClock } from "../runtime/clock.js";
import type { IdSource } from "../runtime/ids.js";
import { createMonotonicIdSource, createUuidIdSource } from "../runtime/ids.js";
import { RuntimeKernel } from "../runtime/kernel.js";
import { createStateStore } from "../state/store.js";

export type CreateEngineOptions = EngineCreateOptions;

type EngineState = {
  running: boolean;
  closing: boolean;
  closed: boolean;
  lifecycleUnsub: (() => void) | null;
  storeUiUnsub: (() => void) | null;
};

function selectClock(options: CreateEngineOptions): MonotonicClock {
  if (options.clock) return options.clock;
  const hostClock = options.host.clock;
  if (hostClock.kind === "available") return { nowMs: () => hostClock.value.nowMs() };
  return systemMonotonicClock();
}

function selectIdSource(options: CreateEngineOptions): IdSource {
  if (options.idSource) return options.idSource;
  const rnd = options.host.random;
  if (rnd.kind === "available") return createUuidIdSource(rnd.value);
  return createMonotonicIdSource();
}

export function createEngine(options: CreateEngineOptions): Engine {
  const clock = selectClock(options);
  const idSource = selectIdSource(options);

  const store = createStateStore({ idSource, clock });
  const kernel = new RuntimeKernel({ clock, idSource });
  void kernel;

  const wallClockMs =
    options.host.clock.kind === "available" && typeof options.host.clock.value.nowWallMs === "function"
      ? options.host.clock.value.nowWallMs
      : undefined;

  const bus = new EventBus({
    idSource,
    clock,
    ...(wallClockMs ? { wallClockMs } : {})
  });

  const handlers = new Set<EngineEventHandler>();
  let busSub: ReturnType<typeof bus.subscribe> | null = null;
  let busPumpRunning = false;
  const engineState: EngineState = { running: false, closing: false, closed: false, lifecycleUnsub: null, storeUiUnsub: null };

  const emitAppState = async (state: AppState): Promise<void> => {
    await bus.emit(
      { type: "state/app-state", state },
      { channel: "ui", severity: "info", sensitivity: "internal" }
    );
  };

  const dispatchHostEvent = async (event: HostEvent): Promise<void> => {
    await store.dispatchCommand({ type: "cmd/host-event", event, nowMonoMs: clock.nowMs() });
    await emitAppState(store.getState());
  };

  const dispatchUiAction = async (action: StateAction): Promise<void> => {
    if (!action.type.startsWith("ui/")) throw new Error(`Engine rejected non-UI action: ${action.type}`);
    await store.dispatch(action);
    await emitAppState(store.getState());
  };

  const start = async (): Promise<void> => {
    if (engineState.closed) return;
    if (engineState.closing) return;
    if (engineState.running) return;
    engineState.running = true;

    await store.dispatchCommand({ type: "cmd/create-session", activate: true, nowMonoMs: clock.nowMs() });
    await emitAppState(store.getState());
    await bus.emit({ type: "engine/ready" }, { channel: "ui", severity: "info", sensitivity: "internal" });

    if (options.host.lifecycle.kind === "available") {
      engineState.lifecycleUnsub = options.host.lifecycle.value.subscribe((evt) => {
        void dispatchHostEvent(evt as HostEvent);
      });
    }

    const ui = store.subscribeUi();
    engineState.storeUiUnsub = ui.unsubscribe;
    void (async () => {
      for await (const _evt of ui) {
        if (engineState.closed) break;
        await emitAppState(store.getState());
      }
    })();
  };

  const stop = async (reason?: string): Promise<void> => {
    if (engineState.closed) return;
    if (engineState.closing) return;
    engineState.closing = true;
    engineState.running = false;

    try {
      engineState.lifecycleUnsub?.();
    } catch {
      // ignore
    }
    engineState.lifecycleUnsub = null;

    try {
      engineState.storeUiUnsub?.();
    } catch {
      // ignore
    }
    engineState.storeUiUnsub = null;

    await store.dispatchCommand({ type: "cmd/host-event", event: { type: "host/stop" }, nowMonoMs: clock.nowMs() });
    await emitAppState(store.getState());
    await bus.emit(
      { type: "engine/stopped", reason: reason ?? "stopped" },
      { channel: "ui", severity: "info", sensitivity: "internal" }
    );

    engineState.closed = true;
    engineState.closing = false;
  };

  const dispatch = async (command: EngineCommand): Promise<void> => {
    if ((engineState.closed || engineState.closing) && command.type !== "engine/stop") return;
    switch (command.type) {
      case "engine/start":
        await start();
        return;
      case "engine/stop":
        await stop(command.reason);
        return;
      case "engine/dispatchHostEvent":
        await dispatchHostEvent(command.event);
        return;
      case "engine/dispatchUiAction":
        await dispatchUiAction(command.action);
        return;
    }
  };

  const subscribe = (handler: EngineEventHandler): Unsubscribe => {
    handlers.add(handler);
    if (!busSub) busSub = bus.subscribe();
    if (!busPumpRunning && busSub) {
      busPumpRunning = true;
      void (async () => {
        const sub = busSub!;
        for await (const evt of sub) {
          if (engineState.closed) break;
          for (const h of handlers) h(evt);
        }
        busPumpRunning = false;
      })();
    }
    return () => {
      handlers.delete(handler);
      if (handlers.size === 0 && busSub) {
        try {
          busSub.unsubscribe();
        } finally {
          busSub = null;
        }
      }
    };
  };

  return { start, stop, dispatch, subscribe };
}
