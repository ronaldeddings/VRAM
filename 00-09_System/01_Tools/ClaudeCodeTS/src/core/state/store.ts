import type { IdSource } from "../runtime/ids.js";
import type { MonotonicClock } from "../runtime/clock.js";
import { BoundedAsyncQueue } from "../runtime/queue.js";
import type { StateSnapshotV1 } from "../types/state.js";
import type { AppState, StateAction, StateCommand, StateEffect, StateUiEvent } from "./state.js";
import { commandToActions, createAppState, createStateSnapshot, reduceAppState } from "./state.js";

export type StateStoreOptions = {
  idSource: IdSource;
  clock: MonotonicClock;
  eventBufferSize?: number;
  effectBufferSize?: number;
};

export type StoreUnsubscribe = () => void;

export type Subscription<T> = AsyncIterable<T> & { unsubscribe: StoreUnsubscribe };

export type StateStore = {
  getState: () => AppState;
  dispatch: (action: StateAction) => Promise<void>;
  dispatchCommand: (command: StateCommand) => Promise<void>;
  snapshotPersisted: () => StateSnapshotV1;
  restoreFromSnapshot: (snapshot: StateSnapshotV1) => Promise<void>;
  subscribeUi: () => Subscription<StateUiEvent>;
  subscribeEffects: () => Subscription<StateEffect>;
};

type Subscriber<T> = {
  id: string;
  queue: BoundedAsyncQueue<T>;
};

export function createStateStore(options: StateStoreOptions): StateStore {
  const deps = { idSource: options.idSource, clock: options.clock };
  let state = createAppState(deps);

  const uiSubscribers = new Map<string, Subscriber<StateUiEvent>>();
  const effectSubscribers = new Map<string, Subscriber<StateEffect>>();

  const eventBufferSize = Math.max(0, options.eventBufferSize ?? 256);
  const effectBufferSize = Math.max(0, options.effectBufferSize ?? 256);

  async function fanOut<T>(subscribers: Map<string, Subscriber<T>>, value: T): Promise<void> {
    const deliveries: Array<Promise<void>> = [];
    for (const sub of subscribers.values()) deliveries.push(sub.queue.push(value));
    await Promise.all(deliveries);
  }

  async function applyAction(action: StateAction): Promise<void> {
    const reduced = reduceAppState(state, action);
    state = reduced.state;
    for (const evt of reduced.events) await fanOut(uiSubscribers, evt);
    for (const eff of reduced.effects) await fanOut(effectSubscribers, eff);
  }

  function subscribe<T>(subscribers: Map<string, Subscriber<T>>, maxSize: number): Subscription<T> {
    const id = options.idSource.nextId("store_sub");
    const queue = new BoundedAsyncQueue<T>({ maxSize, dropPolicy: "drop_oldest" });
    subscribers.set(id, { id, queue });
    const iterator = (async function* (): AsyncGenerator<T> {
      for await (const item of queue) yield item;
    })();
    return Object.assign(iterator, {
      unsubscribe: () => {
        subscribers.delete(id);
        queue.close({ kind: "closed", message: "unsubscribed" });
      }
    });
  }

  return {
    getState: () => state,
    dispatch: async (action) => {
      await applyAction(action);
    },
    dispatchCommand: async (command) => {
      const actions = commandToActions(state, command, deps);
      for (const action of actions) await applyAction(action);
    },
    snapshotPersisted: () => createStateSnapshot(state.persisted),
    restoreFromSnapshot: async (snapshot) => {
      await fanOut(uiSubscribers, { type: "ui/state-changed", actionType: "app/restore-persisted" });
      const actions = commandToActions(state, { type: "cmd/restore-from-snapshot", snapshot }, deps);
      for (const action of actions) await applyAction(action);
    },
    subscribeUi: () => subscribe(uiSubscribers, eventBufferSize),
    subscribeEffects: () => subscribe(effectSubscribers, effectBufferSize)
  };
}
